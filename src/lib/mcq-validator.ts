import { createCipher, createDecipher } from 'crypto'
import { Question } from '@/types/test'

export interface MCQValidationResult {
  isCorrect: boolean
  feedback: string
  correctAnswer: string
}

export interface SecureQuestionData {
  id: string
  questionText: string
  options: string[]
  encryptedAnswer: string // Encrypted correct answer
  questionType: string
  marks: number
  difficulty: string
  topic: string | null
  explanation: string | null
}

/**
 * Simple encryption key - in production, use environment variables
 * This provides basic obfuscation, not security against determined users
 */
const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || 'exam-prep-app-key-2024'

/**
 * Encrypt the correct answer for client-side storage
 * This is basic obfuscation - not cryptographically secure
 */
export function encryptAnswer(answer: string): string {
  const cipher = createCipher('aes192', ENCRYPTION_KEY)
  let encrypted = cipher.update(answer, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  return encrypted
}

/**
 * Decrypt the correct answer for validation
 */
export function decryptAnswer(encryptedAnswer: string): string {
  try {
    const decipher = createDecipher('aes192', ENCRYPTION_KEY)
    let decrypted = decipher.update(encryptedAnswer, 'hex', 'utf8')
    decrypted += decipher.final('utf8')
    return decrypted
  } catch (error) {
    console.error('Error decrypting answer:', error)
    return ''
  }
}

/**
 * Prepare question data for client-side with encrypted answers
 */
export function prepareSecureQuestionData(question: Question): SecureQuestionData {
  return {
    id: question.id,
    questionText: question.questionText,
    options: typeof question.options === 'string' ? JSON.parse(question.options) : question.options,
    encryptedAnswer: encryptAnswer(question.correctAnswer),
    questionType: question.questionType,
    marks: question.marks,
    difficulty: question.difficulty,
    topic: question.topic || null,
    explanation: question.explanation || null
  }
}

/**
 * Validate MCQ answer client-side
 */
export function validateMCQAnswer(
  userAnswer: string, 
  encryptedCorrectAnswer: string
): MCQValidationResult {
  try {
    const correctAnswer = decryptAnswer(encryptedCorrectAnswer)
    
    // Normalize both answers for comparison
    const normalizedUserAnswer = userAnswer.trim().toUpperCase()
    const normalizedCorrectAnswer = correctAnswer.trim().toUpperCase()
    
    // Handle different answer formats (A, B, C, D or 1, 2, 3, 4)
    let isCorrect = false
    
    if (normalizedUserAnswer === normalizedCorrectAnswer) {
      isCorrect = true
    } else {
      // Try alternative formats
      const letterToNumber: { [key: string]: string } = { 'A': '1', 'B': '2', 'C': '3', 'D': '4' }
      const numberToLetter: { [key: string]: string } = { '1': 'A', '2': 'B', '3': 'C', '4': 'D' }
      
      const userAsLetter = numberToLetter[normalizedUserAnswer] || normalizedUserAnswer
      const userAsNumber = letterToNumber[normalizedUserAnswer] || normalizedUserAnswer
      const correctAsLetter = numberToLetter[normalizedCorrectAnswer] || normalizedCorrectAnswer
      const correctAsNumber = letterToNumber[normalizedCorrectAnswer] || normalizedCorrectAnswer
      
      isCorrect = userAsLetter === correctAsLetter || userAsNumber === correctAsNumber
    }
    
    let feedback = ''
    if (isCorrect) {
      feedback = 'Correct! ✓'
    } else {
      feedback = `Incorrect. The correct answer is ${correctAnswer}.`
    }
    
    // Debug logging
    console.log('MCQ Validation:', {
      userAnswer: normalizedUserAnswer,
      correctAnswer: normalizedCorrectAnswer,
      isCorrect
    })
    
    return {
      isCorrect,
      feedback,
      correctAnswer
    }
  } catch (error) {
    console.error('Error validating MCQ answer:', error)
    return {
      isCorrect: false,
      feedback: 'Unable to validate answer. Please try again.',
      correctAnswer: ''
    }
  }
}

/**
 * Validate different question types
 */
export function validateAnswer(
  userAnswer: string,
  questionType: string,
  encryptedCorrectAnswer: string
): MCQValidationResult {
  switch (questionType) {
    case 'mcq':
      return validateMCQAnswer(userAnswer, encryptedCorrectAnswer)
    
    case 'true-false':
      return validateTrueFalse(userAnswer, encryptedCorrectAnswer)
    
    case 'fill-blanks':
      return validateFillBlanks(userAnswer, encryptedCorrectAnswer)
    
    case 'short-answer':
    case 'long-answer':
    case 'essay':
      // For subjective questions, we can't validate client-side
      return {
        isCorrect: false,
        feedback: 'Answer submitted for manual review.',
        correctAnswer: ''
      }
    
    default:
      return {
        isCorrect: false,
        feedback: 'Unknown question type.',
        correctAnswer: ''
      }
  }
}

/**
 * Validate True/False questions
 */
function validateTrueFalse(userAnswer: string, encryptedCorrectAnswer: string): MCQValidationResult {
  try {
    const correctAnswer = decryptAnswer(encryptedCorrectAnswer)
    const normalizedUserAnswer = userAnswer.trim().toLowerCase()
    const normalizedCorrectAnswer = correctAnswer.trim().toLowerCase()
    
    // Accept various forms of true/false
    const isTrue = ['true', 't', 'yes', 'y', '1'].includes(normalizedUserAnswer)
    const isFalse = ['false', 'f', 'no', 'n', '0'].includes(normalizedUserAnswer)
    const isCorrectTrue = ['true', 't', 'yes', 'y', '1'].includes(normalizedCorrectAnswer)
    const isCorrectFalse = ['false', 'f', 'no', 'n', '0'].includes(normalizedCorrectAnswer)
    
    let isCorrect = false
    if (isTrue && isCorrectTrue) {
      isCorrect = true
    } else if (isFalse && isCorrectFalse) {
      isCorrect = true
    }
    
    let feedback = ''
    if (isCorrect) {
      feedback = 'Correct! ✓'
    } else {
      feedback = `Incorrect. The correct answer is ${correctAnswer}.`
    }
    
    return {
      isCorrect,
      feedback,
      correctAnswer
    }
  } catch (error) {
    console.error('Error validating True/False answer:', error)
    return {
      isCorrect: false,
      feedback: 'Unable to validate answer. Please try again.',
      correctAnswer: ''
    }
  }
}

/**
 * Validate Fill in the Blanks questions (basic fuzzy matching)
 */
function validateFillBlanks(userAnswer: string, encryptedCorrectAnswer: string): MCQValidationResult {
  try {
    const correctAnswer = decryptAnswer(encryptedCorrectAnswer)
    const normalizedUserAnswer = userAnswer.trim().toLowerCase()
    const normalizedCorrectAnswer = correctAnswer.trim().toLowerCase()
    
    // Simple fuzzy matching - could be improved with more sophisticated algorithms
    const similarity = calculateSimilarity(normalizedUserAnswer, normalizedCorrectAnswer)
    const isCorrect = similarity > 0.8 // 80% similarity threshold
    
    let feedback = ''
    if (isCorrect) {
      feedback = 'Correct! ✓'
    } else {
      feedback = `Your answer: "${userAnswer}". Expected: "${correctAnswer}".`
    }
    
    return {
      isCorrect,
      feedback,
      correctAnswer
    }
  } catch (error) {
    console.error('Error validating Fill in the Blanks answer:', error)
    return {
      isCorrect: false,
      feedback: 'Unable to validate answer. Please try again.',
      correctAnswer: ''
    }
  }
}

/**
 * Calculate simple similarity between two strings (Levenshtein distance based)
 */
function calculateSimilarity(str1: string, str2: string): number {
  if (str1 === str2) return 1
  
  const longer = str1.length > str2.length ? str1 : str2
  const shorter = str1.length > str2.length ? str2 : str1
  
  if (longer.length === 0) return 1
  
  const distance = levenshteinDistance(longer, shorter)
  return (longer.length - distance) / longer.length
}

/**
 * Calculate Levenshtein distance between two strings
 */
function levenshteinDistance(str1: string, str2: string): number {
  const matrix = []
  
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i]
  }
  
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j
  }
  
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1]
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        )
      }
    }
  }
  
  return matrix[str2.length][str1.length]
}

/**
 * Get instant feedback for MCQ selection
 */
export function getInstantFeedback(
  userAnswer: string,
  questionType: string,
  encryptedCorrectAnswer: string,
  showCorrectAnswer: boolean = true
): string {
  const result = validateAnswer(userAnswer, questionType, encryptedCorrectAnswer)
  
  if (showCorrectAnswer && !result.isCorrect) {
    return result.feedback
  }
  
  return result.isCorrect ? 'Correct! ✓' : 'Incorrect ✗'
}

/**
 * Calculate score for a test attempt
 */
export function calculateTestScore(
  answers: { [questionId: string]: string },
  questions: SecureQuestionData[]
): {
  score: number
  totalMarks: number
  correctAnswers: number
  totalQuestions: number
} {
  let correctAnswers = 0
  let totalMarks = 0
  
  questions.forEach(question => {
    totalMarks += question.marks
    
    const userAnswer = answers[question.id]
    if (userAnswer) {
      const result = validateAnswer(userAnswer, question.questionType, question.encryptedAnswer)
      if (result.isCorrect) {
        correctAnswers++
      }
    }
  })
  
  const score = totalMarks > 0 ? (correctAnswers / questions.length) * totalMarks : 0
  
  return {
    score: Math.round(score * 100) / 100, // Round to 2 decimal places
    totalMarks,
    correctAnswers,
    totalQuestions: questions.length
  }
}
