import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { tokenTracker } from "@/lib/token-tracker"
import { getCacheStats } from "@/lib/question-cache"

export async function GET() {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }

    // Get usage statistics
    const usageStats = tokenTracker.getUsageStats()
    const cacheStats = getCacheStats()
    const usageHistory = tokenTracker.getUsageHistory(7) // Last 7 days

    // Calculate cost savings from caching
    const estimatedCacheSavings = cacheStats.size * usageStats.averagePerRequest.cost * 0.8 // 80% cache hit rate estimate

    return NextResponse.json({
      success: true,
      data: {
        usage: usageStats,
        cache: {
          ...cacheStats,
          estimatedSavings: estimatedCacheSavings
        },
        history: usageHistory,
        limits: {
          daily: {
            limit: 100000,
            used: usageStats.daily.tokens,
            percentage: (usageStats.daily.tokens / 100000) * 100
          },
          monthly: {
            limit: 2000000,
            used: usageStats.monthly.tokens,
            percentage: (usageStats.monthly.tokens / 2000000) * 100
          }
        },
        recommendations: generateRecommendations(usageStats, cacheStats)
      }
    })

  } catch (error) {
    console.error('Error fetching cost analytics:', error)
    return NextResponse.json(
      { message: "Internal server error", error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

function generateRecommendations(usageStats: { daily: { tokens: number }, weekly: { tokens: number }, monthly: { tokens: number } }, cacheStats: { hitRate: number, totalRequests: number }): string[] {
  const recommendations = []

  if (usageStats.daily.tokens > 50000) {
    recommendations.push("High daily usage detected. Consider implementing more aggressive caching.")
  }

  if (usageStats.averagePerRequest.tokens > 2000) {
    recommendations.push("High token usage per request. Consider optimizing prompts further.")
  }

  if (cacheStats.size < 10) {
    recommendations.push("Low cache utilization. Consider extending cache duration.")
  }

  if (usageStats.daily.requests > 100) {
    recommendations.push("High request volume. Consider implementing request batching.")
  }

  if (recommendations.length === 0) {
    recommendations.push("API usage is optimized. Continue current practices.")
  }

  return recommendations
}

