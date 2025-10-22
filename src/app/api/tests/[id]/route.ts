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

    const { id: testId } = await params

    // Fetch test with questions
    const test = await prisma.test.findFirst({
      where: {
        id: testId,
        userId: session.user.id // Ensure user can only access their own tests
      },
      include: {
        questions: {
          orderBy: {
            createdAt: 'asc'
          }
        },
        subject: true
      }
    })

    if (!test) {
      return NextResponse.json(
        { message: "Test not found" },
        { status: 404 }
      )
    }

    // Return the test data
    return NextResponse.json({
      success: true,
      test: {
        id: test.id,
        title: test.title,
        description: test.description,
        type: test.type,
        difficulty: test.difficulty,
        duration: test.duration,
        totalMarks: test.totalMarks,
        isAIGenerated: test.isAIGenerated,
        topics: test.topics ? JSON.parse(test.topics) : [],
        questionTypes: test.questionTypes ? JSON.parse(test.questionTypes) : [],
        subjectId: test.subjectId,
        userId: test.userId,
        questions: test.questions.map(q => ({
          id: q.id,
          questionText: q.questionText,
          options: JSON.parse(q.options),
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
          marks: q.marks,
          difficulty: q.difficulty,
          topic: q.topic,
          questionType: q.questionType,
          testId: q.testId,
          createdAt: q.createdAt,
          updatedAt: q.updatedAt
        })),
        subject: test.subject,
        createdAt: test.createdAt,
        updatedAt: test.updatedAt
      }
    })

  } catch (error) {
    console.error('Error fetching test:', error)
    return NextResponse.json(
      { message: "Internal server error", error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
