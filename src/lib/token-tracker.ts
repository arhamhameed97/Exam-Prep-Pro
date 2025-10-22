// Token usage tracking for cost monitoring
interface TokenUsage {
  inputTokens: number
  outputTokens: number
  totalTokens: number
  cost: number
  timestamp: number
  model: string
}

class TokenTracker {
  private usage: TokenUsage[] = []
  private dailyLimit = 100000 // 100k tokens per day limit
  private monthlyLimit = 2000000 // 2M tokens per month limit

  // Token pricing (approximate rates for Gemini models)
  private readonly PRICING = {
    'gemini-1.5-flash': {
      input: 0.000075, // $0.075 per 1M tokens
      output: 0.0003   // $0.30 per 1M tokens
    },
    'gemini-2.0-flash': {
      input: 0.000075,
      output: 0.0003
    },
    'gemini-2.5-flash': {
      input: 0.000075,
      output: 0.0003
    }
  }

  trackUsage(inputTokens: number, outputTokens: number, model: string): TokenUsage {
    const pricing = this.PRICING[model as keyof typeof this.PRICING] || this.PRICING['gemini-1.5-flash']
    const cost = (inputTokens * pricing.input + outputTokens * pricing.output) / 1000000

    const usage: TokenUsage = {
      inputTokens,
      outputTokens,
      totalTokens: inputTokens + outputTokens,
      cost,
      timestamp: Date.now(),
      model
    }

    this.usage.push(usage)
    
    // Keep only last 1000 entries to prevent memory issues
    if (this.usage.length > 1000) {
      this.usage = this.usage.slice(-1000)
    }

    console.log(`[COST] ${model}: ${inputTokens} input + ${outputTokens} output = $${cost.toFixed(6)}`)

    return usage
  }

  getDailyUsage(): { tokens: number, cost: number, requests: number } {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayStart = today.getTime()

    const todayUsage = this.usage.filter(u => u.timestamp >= todayStart)
    
    return {
      tokens: todayUsage.reduce((sum, u) => sum + u.totalTokens, 0),
      cost: todayUsage.reduce((sum, u) => sum + u.cost, 0),
      requests: todayUsage.length
    }
  }

  getMonthlyUsage(): { tokens: number, cost: number, requests: number } {
    const now = new Date()
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime()

    const monthUsage = this.usage.filter(u => u.timestamp >= monthStart)
    
    return {
      tokens: monthUsage.reduce((sum, u) => sum + u.totalTokens, 0),
      cost: monthUsage.reduce((sum, u) => sum + u.cost, 0),
      requests: monthUsage.length
    }
  }

  getUsageStats(): {
    daily: { tokens: number, cost: number, requests: number }
    monthly: { tokens: number, cost: number, requests: number }
    total: { tokens: number, cost: number, requests: number }
    averagePerRequest: { tokens: number, cost: number }
  } {
    const daily = this.getDailyUsage()
    const monthly = this.getMonthlyUsage()
    const total = {
      tokens: this.usage.reduce((sum, u) => sum + u.totalTokens, 0),
      cost: this.usage.reduce((sum, u) => sum + u.cost, 0),
      requests: this.usage.length
    }

    const averagePerRequest = {
      tokens: total.requests > 0 ? total.tokens / total.requests : 0,
      cost: total.requests > 0 ? total.cost / total.requests : 0
    }

    return {
      daily,
      monthly,
      total,
      averagePerRequest
    }
  }

  isDailyLimitExceeded(): boolean {
    return this.getDailyUsage().tokens > this.dailyLimit
  }

  isMonthlyLimitExceeded(): boolean {
    return this.getMonthlyUsage().tokens > this.monthlyLimit
  }

  getUsageHistory(days: number = 7): TokenUsage[] {
    const cutoff = Date.now() - (days * 24 * 60 * 60 * 1000)
    return this.usage.filter(u => u.timestamp >= cutoff)
  }
}

// Singleton instance
export const tokenTracker = new TokenTracker()

// Helper function to estimate tokens in text
export function estimateTokens(text: string): number {
  // Rough estimation: 1 token ≈ 4 characters for English text
  return Math.ceil(text.length / 4)
}

// Function to track API usage
export function trackApiUsage(inputText: string, outputText: string, model: string): TokenUsage {
  const inputTokens = estimateTokens(inputText)
  const outputTokens = estimateTokens(outputText)
  
  return tokenTracker.trackUsage(inputTokens, outputTokens, model)
}

