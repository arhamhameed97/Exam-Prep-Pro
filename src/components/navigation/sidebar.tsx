"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
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
  Settings,
  User,
  BarChart3,
  LogOut
} from "lucide-react"
import { useState } from "react"

// O/A Level subjects with their codes and icons
const subjects = {
  "O-Level": [
    { name: "Mathematics", code: "4024", icon: Calculator, color: "bg-blue-500" },
    { name: "Additional Mathematics", code: "4037", icon: Calculator, color: "bg-blue-600" },
    { name: "Physics", code: "5054", icon: Atom, color: "bg-purple-500" },
    { name: "Chemistry", code: "5070", icon: FlaskConical, color: "bg-green-500" },
    { name: "Biology", code: "5090", icon: Dna, color: "bg-emerald-500" },
    { name: "English Language", code: "1123", icon: BookOpen, color: "bg-red-500" },
    { name: "English Literature", code: "2010", icon: FileText, color: "bg-red-600" },
    { name: "Pakistan Studies", code: "2059", icon: Globe, color: "bg-green-600" },
    { name: "Islamiyat", code: "2058", icon: Globe, color: "bg-green-700" },
    { name: "Urdu", code: "3248", icon: BookOpen, color: "bg-orange-500" },
    { name: "Geography", code: "2217", icon: Map, color: "bg-teal-500" },
    { name: "History", code: "2147", icon: History, color: "bg-amber-500" },
    { name: "Economics", code: "2281", icon: TrendingUp, color: "bg-indigo-500" },
    { name: "Accounting", code: "7707", icon: BarChart3, color: "bg-gray-500" },
    { name: "Computer Science", code: "2210", icon: Brain, color: "bg-cyan-500" },
    { name: "Art & Design", code: "6090", icon: Palette, color: "bg-pink-500" },
    { name: "Music", code: "6100", icon: Music, color: "bg-violet-500" },
    { name: "Physical Education", code: "5016", icon: Users, color: "bg-lime-500" },
  ],
  "A-Level": [
    { name: "Mathematics", code: "9709", icon: Calculator, color: "bg-blue-500" },
    { name: "Further Mathematics", code: "9231", icon: Calculator, color: "bg-blue-600" },
    { name: "Physics", code: "9702", icon: Atom, color: "bg-purple-500" },
    { name: "Chemistry", code: "9701", icon: FlaskConical, color: "bg-green-500" },
    { name: "Biology", code: "9700", icon: Dna, color: "bg-emerald-500" },
    { name: "English Language", code: "9093", icon: BookOpen, color: "bg-red-500" },
    { name: "English Literature", code: "9695", icon: FileText, color: "bg-red-600" },
    { name: "Pakistan Studies", code: "9488", icon: Globe, color: "bg-green-600" },
    { name: "Geography", code: "9696", icon: Map, color: "bg-teal-500" },
    { name: "History", code: "9489", icon: History, color: "bg-amber-500" },
    { name: "Economics", code: "9708", icon: TrendingUp, color: "bg-indigo-500" },
    { name: "Accounting", code: "9706", icon: BarChart3, color: "bg-gray-500" },
    { name: "Business Studies", code: "9609", icon: Building, color: "bg-slate-500" },
    { name: "Computer Science", code: "9608", icon: Brain, color: "bg-cyan-500" },
    { name: "Psychology", code: "9990", icon: Brain, color: "bg-rose-500" },
    { name: "Sociology", code: "9699", icon: Users, color: "bg-orange-500" },
    { name: "Art & Design", code: "9479", icon: Palette, color: "bg-pink-500" },
    { name: "Music", code: "9483", icon: Music, color: "bg-violet-500" },
    { name: "Photography", code: "9486", icon: Camera, color: "bg-stone-500" },
  ]
}

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: BarChart3, active: true },
  { name: "Tests", href: "/tests", icon: TestTube, active: false },
  { name: "Past Papers", href: "/past-papers", icon: Archive, active: false },
]

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const [expandedLevel, setExpandedLevel] = useState<string | null>("O-Level")

  return (
    <div className={cn("flex h-full w-72 flex-col bg-gradient-to-b from-slate-900 to-slate-800 border-r border-slate-700", className)}>
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center px-6 border-b border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg">
            <BookOpen className="h-6 w-6 text-white" />
          </div>
          <div>
            <span className="text-xl font-bold text-white">Exam Prep Pro</span>
            <p className="text-xs text-slate-400">O/A Level Platform</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col px-4 py-4 space-y-2">
        {/* Main Navigation */}
        <div className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "group flex items-center gap-x-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg"
                    : "text-slate-300 hover:bg-slate-700 hover:text-white"
                )}
              >
                <item.icon
                  className={cn(
                    "h-5 w-5 shrink-0 transition-colors",
                    isActive ? "text-white" : "text-slate-400 group-hover:text-white"
                  )}
                />
                {item.name}
              </Link>
            )
          })}
        </div>

        {/* Subjects Section */}
        <div className="pt-4">
          <h3 className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Subjects
          </h3>
          
          {/* O-Level and A-Level Sections */}
          {Object.entries(subjects).map(([level, levelSubjects]) => (
            <div key={level} className="mb-4">
              <button
                onClick={() => setExpandedLevel(expandedLevel === level ? null : level)}
                className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
              >
                <span className="flex items-center gap-x-2">
                  <div className="h-2 w-2 rounded-full bg-indigo-400"></div>
                  {level}
                </span>
                <svg
                  className={cn(
                    "h-4 w-4 transition-transform",
                    expandedLevel === level ? "rotate-180" : ""
                  )}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {expandedLevel === level && (
                <div className="ml-4 mt-2 space-y-1">
                  {levelSubjects.map((subject) => {
                    const subjectPath = `/subjects/${subject.code.toLowerCase()}`
                    const isActive = pathname === subjectPath
                    return (
                      <Link
                        key={subject.code}
                        href={subjectPath}
                        className={cn(
                          "group flex items-center gap-x-3 rounded-lg px-3 py-2 text-sm transition-all duration-200",
                          isActive
                            ? "bg-gradient-to-r from-slate-700 to-slate-600 text-white shadow-md"
                            : "text-slate-400 hover:bg-slate-700 hover:text-white"
                        )}
                      >
                        <div className={cn("flex h-6 w-6 items-center justify-center rounded-md", subject.color)}>
                          <subject.icon className="h-3.5 w-3.5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">{subject.name}</div>
                          <div className="text-xs text-slate-500">{subject.code}</div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </nav>

      {/* User Section */}
      <div className="border-t border-slate-700 p-4">
        <div className="flex items-center gap-x-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-600">
            <User className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">Student User</p>
            <p className="text-xs text-slate-400 truncate">student@example.com</p>
          </div>
          <button className="text-slate-400 hover:text-white transition-colors">
            <Settings className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
