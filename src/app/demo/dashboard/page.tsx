"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { BookOpen, Users, Clock, Trophy, Brain, Award, Info } from "lucide-react"
import Link from "next/link"

export default function DemoDashboard() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Demo Mode Banner */}
        <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white p-4 rounded-lg shadow-lg">
          <div className="flex items-center gap-3">
            <Info className="h-6 w-6 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-lg">Demo Mode Active</h3>
              <p className="text-sm opacity-90">
                You&apos;re exploring the app without an account. Sign up to save your progress and unlock all features!
              </p>
            </div>
            <Link
              href="/auth/signup"
              className="ml-auto bg-white text-indigo-600 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors whitespace-nowrap"
            >
              Sign Up
            </Link>
          </div>
        </div>

        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Exam Prep Pro!</h1>
          <p className="text-gray-600">Let&apos;s start your learning journey</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Subjects</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">5</p>
              </div>
              <div className="bg-indigo-100 p-3 rounded-full">
                <BookOpen className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Demo subjects available</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tests Taken</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">12</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <Users className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Practice tests completed</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg. Score</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">85%</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <Trophy className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <p className="text-xs text-green-600 mt-2">Grade: A</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Study Time</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">24h</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Total this month</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              href="/subjects"
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow group"
            >
              <div className="flex items-center space-x-3">
                <div className="bg-indigo-100 p-3 rounded-full group-hover:bg-indigo-200 transition-colors">
                  <BookOpen className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Browse Subjects</h3>
                  <p className="text-sm text-gray-600">Explore available subjects</p>
                </div>
              </div>
            </Link>

            <Link
              href="/tests"
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow group"
            >
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 p-3 rounded-full group-hover:bg-green-200 transition-colors">
                  <Brain className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Take a Test</h3>
                  <p className="text-sm text-gray-600">Start practicing now</p>
                </div>
              </div>
            </Link>

            <Link
              href="/past-papers"
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow group"
            >
              <div className="flex items-center space-x-3">
                <div className="bg-purple-100 p-3 rounded-full group-hover:bg-purple-200 transition-colors">
                  <Award className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Past Papers</h3>
                  <p className="text-sm text-gray-600">Review previous exams</p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Demo Subjects */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Demo Subjects</h2>
            <Link href="/subjects" className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {demoSubjects.map((subject, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="bg-indigo-100 p-2 rounded-lg">
                    <BookOpen className="h-5 w-5 text-indigo-600" />
                  </div>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {subject.level}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{subject.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{subject.code}</p>
                <Link
                  href={`/subjects/${subject.code}`}
                  className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  Generate Test →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

const demoSubjects = [
  { name: "Mathematics", code: "4024", level: "O-Level" },
  { name: "Physics", code: "5054", level: "O-Level" },
  { name: "Chemistry", code: "5070", level: "O-Level" },
  { name: "Biology", code: "5090", level: "O-Level" },
  { name: "English Language", code: "1123", level: "O-Level" },
  { name: "Computer Science", code: "2210", level: "O-Level" },
]

