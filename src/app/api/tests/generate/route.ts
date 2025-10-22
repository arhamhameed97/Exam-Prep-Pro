import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { generateTestQuestions } from "@/lib/gemini"
import { TestGenerationRequest } from "@/types/test"

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

    const body: TestGenerationRequest = await request.json()
    const { 
      subjectCode, 
      subjectName, 
      subjectLevel, 
      numberOfQuestions, 
      difficulty, 
      topics, 
      questionTypes,
      duration 
    } = body

    // Validate required fields
    if (!subjectCode || !subjectName || !numberOfQuestions || !difficulty || !questionTypes) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      )
    }

    // Validate question types
    if (!Array.isArray(questionTypes) || questionTypes.length === 0) {
      return NextResponse.json(
        { message: "At least one question type must be selected" },
        { status: 400 }
      )
    }

    // Validate number of questions (5-50 range)
    if (numberOfQuestions < 5 || numberOfQuestions > 50) {
      return NextResponse.json(
        { message: "Number of questions must be between 5 and 50" },
        { status: 400 }
      )
    }

    // For JWT strategy, user info is in the session token
    // We can optionally verify the user exists in the database, but it's not required for JWT
    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    })

    // If user doesn't exist in database, create them (for first-time users)
    if (!user) {
      // Try to create user if they don't exist (this might happen with JWT strategy)
      try {
        await prisma.user.create({
          data: {
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.name || '',
            level: 'student'
          }
        })
      } catch (error) {
        // User might already exist or creation failed
        console.log('User creation skipped:', error)
      }
    }

    // Find or create subject
    let subject = await prisma.subject.findFirst({
      where: { 
        code: subjectCode,
        userId: session.user.id
      }
    })

    if (!subject) {
      subject = await prisma.subject.create({
        data: {
          name: subjectName,
          code: subjectCode,
          level: subjectLevel,
          description: `AI-generated tests for ${subjectName}`,
          userId: session.user.id
        }
      })
    }

    // Calculate duration if not provided (1 minute per question + 10 minutes buffer)
    const calculatedDuration = duration || (numberOfQuestions + 10)

    // Create test record
    const test = await prisma.test.create({
      data: {
        title: `AI Generated ${subjectName} Test`,
        description: `Practice test for ${subjectName} (${subjectLevel}) - ${numberOfQuestions} questions`,
        type: "practice",
        difficulty,
        duration: calculatedDuration,
        totalMarks: numberOfQuestions * 2, // Assuming 2 marks per question on average
        isAIGenerated: true,
        topics: JSON.stringify(topics),
        questionTypes: JSON.stringify(questionTypes),
        subjectId: subject.id,
        userId: session.user.id
      }
    })

    // Generate questions using Gemini API
    let questions
    try {
      questions = await generateTestQuestions(body)
    } catch (error) {
      console.error('Gemini API error:', error)
      // Throw error instead of generating questions
      return NextResponse.json(
        { 
          message: "AI test generation failed. Please check your internet connection and try again.", 
          error: error instanceof Error ? error.message : 'Unknown error',
          details: "The AI service is currently unavailable. Please try again in a few moments."
        },
        { status: 500 }
      )
    }

    // Save questions to database
    const savedQuestions = await Promise.all(
      questions.map(question => 
        prisma.question.create({
          data: {
            questionText: question.questionText,
            options: JSON.stringify(question.options),
            correctAnswer: question.correctAnswer,
            explanation: question.explanation,
            marks: question.marks,
            difficulty: question.difficulty,
            topic: question.topic,
            questionType: question.questionType,
            testId: test.id
          }
        })
      )
    )

    // Return the generated test with questions
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
        questions: savedQuestions.map(q => ({
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
        createdAt: test.createdAt,
        updatedAt: test.updatedAt
      }
    })

  } catch (error) {
    console.error('Test generation error:', error)
    return NextResponse.json(
      { message: "Internal server error", error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
