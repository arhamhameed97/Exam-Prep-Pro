import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get all tests for this user
    const tests = await prisma.test.findMany({
      where: {
        userId: session.user.id
      },
      include: {
        subject: true,
        attempts: {
          where: {
            status: 'completed'
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10
    })

    return NextResponse.json({
      success: true,
      tests: tests.map(test => ({
        id: test.id,
        title: test.title,
        subjectCode: test.subject?.code,
        subjectName: test.subject?.name,
        createdAt: test.createdAt,
        attemptsCount: test.attempts.length,
        attempts: test.attempts.map(attempt => ({
          id: attempt.id,
          score: attempt.score,
          grade: attempt.grade,
          completedAt: attempt.completedAt
        }))
      }))
    })

  } catch (error) {
    console.error('Error fetching tests:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tests' },
      { status: 500 }
    )
  }
}
