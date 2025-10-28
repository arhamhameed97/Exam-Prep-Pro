import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest, { params }: { params: { code: string } }) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!(session as { user?: { id: string } })?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }

    const subjectCode = params.code

    // Find subject
    const subject = await prisma.subject.findFirst({
      where: { 
        code: subjectCode,
        userId: (session as { user: { id: string } }).user.id
      }
    })

    if (!subject) {
      return NextResponse.json(
        { message: "Subject not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      subject: {
        id: subject.id,
        name: subject.name,
        code: subject.code,
        level: subject.level,
        description: subject.description,
        syllabus: subject.syllabus,
        markScheme: subject.markScheme,
        syllabusFile: subject.syllabusFile,
        markSchemeFile: subject.markSchemeFile
      }
    })

  } catch (error) {
    console.error('Error fetching subject:', error)
    return NextResponse.json(
      { message: "Internal server error", error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest, { params }: { params: { code: string } }) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!(session as { user?: { id: string } })?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }

    const subjectCode = params.code
    const body = await request.json()
    const { syllabus, markScheme, syllabusFile, markSchemeFile } = body

    // Update subject
    const subject = await prisma.subject.updateMany({
      where: { 
        code: subjectCode,
        userId: (session as { user: { id: string } }).user.id
      },
      data: {
        syllabus: syllabus !== undefined ? syllabus : undefined,
        markScheme: markScheme !== undefined ? markScheme : undefined,
        syllabusFile: syllabusFile !== undefined ? syllabusFile : undefined,
        markSchemeFile: markSchemeFile !== undefined ? markSchemeFile : undefined
      }
    })

    if (subject.count === 0) {
      return NextResponse.json(
        { message: "Subject not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Subject updated successfully"
    })

  } catch (error) {
    console.error('Error updating subject:', error)
    return NextResponse.json(
      { message: "Internal server error", error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

