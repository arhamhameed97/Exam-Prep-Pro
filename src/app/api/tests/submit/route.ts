import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { calculateTestScore } from "@/lib/mcq-validator"

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!(session as { user?: { id: string } })?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { testId, score, grade, timeSpent, answers, questions } = body

    // Validate required fields
    if (!testId || score === undefined || !grade || timeSpent === undefined) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      )
    }

    // Verify the test exists and belongs to the user
    const test = await prisma.test.findFirst({
      where: {
        id: testId,
        userId: (session as { user: { id: string } }).user.id
      },
      include: {
        questions: true
      }
    })

    if (!test) {
      return NextResponse.json(
        { message: "Test not found" },
        { status: 404 }
      )
    }

    // Calculate final score with AI grading for non-MCQ questions
    let finalScore = parseFloat(score)
    let finalGrade = grade
    let detailedResults = null

    if (questions && questions.length > 0) {
      try {
        const gradingResults = await gradeNonMCQQuestions(questions, answers)
        finalScore = gradingResults.totalScore
        finalGrade = calculateOverallGrade(finalScore, test.totalMarks)
        detailedResults = gradingResults.detailedResults
      } catch (error) {
        console.error('Error in AI grading:', error)
        // Continue with original score if AI grading fails
      }
    }

    // Save test attempt
    const testAttempt = await prisma.testAttempt.create({
      data: {
        score: finalScore,
        grade: finalGrade,
        timeSpent: Math.round(parseInt(timeSpent) / 60), // Convert seconds to minutes
        answers: JSON.stringify(answers), // Store user's answers as JSON
        status: 'completed',
        testId,
        userId: (session as { user: { id: string } }).user.id
      }
    })

    return NextResponse.json({
      success: true,
      attemptId: testAttempt.id,
      message: "Test attempt saved successfully",
      detailedResults
    })

  } catch (error) {
    console.error('Test submission error:', error)
    return NextResponse.json(
      { message: "Internal server error", error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// Helper function to grade non-MCQ questions using AI
async function gradeNonMCQQuestions(questions: any[], answers: { [questionId: string]: string }) {
  const detailedResults: any[] = []
  let totalScore = 0
  let mcqScore = 0

  for (const question of questions) {
    const userAnswer = answers[question.id]
    
    if (!userAnswer) {
      // No answer provided
      detailedResults.push({
        questionId: question.id,
        score: 0,
        maxScore: question.marks,
        feedback: "No answer provided",
        isCorrect: false,
        grade: 'F'
      })
      continue
    }

    // Grade MCQ questions locally
    if (question.questionType === 'mcq' || question.questionType === 'multiple-choice' || question.questionType === 'true-false') {
      const isCorrect = userAnswer === question.correctAnswer
      const score = isCorrect ? question.marks : 0
      mcqScore += score
      
      detailedResults.push({
        questionId: question.id,
        score,
        maxScore: question.marks,
        feedback: isCorrect ? "Correct!" : "Incorrect",
        isCorrect,
        grade: calculateGrade(score, question.marks)
      })
    } else {
      // Grade non-MCQ questions using AI
      try {
        const gradingResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/tests/grade`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            questionText: question.questionText,
            correctAnswer: question.correctAnswer,
            userAnswer: userAnswer,
            questionType: question.questionType,
            marks: question.marks,
            topic: question.topic,
            difficulty: question.difficulty
          })
        })

        if (gradingResponse.ok) {
          const gradingResult = await gradingResponse.json()
          if (gradingResult.success) {
            totalScore += gradingResult.result.score
            detailedResults.push({
              questionId: question.id,
              ...gradingResult.result
            })
          } else {
            throw new Error('AI grading failed')
          }
        } else {
          throw new Error('AI grading service unavailable')
        }
      } catch (error) {
        console.error(`Error grading question ${question.id}:`, error)
        // Fallback: give partial credit for any attempt
        const fallbackScore = question.marks * 0.3
        totalScore += fallbackScore
        
        detailedResults.push({
          questionId: question.id,
          score: fallbackScore,
          maxScore: question.marks,
          feedback: "Answer submitted for manual review due to grading system error",
          isCorrect: false,
          grade: calculateGrade(fallbackScore, question.marks)
        })
      }
    }
  }

  return {
    totalScore: totalScore + mcqScore,
    detailedResults
  }
}

function calculateOverallGrade(score: number, totalMarks: number): string {
  const percentage = (score / totalMarks) * 100
  
  if (percentage >= 90) return 'A+'
  if (percentage >= 80) return 'A'
  if (percentage >= 70) return 'B'
  if (percentage >= 60) return 'C'
  if (percentage >= 50) return 'D'
  return 'F'
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
