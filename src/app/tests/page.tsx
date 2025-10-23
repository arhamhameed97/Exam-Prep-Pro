import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Calendar, Clock, Award, Play, TestTube, TrendingUp, Filter, Search } from "lucide-react"

async function getUserTests(userId: string) {
  try {
    const tests = await prisma.test.findMany({
      where: { userId },
      include: {
        subject: true,
        attempts: {
          where: { status: 'completed' },
          orderBy: { completedAt: 'desc' },
          take: 1
        },
        _count: {
          select: { questions: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return tests
  } catch (error) {
    console.error('Error fetching user tests:', error)
    return []
  }
}

async function getTestStats(userId: string) {
  try {
    const completedAttempts = await prisma.testAttempt.findMany({
      where: {
        userId,
        status: 'completed'
      }
    })

    const totalTests = await prisma.test.count({
      where: { userId }
    })

    const completedTests = completedAttempts.length
    const averageTime = completedAttempts.length > 0 
      ? completedAttempts.reduce((sum, attempt) => sum + attempt.timeSpent, 0) / completedAttempts.length
      : 0
    
    // Calculate average score across all tests as percentage
    let averageScore = 0
    
    if (completedAttempts.length > 0) {
      const scoresWithPercentages = completedAttempts.map(attempt => {
        const totalMarks = attempt.test.totalMarks || 10
        return (attempt.score / totalMarks) * 100
      })
      averageScore = scoresWithPercentages.reduce((sum, score) => sum + score, 0) / scoresWithPercentages.length
    }

    return {
      totalTests,
      completedTests,
      averageTime: Math.round(averageTime),
      averageScore: Math.round(averageScore)
    }
  } catch (error) {
    console.error('Error fetching test stats:', error)
    return {
      totalTests: 0,
      completedTests: 0,
      averageTime: 0,
      averageScore: 0
    }
  }
}

export default async function TestsPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    redirect('/auth/signin')
  }

  const [tests, stats] = await Promise.all([
    getUserTests(session.user.id),
    getTestStats(session.user.id)
  ])

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Practice Tests</h1>
            <p className="text-slate-600 mt-2">Take practice tests to improve your exam performance</p>
          </div>
          <div className="flex space-x-3">
            <Link 
              href="/subjects" 
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Create New Test
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <TestTube className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Total Tests</p>
                <p className="text-2xl font-bold text-slate-900">{stats.totalTests}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Completed</p>
                <p className="text-2xl font-bold text-slate-900">{stats.completedTests}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Average Time</p>
                <p className="text-2xl font-bold text-slate-900">
                  {stats.averageTime > 0 ? `${stats.averageTime}m` : '-'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Average Score</p>
                <p className="text-2xl font-bold text-slate-900">
                  {stats.averageScore > 0 ? `${stats.averageScore}%` : '-'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        {tests.length > 0 ? (
          <div className="grid gap-6">
            {tests.map((test) => {
              const latestAttempt = test.attempts[0]
              const isCompleted = latestAttempt && latestAttempt.status === 'completed'
              
              return (
                <div key={test.id} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-slate-900">{test.title}</h3>
                        {test.isAIGenerated && (
                          <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                            AI Generated
                          </span>
                        )}
                      </div>
                      <p className="text-slate-600 mb-3">{test.description}</p>
                      
                      <div className="flex items-center gap-6 text-sm text-slate-500 mb-4">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(test.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{test.duration} minutes</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span>{test._count.questions} questions</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="capitalize">{test.difficulty}</span>
                        </div>
                      </div>

                      {isCompleted && latestAttempt && (
                        <div className="flex items-center gap-4 mb-4">
                          <div className="flex items-center gap-1">
                            <Award className="h-4 w-4 text-green-600" />
                            <span className="text-sm text-slate-600">
                              Score: <span className="font-medium text-green-600">{Math.round((latestAttempt.score / test.totalMarks) * 100)}%</span>
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-sm text-slate-600">
                              Grade: <span className="font-medium">{latestAttempt.grade}</span>
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4 text-slate-400" />
                            <span className="text-sm text-slate-600">
                              {latestAttempt.timeSpent} minutes
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      {isCompleted ? (
                        <Link
                          href={`/tests/${test.id}?viewResults=${latestAttempt.id}`}
                          className="bg-slate-100 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-200 transition-colors"
                        >
                          View Results
                        </Link>
                      ) : (
                        <Link
                          href={`/tests/${test.id}`}
                          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
                        >
                          <Play className="h-4 w-4" />
                          Take Test
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200">
            <div className="text-center py-12">
              <TestTube className="h-16 w-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">No Tests Available Yet</h3>
              <p className="text-slate-600 mb-6">
                Create your first test to get started with practice exams.
              </p>
              <Link 
                href="/subjects" 
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Create Test
              </Link>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}