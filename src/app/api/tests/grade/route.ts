import { NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from '@google/generative-ai'
import { AI_CONFIG } from '@/lib/ai-config'

interface GradingRequest {
  questionText: string
  correctAnswer: string
  userAnswer: string
  questionType: string
  marks: number
  topic?: string
  difficulty?: string
  markScheme?: string
  specificMarkScheme?: string
  subjectCode?: string
  examBoard?: string
  subjectLevel?: string
}

interface GradingResult {
  score: number
  maxScore: number
  feedback: string
  isCorrect: boolean
  grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F'
}

export async function POST(request: NextRequest) {
  try {
    // Note: This endpoint is called internally from /api/tests/submit which already handles authentication
    // No need to check auth here as this is an internal API endpoint

    const body: GradingRequest = await request.json()
    const { questionText, correctAnswer, userAnswer, questionType, marks, topic, difficulty } = body

    // Validate required fields
    if (!questionText || !userAnswer || !questionType || !marks) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      )
    }

    // Skip AI grading for MCQ and true-false questions (should be graded locally)
    if (questionType === 'mcq' || questionType === 'multiple-choice' || questionType === 'true-false') {
      return NextResponse.json(
        { message: "This question type should be graded locally" },
        { status: 400 }
      )
    }

    // Generate AI grading prompt
    const gradingPrompt = generateGradingPrompt({
      questionText,
      correctAnswer,
      userAnswer,
      questionType,
      marks,
      topic,
      difficulty,
      markScheme: body.markScheme,
      specificMarkScheme: body.specificMarkScheme,
      subjectCode: body.subjectCode,
      examBoard: body.examBoard,
      subjectLevel: body.subjectLevel
    })

    try {
      // Initialize Gemini API
      const geminiApiKey = process.env.GEMINI_API_KEY
      if (!geminiApiKey) {
        throw new Error('AI service is not configured')
      }

      console.log(`[GRADING] Using model: ${AI_CONFIG.model}`)
      
      const genAI = new GoogleGenerativeAI(geminiApiKey)
      let currentModel = AI_CONFIG.model
      let gradingResult
      
      try {
        // Try with primary model
        const model = genAI.getGenerativeModel({ 
          model: currentModel,
          generationConfig: {
            temperature: AI_CONFIG.generationConfig.temperature,
            topP: AI_CONFIG.generationConfig.topP,
            topK: AI_CONFIG.generationConfig.topK,
            maxOutputTokens: 1000, // Lower for grading responses
          }
        })
        
        // Call AI for grading
        const result = await model.generateContent(gradingPrompt)
        const response = await result.response
        const aiResponse = response.text()
        
        gradingResult = parseAIResponse(aiResponse, marks)
      } catch (modelError) {
        // If model not found, try fallback
        if ((modelError instanceof Error && (modelError.message.includes('not found') || modelError.message.includes('404'))) && currentModel === 'gemini-2.0-flash') {
          console.warn(`[GRADING] Model gemini-2.0-flash not available, trying gemini-2.5-flash`)
          currentModel = 'gemini-2.5-flash'
          
          const fallbackModel = genAI.getGenerativeModel({ 
            model: currentModel,
            generationConfig: {
              temperature: AI_CONFIG.generationConfig.temperature,
              topP: AI_CONFIG.generationConfig.topP,
              topK: AI_CONFIG.generationConfig.topK,
              maxOutputTokens: 1000,
            }
          })
          
          const result = await fallbackModel.generateContent(gradingPrompt)
          const response = await result.response
          const aiResponse = response.text()
          
          gradingResult = parseAIResponse(aiResponse, marks)
        } else {
          throw modelError
        }
      }
      
      return NextResponse.json({
        success: true,
        result: gradingResult
      })
    } catch (aiError) {
      console.error('AI grading error:', aiError)
      
      // Fallback grading for AI failures
      const fallbackResult = generateFallbackGrade(userAnswer, correctAnswer, marks, questionType)
      
      return NextResponse.json({
        success: true,
        result: fallbackResult,
        warning: "AI grading failed, using fallback grading"
      })
    }

  } catch (error) {
    console.error('Grading API error:', error)
    return NextResponse.json(
      { message: "Internal server error", error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

function generateGradingPrompt(data: GradingRequest): string {
  const { questionText, correctAnswer, userAnswer, questionType, marks, topic, difficulty, markScheme, specificMarkScheme, subjectCode, examBoard, subjectLevel } = data

  // Build exam board context
  let examBoardContext = ''
  if (examBoard && examBoard.trim() !== '' && subjectLevel) {
    examBoardContext = `\n\nEXAM BOARD CONTEXT:\nExam Board: ${examBoard}\nLevel: ${subjectLevel}\n\nProvide feedback and grading based on ${examBoard} ${subjectLevel} standards. Consider ${examBoard}'s typical marking criteria, expectations, and feedback style.`
  }

  // Build mark scheme context
  let markSchemeContext = ''
  if (specificMarkScheme) {
    markSchemeContext = `\n\nQUESTION-SPECIFIC MARK SCHEME:\n${specificMarkScheme}\n\nApply the above mark scheme precisely when grading this answer.`
  } else if (markScheme) {
    markSchemeContext = `\n\nSUBJECT MARK SCHEME:\n${markScheme}\n\nGrade according to the mark scheme guidelines.`
  }

  return `You are an expert educational assessor. Please grade the following ${questionType} question.${examBoardContext}

QUESTION: ${questionText}
CORRECT ANSWER: ${correctAnswer}
STUDENT ANSWER: ${userAnswer}
TOPIC: ${topic || 'General'}
DIFFICULTY: ${difficulty || 'Medium'}
SUBJECT: ${subjectCode || 'Not specified'}
MAXIMUM MARKS: ${marks}${markSchemeContext}

Please provide a JSON response with the following structure:
{
  "score": <number between 0 and ${marks}>,
  "maxScore": ${marks},
  "feedback": "<detailed feedback explaining what the student did well and what could be improved>",
  "isCorrect": <boolean>,
  "grade": "<A+, A, B, C, D, or F>"
}

Grading criteria:
- A+ (90-100%): Excellent answer, comprehensive and accurate
- A (80-89%): Very good answer with minor issues
- B (70-79%): Good answer with some errors or omissions
- C (60-69%): Satisfactory answer with notable issues
- D (50-59%): Poor answer with significant problems
- F (0-49%): Very poor or incorrect answer

Consider:
1. Accuracy of the answer
2. Completeness of the response
3. Understanding demonstrated
4. Clarity and organization (for longer answers)
5. Use of appropriate terminology
6. Depth of analysis (for essay questions)
${markScheme ? '7. Adherence to mark scheme criteria' : ''}

Provide constructive feedback that helps the student learn.`
}

function parseAIResponse(aiResponse: string, maxMarks: number): GradingResult {
  try {
    // Try to extract JSON from the response
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0])
      
      // Validate and normalize the response
      const score = Math.max(0, Math.min(maxMarks, parseFloat(parsed.score) || 0))
      const feedback = parsed.feedback || "No feedback provided"
      const isCorrect = parsed.isCorrect || score >= maxMarks * 0.5
      const grade = parsed.grade || calculateGrade(score, maxMarks)
      
      return {
        score,
        maxScore: maxMarks,
        feedback,
        isCorrect,
        grade
      }
    }
  } catch (error) {
    console.error('Error parsing AI response:', error)
  }
  
  // Fallback if parsing fails
  return generateFallbackGrade("", "", maxMarks, "unknown")
}

function generateFallbackGrade(userAnswer: string, correctAnswer: string, marks: number, questionType: string): GradingResult {
  // Simple fallback grading based on answer length and basic similarity
  const answerLength = userAnswer.trim().length
  const minLength = questionType === 'essay' ? 200 : questionType === 'long-answer' ? 100 : 20
  
  let score = 0
  let feedback = "Answer submitted for manual review."
  
  if (answerLength >= minLength) {
    score = marks * 0.6 // Give 60% for meeting minimum length
    feedback = "Answer meets minimum length requirements. Manual review recommended for accurate grading."
  } else if (answerLength > 0) {
    score = marks * 0.3 // Give 30% for any attempt
    feedback = "Answer provided but may be too brief. Manual review recommended."
  } else {
    score = 0
    feedback = "No answer provided."
  }
  
  return {
    score,
    maxScore: marks,
    feedback,
    isCorrect: score >= marks * 0.5,
    grade: calculateGrade(score, marks)
  }
}

function calculateGrade(score: number, maxScore: number): 'A+' | 'A' | 'B' | 'C' | 'D' | 'F' {
  const percentage = (score / maxScore) * 100
  
  if (percentage >= 90) return 'A+'
  if (percentage >= 80) return 'A'
  if (percentage >= 70) return 'B'
  if (percentage >= 60) return 'C'
  if (percentage >= 50) return 'D'
  return 'F'
}

