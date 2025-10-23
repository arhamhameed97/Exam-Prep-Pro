"use client"

import { 
  X, 
  Trophy, 
  Clock, 
  BookOpen, 
  RotateCcw, 
  Eye,
  AlertCircle
} from "lucide-react"
import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"

interface TestAttempt {
  id: string
  score: number
  grade: string
  timeSpent: number
  completedAt: string
  status: string
  test: {
    id: string
    title: string
    description?: string
    duration: number
    totalMarks: number
    difficulty: string
    isAIGenerated: boolean
    subject: {
      name: string
      code: string
    }
    questions: Array<{
      id: string
      questionText: string
      options: string[]
      correctAnswer: string
      explanation?: string
      marks: number
      difficulty: string
      topic?: string
      questionType: string
    }>
  }
}

interface TestResultsModalProps {
  isOpen: boolean
  onClose: () => void
  attemptId: string
}

export default function TestResultsModal({ isOpen, onClose, attemptId }: TestResultsModalProps) {
  const [attempt, setAttempt] = useState<TestAttempt | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    if (isOpen && attemptId) {
      fetchAttemptData()
    }
  }, [isOpen, attemptId, fetchAttemptData])

  const fetchAttemptData = useCallback(async () => {
    try {
      setLoading(true)
      setError('')
      
      const response = await fetch(`/api/tests/attempts/${attemptId}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch test attempt')
      }
      
      const data = await response.json()
      
      if (data.success) {
        setAttempt(data.attempt)
      } else {
        throw new Error(data.message || 'Failed to load test attempt')
      }
    } catch (error) {
      console.error('Error fetching attempt:', error)
      setError(error instanceof Error ? error.message : 'Failed to load test attempt')
    } finally {
      setLoading(false)
    }
  }, [attemptId])

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleRetakeTest = () => {
    if (attempt) {
      router.push(`/tests/${attempt.test.id}`)
      onClose()
    }
  }

  const handleViewDetailedResults = () => {
    if (attempt) {
      router.push(`/tests/${attempt.test.id}?viewResults=${attempt.id}`)
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Trophy className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Test Results</h2>
              <p className="text-sm text-slate-600">
                {attempt?.test.title || 'Loading...'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-slate-600" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          {loading && (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          )}

          {error && (
            <div className="p-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <span className="text-red-800 font-medium">Error</span>
                </div>
                <p className="text-red-700 mt-2">{error}</p>
              </div>
            </div>
          )}

          {attempt && (
            <div className="p-6 space-y-6">
              {/* Score Summary */}
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white">
                <div className="text-center mb-6">
                  <Trophy className="h-16 w-16 text-yellow-300 mx-auto mb-4" />
                  <div className="text-5xl font-bold mb-2">
                    {attempt.grade}
                  </div>
                  <p className="text-xl opacity-90">
                    {attempt.score} / {attempt.test.totalMarks} marks
                  </p>
                  <p className="text-lg opacity-75">
                    {Math.round((attempt.score / attempt.test.totalMarks) * 100)}%
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                    <div className="text-2xl font-bold">{attempt.test.questions.length}</div>
                    <div className="text-sm opacity-90">Total Questions</div>
                  </div>
                  <div className="text-center p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                    <div className="text-2xl font-bold">{attempt.test.duration}</div>
                    <div className="text-sm opacity-90">Duration (min)</div>
                  </div>
                  <div className="text-center p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                    <div className="text-2xl font-bold">{formatTime(attempt.timeSpent)}</div>
                    <div className="text-sm opacity-90">Time Spent</div>
                  </div>
                </div>
              </div>

              {/* Test Details */}
              <div className="bg-slate-50 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2 flex items-center space-x-2">
                      <BookOpen className="h-4 w-4 text-slate-600" />
                      <span>Subject</span>
                    </h4>
                    <p className="text-slate-700">{attempt.test.subject.name}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2 flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-slate-600" />
                      <span>Completed</span>
                    </h4>
                    <p className="text-slate-700">{formatDate(attempt.completedAt)}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">Difficulty</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      attempt.test.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                      attempt.test.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {attempt.test.difficulty}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">Type</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      attempt.test.isAIGenerated ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {attempt.test.isAIGenerated ? 'AI Generated' : 'Manual'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Performance Analysis */}
              <div className="bg-white border border-slate-200 rounded-lg p-4">
                <h4 className="font-semibold text-slate-900 mb-4">Performance Analysis</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Overall Score</span>
                    <span className={`font-semibold ${
                      attempt.score >= 80 ? 'text-green-600' :
                      attempt.score >= 60 ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {Math.round((attempt.score / attempt.test.totalMarks) * 100)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Time Efficiency</span>
                    <span className={`font-semibold ${
                      attempt.timeSpent <= attempt.test.duration * 0.8 ? 'text-green-600' :
                      attempt.timeSpent <= attempt.test.duration ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {attempt.timeSpent <= attempt.test.duration ? 'Good' : 'Over Time'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Grade</span>
                    <span className={`font-semibold ${
                      attempt.grade === 'A+' || attempt.grade === 'A' ? 'text-green-600' :
                      attempt.grade === 'B' || attempt.grade === 'C' ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {attempt.grade}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {attempt && (
          <div className="flex items-center justify-between p-6 border-t border-slate-200 bg-slate-50">
            <div className="text-sm text-slate-600">
              Completed on {formatDate(attempt.completedAt)}
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleViewDetailedResults}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors flex items-center space-x-2"
              >
                <Eye className="h-4 w-4" />
                <span>View Details</span>
              </button>
              <button
                onClick={handleRetakeTest}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Retake Test</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
