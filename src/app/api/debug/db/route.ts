import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const start = Date.now()
    const result = await prisma.$queryRaw`SELECT 1 as ok`
    const durationMs = Date.now() - start

    // Do not leak secrets; only return booleans and enums
    const engineType = process.env.PRISMA_CLIENT_ENGINE_TYPE || "binary"
    const dbUrl = process.env.DATABASE_URL || ""
    const urlScheme = dbUrl.split(":")[0] || ""

    return NextResponse.json({
      status: "ok",
      durationMs,
      result,
      prisma: {
        clientVersion: (prisma as any)._clientVersion,
        engineType,
      },
      database: {
        urlScheme,
        hasUrl: Boolean(dbUrl),
      },
    })
  } catch (error: any) {
    const engineType = process.env.PRISMA_CLIENT_ENGINE_TYPE || "binary"
    const dbUrl = process.env.DATABASE_URL || ""
    const urlScheme = dbUrl.split(":")[0] || ""

    return NextResponse.json(
      {
        status: "error",
        message: error?.message || "Unknown error",
        code: error?.code,
        prisma: {
          clientVersion: (prisma as any)._clientVersion,
          engineType,
        },
        database: {
          urlScheme,
          hasUrl: Boolean(dbUrl),
        },
      },
      { status: 500 }
    )
  }
}


