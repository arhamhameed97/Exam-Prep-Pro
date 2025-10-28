"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { 
  BookOpen,
  Calculator,
  Atom,
  FlaskConical,
  Dna,
  Globe,
  Map,
  History,
  Users,
  FileText,
  Palette,
  Music,
  Camera,
  Building,
  TrendingUp,
  Brain,
  TestTube, 
  Archive, 
  Clock, 
  Play,
  Download,
  Utensils,
  Wrench,
  Plane,
  Scale,
  GraduationCap,
  Mic,
  Video,
  Laptop
} from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useState, useEffect, useCallback } from "react"
import { Eye, Calendar, Trophy, CheckCircle } from "lucide-react"
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

// Subject data mapping
const subjectData: Record<string, { name: string; code: string; level: string; description: string; icon: React.ComponentType<{ className?: string }>; color: string }> = {
  // O-Level subjects - Core Subjects
  "4024": { name: "Mathematics", code: "4024", level: "O-Level", description: "Core Mathematics covering algebra, geometry, and statistics", icon: Calculator, color: "bg-blue-500" },
  "4037": { name: "Additional Mathematics", code: "4037", level: "O-Level", description: "Advanced mathematical concepts and problem-solving", icon: Calculator, color: "bg-blue-600" },
  "1123": { name: "English Language", code: "1123", level: "O-Level", description: "English language skills and comprehension", icon: BookOpen, color: "bg-red-500" },
  "2010": { name: "English Literature", code: "2010", level: "O-Level", description: "Literary analysis and critical thinking", icon: FileText, color: "bg-red-600" },
  "3248": { name: "Urdu", code: "3248", level: "O-Level", description: "Urdu language and literature", icon: BookOpen, color: "bg-orange-500" },
  "2059": { name: "Pakistan Studies", code: "2059", level: "O-Level", description: "History and geography of Pakistan", icon: Globe, color: "bg-green-600" },
  "2058": { name: "Islamiyat", code: "2058", level: "O-Level", description: "Islamic studies and religious education", icon: Globe, color: "bg-green-700" },
  
  // O-Level subjects - Sciences
  "5054": { name: "Physics", code: "5054", level: "O-Level", description: "Fundamental physics principles and applications", icon: Atom, color: "bg-purple-500" },
  "5070": { name: "Chemistry", code: "5070", level: "O-Level", description: "Chemical reactions, atomic structure, and laboratory work", icon: FlaskConical, color: "bg-green-500" },
  "5090": { name: "Biology", code: "5090", level: "O-Level", description: "Living organisms, cells, and biological processes", icon: Dna, color: "bg-emerald-500" },
  "2210": { name: "Computer Science", code: "2210", level: "O-Level", description: "Programming and computer fundamentals", icon: Brain, color: "bg-cyan-500" },
  "5014": { name: "Environmental Management", code: "5014", level: "O-Level", description: "Environmental science and sustainability", icon: Globe, color: "bg-teal-600" },
  
  // O-Level subjects - Humanities & Social Sciences
  "2217": { name: "Geography", code: "2217", level: "O-Level", description: "Physical and human geography", icon: Map, color: "bg-teal-500" },
  "2147": { name: "History", code: "2147", level: "O-Level", description: "World history and historical analysis", icon: History, color: "bg-amber-500" },
  "2281": { name: "Economics", code: "2281", level: "O-Level", description: "Economic principles and market systems", icon: TrendingUp, color: "bg-indigo-500" },
  "7707": { name: "Accounting", code: "7707", level: "O-Level", description: "Financial accounting and bookkeeping", icon: TrendingUp, color: "bg-gray-500" },
  "7115": { name: "Business Studies", code: "7115", level: "O-Level", description: "Business management and entrepreneurship", icon: Building, color: "bg-slate-500" },
  "2251": { name: "Sociology", code: "2251", level: "O-Level", description: "Social behavior and societal structures", icon: Users, color: "bg-orange-600" },
  
  // O-Level subjects - Languages
  "3015": { name: "French", code: "3015", level: "O-Level", description: "French language and culture", icon: BookOpen, color: "bg-blue-700" },
  "3016": { name: "German", code: "3016", level: "O-Level", description: "German language and culture", icon: BookOpen, color: "bg-yellow-600" },
  "3017": { name: "Spanish", code: "3017", level: "O-Level", description: "Spanish language and culture", icon: BookOpen, color: "bg-red-700" },
  "3180": { name: "Arabic", code: "3180", level: "O-Level", description: "Arabic language and literature", icon: BookOpen, color: "bg-green-800" },
  "3205": { name: "Chinese", code: "3205", level: "O-Level", description: "Chinese language and culture", icon: BookOpen, color: "bg-red-800" },
  
  // O-Level subjects - Arts & Creative Subjects
  "6090": { name: "Art & Design", code: "6090", level: "O-Level", description: "Creative arts and design principles", icon: Palette, color: "bg-pink-500" },
  "6100": { name: "Music", code: "6100", level: "O-Level", description: "Musical theory and performance", icon: Music, color: "bg-violet-500" },
  "6421": { name: "Drama", code: "6421", level: "O-Level", description: "Theatre arts and dramatic performance", icon: Users, color: "bg-purple-600" },
  
  // O-Level subjects - Applied Subjects
  "6065": { name: "Food & Nutrition", code: "6065", level: "O-Level", description: "Nutritional science and food preparation", icon: Utensils, color: "bg-orange-600" },
  "6043": { name: "Design & Technology", code: "6043", level: "O-Level", description: "Engineering design and technology", icon: Wrench, color: "bg-gray-600" },
  "5016": { name: "Physical Education", code: "5016", level: "O-Level", description: "Sports science and physical fitness", icon: Users, color: "bg-lime-500" },
  "7096": { name: "Travel & Tourism", code: "7096", level: "O-Level", description: "Tourism industry and travel management", icon: Plane, color: "bg-cyan-600" },
  
  // A-Level subjects - Core Sciences
  "9709": { name: "Mathematics", code: "9709", level: "A-Level", description: "Advanced mathematics including calculus and statistics", icon: Calculator, color: "bg-blue-500" },
  "9231": { name: "Further Mathematics", code: "9231", level: "A-Level", description: "Advanced mathematical concepts and applications", icon: Calculator, color: "bg-blue-600" },
  "9702": { name: "Physics", code: "9702", level: "A-Level", description: "Advanced physics including quantum mechanics", icon: Atom, color: "bg-purple-500" },
  "9701": { name: "Chemistry", code: "9701", level: "A-Level", description: "Advanced chemistry including organic chemistry", icon: FlaskConical, color: "bg-green-500" },
  "9700": { name: "Biology", code: "9700", level: "A-Level", description: "Advanced biology including molecular biology", icon: Dna, color: "bg-emerald-500" },
  "9608": { name: "Computer Science", code: "9608", level: "A-Level", description: "Advanced programming and computer systems", icon: Brain, color: "bg-cyan-500" },
  "9693": { name: "Environmental Science", code: "9693", level: "A-Level", description: "Environmental science and sustainability", icon: Globe, color: "bg-teal-600" },
  "9990": { name: "Psychology", code: "9990", level: "A-Level", description: "Human behavior and mental processes", icon: Brain, color: "bg-rose-500" },
  
  // A-Level subjects - Humanities & Social Sciences
  "9093": { name: "English Language", code: "9093", level: "A-Level", description: "Advanced English language and linguistics", icon: BookOpen, color: "bg-red-500" },
  "9695": { name: "English Literature", code: "9695", level: "A-Level", description: "Advanced literary analysis and criticism", icon: FileText, color: "bg-red-600" },
  "9488": { name: "Pakistan Studies", code: "9488", level: "A-Level", description: "Advanced study of Pakistan's history and culture", icon: Globe, color: "bg-green-600" },
  "9696": { name: "Geography", code: "9696", level: "A-Level", description: "Advanced geography and environmental studies", icon: Map, color: "bg-teal-500" },
  "9489": { name: "History", code: "9489", level: "A-Level", description: "Advanced historical research and analysis", icon: History, color: "bg-amber-500" },
  "9708": { name: "Economics", code: "9708", level: "A-Level", description: "Advanced economics and economic theory", icon: TrendingUp, color: "bg-indigo-500" },
  "9706": { name: "Accounting", code: "9706", level: "A-Level", description: "Advanced accounting and financial management", icon: TrendingUp, color: "bg-gray-500" },
  "9609": { name: "Business Studies", code: "9609", level: "A-Level", description: "Business management and entrepreneurship", icon: Building, color: "bg-slate-500" },
  "9699": { name: "Sociology", code: "9699", level: "A-Level", description: "Social behavior and societal structures", icon: Users, color: "bg-orange-500" },
  "9084": { name: "Law", code: "9084", level: "A-Level", description: "Legal principles and jurisprudence", icon: Scale, color: "bg-slate-600" },
  "9698": { name: "Political Science", code: "9698", level: "A-Level", description: "Political systems and governance", icon: GraduationCap, color: "bg-blue-700" },
  "9704": { name: "Philosophy", code: "9704", level: "A-Level", description: "Critical thinking and philosophical inquiry", icon: Brain, color: "bg-purple-700" },
  
  // A-Level subjects - Languages
  "9716": { name: "French", code: "9716", level: "A-Level", description: "Advanced French language and culture", icon: BookOpen, color: "bg-blue-700" },
  "9717": { name: "German", code: "9717", level: "A-Level", description: "Advanced German language and culture", icon: BookOpen, color: "bg-yellow-600" },
  "9719": { name: "Spanish", code: "9719", level: "A-Level", description: "Advanced Spanish language and culture", icon: BookOpen, color: "bg-red-700" },
  "9680": { name: "Arabic", code: "9680", level: "A-Level", description: "Advanced Arabic language and literature", icon: BookOpen, color: "bg-green-800" },
  "9715": { name: "Chinese", code: "9715", level: "A-Level", description: "Advanced Chinese language and culture", icon: BookOpen, color: "bg-red-800" },
  "9686": { name: "Urdu", code: "9686", level: "A-Level", description: "Advanced Urdu language and literature", icon: BookOpen, color: "bg-orange-500" },
  
  // A-Level subjects - Arts & Creative Subjects
  "9479": { name: "Art & Design", code: "9479", level: "A-Level", description: "Advanced art theory and creative practice", icon: Palette, color: "bg-pink-500" },
  "9483": { name: "Music", code: "9483", level: "A-Level", description: "Advanced music theory and composition", icon: Music, color: "bg-violet-500" },
  "9482": { name: "Drama and Theatre Studies", code: "9482", level: "A-Level", description: "Advanced theatre arts and dramatic performance", icon: Mic, color: "bg-purple-600" },
  "9486": { name: "Photography", code: "9486", level: "A-Level", description: "Digital and film photography techniques", icon: Camera, color: "bg-stone-500" },
  
  // A-Level subjects - Applied & Professional Subjects
  "9607": { name: "Media Studies", code: "9607", level: "A-Level", description: "Media analysis and production", icon: Video, color: "bg-indigo-600" },
  "9626": { name: "Information Technology", code: "9626", level: "A-Level", description: "IT systems and digital technologies", icon: Laptop, color: "bg-cyan-600" },
  "9705": { name: "Design and Technology", code: "9705", level: "A-Level", description: "Engineering design and innovation", icon: Wrench, color: "bg-gray-600" },
  "9396": { name: "Physical Education", code: "9396", level: "A-Level", description: "Sports science and physical fitness", icon: Users, color: "bg-lime-500" },
  "9395": { name: "Travel and Tourism", code: "9395", level: "A-Level", description: "Tourism industry and travel management", icon: Plane, color: "bg-cyan-600" },
}

interface TestAttempt {
  id: string
  score: number
  grade: string
  timeSpent: number
  completedAt: string
  test: {
    id: string
    title: string
    duration: number
    totalMarks: number
  }
}

export default function SubjectPage() {
  const params = useParams()
  const router = useRouter()
  const code = params.code as string
  const subject = subjectData[code]
  const [activeTab, setActiveTab] = useState('overview')
  const [testAttempts, setTestAttempts] = useState<TestAttempt[]>([])
  const [loading, setLoading] = useState(false)
  const [analytics, setAnalytics] = useState<any>(null)

  const groupTestsByMonth = useCallback((attempts: TestAttempt[]) => {
    const grouped = attempts.reduce((acc, attempt) => {
      const date = new Date(attempt.completedAt)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      if (!acc[monthKey]) {
        acc[monthKey] = []
      }
      acc[monthKey].push(attempt)
      return acc
    }, {} as Record<string, TestAttempt[]>)

    return Object.entries(grouped).map(([month, tests]) => ({
      month,
      count: tests.length,
      avgScore: Math.round((tests.reduce((sum, t) => sum + t.score, 0) / tests.reduce((sum, t) => sum + t.test.totalMarks, 0)) * 100)
    })).sort((a, b) => a.month.localeCompare(b.month))
  }, [])

  const calculateAnalytics = useCallback((attempts: TestAttempt[]) => {
    if (!attempts || attempts.length === 0) {
      setAnalytics(null)
      return
    }

    const totalTests = attempts.length
    const totalScore = attempts.reduce((sum, attempt) => sum + attempt.score, 0)
    const totalMarks = attempts.reduce((sum, attempt) => sum + attempt.test.totalMarks, 0)
    const averageScore = (totalScore / totalMarks) * 100

    // Calculate grade distribution for chart
    const gradeCounts = attempts.reduce((acc, attempt) => {
      acc[attempt.grade] = (acc[attempt.grade] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Convert to chart format
    const gradeChartData = Object.entries(gradeCounts).map(([grade, count]) => ({
      name: grade,
      value: count,
      color: getGradeColor(grade)
    })).sort((a, b) => {
      const order = ['A+', 'A', 'B', 'C', 'D', 'F']
      return order.indexOf(a.name) - order.indexOf(b.name)
    })

    // Calculate performance over time (for line chart)
    const performanceOverTime = attempts.map((attempt, index) => ({
      test: `Test ${totalTests - index}`,
      score: Math.round((attempt.score / attempt.test.totalMarks) * 100),
      date: new Date(attempt.completedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    })).reverse()

    // Calculate trend (comparing last 5 tests with previous 5)
    const recentTests = attempts.slice(0, 5)
    const previousTests = attempts.slice(5, 10)
    const recentAvg = recentTests.length > 0 
      ? (recentTests.reduce((sum, t) => sum + t.score, 0) / recentTests.reduce((sum, t) => sum + t.test.totalMarks, 0)) * 100
      : 0
    const previousAvg = previousTests.length > 0
      ? (previousTests.reduce((sum, t) => sum + t.score, 0) / previousTests.reduce((sum, t) => sum + t.test.totalMarks, 0)) * 100
      : 0

    const bestTest = attempts.reduce((best, current) => {
      const currentPercentage = (current.score / current.test.totalMarks) * 100
      const bestPercentage = (best.score / best.test.totalMarks) * 100
      return currentPercentage > bestPercentage ? current : best
    })

    // Calculate average time per test
    const avgTimePerTest = Math.round(attempts.reduce((sum, a) => sum + a.timeSpent, 0) / totalTests)

    setAnalytics({
      totalTests,
      averageScore: Math.round(averageScore),
      gradeDistribution: gradeCounts,
      gradeChartData,
      performanceOverTime,
      trend: recentAvg - previousAvg,
      bestTest,
      totalTimeSpent: attempts.reduce((sum, a) => sum + a.timeSpent, 0),
      avgTimePerTest,
      testsByMonth: groupTestsByMonth(attempts)
    })
  }, [groupTestsByMonth])

  const getGradeColor = (grade: string) => {
    const colors: Record<string, string> = {
      'A+': '#10b981',
      'A': '#22c55e',
      'B': '#3b82f6',
      'C': '#f59e0b',
      'D': '#ef4444',
      'F': '#dc2626'
    }
    return colors[grade] || '#94a3b8'
  }

  // Fetch test attempts for this subject
  useEffect(() => {
    const fetchTestAttempts = async () => {
      if (activeTab === 'tests' || activeTab === 'overview' || activeTab === 'analytics') {
        setLoading(true)
        try {
          const response = await fetch(`/api/tests/attempts?subjectCode=${code}`)
          if (response.ok) {
            const data = await response.json()
            setTestAttempts(data.attempts || [])
            
            // Calculate analytics if we have attempts
            if (data.attempts && data.attempts.length > 0 && activeTab === 'analytics') {
              calculateAnalytics(data.attempts)
            }
          }
        } catch (error) {
          console.error('Error fetching test attempts:', error)
        } finally {
          setLoading(false)
        }
      }
    }

    fetchTestAttempts()
  }, [activeTab, code, calculateAnalytics])

  const handleViewResults = (attempt: { test: { id: string }; id: string }) => {
    router.push(`/tests/${attempt.test.id}?viewResults=${attempt.id}`)
  }

  if (!subject) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Subject Not Found</h2>
            <p className="text-slate-600">The requested subject could not be found.</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  const IconComponent = subject.icon

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Subject Header */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className={`p-4 rounded-xl ${subject.color}`}>
                <IconComponent className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">{subject.name}</h1>
                <div className="flex items-center space-x-4 mt-2">
                  <span className="text-lg text-slate-600">{subject.code}</span>
                  <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium">
                    {subject.level}
                  </span>
                </div>
                <p className="text-slate-600 mt-2">{subject.description}</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button 
                onClick={() => router.push(`/subjects/${code}/generate-test`)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Play className="h-4 w-4 inline mr-2" />
                Generate AI Test
              </button>
              <button className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">
                <Download className="h-4 w-4 inline mr-2" />
                Resources
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="border-b border-slate-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', name: 'Overview', icon: BookOpen },
                { id: 'tests', name: 'Tests', icon: TestTube },
                { id: 'past-papers', name: 'Past Papers', icon: Archive },
                { id: 'analytics', name: 'Analytics', icon: TrendingUp },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-slate-50 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-slate-900">Available Tests</h3>
                      <TestTube className="h-5 w-5 text-slate-400" />
                    </div>
                    <p className="text-3xl font-bold text-slate-900">12</p>
                    <p className="text-sm text-slate-600 mt-1">Practice tests available</p>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-slate-900">Past Papers</h3>
                      <Archive className="h-5 w-5 text-slate-400" />
                    </div>
                    <p className="text-3xl font-bold text-slate-900">45</p>
                    <p className="text-sm text-slate-600 mt-1">Years of past papers</p>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-slate-900">Your Progress</h3>
                      <TrendingUp className="h-5 w-5 text-slate-400" />
                    </div>
                    <p className="text-3xl font-bold text-slate-900">{testAttempts.length}</p>
                    <p className="text-sm text-slate-600 mt-1">Tests completed</p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Brain className="h-6 w-6 text-indigo-600" />
                    <h3 className="text-lg font-semibold text-slate-900">AI Study Assistant</h3>
                  </div>
                  <p className="text-slate-700 mb-4">
                    Get personalized study recommendations and practice questions tailored to your learning style.
                  </p>
                  <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                    Start AI Study Session
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'tests' && (
              <div className="space-y-6">
                {/* Generate New Test Section */}
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <Brain className="h-6 w-6 text-indigo-600" />
                      <h3 className="text-lg font-semibold text-slate-900">Generate New Test</h3>
                    </div>
                    <button 
                      onClick={() => router.push(`/subjects/${code}/generate-test`)}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
                    >
                      <Brain className="h-4 w-4" />
                      <span>Generate AI Test</span>
                    </button>
                  </div>
                  <p className="text-slate-700 mb-4">
                    Create a custom practice test tailored to your needs using AI. Our AI will generate high-quality questions based on your selected topics, difficulty level, and curriculum requirements.
                  </p>
                </div>

                {/* Past Test Attempts */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-slate-900">Your Test History</h3>
                    <span className="text-sm text-slate-600">{testAttempts.length} tests completed</span>
                  </div>

                  {loading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-500 border-t-transparent mx-auto mb-4"></div>
                      <p className="text-slate-600">Loading your test history...</p>
                    </div>
                  ) : testAttempts.length === 0 ? (
                    <div className="text-center py-8 bg-slate-50 rounded-lg">
                      <TestTube className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                      <h4 className="text-lg font-semibold text-slate-900 mb-2">No Tests Yet</h4>
                      <p className="text-slate-600 mb-4">You haven&apos;t taken any tests for this subject yet.</p>
                      <button 
                        onClick={() => router.push(`/subjects/${code}/generate-test`)}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                      >
                        Generate Your First Test
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {testAttempts.map((attempt) => (
                        <div key={attempt.id} className="bg-white border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h4 className="font-semibold text-slate-900 text-sm mb-1">
                                {attempt.test.title.length > 30 ? `${attempt.test.title.substring(0, 30)}...` : attempt.test.title}
                              </h4>
                              <div className="flex items-center space-x-4 text-xs text-slate-600">
                                <div className="flex items-center space-x-1">
                                  <Calendar className="h-3 w-3" />
                                  <span>{new Date(attempt.completedAt).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Clock className="h-3 w-3" />
                                  <span>{attempt.timeSpent} min</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Trophy className="h-4 w-4 text-yellow-500" />
                              <span className="text-sm font-semibold text-slate-900">{Math.round((attempt.score / attempt.test.totalMarks) * 100)}%</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <span className="text-sm font-medium text-slate-700">{attempt.grade}</span>
                            </div>
                            <button
                              onClick={() => handleViewResults(attempt)}
                              className="px-3 py-1.5 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded text-xs font-medium transition-colors flex items-center space-x-1"
                            >
                              <Eye className="h-3 w-3" />
                              <span>View Results</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'past-papers' && (
              <div className="text-center py-12">
                <Archive className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Past Papers Coming Soon</h3>
                <p className="text-slate-600">Access to past papers will be available in the next update.</p>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="space-y-6">
                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-500 border-t-transparent mx-auto mb-4"></div>
                    <p className="text-slate-600">Loading analytics...</p>
                  </div>
                ) : !analytics || analytics.totalTests === 0 ? (
                  <div className="text-center py-12">
                    <TrendingUp className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">Analytics Dashboard</h3>
                    <p className="text-slate-600">Your performance analytics will appear here once you start taking tests.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Overview Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium text-slate-700">Total Tests</h3>
                          <TestTube className="h-5 w-5 text-blue-600" />
                        </div>
                        <p className="text-3xl font-bold text-blue-900">{analytics.totalTests}</p>
                        <p className="text-sm text-slate-600 mt-1">completed</p>
                      </div>

                      <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium text-slate-700">Average Score</h3>
                          <Trophy className="h-5 w-5 text-green-600" />
                        </div>
                        <p className="text-3xl font-bold text-green-900">{analytics.averageScore}%</p>
                        <p className="text-sm text-slate-600 mt-1">overall performance</p>
                      </div>

                      <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium text-slate-700">Best Score</h3>
                          <Trophy className="h-5 w-5 text-purple-600" />
                        </div>
                        <p className="text-3xl font-bold text-purple-900">
                          {Math.round((analytics.bestTest.score / analytics.bestTest.test.totalMarks) * 100)}%
                        </p>
                        <p className="text-sm text-slate-600 mt-1">highest achieved</p>
                      </div>

                      <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6 border border-orange-200">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium text-slate-700">Avg Time</h3>
                          <Clock className="h-5 w-5 text-orange-600" />
                        </div>
                        <p className="text-3xl font-bold text-orange-900">{analytics.avgTimePerTest}</p>
                        <p className="text-sm text-slate-600 mt-1">minutes per test</p>
                      </div>
                    </div>

                    {/* Performance Trend Chart */}
                    <div className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-slate-900">Performance Trend</h3>
                        <div className="flex items-center space-x-2 text-sm text-slate-600">
                          <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                          <span>Score over time</span>
                        </div>
                      </div>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={analytics.performanceOverTime}>
                          <defs>
                            <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                          <XAxis 
                            dataKey="date" 
                            stroke="#64748b"
                            style={{ fontSize: '12px' }}
                          />
                          <YAxis 
                            stroke="#64748b"
                            style={{ fontSize: '12px' }}
                            domain={[0, 100]}
                            tickFormatter={(value) => `${value}%`}
                          />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'white', 
                              border: '1px solid #e5e7eb',
                              borderRadius: '8px',
                              padding: '8px',
                              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                            }}
                            formatter={(value: number) => [`${value}%`, 'Score']}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="score" 
                            stroke="#6366f1" 
                            strokeWidth={3}
                            dot={{ fill: '#6366f1', r: 5, strokeWidth: 2, stroke: '#fff' }}
                            activeDot={{ r: 8, strokeWidth: 2 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Grade Distribution Pie Chart */}
                      <div className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm">
                        <h3 className="text-lg font-semibold text-slate-900 mb-4">Grade Distribution</h3>
                        <ResponsiveContainer width="100%" height={300}>
                          <PieChart>
                            <Pie
                              data={analytics.gradeChartData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                              outerRadius={90}
                              fill="#8884d8"
                              dataKey="value"
                              stroke="white"
                              strokeWidth={2}
                            >
                              {analytics.gradeChartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: 'white', 
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px',
                                padding: '8px',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                              }}
                            />
                            <Legend 
                              verticalAlign="bottom" 
                              height={36}
                              iconType="circle"
                              formatter={(value: string) => value}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>

                      {/* Monthly Performance Bar Chart */}
                      <div className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-slate-900">Monthly Performance</h3>
                          <div className="flex items-center space-x-2 text-sm text-slate-600">
                            <div className="w-3 h-3 rounded bg-indigo-500"></div>
                            <span>Average score</span>
                          </div>
                        </div>
                        {analytics.testsByMonth.length > 0 ? (
                          <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={analytics.testsByMonth}>
                              <defs>
                                <linearGradient id="colorAvgScore" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.3}/>
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                              <XAxis 
                                dataKey="month" 
                                stroke="#64748b"
                                style={{ fontSize: '12px' }}
                                tickFormatter={(value) => new Date(value + '-01').toLocaleDateString('en-US', { month: 'short' })}
                              />
                              <YAxis 
                                stroke="#64748b"
                                style={{ fontSize: '12px' }}
                                domain={[0, 100]}
                                tickFormatter={(value) => `${value}%`}
                              />
                              <Tooltip 
                                contentStyle={{ 
                                  backgroundColor: 'white', 
                                  border: '1px solid #e5e7eb',
                                  borderRadius: '8px',
                                  padding: '8px',
                                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                }}
                                formatter={(value: number) => [`${value}%`, 'Average Score']}
                                labelFormatter={(value) => new Date(value + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                              />
                              <Bar 
                                dataKey="avgScore" 
                                fill="url(#colorAvgScore)"
                                radius={[8, 8, 0, 0]}
                              />
                            </BarChart>
                          </ResponsiveContainer>
                        ) : (
                          <div className="flex items-center justify-center h-[300px] text-slate-500">
                            <p>No monthly data available</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Grade Breakdown Cards */}
                    <div className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm">
                      <h3 className="text-lg font-semibold text-slate-900 mb-4">Grade Breakdown</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {Object.entries(analytics.gradeDistribution).map(([grade, count]) => {
                          const gradeColor = getGradeColor(grade)
                          return (
                            <div key={grade} className="relative overflow-hidden text-center p-4 rounded-xl border-2 border-slate-200 hover:border-indigo-300 transition-all group">
                              <div className="absolute top-0 right-0 w-16 h-16 opacity-10" style={{ background: gradeColor, borderRadius: '0 0 0 100%' }}></div>
                              <div className="text-4xl font-bold mb-2" style={{ color: gradeColor }}>{grade}</div>
                              <div className="text-lg font-semibold text-slate-700">{count as number}</div>
                              <div className="text-xs text-slate-500 mt-1">test{(count as number) > 1 ? 's' : ''}</div>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    {/* Performance Trend Indicator */}
                    {analytics.trend !== 0 && (
                      <div className={`rounded-lg p-6 border ${
                        analytics.trend > 0 
                          ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200' 
                          : 'bg-gradient-to-r from-red-50 to-rose-50 border-red-200'
                      }`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className={`p-3 rounded-lg ${
                              analytics.trend > 0 ? 'bg-green-100' : 'bg-red-100'
                            }`}>
                              <TrendingUp className={`h-8 w-8 ${
                                analytics.trend > 0 ? 'text-green-600' : 'text-red-600 transform rotate-180'
                              }`} />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-slate-900 mb-1">
                                Performance Trend
                              </h3>
                              <p className={`text-sm font-medium ${
                                analytics.trend > 0 ? 'text-green-700' : 'text-red-700'
                              }`}>
                                {analytics.trend > 0 ? '↑' : '↓'} {Math.abs(analytics.trend).toFixed(1)}% 
                                {analytics.trend > 0 ? ' improvement' : ' decline'} compared to previous tests
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
