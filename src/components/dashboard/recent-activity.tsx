"use client"

import { 
  Clock, 
  Trophy, 
  BookOpen, 
  Target, 
  TrendingUp, 
  TrendingDown,
  CheckCircle,
  XCircle,
  Star,
  Calendar,
  Timer,
  Award,
  Brain,
  Zap,
  ChevronRight
} from "lucide-react"
import { useState } from "react"
import TestResultsModal from "./test-results-modal"

interface TestAttempt {
  id: string
  score: number
  grade: string
  timeSpent: number
  status: string
  completedAt: string
  test: {
    id: string
    title: string
    difficulty: string
    totalMarks: number
    duration: number
    isAIGenerated: boolean
    subject: {
      name: string
      code: string
    }
  }
}

interface RecentActivityProps {
  attempts: TestAttempt[]
}

export default function RecentActivity({ attempts }: RecentActivityProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const [selectedAttemptId, setSelectedAttemptId] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A+': return 'text-green-600 bg-green-100'
      case 'A': return 'text-green-600 bg-green-100'
      case 'B': return 'text-blue-600 bg-blue-100'
      case 'C': return 'text-yellow-600 bg-yellow-100'
      case 'D': return 'text-orange-600 bg-orange-100'
      default: return 'text-red-600 bg-red-100'
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-50'
      case 'medium': return 'text-yellow-600 bg-yellow-50'
      case 'hard': return 'text-red-600 bg-red-50'
      default: return 'text-slate-600 bg-slate-50'
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const getPerformanceTrend = (score: number) => {
    if (score >= 80) return { icon: TrendingUp, color: 'text-green-500', text: 'Excellent' }
    if (score >= 60) return { icon: Target, color: 'text-blue-500', text: 'Good' }
    return { icon: TrendingDown, color: 'text-red-500', text: 'Needs Work' }
  }

  const handleViewResults = (attemptId: string) => {
    setSelectedAttemptId(attemptId)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedAttemptId(null)
  }

  if (attempts.length === 0) {
    return (
      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center space-x-2">
          <Clock className="h-5 w-5 text-slate-600" />
          <span>Recent Activity</span>
        </h3>
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Brain className="h-8 w-8 text-indigo-500" />
          </div>
          <h4 className="text-sm font-medium text-slate-900 mb-1">No Recent Activity</h4>
          <p className="text-xs text-slate-500 mb-3">Start your learning journey</p>
          <a 
            href="/subjects" 
            className="inline-flex items-center space-x-1 px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-xs"
          >
            <Zap className="h-3 w-3" />
            <span>Take a Test</span>
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-900 flex items-center space-x-2">
          <Clock className="h-5 w-5 text-slate-600" />
          <span>Recent Activity</span>
        </h3>
        <a 
          href="/tests" 
          className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
        >
          View All
        </a>
      </div>

      <div className="space-y-3">
        {attempts.slice(0, 3).map((attempt, index) => {
          const trend = getPerformanceTrend(Math.round((attempt.score / attempt.test.totalMarks) * 100))
          const TrendIcon = trend.icon
          
          return (
            <div
              key={attempt.id}
              className={`group relative p-3 rounded-lg border transition-all duration-300 hover:shadow-md ${
                hoveredItem === attempt.id 
                  ? 'border-indigo-200 bg-indigo-50' 
                  : 'border-slate-100 bg-slate-50 hover:border-slate-200'
              }`}
              onMouseEnter={() => setHoveredItem(attempt.id)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              {/* Compact Header */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-1 mb-1">
                    <h4 className="font-medium text-slate-900 text-sm truncate group-hover:text-indigo-700 transition-colors">
                      {attempt.test.title.length > 35 ? `${attempt.test.title.substring(0, 35)}...` : attempt.test.title}
                    </h4>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-slate-600">
                    <span className="flex items-center space-x-0.5">
                      <BookOpen className="h-3 w-3" />
                      <span className="truncate">{attempt.test.subject.name}</span>
                    </span>
                    <span className={`px-1.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(attempt.test.difficulty)}`}>
                      {attempt.test.difficulty}
                    </span>
                  </div>
                </div>
                
                <div className="text-right ml-2">
                  <div className={`text-lg font-bold ${getScoreColor(Math.round((attempt.score / attempt.test.totalMarks) * 100))}`}>
                    {Math.round((attempt.score / attempt.test.totalMarks) * 100)}%
                  </div>
                  <div className={`inline-flex items-center space-x-0.5 px-1.5 py-0.5 rounded-full text-xs font-medium ${getGradeColor(attempt.grade)}`}>
                    <Award className="h-2.5 w-2.5" />
                    <span>{attempt.grade}</span>
                  </div>
                </div>
              </div>

              {/* Compact Progress Bar */}
              <div className="mb-2">
                <div className="flex justify-between text-xs text-slate-600 mb-1">
                  <span>Performance</span>
                  <span className="flex items-center space-x-0.5">
                    <TrendIcon className={`h-2.5 w-2.5 ${trend.color}`} />
                    <span className={trend.color}>{trend.text}</span>
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5">
                  <div 
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      Math.round((attempt.score / attempt.test.totalMarks) * 100) >= 80 ? 'bg-gradient-to-r from-green-400 to-green-500' :
                      Math.round((attempt.score / attempt.test.totalMarks) * 100) >= 60 ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' :
                      'bg-gradient-to-r from-red-400 to-red-500'
                    }`}
                    style={{ width: `${Math.round((attempt.score / attempt.test.totalMarks) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Compact Stats */}
              <div className="grid grid-cols-2 gap-2 mb-2">
                <div className="text-center p-1.5 bg-white rounded-md">
                  <div className="text-sm font-semibold text-slate-900">{attempt.score}/{attempt.test.totalMarks}</div>
                  <div className="text-xs text-slate-600">Marks</div>
                </div>
                <div className="text-center p-1.5 bg-white rounded-md">
                  <div className="text-sm font-semibold text-slate-900">{formatTime(attempt.timeSpent)}</div>
                  <div className="text-xs text-slate-600">Time</div>
                </div>
              </div>

              {/* Compact Footer */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                <span className="text-xs text-slate-500">{formatDate(attempt.completedAt)}</span>
                <button 
                  onClick={() => handleViewResults(attempt.id)}
                  className="inline-flex items-center space-x-1 text-xs text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  <span>View Results</span>
                  <ChevronRight className="h-3 w-3" />
                </button>
              </div>

              {/* Hover Effect Indicator */}
              {hoveredItem === attempt.id && (
                <div className="absolute top-1.5 right-1.5">
                  <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Compact Footer */}
      <div className="mt-4 pt-3 border-t border-slate-200">
        <div className="flex items-center justify-between text-xs text-slate-600">
          <span>Showing {Math.min(attempts.length, 3)} recent</span>
          <a 
            href="/tests" 
            className="flex items-center space-x-1 text-indigo-600 hover:text-indigo-700 font-medium"
          >
            <span>View All</span>
            <ChevronRight className="h-3 w-3" />
          </a>
        </div>
      </div>
      
      <TestResultsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        attemptId={selectedAttemptId || ''}
      />
    </div>
  )
}