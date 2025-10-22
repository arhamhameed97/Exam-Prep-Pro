import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { BookOpen, Users, Clock, Trophy, TrendingUp, Brain } from "lucide-react"
import { getServerSession } from "next-auth"
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
    
    const bestScore = completedAttempts.length > 0
      ? Math.max(...completedAttempts.map(attempt => attempt.score))
      : 0

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
      const averageScore = completedAttempts.length > 0 
        ? completedAttempts.reduce((sum, attempt) => sum + attempt.score, 0) / completedAttempts.length
        : 0
      const bestScore = completedAttempts.length > 0 
        ? Math.max(...completedAttempts.map(attempt => attempt.score))
        : 0
      
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
      bestScore: Math.round((bestScore / (totalTests * 10)) * 100), // Assuming 10 marks per test on average
      recentAttempts,
      subjectStats
    }
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return {
      totalTests: 0,
      completedTests: 0,
      averageTime: 0,
      bestScore: 0,
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
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-8 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Welcome back, {session.user.name || 'Student'}! 👋
              </h1>
              <p className="text-indigo-100 text-lg">
                Ready to ace your O/A Level exams? Let's get started with your studies.
              </p>
            </div>
            <div className="hidden md:block">
              <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center">
                <Brain className="h-12 w-12 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Total Tests</p>
                <p className="text-2xl font-bold text-slate-900">{stats.totalTests}</p>
                <p className="text-xs text-slate-500">Available tests</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Completed</p>
                <p className="text-2xl font-bold text-slate-900">{stats.completedTests}</p>
                <p className="text-xs text-slate-500">Tests taken</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Average Time</p>
                <p className="text-2xl font-bold text-slate-900">
                  {stats.averageTime > 0 ? `${stats.averageTime}m` : '-'}
                </p>
                <p className="text-xs text-slate-500">Per test</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Trophy className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Best Score</p>
                <p className="text-2xl font-bold text-slate-900">
                  {stats.bestScore > 0 ? `${stats.bestScore}%` : '-'}
                </p>
                <p className="text-xs text-slate-500">Highest achieved</p>
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