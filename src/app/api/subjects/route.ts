import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// Available subjects data
const AVAILABLE_SUBJECTS = {
  "O-Level": [
    { name: "Mathematics", code: "4024", description: "Core Mathematics covering algebra, geometry, and statistics" },
    { name: "Additional Mathematics", code: "4037", description: "Advanced mathematical concepts and problem-solving" },
    { name: "English Language", code: "1123", description: "English language skills and comprehension" },
    { name: "English Literature", code: "2010", description: "Literary analysis and critical thinking" },
    { name: "Urdu", code: "3248", description: "Urdu language and literature" },
    { name: "Pakistan Studies", code: "2059", description: "History and geography of Pakistan" },
    { name: "Islamiyat", code: "2058", description: "Islamic studies and religious education" },
    { name: "Physics", code: "5054", description: "Fundamental physics principles and applications" },
    { name: "Chemistry", code: "5070", description: "Chemical reactions, atomic structure, and laboratory work" },
    { name: "Biology", code: "5090", description: "Living organisms, cells, and biological processes" },
    { name: "Computer Science", code: "2210", description: "Programming and computer fundamentals" },
    { name: "Geography", code: "2217", description: "Physical and human geography" },
    { name: "History", code: "2147", description: "World history and historical analysis" },
    { name: "Economics", code: "2281", description: "Economic principles and market systems" },
    { name: "Business Studies", code: "7115", description: "Business management and entrepreneurship" },
    { name: "Art & Design", code: "6090", description: "Creative arts and design principles" },
    { name: "Music", code: "6100", description: "Musical theory and performance" },
    { name: "French", code: "3015", description: "French language and culture" },
    { name: "German", code: "3016", description: "German language and culture" },
    { name: "Spanish", code: "3017", description: "Spanish language and culture" },
    { name: "Arabic", code: "3180", description: "Arabic language and literature" },
    { name: "Chinese", code: "3205", description: "Chinese language and culture" }
  ],
  "A-Level": [
    { name: "Mathematics", code: "9709", description: "Advanced Mathematics including calculus and statistics" },
    { name: "Further Mathematics", code: "9231", description: "Advanced mathematical concepts and applications" },
    { name: "Physics", code: "9702", description: "Advanced physics principles and applications" },
    { name: "Chemistry", code: "9701", description: "Advanced chemistry including organic and inorganic" },
    { name: "Biology", code: "9700", description: "Advanced biology including molecular and cellular biology" },
    { name: "Computer Science", code: "9608", description: "Advanced programming and computer science" },
    { name: "Economics", code: "9708", description: "Advanced economic theory and analysis" },
    { name: "Business", code: "9609", description: "Advanced business management and strategy" },
    { name: "Psychology", code: "9990", description: "Advanced psychology and behavioral studies" },
    { name: "Sociology", code: "9699", description: "Advanced sociology and social theory" },
    { name: "History", code: "9489", description: "Advanced historical analysis and research" },
    { name: "Geography", code: "9696", description: "Advanced geography and environmental studies" },
    { name: "English Literature", code: "9695", description: "Advanced literary analysis and criticism" },
    { name: "Art & Design", code: "9479", description: "Advanced creative arts and design" },
    { name: "Music", code: "9483", description: "Advanced musical theory and composition" }
  ]
}

// GET - Fetch user's subjects
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!(session as { user?: { id: string } })?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const subjects = await prisma.subject.findMany({
      where: { userId: (session as { user: { id: string } }).user.id },
      include: {
        tests: {
          include: {
            attempts: {
              where: { userId: (session as { user: { id: string } }).user.id }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ success: true, subjects })

  } catch (error) {
    console.error('Error fetching subjects:', error)
    return NextResponse.json(
      { message: "Internal server error", error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// POST - Add a new subject
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!(session as { user?: { id: string } })?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { subjectCode, level = "O-Level" } = body

    if (!subjectCode) {
      return NextResponse.json({ message: "Subject code is required" }, { status: 400 })
    }

    // Check if subject exists in available subjects
    const availableSubjects = AVAILABLE_SUBJECTS[level as keyof typeof AVAILABLE_SUBJECTS] || []
    const subjectData = availableSubjects.find(subject => subject.code === subjectCode)

    if (!subjectData) {
      return NextResponse.json({ message: "Subject not found" }, { status: 404 })
    }

    // Check if user already has this subject
    const existingSubject = await prisma.subject.findFirst({
      where: {
        userId: (session as { user: { id: string } }).user.id,
        code: subjectCode
      }
    })

    if (existingSubject) {
      return NextResponse.json({ message: "Subject already added" }, { status: 409 })
    }

    // Create new subject
    const newSubject = await prisma.subject.create({
      data: {
        name: subjectData.name,
        code: subjectData.code,
        description: subjectData.description,
        level,
        userId: (session as { user: { id: string } }).user.id
      }
    })

    return NextResponse.json({ success: true, subject: newSubject })

  } catch (error) {
    console.error('Error adding subject:', error)
    return NextResponse.json(
      { message: "Internal server error", error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// DELETE - Remove a subject
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!(session as { user?: { id: string } })?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const subjectId = searchParams.get('id')

    if (!subjectId) {
      return NextResponse.json({ message: "Subject ID is required" }, { status: 400 })
    }

    // Check if subject belongs to user
    const subject = await prisma.subject.findFirst({
      where: {
        id: subjectId,
        userId: (session as { user: { id: string } }).user.id
      }
    })

    if (!subject) {
      return NextResponse.json({ message: "Subject not found" }, { status: 404 })
    }

    // Delete subject (this will cascade delete tests and attempts)
    await prisma.subject.delete({
      where: { id: subjectId }
    })

    return NextResponse.json({ success: true, message: "Subject removed successfully" })

  } catch (error) {
    console.error('Error removing subject:', error)
    return NextResponse.json(
      { message: "Internal server error", error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}


