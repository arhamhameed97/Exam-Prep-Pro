"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { BookOpen, Users, Clock, Trophy, TrendingUp, Brain } from "lucide-react"
import { useSession } from "next-auth/react"

export default function Dashboard() {
  const { data: session } = useSession()

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-8 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Welcome back, {session?.user?.name || 'Student'}! 👋
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
                <p className="text-sm font-medium text-slate-600">Subjects</p>
                <p className="text-2xl font-bold text-slate-900">37</p>
                <p className="text-xs text-slate-500">O/A Level courses</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Tests Taken</p>
                <p className="text-2xl font-bold text-slate-900">0</p>
                <p className="text-xs text-slate-500">Practice tests</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Study Time</p>
                <p className="text-2xl font-bold text-slate-900">0h</p>
                <p className="text-xs text-slate-500">Total hours</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Trophy className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Average Score</p>
                <p className="text-2xl font-bold text-slate-900">-</p>
                <p className="text-xs text-slate-500">Overall performance</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                <span className="text-slate-700">Take Practice Test</span>
                <TrendingUp className="h-5 w-5 text-slate-400" />
              </button>
              <button className="w-full flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                <span className="text-slate-700">View Past Papers</span>
                <BookOpen className="h-5 w-5 text-slate-400" />
              </button>
              <button className="w-full flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                <span className="text-slate-700">AI Study Assistant</span>
                <Brain className="h-5 w-5 text-slate-400" />
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Activity</h3>
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-slate-400" />
              </div>
              <p className="text-slate-500">No recent activity</p>
              <p className="text-sm text-slate-400">Start by taking a practice test</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
