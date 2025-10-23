import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }

    const { id: attemptId } = await params

    // Fetch test attempt with test and questions
    const attempt = await prisma.testAttempt.findFirst({
      where: {
        id: attemptId,
        userId: session.user.id
      },
      include: {
        test: {
          include: {
            questions: true,
            subject: true
          }
        }
      }
    })

    if (!attempt) {
      return NextResponse.json(
        { message: "Test attempt not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      attempt: {
        id: attempt.id,
        score: attempt.score,
        grade: attempt.grade,
        timeSpent: attempt.timeSpent,
        answers: attempt.answers ? JSON.parse(attempt.answers) : {},
        completedAt: attempt.completedAt,
        status: attempt.status,
        test: {
          id: attempt.test.id,
          title: attempt.test.title,
          description: attempt.test.description,
          duration: attempt.test.duration,
          totalMarks: attempt.test.totalMarks,
          difficulty: attempt.test.difficulty,
          isAIGenerated: attempt.test.isAIGenerated,
          subject: {
            name: attempt.test.subject.name,
            code: attempt.test.subject.code
          },
          questions: attempt.test.questions.map(q => ({
            id: q.id,
            questionText: q.questionText,
            options: JSON.parse(q.options),
            correctAnswer: q.correctAnswer,
            explanation: q.explanation,
            marks: q.marks,
            difficulty: q.difficulty,
            topic: q.topic,
            questionType: q.questionType
          }))
        }
      }
    })

  } catch (error) {
    console.error('Error fetching test attempt:', error)
    return NextResponse.json(
      { message: "Internal server error", error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
