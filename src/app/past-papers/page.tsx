"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Archive, Download, Calendar, Filter, Search } from "lucide-react"

export default function PastPapersPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Past Papers</h1>
            <p className="text-slate-600 mt-2">Access past examination papers to practice with real questions</p>
          </div>
          <div className="flex space-x-3">
            <button className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">
              <Filter className="h-4 w-4 inline mr-2" />
              Filter
            </button>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
              <Search className="h-4 w-4 inline mr-2" />
              Search
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Archive className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Total Papers</p>
                <p className="text-2xl font-bold text-slate-900">0</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <Download className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Downloaded</p>
                <p className="text-2xl font-bold text-slate-900">0</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Calendar className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Latest Year</p>
                <p className="text-2xl font-bold text-slate-900">2024</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Archive className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Subjects</p>
                <p className="text-2xl font-bold text-slate-900">37</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200">
          <div className="text-center py-12">
            <Archive className="h-16 w-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Past Papers Coming Soon</h3>
            <p className="text-slate-600 mb-6">
              We're working on adding past papers for all O/A Level subjects. This feature will be available in the next update.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                Browse Subjects
              </button>
              <button className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">
                Take Practice Tests
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
