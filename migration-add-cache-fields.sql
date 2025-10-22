-- Migration to add cache fields to questions table
-- Run this after updating your Prisma schema

-- Add cacheKey column (nullable)
ALTER TABLE questions ADD COLUMN cacheKey TEXT;

-- Add timesReused column with default value 0
ALTER TABLE questions ADD COLUMN timesReused INTEGER DEFAULT 0;

-- Create index on cacheKey for faster lookups
CREATE INDEX idx_questions_cache_key ON questions(cacheKey);

-- Create index on timesReused for cache cleanup queries
CREATE INDEX idx_questions_times_reused ON questions(timesReused);
