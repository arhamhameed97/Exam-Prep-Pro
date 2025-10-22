import { TestGenerationRequest, GeneratedQuestion } from './gemini'

// Simple in-memory cache for question generation
const questionCache = new Map<string, GeneratedQuestion[]>()

// Cache TTL in milliseconds (1 hour)
const CACHE_TTL = 60 * 60 * 1000

interface CacheEntry {
  questions: GeneratedQuestion[]
  timestamp: number
}

export function generateCacheKey(request: TestGenerationRequest): string {
  // Create a unique key based on request parameters
  const key = JSON.stringify({
    subjectName: request.subjectName,
    subjectLevel: request.subjectLevel,
    numberOfQuestions: request.numberOfQuestions,
    difficulty: request.difficulty,
    topics: request.topics.sort(), // Sort to ensure consistent keys
    questionTypes: request.questionTypes.sort()
  })
  
  return Buffer.from(key).toString('base64')
}

export function getCachedQuestions(request: TestGenerationRequest): GeneratedQuestion[] | null {
  const cacheKey = generateCacheKey(request)
  const cached = questionCache.get(cacheKey) as CacheEntry | undefined
  
  if (!cached) {
    return null
  }
  
  // Check if cache entry is expired
  if (Date.now() - cached.timestamp > CACHE_TTL) {
    questionCache.delete(cacheKey)
    return null
  }
  
  console.log(`[CACHE] Hit for key: ${cacheKey.substring(0, 20)}...`)
  return cached.questions
}

export function setCachedQuestions(request: TestGenerationRequest, questions: GeneratedQuestion[]): void {
  const cacheKey = generateCacheKey(request)
  const cacheEntry: CacheEntry = {
    questions,
    timestamp: Date.now()
  }
  
  questionCache.set(cacheKey, cacheEntry)
  console.log(`[CACHE] Stored ${questions.length} questions for key: ${cacheKey.substring(0, 20)}...`)
  
  // Clean up expired entries periodically
  if (questionCache.size > 100) {
    cleanupExpiredEntries()
  }
}

function cleanupExpiredEntries(): void {
  const now = Date.now()
  for (const [key, entry] of questionCache.entries()) {
    if (now - entry.timestamp > CACHE_TTL) {
      questionCache.delete(key)
    }
  }
  console.log(`[CACHE] Cleaned up expired entries. Cache size: ${questionCache.size}`)
}

export function getCacheStats(): { size: number, keys: string[] } {
  return {
    size: questionCache.size,
    keys: Array.from(questionCache.keys()).map(key => key.substring(0, 20) + '...')
  }
}