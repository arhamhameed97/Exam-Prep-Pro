import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { BookOpen, Users, Clock, Trophy, TrendingUp, Brain, Target, Zap, Award, BarChart3, Star } from "lucide-react"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import RecentActivity from "@/components/dashboard/recent-activity"
import MySubjects from "@/components/dashboard/my-subjects"

async function getDashboardStats(userId: string) {
  try {
    // Get total tests created by user
    const totalTests = await prisma.test.count({
      where: { userId }
    })

    // Get completed test attempts
    const completedAttempts = await prisma.testAttempt.findMany({
      where: {
        userId,
        status: 'completed'
      },
      include: {
        test: true
      }
    })

    // Calculate statistics
    const completedTests = completedAttempts.length
    const averageTime = completedAttempts.length > 0 
      ? completedAttempts.reduce((sum, attempt) => sum + attempt.timeSpent, 0) / completedAttempts.length
      : 0
    
    // Calculate average score across all subjects as percentage
    let averageScore = 0
    let averageGrade = 'N/A'
    
    if (completedAttempts.length > 0) {
      // Calculate scores as percentages
      const scoresWithPercentages = completedAttempts.map(attempt => {
        const totalMarks = attempt.test.totalMarks || 10
        return (attempt.score / totalMarks) * 100
      })
      
      averageScore = scoresWithPercentages.reduce((sum, score) => sum + score, 0) / scoresWithPercentages.length
      
      // Calculate average grade based on average score
      if (averageScore >= 90) averageGrade = 'A+'
      else if (averageScore >= 85) averageGrade = 'A'
      else if (averageScore >= 80) averageGrade = 'A-'
      else if (averageScore >= 75) averageGrade = 'B+'
      else if (averageScore >= 70) averageGrade = 'B'
      else if (averageScore >= 65) averageGrade = 'B-'
      else if (averageScore >= 60) averageGrade = 'C+'
      else if (averageScore >= 55) averageGrade = 'C'
      else if (averageScore >= 50) averageGrade = 'C-'
      else if (averageScore >= 45) averageGrade = 'D+'
      else if (averageScore >= 40) averageGrade = 'D'
      else averageGrade = 'F'
    }

    // Get recent test attempts
    const recentAttempts = await prisma.testAttempt.findMany({
      where: { userId },
      take: 5,
      orderBy: { completedAt: 'desc' },
      include: {
        test: {
          include: {
            subject: true
          }
        }
      }
    })

    // Get subject analytics
    const subjects = await prisma.subject.findMany({
      where: { userId },
      include: {
        tests: {
          include: {
            attempts: {
              where: { userId }
            }
          }
        }
      }
    })

    // Calculate subject statistics
    const subjectStats = subjects.map(subject => {
      const allAttempts = subject.tests.flatMap(test => test.attempts)
      const completedAttempts = allAttempts.filter(attempt => attempt.status === 'completed')
      
      const totalTests = subject.tests.length
      const totalTimeSpent = completedAttempts.reduce((sum, attempt) => sum + attempt.timeSpent, 0)
      
      // Calculate average and best scores as percentages
      let averageScore = 0
      let bestScore = 0
      
      if (completedAttempts.length > 0) {
        // Get the total marks for each test to convert raw scores to percentages
        const scoresWithPercentages = completedAttempts.map(attempt => {
          const test = subject.tests.find(t => t.id === attempt.testId)
          const totalMarks = test?.totalMarks || 10 // Default to 10 if not found
          return (attempt.score / totalMarks) * 100
        })
        
        averageScore = scoresWithPercentages.reduce((sum, score) => sum + score, 0) / scoresWithPercentages.length
        bestScore = Math.max(...scoresWithPercentages)
      }
      
      // Calculate recent activity (last 7 days)
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      const recentActivity = completedAttempts.filter(attempt => 
        new Date(attempt.completedAt) >= weekAgo
      ).length

      // Determine performance level
      let performance: 'excellent' | 'good' | 'average' | 'needs-improvement'
      if (averageScore >= 80) performance = 'excellent'
      else if (averageScore >= 60) performance = 'good'
      else if (averageScore >= 40) performance = 'average'
      else performance = 'needs-improvement'

      // Get last accessed date
      const lastAccessed = completedAttempts.length > 0
        ? completedAttempts.sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())[0].completedAt
        : subject.createdAt

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
        lastAccessed: lastAccessed.toISOString(),
        recentActivity,
        performance,
        isFavorite: false, // This could be stored in a separate table
        color: 'bg-blue-500', // Default color, could be customized
        icon: 'BookOpen' // Store as string instead of component
      }
    })

    return {
      totalTests,
      completedTests,
      averageTime: Math.round(averageTime),
      averageScore: Math.round(averageScore),
      averageGrade,
      recentAttempts,
      subjectStats
    }
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return {
      totalTests: 0,
      completedTests: 0,
      averageTime: 0,
      averageScore: 0,
      averageGrade: 'N/A',
      recentAttempts: [],
      subjectStats: []
    }
  }
}

export default async function Dashboard() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    redirect('/auth/signin')
  }

  const stats = await getDashboardStats(session.user.id)

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Compact Hero Section */}
        <div className="relative overflow-hidden">
          {/* Background with animated gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-2xl"></div>
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent rounded-2xl"></div>
          
          {/* Floating elements */}
          <div className="absolute top-2 right-2 w-12 h-12 bg-white/10 rounded-full blur-lg"></div>
          <div className="absolute bottom-2 left-2 w-8 h-8 bg-white/5 rounded-full blur-md"></div>
          
          <div className="relative p-4 lg:p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* Welcome Content */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                    <Brain className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-white mb-1">
                      Welcome back, {session.user.name || 'Student'}! 👋
                    </h1>
                    <p className="text-white/90 text-sm lg:text-base">
                      Ready to ace your O/A Level exams? Let&apos;s track your progress and achieve excellence.
                    </p>
                  </div>
                </div>
                
                {/* Quick Stats Row */}
                <div className="flex flex-wrap gap-2 mt-3">
                  <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
                    <Trophy className="h-4 w-4 text-yellow-300" />
                    <span className="text-white text-sm font-semibold">Avg: {stats.averageScore}%</span>
                  </div>
                  <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
                    <Award className="h-4 w-4 text-purple-300" />
                    <span className="text-white text-sm font-semibold">Grade: {stats.averageGrade}</span>
                  </div>
                  <div className="flex items-center gap-1 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-1">
                    <Target className="h-3 w-3 text-green-300" />
                    <span className="text-white text-sm font-medium">{stats.completedTests} Completed</span>
                  </div>
                  <div className="flex items-center gap-1 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-1">
                    <Zap className="h-3 w-3 text-blue-300" />
                    <span className="text-white text-sm font-medium">{stats.totalTests} Tests Available</span>
                  </div>
                </div>
              </div>
              
              {/* Visual Element */}
              <div className="hidden lg:block">
                <div className="relative">
                  <div className="w-24 h-24 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/30 shadow-lg">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white mb-1 drop-shadow-lg">{stats.averageScore}%</div>
                      <div className="text-white/90 text-sm font-medium mb-1">Avg Score</div>
                      <div className="text-white text-lg font-bold drop-shadow-md">{stats.averageGrade}</div>
                    </div>
                  </div>
                  {/* Floating icons */}
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce shadow-lg">
                    <Star className="h-3 w-3 text-white" />
                  </div>
                  <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-green-400 rounded-full flex items-center justify-center animate-pulse shadow-lg">
                    <Award className="h-3 w-3 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Compact Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Tests Card */}
          <div className="group bg-white rounded-xl p-4 shadow-sm border border-slate-200 hover:shadow-lg hover:border-indigo-200 transition-all duration-300 hover:-translate-y-0.5">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-md group-hover:shadow-lg transition-all duration-300">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {stats.totalTests}
                </div>
                <div className="text-xs text-slate-500">Available</div>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-600">Total Tests</span>
                <TrendingUp className="h-3 w-3 text-green-500" />
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-1.5 rounded-full transition-all duration-500" style={{ width: '100%' }}></div>
              </div>
            </div>
          </div>

          {/* Completed Tests Card */}
          <div className="group bg-white rounded-xl p-4 shadow-sm border border-slate-200 hover:shadow-lg hover:border-green-200 transition-all duration-300 hover:-translate-y-0.5">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-md group-hover:shadow-lg transition-all duration-300">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-slate-900 group-hover:text-green-600 transition-colors">
                  {stats.completedTests}
                </div>
                <div className="text-xs text-slate-500">Completed</div>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-600">Tests Taken</span>
                <Target className="h-3 w-3 text-green-500" />
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5">
                <div className="bg-gradient-to-r from-green-500 to-green-600 h-1.5 rounded-full transition-all duration-500" 
                     style={{ width: `${stats.totalTests > 0 ? (stats.completedTests / stats.totalTests) * 100 : 0}%` }}></div>
              </div>
            </div>
          </div>

          {/* Average Time Card */}
          <div className="group bg-white rounded-xl p-4 shadow-sm border border-slate-200 hover:shadow-lg hover:border-yellow-200 transition-all duration-300 hover:-translate-y-0.5">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg shadow-md group-hover:shadow-lg transition-all duration-300">
                <Clock className="h-5 w-5 text-white" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-slate-900 group-hover:text-yellow-600 transition-colors">
                  {stats.averageTime > 0 ? `${stats.averageTime}m` : '-'}
                </div>
                <div className="text-xs text-slate-500">Average</div>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-600">Time Per Test</span>
                <BarChart3 className="h-3 w-3 text-yellow-500" />
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5">
                <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 h-1.5 rounded-full transition-all duration-500" 
                     style={{ width: `${Math.min((stats.averageTime / 30) * 100, 100)}%` }}></div>
              </div>
            </div>
          </div>

          {/* Average Score Card */}
          <div className="group bg-white rounded-xl p-4 shadow-sm border border-slate-200 hover:shadow-lg hover:border-purple-200 transition-all duration-300 hover:-translate-y-0.5">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-md group-hover:shadow-lg transition-all duration-300">
                <Trophy className="h-5 w-5 text-white" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
                  {stats.averageScore > 0 ? `${stats.averageScore}%` : '-'}
                </div>
                <div className="text-xs text-slate-500">Avg Score</div>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-600">Grade: {stats.averageGrade}</span>
                <Star className="h-3 w-3 text-purple-500" />
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5">
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 h-1.5 rounded-full transition-all duration-500" 
                     style={{ width: `${stats.averageScore}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* My Subjects and Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 order-2 lg:order-1">
            <MySubjects subjects={stats.subjectStats} />
          </div>
          <div className="lg:col-span-1 order-1 lg:order-2">
            <RecentActivity attempts={stats.recentAttempts} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}