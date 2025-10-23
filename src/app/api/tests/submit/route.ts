import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { testId, score, grade, timeSpent, answers } = body

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
        userId: session.user.id
      }
    })

    if (!test) {
      return NextResponse.json(
        { message: "Test not found" },
        { status: 404 }
      )
    }

    // Save test attempt
    const testAttempt = await prisma.testAttempt.create({
      data: {
        score: parseFloat(score),
        grade,
        timeSpent: Math.round(parseInt(timeSpent) / 60), // Convert seconds to minutes
        answers: JSON.stringify(answers), // Store user's answers as JSON
        status: 'completed',
        testId,
        userId: session.user.id
      }
    })

    return NextResponse.json({
      success: true,
      attemptId: testAttempt.id,
      message: "Test attempt saved successfully"
    })

  } catch (error) {
    console.error('Test submission error:', error)
    return NextResponse.json(
      { message: "Internal server error", error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
