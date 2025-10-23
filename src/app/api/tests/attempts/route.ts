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

    const { searchParams } = new URL(request.url)
    const subjectCode = searchParams.get('subjectCode')

    if (!subjectCode) {
      return NextResponse.json({ error: 'Subject code is required' }, { status: 400 })
    }

    // Find the subject by code
    const subject = await prisma.subject.findFirst({
      where: { code: subjectCode }
    })

    if (!subject) {
      return NextResponse.json({ error: 'Subject not found' }, { status: 404 })
    }

    // Fetch test attempts for this subject
    const attempts = await prisma.testAttempt.findMany({
      where: {
        userId: session.user.id,
        test: {
          subjectId: subject.id
        },
        status: 'completed'
      },
      include: {
        test: {
          select: {
            id: true,
            title: true,
            duration: true
          }
        }
      },
      orderBy: {
        completedAt: 'desc'
      }
    })

    return NextResponse.json({
      success: true,
      attempts: attempts.map(attempt => ({
        id: attempt.id,
        score: attempt.score,
        grade: attempt.grade,
        timeSpent: attempt.timeSpent,
        completedAt: attempt.completedAt.toISOString(),
        test: {
          id: attempt.test.id,
          title: attempt.test.title,
          duration: attempt.test.duration
        }
      }))
    })

  } catch (error) {
    console.error('Error fetching test attempts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch test attempts' },
      { status: 500 }
    )
  }
}
