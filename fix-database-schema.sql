-- Fix database schema for existing data
-- Run this on your PostgreSQL database

-- Add new columns with default values to avoid conflicts
ALTER TABLE questions ADD COLUMN IF NOT EXISTS questionText TEXT DEFAULT '';
ALTER TABLE questions ADD COLUMN IF NOT EXISTS updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE questions ADD COLUMN IF NOT EXISTS cacheKey TEXT;
ALTER TABLE questions ADD COLUMN IF NOT EXISTS timesReused INTEGER DEFAULT 0;

-- Update existing NULL values
UPDATE questions SET correctAnswer = 'A' WHERE correctAnswer IS NULL;
UPDATE questions SET questionText = 'Sample Question' WHERE questionText IS NULL OR questionText = '';

-- Add columns to other tables
ALTER TABLE subjects ADD COLUMN IF NOT EXISTS updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE subjects ADD COLUMN IF NOT EXISTS userId TEXT DEFAULT 'default-user';

ALTER TABLE test_attempts ADD COLUMN IF NOT EXISTS grade TEXT DEFAULT 'F';

ALTER TABLE tests ADD COLUMN IF NOT EXISTS updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE tests ADD COLUMN IF NOT EXISTS userId TEXT DEFAULT 'default-user';

-- Update existing NULL values in tests
UPDATE tests SET difficulty = 'medium' WHERE difficulty IS NULL;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_questions_cache_key ON questions(cacheKey);
CREATE INDEX IF NOT EXISTS idx_questions_times_reused ON questions(timesReused);
CREATE INDEX IF NOT EXISTS idx_questions_test_id ON questions(testId);
CREATE INDEX IF NOT EXISTS idx_tests_user_id ON tests(userId);
CREATE INDEX IF NOT EXISTS idx_subjects_user_id ON subjects(userId);
