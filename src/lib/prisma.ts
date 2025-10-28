import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Configure Prisma for Neon connection pooling and Vercel serverless
const prismaClientConfig = {
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient(prismaClientConfig)

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
