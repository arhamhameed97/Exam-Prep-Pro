/**
 * Centralized AI configuration for cost optimization
 */

export const AI_CONFIG = {
  // Model configuration - using most cost-effective model
  model: process.env.AI_MODEL || "gemini-1.5-flash", // More cost-effective than 2.0
  
  // Generation configuration optimized for minimal token usage
  generationConfig: {
    temperature: 0.3, // Lower temperature for more consistent, shorter responses
    topP: 0.8, // Reduced for more focused responses
    topK: 20, // Reduced for more focused responses
    maxOutputTokens: 4096, // Reduced from 8192 to limit output tokens
    responseMimeType: "application/json" as const,
  },

  // Retry configuration - reduced attempts to save costs
  retry: {
    maxAttempts: 2, // Reduced from 3 to save API calls
    baseDelay: 500, // Reduced delay
    maxDelay: 5000, // Reduced max delay
  },

  // Cache configuration - extended cache for cost savings
  cache: {
    enabled: true,
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days - longer cache for cost savings
    reuseThreshold: 0.8, // Higher threshold for better reuse
  },

  // Cost tracking
  tracking: {
    enabled: process.env.NODE_ENV === 'development',
    logTokenUsage: true, // Always log for cost monitoring
  }
} as const;

// JSON Schema for question generation to reduce output tokens
export const QUESTION_SCHEMA = {
  type: "object",
  properties: {
    questions: {
      type: "array",
      items: {
        type: "object",
        properties: {
          questionText: { type: "string" },
          options: {
            type: "array",
            items: { type: "string" }
          },
          correctAnswer: { type: "string" },
          explanation: { type: "string" },
          marks: { type: "integer", minimum: 1, maximum: 10 },
          difficulty: { type: "string", enum: ["easy", "medium", "hard"] },
          topic: { type: "string" },
          questionType: { 
            type: "string", 
            enum: ["mcq", "short-answer", "long-answer", "essay", "true-false", "fill-blanks"] 
          }
        },
        required: ["questionText", "options", "correctAnswer", "explanation", "marks", "difficulty", "topic", "questionType"],
        additionalProperties: false
      }
    }
  },
  required: ["questions"],
  additionalProperties: false
} as const;
