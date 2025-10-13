"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { 
  BookOpen, 
  TestTube, 
  Archive, 
  Clock, 
  TrendingUp, 
  Award,
  Play,
  Download,
  Brain
} from "lucide-react"
import { useParams } from "next/navigation"
import { useState } from "react"

// Subject data mapping
const subjectData: Record<string, { name: string; code: string; level: string; description: string; icon: any; color: string }> = {
  // O-Level subjects
  "4024": { name: "Mathematics", code: "4024", level: "O-Level", description: "Core Mathematics covering algebra, geometry, and statistics", icon: BookOpen, color: "bg-blue-500" },
  "4037": { name: "Additional Mathematics", code: "4037", level: "O-Level", description: "Advanced mathematical concepts and problem-solving", icon: BookOpen, color: "bg-blue-600" },
  "5054": { name: "Physics", code: "5054", level: "O-Level", description: "Fundamental physics principles and applications", icon: BookOpen, color: "bg-purple-500" },
  "5070": { name: "Chemistry", code: "5070", level: "O-Level", description: "Chemical reactions, atomic structure, and laboratory work", icon: BookOpen, color: "bg-green-500" },
  "5090": { name: "Biology", code: "5090", level: "O-Level", description: "Living organisms, cells, and biological processes", icon: BookOpen, color: "bg-emerald-500" },
  "1123": { name: "English Language", code: "1123", level: "O-Level", description: "English language skills and comprehension", icon: BookOpen, color: "bg-red-500" },
  "2010": { name: "English Literature", code: "2010", level: "O-Level", description: "Literary analysis and critical thinking", icon: BookOpen, color: "bg-red-600" },
  "2059": { name: "Pakistan Studies", code: "2059", level: "O-Level", description: "History and geography of Pakistan", icon: BookOpen, color: "bg-green-600" },
  "2058": { name: "Islamiyat", code: "2058", level: "O-Level", description: "Islamic studies and religious education", icon: BookOpen, color: "bg-green-700" },
  "3248": { name: "Urdu", code: "3248", level: "O-Level", description: "Urdu language and literature", icon: BookOpen, color: "bg-orange-500" },
  "2217": { name: "Geography", code: "2217", level: "O-Level", description: "Physical and human geography", icon: BookOpen, color: "bg-teal-500" },
  "2147": { name: "History", code: "2147", level: "O-Level", description: "World history and historical analysis", icon: BookOpen, color: "bg-amber-500" },
  "2281": { name: "Economics", code: "2281", level: "O-Level", description: "Economic principles and market systems", icon: BookOpen, color: "bg-indigo-500" },
  "7707": { name: "Accounting", code: "7707", level: "O-Level", description: "Financial accounting and bookkeeping", icon: BookOpen, color: "bg-gray-500" },
  "2210": { name: "Computer Science", code: "2210", level: "O-Level", description: "Programming and computer fundamentals", icon: BookOpen, color: "bg-cyan-500" },
  "6090": { name: "Art & Design", code: "6090", level: "O-Level", description: "Creative arts and design principles", icon: BookOpen, color: "bg-pink-500" },
  "6100": { name: "Music", code: "6100", level: "O-Level", description: "Musical theory and performance", icon: BookOpen, color: "bg-violet-500" },
  "5016": { name: "Physical Education", code: "5016", level: "O-Level", description: "Sports science and physical fitness", icon: BookOpen, color: "bg-lime-500" },
  
  // A-Level subjects
  "9709": { name: "Mathematics", code: "9709", level: "A-Level", description: "Advanced mathematics including calculus and statistics", icon: BookOpen, color: "bg-blue-500" },
  "9231": { name: "Further Mathematics", code: "9231", level: "A-Level", description: "Advanced mathematical concepts and applications", icon: BookOpen, color: "bg-blue-600" },
  "9702": { name: "Physics", code: "9702", level: "A-Level", description: "Advanced physics including quantum mechanics", icon: BookOpen, color: "bg-purple-500" },
  "9701": { name: "Chemistry", code: "9701", level: "A-Level", description: "Advanced chemistry including organic chemistry", icon: BookOpen, color: "bg-green-500" },
  "9700": { name: "Biology", code: "9700", level: "A-Level", description: "Advanced biology including molecular biology", icon: BookOpen, color: "bg-emerald-500" },
  "9093": { name: "English Language", code: "9093", level: "A-Level", description: "Advanced English language and linguistics", icon: BookOpen, color: "bg-red-500" },
  "9695": { name: "English Literature", code: "9695", level: "A-Level", description: "Advanced literary analysis and criticism", icon: BookOpen, color: "bg-red-600" },
  "9488": { name: "Pakistan Studies", code: "9488", level: "A-Level", description: "Advanced study of Pakistan's history and culture", icon: BookOpen, color: "bg-green-600" },
  "9696": { name: "Geography", code: "9696", level: "A-Level", description: "Advanced geography and environmental studies", icon: BookOpen, color: "bg-teal-500" },
  "9489": { name: "History", code: "9489", level: "A-Level", description: "Advanced historical research and analysis", icon: BookOpen, color: "bg-amber-500" },
  "9708": { name: "Economics", code: "9708", level: "A-Level", description: "Advanced economics and economic theory", icon: BookOpen, color: "bg-indigo-500" },
  "9706": { name: "Accounting", code: "9706", level: "A-Level", description: "Advanced accounting and financial management", icon: BookOpen, color: "bg-gray-500" },
  "9609": { name: "Business Studies", code: "9609", level: "A-Level", description: "Business management and entrepreneurship", icon: BookOpen, color: "bg-slate-500" },
  "9608": { name: "Computer Science", code: "9608", level: "A-Level", description: "Advanced programming and computer systems", icon: BookOpen, color: "bg-cyan-500" },
  "9990": { name: "Psychology", code: "9990", level: "A-Level", description: "Human behavior and mental processes", icon: BookOpen, color: "bg-rose-500" },
  "9699": { name: "Sociology", code: "9699", level: "A-Level", description: "Social behavior and societal structures", icon: BookOpen, color: "bg-orange-500" },
  "9479": { name: "Art & Design", code: "9479", level: "A-Level", description: "Advanced art theory and creative practice", icon: BookOpen, color: "bg-pink-500" },
  "9483": { name: "Music", code: "9483", level: "A-Level", description: "Advanced music theory and composition", icon: BookOpen, color: "bg-violet-500" },
  "9486": { name: "Photography", code: "9486", level: "A-Level", description: "Digital and film photography techniques", icon: BookOpen, color: "bg-stone-500" },
}

export default function SubjectPage() {
  const params = useParams()
  const code = params.code as string
  const subject = subjectData[code]
  const [activeTab, setActiveTab] = useState('overview')

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
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                <Play className="h-4 w-4 inline mr-2" />
                Start Test
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
                    <p className="text-3xl font-bold text-slate-900">0%</p>
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
              <div className="text-center py-12">
                <TestTube className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No Tests Available Yet</h3>
                <p className="text-slate-600">Practice tests for this subject will be available soon.</p>
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
              <div className="text-center py-12">
                <TrendingUp className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Analytics Dashboard</h3>
                <p className="text-slate-600">Your performance analytics will appear here once you start taking tests.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
