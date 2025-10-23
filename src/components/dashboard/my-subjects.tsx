"use client"

import { 
  BookOpen, 
  Plus, 
  TrendingUp, 
  Clock, 
  Target, 
  Award, 
  Brain,
  Zap,
  Star,
  Calendar,
  BarChart3,
  Trophy,
  ChevronRight,
  Search,
  Filter,
  Grid,
  List,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Play
} from "lucide-react"
import { useState, useEffect } from "react"
import Link from "next/link"
import AddSubjectModal from "./add-subject-modal"

interface SubjectStats {
  id: string
  name: string
  code: string
  level: string
  description?: string
  totalTests: number
  totalTimeSpent: number
  averageScore: number
  bestScore: number
  lastAccessed: string
  recentActivity: number
  performance: 'excellent' | 'good' | 'average' | 'needs-improvement'
  isFavorite: boolean
  color: string
  icon: string // Changed from component to string
}

interface MySubjectsProps {
  subjects: SubjectStats[]
}

export default function MySubjects({ subjects: initialSubjects }: MySubjectsProps) {
  const [subjects, setSubjects] = useState<SubjectStats[]>(initialSubjects)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState<'recent' | 'performance' | 'name' | 'tests'>('recent')
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddSubject, setShowAddSubject] = useState(false)
  const [hoveredSubject, setHoveredSubject] = useState<string | null>(null)

  // Filter and sort subjects
  const filteredSubjects = subjects
    .filter(subject => 
      subject.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      subject.code.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.lastAccessed).getTime() - new Date(a.lastAccessed).getTime()
        case 'performance':
          return b.averageScore - a.averageScore
        case 'name':
          return a.name.localeCompare(b.name)
        case 'tests':
          return b.totalTests - a.totalTests
        default:
          return 0
      }
    })

  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case 'excellent': return 'text-green-600 bg-green-100'
      case 'good': return 'text-blue-600 bg-blue-100'
      case 'average': return 'text-yellow-600 bg-yellow-100'
      case 'needs-improvement': return 'text-red-600 bg-red-100'
      default: return 'text-slate-600 bg-slate-100'
    }
  }

  const getPerformanceIcon = (performance: string) => {
    switch (performance) {
      case 'excellent': return Trophy
      case 'good': return Award
      case 'average': return Target
      case 'needs-improvement': return TrendingUp
      default: return BarChart3
    }
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
    if (diffDays < 7) return `${diffDays} days ago`
    return date.toLocaleDateString()
  }

  const toggleFavorite = (subjectId: string) => {
    setSubjects(prev => prev.map(subject => 
      subject.id === subjectId 
        ? { ...subject, isFavorite: !subject.isFavorite }
        : subject
    ))
  }

  const refreshSubjects = async () => {
    try {
      const response = await fetch('/api/subjects')
      const data = await response.json()
      
      if (data.success) {
        // Transform the data to match our interface
        const transformedSubjects = data.subjects.map((subject: any) => {
          const allAttempts = subject.tests?.flatMap((test: any) => test.attempts || []) || []
          const completedAttempts = allAttempts.filter((attempt: any) => attempt.status === 'completed')
          
          const totalTests = subject.tests?.length || 0
          const totalTimeSpent = completedAttempts.reduce((sum: number, attempt: any) => sum + (attempt.timeSpent || 0), 0)
          const averageScore = completedAttempts.length > 0 
            ? completedAttempts.reduce((sum: number, attempt: any) => sum + (attempt.score || 0), 0) / completedAttempts.length
            : 0
          const bestScore = completedAttempts.length > 0 
            ? Math.max(...completedAttempts.map((attempt: any) => attempt.score || 0))
            : 0

          return {
            id: subject.id,
            name: subject.name,
            code: subject.code,
            level: subject.level,
            description: subject.description,
            totalTests,
            totalTimeSpent,
            averageScore,
            bestScore,
            lastAccessed: subject.updatedAt,
            recentActivity: 0,
            performance: averageScore >= 80 ? 'excellent' as const : 
                        averageScore >= 60 ? 'good' as const : 
                        averageScore >= 40 ? 'average' as const : 'needs-improvement' as const,
            isFavorite: false,
            color: 'bg-blue-500',
            icon: 'BookOpen'
          }
        })
        
        setSubjects(transformedSubjects)
      }
    } catch (error) {
      console.error('Error refreshing subjects:', error)
    }
  }

  if (subjects.length === 0) {
    return (
      <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <BookOpen className="h-10 w-10 text-indigo-500" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 mb-2">No Subjects Added Yet</h3>
          <p className="text-slate-600 mb-6">Add subjects to start tracking your progress and performance</p>
          <button
            onClick={() => setShowAddSubject(true)}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>Add Your First Subject</span>
          </button>
        </div>
        
        <AddSubjectModal
          isOpen={showAddSubject}
          onClose={() => setShowAddSubject(false)}
          onSubjectAdded={refreshSubjects}
        />
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <h3 className="text-lg font-semibold text-slate-900 flex items-center space-x-2">
            <BookOpen className="h-5 w-5 text-slate-600" />
            <span>My Subjects</span>
          </h3>
          <div className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
            {subjects.length}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowAddSubject(true)}
            className="flex items-center space-x-2 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
          >
            <Plus className="h-4 w-4" />
            <span>Add Subject</span>
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search subjects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            />
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
          >
            <option value="recent">Most Recent</option>
            <option value="performance">Best Performance</option>
            <option value="name">Name A-Z</option>
            <option value="tests">Most Tests</option>
          </select>
        </div>

        {/* View Mode */}
        <div className="flex items-center space-x-1 bg-slate-100 rounded-lg p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-md transition-colors ${
              viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-slate-200'
            }`}
          >
            <Grid className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-md transition-colors ${
              viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-slate-200'
            }`}
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Subjects Grid/List */}
      <div className={
        viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
          : 'space-y-3'
      }>
        {filteredSubjects.map((subject) => {
          const PerformanceIcon = getPerformanceIcon(subject.performance)
          
          return (
            <div
              key={subject.id}
              className={`group relative p-5 rounded-2xl border-2 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] ${
                hoveredSubject === subject.id 
                  ? 'border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50 shadow-lg' 
                  : 'border-slate-100 bg-gradient-to-br from-white to-slate-50 hover:border-indigo-200'
              }`}
              onMouseEnter={() => setHoveredSubject(subject.id)}
              onMouseLeave={() => setHoveredSubject(null)}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-3 rounded-xl ${subject.color} text-white shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg group-hover:text-indigo-700 transition-colors">
                      {subject.name}
                    </h4>
                    <p className="text-sm text-slate-600 font-medium">{subject.code} • {subject.level}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => toggleFavorite(subject.id)}
                    className={`p-2 rounded-lg transition-all duration-300 ${
                      subject.isFavorite 
                        ? 'text-yellow-500 hover:text-yellow-600 bg-yellow-50 hover:bg-yellow-100' 
                        : 'text-slate-400 hover:text-yellow-500 hover:bg-yellow-50'
                    }`}
                  >
                    <Star className={`h-4 w-4 ${subject.isFavorite ? 'fill-current' : ''}`} />
                  </button>
                  <button className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all duration-300">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Performance Indicator */}
              <div className="mb-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-slate-700">Overall Performance</span>
                  <div className={`inline-flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs font-bold ${getPerformanceColor(subject.performance)} shadow-sm`}>
                    <PerformanceIcon className="h-3 w-3" />
                    <span className="capitalize">{subject.performance.replace('-', ' ')}</span>
                  </div>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3 shadow-inner">
                  <div 
                    className={`h-3 rounded-full transition-all duration-700 ${
                      subject.averageScore >= 80 ? 'bg-gradient-to-r from-green-400 via-green-500 to-green-600' :
                      subject.averageScore >= 60 ? 'bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600' :
                      'bg-gradient-to-r from-red-400 via-red-500 to-red-600'
                    }`}
                    style={{ width: `${subject.averageScore}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-slate-600 mt-2 font-medium">
                  <span>Avg: {subject.averageScore.toFixed(1)}%</span>
                  <span>Best: {subject.bestScore.toFixed(1)}%</span>
                </div>
              </div>

              {/* Stats Grid */}
              <div className={`grid gap-3 mb-5 ${
                viewMode === 'grid' ? 'grid-cols-2' : 'grid-cols-4'
              }`}>
                <div className="text-center p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
                  <div className="text-xl font-bold text-slate-900">{subject.totalTests}</div>
                  <div className="text-xs text-slate-600 font-medium">Tests</div>
                </div>
                <div className="text-center p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
                  <div className="text-xl font-bold text-slate-900">{formatTime(subject.totalTimeSpent)}</div>
                  <div className="text-xs text-slate-600 font-medium">Time Spent</div>
                </div>
                {viewMode === 'list' && (
                  <>
                    <div className="text-center p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
                      <div className="text-xl font-bold text-slate-900">{subject.recentActivity}</div>
                      <div className="text-xs text-slate-600 font-medium">This Week</div>
                    </div>
                    <div className="text-center p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
                      <div className="text-xl font-bold text-slate-900">{formatDate(subject.lastAccessed)}</div>
                      <div className="text-xs text-slate-600 font-medium">Last Accessed</div>
                    </div>
                  </>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                <div className="flex items-center space-x-3">
                  <Link
                    href={`/subjects/${subject.code}`}
                    className="inline-flex items-center space-x-1 text-sm text-indigo-600 hover:text-indigo-700 font-semibold px-3 py-2 rounded-lg hover:bg-indigo-50 transition-all duration-300"
                  >
                    <Eye className="h-4 w-4" />
                    <span>View</span>
                  </Link>
                  <Link
                    href={`/subjects/${subject.code}/generate-test`}
                    className="inline-flex items-center space-x-1 text-sm text-green-600 hover:text-green-700 font-semibold px-3 py-2 rounded-lg hover:bg-green-50 transition-all duration-300"
                  >
                    <Play className="h-4 w-4" />
                    <span>Practice</span>
                  </Link>
                </div>
                <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-slate-600 transition-all duration-300 group-hover:translate-x-1" />
              </div>

              {/* Hover Effect Indicator */}
              {hoveredSubject === subject.id && (
                <div className="absolute top-3 right-3">
                  <div className="w-3 h-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full animate-pulse shadow-lg" />
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-slate-200">
        <div className="flex items-center justify-between text-sm text-slate-600">
          <span>Showing {filteredSubjects.length} of {subjects.length} subjects</span>
          <Link 
            href="/subjects" 
            className="flex items-center space-x-1 text-indigo-600 hover:text-indigo-700 font-medium"
          >
            <span>Manage All Subjects</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
      
      <AddSubjectModal
        isOpen={showAddSubject}
        onClose={() => setShowAddSubject(false)}
        onSubjectAdded={refreshSubjects}
      />
    </div>
  )
}
