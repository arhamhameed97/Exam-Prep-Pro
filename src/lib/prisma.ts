import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Debug logging for environment variables
if (!process.env.DATABASE_URL) {
  console.error('⚠️ DATABASE_URL is not set!')
  console.error('Environment variables:', Object.keys(process.env).filter(key => key.includes('DATABASE')))
}

// Configure Prisma for Neon connection pooling and Vercel serverless
const prismaClientConfig = {
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient(prismaClientConfig)

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
