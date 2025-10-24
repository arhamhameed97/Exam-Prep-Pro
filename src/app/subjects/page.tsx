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
  Search,
  Filter,
  ChevronDown,
  Utensils,
  Wrench,
  Plane,
  Scale,
  GraduationCap,
  Mic,
  Video,
  Laptop
} from "lucide-react"
import { useState } from "react"
import Link from "next/link"

// Subject data with proper icons
const subjects = {
  "O-Level": [
    // Core Subjects
    { name: "Mathematics", code: "4024", icon: Calculator, color: "bg-blue-500", description: "Core Mathematics covering algebra, geometry, and statistics" },
    { name: "Additional Mathematics", code: "4037", icon: Calculator, color: "bg-blue-600", description: "Advanced mathematical concepts and problem-solving" },
    { name: "English Language", code: "1123", icon: BookOpen, color: "bg-red-500", description: "English language skills and comprehension" },
    { name: "English Literature", code: "2010", icon: FileText, color: "bg-red-600", description: "Literary analysis and critical thinking" },
    { name: "Urdu", code: "3248", icon: BookOpen, color: "bg-orange-500", description: "Urdu language and literature" },
    { name: "Pakistan Studies", code: "2059", icon: Globe, color: "bg-green-600", description: "History and geography of Pakistan" },
    { name: "Islamiyat", code: "2058", icon: Globe, color: "bg-green-700", description: "Islamic studies and religious education" },
    
    // Sciences
    { name: "Physics", code: "5054", icon: Atom, color: "bg-purple-500", description: "Fundamental physics principles and applications" },
    { name: "Chemistry", code: "5070", icon: FlaskConical, color: "bg-green-500", description: "Chemical reactions, atomic structure, and laboratory work" },
    { name: "Biology", code: "5090", icon: Dna, color: "bg-emerald-500", description: "Living organisms, cells, and biological processes" },
    { name: "Computer Science", code: "2210", icon: Brain, color: "bg-cyan-500", description: "Programming and computer fundamentals" },
    { name: "Environmental Management", code: "5014", icon: Globe, color: "bg-teal-600", description: "Environmental science and sustainability" },
    
    // Humanities & Social Sciences
    { name: "Geography", code: "2217", icon: Map, color: "bg-teal-500", description: "Physical and human geography" },
    { name: "History", code: "2147", icon: History, color: "bg-amber-500", description: "World history and historical analysis" },
    { name: "Economics", code: "2281", icon: TrendingUp, color: "bg-indigo-500", description: "Economic principles and market systems" },
    { name: "Accounting", code: "7707", icon: TrendingUp, color: "bg-gray-500", description: "Financial accounting and bookkeeping" },
    { name: "Business Studies", code: "7115", icon: Building, color: "bg-slate-500", description: "Business management and entrepreneurship" },
    { name: "Sociology", code: "2251", icon: Users, color: "bg-orange-600", description: "Social behavior and societal structures" },
    
    // Languages
    { name: "French", code: "3015", icon: BookOpen, color: "bg-blue-700", description: "French language and culture" },
    { name: "German", code: "3016", icon: BookOpen, color: "bg-yellow-600", description: "German language and culture" },
    { name: "Spanish", code: "3017", icon: BookOpen, color: "bg-red-700", description: "Spanish language and culture" },
    { name: "Arabic", code: "3180", icon: BookOpen, color: "bg-green-800", description: "Arabic language and literature" },
    { name: "Chinese", code: "3205", icon: BookOpen, color: "bg-red-800", description: "Chinese language and culture" },
    
    // Arts & Creative Subjects
    { name: "Art & Design", code: "6090", icon: Palette, color: "bg-pink-500", description: "Creative arts and design principles" },
    { name: "Music", code: "6100", icon: Music, color: "bg-violet-500", description: "Musical theory and performance" },
    { name: "Drama", code: "6421", icon: Users, color: "bg-purple-600", description: "Theatre arts and dramatic performance" },
    
    // Applied Subjects
    { name: "Food & Nutrition", code: "6065", icon: Utensils, color: "bg-orange-600", description: "Nutritional science and food preparation" },
    { name: "Design & Technology", code: "6043", icon: Wrench, color: "bg-gray-600", description: "Engineering design and technology" },
    { name: "Physical Education", code: "5016", icon: Users, color: "bg-lime-500", description: "Sports science and physical fitness" },
    { name: "Travel & Tourism", code: "7096", icon: Plane, color: "bg-cyan-600", description: "Tourism industry and travel management" },
  ],
  "A-Level": [
    // Core Sciences
    { name: "Mathematics", code: "9709", icon: Calculator, color: "bg-blue-500", description: "Advanced mathematics including calculus and statistics" },
    { name: "Further Mathematics", code: "9231", icon: Calculator, color: "bg-blue-600", description: "Advanced mathematical concepts and applications" },
    { name: "Physics", code: "9702", icon: Atom, color: "bg-purple-500", description: "Advanced physics including quantum mechanics" },
    { name: "Chemistry", code: "9701", icon: FlaskConical, color: "bg-green-500", description: "Advanced chemistry including organic chemistry" },
    { name: "Biology", code: "9700", icon: Dna, color: "bg-emerald-500", description: "Advanced biology including molecular biology" },
    { name: "Computer Science", code: "9608", icon: Brain, color: "bg-cyan-500", description: "Advanced programming and computer systems" },
    { name: "Environmental Science", code: "9693", icon: Globe, color: "bg-teal-600", description: "Environmental science and sustainability" },
    { name: "Psychology", code: "9990", icon: Brain, color: "bg-rose-500", description: "Human behavior and mental processes" },
    
    // Humanities & Social Sciences
    { name: "English Language", code: "9093", icon: BookOpen, color: "bg-red-500", description: "Advanced English language and linguistics" },
    { name: "English Literature", code: "9695", icon: FileText, color: "bg-red-600", description: "Advanced literary analysis and criticism" },
    { name: "Pakistan Studies", code: "9488", icon: Globe, color: "bg-green-600", description: "Advanced study of Pakistan's history and culture" },
    { name: "Geography", code: "9696", icon: Map, color: "bg-teal-500", description: "Advanced geography and environmental studies" },
    { name: "History", code: "9489", icon: History, color: "bg-amber-500", description: "Advanced historical research and analysis" },
    { name: "Economics", code: "9708", icon: TrendingUp, color: "bg-indigo-500", description: "Advanced economics and economic theory" },
    { name: "Accounting", code: "9706", icon: TrendingUp, color: "bg-gray-500", description: "Advanced accounting and financial management" },
    { name: "Business Studies", code: "9609", icon: Building, color: "bg-slate-500", description: "Business management and entrepreneurship" },
    { name: "Sociology", code: "9699", icon: Users, color: "bg-orange-500", description: "Social behavior and societal structures" },
    { name: "Law", code: "9084", icon: Scale, color: "bg-slate-600", description: "Legal principles and jurisprudence" },
    { name: "Political Science", code: "9698", icon: GraduationCap, color: "bg-blue-700", description: "Political systems and governance" },
    { name: "Philosophy", code: "9704", icon: Brain, color: "bg-purple-700", description: "Critical thinking and philosophical inquiry" },
    
    // Languages
    { name: "French", code: "9716", icon: BookOpen, color: "bg-blue-700", description: "Advanced French language and culture" },
    { name: "German", code: "9717", icon: BookOpen, color: "bg-yellow-600", description: "Advanced German language and culture" },
    { name: "Spanish", code: "9719", icon: BookOpen, color: "bg-red-700", description: "Advanced Spanish language and culture" },
    { name: "Arabic", code: "9680", icon: BookOpen, color: "bg-green-800", description: "Advanced Arabic language and literature" },
    { name: "Chinese", code: "9715", icon: BookOpen, color: "bg-red-800", description: "Advanced Chinese language and culture" },
    { name: "Urdu", code: "9686", icon: BookOpen, color: "bg-orange-500", description: "Advanced Urdu language and literature" },
    
    // Arts & Creative Subjects
    { name: "Art & Design", code: "9479", icon: Palette, color: "bg-pink-500", description: "Advanced art theory and creative practice" },
    { name: "Music", code: "9483", icon: Music, color: "bg-violet-500", description: "Advanced music theory and composition" },
    { name: "Drama and Theatre Studies", code: "9482", icon: Mic, color: "bg-purple-600", description: "Advanced theatre arts and dramatic performance" },
    { name: "Photography", code: "9486", icon: Camera, color: "bg-stone-500", description: "Digital and film photography techniques" },
    
    // Applied & Professional Subjects
    { name: "Media Studies", code: "9607", icon: Video, color: "bg-indigo-600", description: "Media analysis and production" },
    { name: "Information Technology", code: "9626", icon: Laptop, color: "bg-cyan-600", description: "IT systems and digital technologies" },
    { name: "Design and Technology", code: "9705", icon: Wrench, color: "bg-gray-600", description: "Engineering design and innovation" },
    { name: "Physical Education", code: "9396", icon: Users, color: "bg-lime-500", description: "Sports science and physical fitness" },
    { name: "Travel and Tourism", code: "9395", icon: Plane, color: "bg-cyan-600", description: "Tourism industry and travel management" },
  ]
}

export default function SubjectsPage() {
  const [selectedLevel, setSelectedLevel] = useState<string>("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [showLevelFilter, setShowLevelFilter] = useState(false)

  // Filter subjects based on level and search query
  const filteredSubjects = Object.entries(subjects).reduce((acc, [level, levelSubjects]) => {
    if (selectedLevel !== "All" && selectedLevel !== level) return acc
    
    const filtered = levelSubjects.filter(subject =>
      subject.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      subject.code.toLowerCase().includes(searchQuery.toLowerCase())
    )
    
    if (filtered.length > 0) {
      acc[level] = filtered
    }
    
    return acc
  }, {} as Record<string, typeof subjects['O-Level']>)

  const totalSubjects = Object.values(filteredSubjects).reduce((total, subjects) => total + subjects.length, 0)

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Subjects</h1>
            <p className="text-slate-600 mt-1">Explore all available O-Level and A-Level subjects</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-slate-900">{totalSubjects}</p>
            <p className="text-sm text-slate-600">Subjects Available</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search subjects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Level Filter */}
            <div className="relative">
              <button
                onClick={() => setShowLevelFilter(!showLevelFilter)}
                className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <Filter className="h-4 w-4 text-slate-400" />
                <span className="text-slate-700">{selectedLevel}</span>
                <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${showLevelFilter ? 'rotate-180' : ''}`} />
              </button>

              {showLevelFilter && (
                <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-10">
                  {["All", "O-Level", "A-Level"].map((level) => (
                    <button
                      key={level}
                      onClick={() => {
                        setSelectedLevel(level)
                        setShowLevelFilter(false)
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 first:rounded-t-lg last:rounded-b-lg ${
                        selectedLevel === level ? 'bg-indigo-50 text-indigo-600' : 'text-slate-700'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Subject Cards */}
        <div className="space-y-8">
          {Object.entries(filteredSubjects).map(([level, levelSubjects]) => (
            <div key={level}>
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-xl font-semibold text-slate-900">{level}</h2>
                <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm font-medium">
                  {levelSubjects.length} subjects
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {levelSubjects.map((subject) => {
                  const IconComponent = subject.icon
                  return (
                    <Link
                      key={subject.code}
                      href={`/subjects/${subject.code.toLowerCase()}`}
                      className="group bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md hover:border-indigo-300 transition-all duration-200"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className={`p-3 rounded-lg ${subject.color}`}>
                          <IconComponent className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-xs text-slate-500 font-medium">{subject.code}</span>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                        {subject.name}
                      </h3>
                      
                      <p className="text-sm text-slate-600 line-clamp-2 mb-4">
                        {subject.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs font-medium">
                          {level}
                        </span>
                        <div className="text-slate-400 group-hover:text-indigo-500 transition-colors">
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {totalSubjects === 0 && (
          <div className="text-center py-12">
            <Search className="h-16 w-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No subjects found</h3>
            <p className="text-slate-600">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
