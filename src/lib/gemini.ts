import { GoogleGenerativeAI } from '@google/generative-ai'
import { TestGenerationRequest } from '@/types/test'
import { AI_CONFIG } from './ai-config'
import { getCachedQuestions, setCachedQuestions } from './question-cache'
import { trackApiUsage } from './token-tracker'

// Initialize Gemini API with optimized configuration
const geminiApiKey = process.env.GEMINI_API_KEY
if (!geminiApiKey) {
  console.warn('GEMINI_API_KEY not found in environment variables. AI generation will fail.')
} else {
  console.log('GEMINI_API_KEY found, initializing Gemini API...')
}

const genAI = geminiApiKey ? new GoogleGenerativeAI(geminiApiKey) : null

export interface GeneratedQuestion {
  questionText: string
  options: string[]
  correctAnswer: string
  explanation: string
  marks: number
  difficulty: 'easy' | 'medium' | 'hard'
  topic: string
  questionType: string
}

export interface GeminiResponse {
  questions: GeneratedQuestion[]
}

export async function generateTestQuestions(request: TestGenerationRequest): Promise<GeneratedQuestion[]> {
  // Check cache first
  const cachedQuestions = getCachedQuestions(request)
  if (cachedQuestions) {
    console.log(`[CACHE] Returning ${cachedQuestions.length} cached questions`)
    return cachedQuestions
  }

  // If Gemini API is not available, throw error immediately
  if (!genAI) {
    console.log('Gemini API not available, throwing error')
    throw new Error('AI service is not configured. Please contact support.')
  }

  console.log(`[AI] Using model: ${AI_CONFIG.model}`)

  const maxAttempts = AI_CONFIG.retry.maxAttempts
  let lastError: Error | null = null
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      // Use optimized model with JSON schema for cost reduction
      const model = genAI.getGenerativeModel({ 
        model: AI_CONFIG.model,
        generationConfig: {
          temperature: AI_CONFIG.generationConfig.temperature,
          topP: AI_CONFIG.generationConfig.topP,
          topK: AI_CONFIG.generationConfig.topK,
          maxOutputTokens: AI_CONFIG.generationConfig.maxOutputTokens,
          responseMimeType: AI_CONFIG.generationConfig.responseMimeType
        }
      })
      
      const prompt = createOptimizedPrompt(request)
      
      // Log token usage if enabled
      if (AI_CONFIG.tracking.logTokenUsage) {
        console.log(`[AI] Attempt ${attempt}: Generating ${request.numberOfQuestions} questions for ${request.subjectName}`)
      }
      
      const result = await model.generateContent(prompt)
      const response = await result.response
      const text = response.text()
      
      // Log the raw response for debugging
      if (AI_CONFIG.tracking.logTokenUsage) {
        console.log(`[AI] Raw response:`, text.substring(0, 500) + '...')
      }
      
      // Try to parse the JSON response
      let parsedResponse: GeminiResponse
      try {
        parsedResponse = JSON.parse(text)
        
        // Fix null correctAnswer by extracting from explanation if needed
        parsedResponse.questions.forEach((question, index) => {
          if (question.correctAnswer === null || question.correctAnswer === undefined) {
            console.warn(`[AI] Question ${index} has null correctAnswer, attempting to extract from explanation`)
            // Try to extract answer from explanation for short-answer questions
            if (question.questionType === 'short-answer' && question.explanation) {
              // Look for patterns like "Angle C = 60 degrees" or "x = 5"
              const answerMatch = question.explanation.match(/(?:angle\s+\w+\s*=\s*|x\s*=\s*|answer\s*is\s*|result\s*is\s*)([^.,]+)/i)
              if (answerMatch) {
                question.correctAnswer = answerMatch[1].trim()
                console.log(`[AI] Extracted answer: ${question.correctAnswer}`)
              } else {
                // Use first sentence of explanation as answer
                const firstSentence = question.explanation.split('.')[0]
                question.correctAnswer = firstSentence || 'Answer not specified'
                console.log(`[AI] Used explanation-based answer: ${question.correctAnswer}`)
              }
            }
          }
        })
      } catch (parseError) {
        console.error(`[AI] JSON parse error:`, parseError)
        console.error(`[AI] Raw text:`, text)
        throw new Error('Invalid JSON response from Gemini API')
      }
      
      // Validate the response structure
      if (!parsedResponse.questions || !Array.isArray(parsedResponse.questions)) {
        throw new Error('Invalid response format from Gemini API')
      }
      
      // Validate question count - this is critical
      if (parsedResponse.questions.length !== request.numberOfQuestions) {
        console.error(`Expected ${request.numberOfQuestions} questions, got ${parsedResponse.questions.length}`)
        throw new Error(`Incorrect number of questions generated. Expected ${request.numberOfQuestions}, got ${parsedResponse.questions.length}`)
      }
      
      // Validate each question
      parsedResponse.questions.forEach((question, index) => {
        if (!question.questionText) {
          throw new Error(`Invalid question structure at index ${index}: missing questionText`)
        }
        if (question.correctAnswer === null || question.correctAnswer === undefined) {
          throw new Error(`Invalid question structure at index ${index}: correctAnswer cannot be null or undefined`)
        }
        if (!Array.isArray(question.options)) {
          throw new Error(`Invalid options for question at index ${index}: options must be an array`)
        }
        // For MCQ questions, validate options
        if (question.questionType === 'mcq') {
          if (question.options.length !== 4) {
            throw new Error(`Invalid MCQ options for question at index ${index}: must have exactly 4 options`)
          }
          if (!['A', 'B', 'C', 'D'].includes(question.correctAnswer)) {
            throw new Error(`Invalid MCQ correctAnswer for question at index ${index}: must be A, B, C, or D`)
          }
        }
        // For non-MCQ questions, options should be empty
        if (question.questionType !== 'mcq' && question.options.length > 0) {
          console.warn(`Question at index ${index} is not MCQ but has options. This is allowed but unusual.`)
        }
        
        // Validate that the question is about the correct subject
        const questionText = question.questionText.toLowerCase()
        const subjectName = request.subjectName.toLowerCase()
        
        // Check for obvious subject mismatches (only flag if clearly wrong)
        const wrongSubjectPatterns = {
          'mathematics': ['capital of', 'country', 'geography', 'history', 'biology', 'chemistry'],
          'physics': ['capital of', 'country', 'geography', 'history', 'biology', 'chemistry'],
          'chemistry': ['capital of', 'country', 'geography', 'history', 'biology', 'physics'],
          'biology': ['capital of', 'country', 'geography', 'history', 'chemistry', 'physics'],
          'geography': ['solve for x', 'equation', 'algebra', 'geometry', 'biology', 'chemistry'],
          'history': ['solve for x', 'equation', 'algebra', 'geometry', 'biology', 'chemistry']
        }
        
        const wrongPatterns = wrongSubjectPatterns[subjectName] || []
        const isWrongSubject = wrongPatterns.some(pattern => questionText.includes(pattern))
        
        if (isWrongSubject) {
          console.warn(`Question ${index} might be about wrong subject: ${question.questionText}`)
        }
      })
      
      // Cache the successful response
      setCachedQuestions(request, parsedResponse.questions)
      
      // Track token usage for cost monitoring
      trackApiUsage(prompt, text, AI_CONFIG.model)
      
      // Log success if tracking enabled
      if (AI_CONFIG.tracking.logTokenUsage) {
        console.log(`[AI] Successfully generated ${parsedResponse.questions.length} questions`)
      }
      
      return parsedResponse.questions
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error')
      
      // Don't retry on validation errors
      if (lastError.message.includes('Invalid')) {
        break
      }
      
      // Calculate delay for exponential backoff
      if (attempt < maxAttempts) {
        const delay = Math.min(
          AI_CONFIG.retry.baseDelay * Math.pow(2, attempt - 1),
          AI_CONFIG.retry.maxDelay
        )
        
        console.warn(`[AI] Attempt ${attempt} failed, retrying in ${delay}ms:`, lastError.message)
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
  }
  
  console.error('Error generating test questions after all attempts:', lastError)
  throw new Error('Failed to generate test questions. Please try again.')
}

function createOptimizedPrompt(request: TestGenerationRequest): string {
  const { subjectName, subjectLevel, numberOfQuestions, difficulty, topics, questionTypes } = request
  
  const topicsText = topics.join(', ')
  const typesText = questionTypes.join(', ')
  
  // Ultra-compact prompt to minimize tokens
  return `Create ${numberOfQuestions} ${difficulty} ${subjectLevel} ${subjectName} questions.

Topics: ${topicsText}
Types: ${typesText}

Rules:
- ${subjectName} only
- MCQ: 4 options A-D, correctAnswer: "A"/"B"/"C"/"D"
- Others: options: [], correctAnswer: actual answer
- Marks: 1-10, difficulty: ${difficulty}
- Include explanations

JSON format:
{
  "questions": [
    {
      "questionText": "Question here",
      "options": ["A", "B", "C", "D"] or [],
      "correctAnswer": "A" or "answer",
      "explanation": "Brief explanation",
      "marks": 2,
      "difficulty": "${difficulty}",
      "topic": "${topics[0] || 'General'}",
      "questionType": "mcq"
    }
  ]
}

Generate ${numberOfQuestions} questions:`
}

