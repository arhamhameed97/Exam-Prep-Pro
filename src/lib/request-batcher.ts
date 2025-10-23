import { TestGenerationRequest, Question } from '@/types/test'

// Request batching to reduce API calls
interface BatchedRequest {
  id: string
  request: TestGenerationRequest
  resolve: (questions: Question[]) => void
  reject: (error: Error) => void
  timestamp: number
}

class RequestBatcher {
  private batch: BatchedRequest[] = []
  private batchTimeout: NodeJS.Timeout | null = null
  private readonly BATCH_SIZE = 3 // Batch up to 3 requests
  private readonly BATCH_TIMEOUT = 2000 // 2 seconds max wait

  async addRequest(request: TestGenerationRequest): Promise<Question[]> {
    return new Promise((resolve, reject) => {
      const batchedRequest: BatchedRequest = {
        id: Math.random().toString(36).substr(2, 9),
        request,
        resolve,
        reject,
        timestamp: Date.now()
      }

      this.batch.push(batchedRequest)

      // Process batch if it's full
      if (this.batch.length >= this.BATCH_SIZE) {
        this.processBatch()
      } else {
        // Set timeout for partial batch
        if (this.batchTimeout) {
          clearTimeout(this.batchTimeout)
        }
        this.batchTimeout = setTimeout(() => {
          this.processBatch()
        }, this.BATCH_TIMEOUT)
      }
    })
  }

  private async processBatch() {
    if (this.batch.length === 0) return

    const currentBatch = [...this.batch]
    this.batch = []
    
    if (this.batchTimeout) {
      clearTimeout(this.batchTimeout)
      this.batchTimeout = null
    }

    console.log(`[BATCH] Processing ${currentBatch.length} requests`)

    try {
      // Process each request individually but in parallel
      const results = await Promise.allSettled(
        currentBatch.map(async (batchedRequest) => {
          const { generateTestQuestions } = await import('./gemini')
          return generateTestQuestions(batchedRequest.request)
        })
      )

      // Resolve or reject each request
      results.forEach((result, index) => {
        const batchedRequest = currentBatch[index]
        if (result.status === 'fulfilled') {
          batchedRequest.resolve(result.value)
        } else {
          batchedRequest.reject(result.reason)
        }
      })
    } catch (error) {
      // Reject all requests if batch processing fails
      currentBatch.forEach(batchedRequest => {
        batchedRequest.reject(error instanceof Error ? error : new Error('Batch processing failed'))
      })
    }
  }
}

// Singleton instance
export const requestBatcher = new RequestBatcher()

// Function to add request to batch
export async function generateTestQuestionsBatched(request: TestGenerationRequest): Promise<Question[]> {
  return requestBatcher.addRequest(request)
}

