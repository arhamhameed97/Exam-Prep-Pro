import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  },
  log: ['query', 'info', 'warn', 'error'],
})

export default async function handler(req: any, res: any) {
  try {
    console.log('Testing database connection...')
    console.log('DATABASE_URL:', process.env.DATABASE_URL?.substring(0, 20) + '...')
    
    // Test a simple query
    const userCount = await prisma.user.count()
    
    console.log('Database connection successful! User count:', userCount)
    res.status(200).json({ 
      success: true, 
      userCount,
      message: 'Database connection successful' 
    })
  } catch (error) {
    console.error('Database connection failed:', error)
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error
    })
  } finally {
    await prisma.$disconnect()
  }
}
