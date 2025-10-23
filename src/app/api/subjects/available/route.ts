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

// GET - Fetch available subjects to add
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const level = searchParams.get('level') || 'O-Level'

    // Get user's current subjects
    const userSubjects = await prisma.subject.findMany({
      where: { userId: session.user.id },
      select: { code: true }
    })

    const userSubjectCodes = userSubjects.map(subject => subject.code)

    // Filter out subjects user already has
    const availableSubjects = (AVAILABLE_SUBJECTS[level as keyof typeof AVAILABLE_SUBJECTS] || [])
      .filter(subject => !userSubjectCodes.includes(subject.code))

    return NextResponse.json({ success: true, subjects: availableSubjects })

  } catch (error) {
    console.error('Error fetching available subjects:', error)
    return NextResponse.json(
      { message: "Internal server error", error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
