import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  },
  log: ['query', 'info', 'warn', 'error'],
})

export async function GET(req: NextRequest) {
  try {
    console.log('Testing database connection...')
    console.log('DATABASE_URL:', process.env.DATABASE_URL?.substring(0, 20) + '...')
    
    // Test a simple query
    const userCount = await prisma.user.count()
    
    console.log('Database connection successful! User count:', userCount)
    return NextResponse.json({ 
      success: true, 
      userCount,
      message: 'Database connection successful' 
    })
  } catch (error) {
    console.error('Database connection failed:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
