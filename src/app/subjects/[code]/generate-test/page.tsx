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
  Clock, 
  Utensils,
  Wrench,
  Plane,
  Scale,
  GraduationCap,
  Mic,
  Video,
  Laptop,
  ArrowLeft,
  Settings,
  Zap,
  CheckSquare,
  Sparkles,
  Target,
  Timer,
  BarChart3,
  Search,
  Lightbulb
} from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { TestConfig, SUBJECT_TOPICS, DEFAULT_TOPICS, QuestionType, QUESTION_TYPES, getQuestionTypesForSubject } from "@/types/test"

// Subject data mapping (same as in the main subject page)
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

export default function GenerateTestPage() {
  const params = useParams()
  const router = useRouter()
  const code = params.code as string
  const subject = subjectData[code]
  
  const [config, setConfig] = useState<TestConfig>({
    subjectCode: code,
    subjectName: subject?.name || '',
    subjectLevel: subject?.level || '',
    numberOfQuestions: 5,
    difficulty: 'medium',
    topics: [],
    questionTypes: [],
    duration: 15
  })
  
  const [isGenerating, setIsGenerating] = useState(false)
  const [availableTopics, setAvailableTopics] = useState<string[]>([])
  const [availableQuestionTypes, setAvailableQuestionTypes] = useState<QuestionType[]>([])
  const [error, setError] = useState('')
  const [topicSearchQuery, setTopicSearchQuery] = useState('')

  useEffect(() => {
    if (subject) {
      const topics = SUBJECT_TOPICS[code] || DEFAULT_TOPICS
      const questionTypes = getQuestionTypesForSubject(code)
      setAvailableTopics(topics)
      setAvailableQuestionTypes(questionTypes)
      setConfig(prev => ({
        ...prev,
        subjectName: subject.name,
        subjectLevel: subject.level,
        duration: prev.numberOfQuestions + 10 // Auto-calculate duration
      }))
    }
  }, [subject, code])

  useEffect(() => {
    // Auto-calculate duration when number of questions changes
    setConfig(prev => ({
      ...prev,
      duration: prev.numberOfQuestions + 10
    }))
  }, [config.numberOfQuestions])

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

  const handleTopicToggle = (topic: string) => {
    setConfig(prev => ({
      ...prev,
      topics: prev.topics.includes(topic)
        ? prev.topics.filter(t => t !== topic)
        : [...prev.topics, topic]
    }))
  }

  const handleQuestionTypeToggle = (questionType: QuestionType) => {
    setConfig(prev => ({
      ...prev,
      questionTypes: prev.questionTypes.includes(questionType)
        ? prev.questionTypes.filter(t => t !== questionType)
        : [...prev.questionTypes, questionType]
    }))
  }

  const handleSelectAllTopics = () => {
    const filteredTopics = availableTopics.filter(topic => 
      topic.toLowerCase().includes(topicSearchQuery.toLowerCase())
    )
    setConfig(prev => ({
      ...prev,
      topics: filteredTopics
    }))
  }

  const handleDeselectAllTopics = () => {
    setConfig(prev => ({
      ...prev,
      topics: []
    }))
  }

  const handleSelectAllQuestionTypes = () => {
    setConfig(prev => ({
      ...prev,
      questionTypes: availableQuestionTypes
    }))
  }

  const handleDeselectAllQuestionTypes = () => {
    setConfig(prev => ({
      ...prev,
      questionTypes: []
    }))
  }

  const filteredTopics = availableTopics.filter(topic => 
    topic.toLowerCase().includes(topicSearchQuery.toLowerCase())
  )

  const handleGenerate = async () => {
    if (config.topics.length === 0) {
      setError('Please select at least one topic')
      return
    }
    
    if (config.questionTypes.length === 0) {
      setError('Please select at least one question type')
      return
    }

    setIsGenerating(true)
    setError('')

    try {
      const response = await fetch('/api/tests/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      })

      const result = await response.json()

      if (!response.ok) {
        const errorMessage = result.message || 'Failed to generate test'
        const errorDetails = result.details ? `\n\n${result.details}` : ''
        throw new Error(`${errorMessage}${errorDetails}`)
      }

      if (result.success && result.test) {
        // Redirect to the generated test (you might want to create a test view page)
        router.push(`/tests/${result.test.id}`)
      } else {
        throw new Error('Failed to generate test')
      }
    } catch (error) {
      console.error('Test generation error:', error)
      setError(error instanceof Error ? error.message : 'Failed to generate test')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-indigo-500/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-blue-500/20 to-cyan-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        <div className="relative h-full flex flex-col p-6 space-y-6">
          {/* Modern Header */}
          <div className="flex-shrink-0">
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <button
                    onClick={() => router.back()}
                    className="p-3 hover:bg-white/10 rounded-xl transition-all duration-300 group"
                  >
                    <ArrowLeft className="h-5 w-5 text-white/80 group-hover:text-white transition-colors" />
                  </button>
                  
                  <div className="flex items-center space-x-4">
                    <div className={`p-4 rounded-2xl ${subject.color} shadow-lg ring-4 ring-white/10`}>
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                        Generate AI Test
                      </h1>
                      <p className="text-white/70 text-sm font-medium">Create a custom practice test using AI</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full border border-indigo-400/30">
                    <Sparkles className="h-4 w-4 text-indigo-400" />
                    <span className="text-sm font-semibold text-indigo-300">AI Powered</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-white/60">{subject.name}</div>
                    <div className="text-xs text-white/40">{subject.code} • {subject.level}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>


          {/* Main Configuration Panel */}
          <div className="flex-1 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
            <div className="h-full flex">
              {/* Left Panel - Basic Settings */}
              <div className="w-80 bg-white/5 backdrop-blur-xl border-r border-white/10 p-6 flex flex-col space-y-6">
                {/* Questions Count */}
                <div className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-2xl p-5 border border-blue-400/20">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-blue-500/20 rounded-xl">
                      <BarChart3 className="h-5 w-5 text-blue-400" />
                    </div>
                    <h3 className="text-lg font-bold text-white">Questions</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="relative">
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={config.numberOfQuestions}
                        onChange={(e) => setConfig(prev => ({ ...prev, numberOfQuestions: parseInt(e.target.value) }))}
                        className="w-full h-3 bg-gradient-to-r from-blue-500/30 to-indigo-500/30 rounded-full appearance-none cursor-pointer slider"
                        style={{
                          background: `linear-gradient(to right, #3b82f6 0%, #6366f1 ${(config.numberOfQuestions - 1) / 9 * 100}%, rgba(255,255,255,0.1) ${(config.numberOfQuestions - 1) / 9 * 100}%, rgba(255,255,255,0.1) 100%)`
                        }}
                      />
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white">{config.numberOfQuestions}</div>
                      <div className="text-sm text-white/60">questions</div>
                    </div>
                  </div>
                </div>

                {/* Difficulty and Duration Combined - Full Height */}
                <div className="flex-1 flex flex-col space-y-6">
                  {/* Difficulty */}
                  <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-2xl p-5 border border-green-400/20 flex-1 flex flex-col justify-center">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="p-2 bg-green-500/20 rounded-xl">
                        <Target className="h-5 w-5 text-green-400" />
                      </div>
                      <h3 className="text-lg font-bold text-white">Difficulty</h3>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {(['easy', 'medium', 'hard'] as const).map((level) => (
                        <button
                          key={level}
                          onClick={() => setConfig(prev => ({ ...prev, difficulty: level }))}
                          className={`p-3 rounded-xl border-2 transition-all duration-300 text-sm font-semibold ${
                            config.difficulty === level
                              ? 'border-green-400 bg-green-500/20 text-green-300 shadow-lg'
                              : 'border-white/20 hover:border-white/40 text-white/70 hover:bg-white/5'
                          }`}
                        >
                          <div className="capitalize">{level}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Duration */}
                  <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl p-5 border border-purple-400/20 flex-1 flex flex-col justify-center">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="p-2 bg-purple-500/20 rounded-xl">
                        <Timer className="h-5 w-5 text-purple-400" />
                      </div>
                      <h3 className="text-lg font-bold text-white">Duration</h3>
                    </div>
                    <div className="space-y-3">
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
                        <input
                          type="number"
                          min="5"
                          max="300"
                          value={config.duration}
                          onChange={(e) => setConfig(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                          className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent text-white placeholder-white/40"
                          placeholder="20"
                        />
                      </div>
                      <div className="text-sm text-purple-300 text-center">
                        Auto: {config.numberOfQuestions + 10} min
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Center Panel - Topics */}
              <div className="flex-1 bg-white/5 backdrop-blur-xl border-r border-white/10 p-6 flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-orange-500/20 rounded-xl">
                      <BookOpen className="h-5 w-5 text-orange-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">Topics</h3>
                      <p className="text-sm text-white/60">{config.topics.length} of {availableTopics.length} selected</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleSelectAllTopics}
                      className="px-3 py-1.5 bg-green-500/20 hover:bg-green-500/30 text-green-300 rounded-lg text-sm font-medium transition-all duration-200"
                    >
                      All
                    </button>
                    <button
                      onClick={handleDeselectAllTopics}
                      className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg text-sm font-medium transition-all duration-200"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                {/* Search */}
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
                  <input
                    type="text"
                    placeholder="Search topics..."
                    value={topicSearchQuery}
                    onChange={(e) => setTopicSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent text-white placeholder-white/40"
                  />
                </div>

                {/* Topics Grid */}
                <div className="flex-1 overflow-y-auto">
                  <div className="grid grid-cols-2 gap-2">
                    {filteredTopics.map((topic) => (
                      <label key={topic} className="flex items-center space-x-3 p-3 hover:bg-white/5 rounded-xl cursor-pointer transition-all duration-200 group border border-white/10 hover:border-white/20">
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={config.topics.includes(topic)}
                            onChange={() => handleTopicToggle(topic)}
                            className="sr-only"
                          />
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                            config.topics.includes(topic)
                              ? 'bg-orange-500 border-orange-500 text-white'
                              : 'border-white/30 group-hover:border-orange-400'
                          }`}>
                            {config.topics.includes(topic) && <CheckSquare className="h-3 w-3" />}
                          </div>
                        </div>
                        <span className="text-sm text-white/80 group-hover:text-white font-medium">{topic}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {config.topics.length === 0 && (
                  <div className="mt-4 p-3 bg-amber-500/10 border border-amber-400/30 rounded-xl">
                    <div className="flex items-center space-x-2">
                      <Lightbulb className="h-4 w-4 text-amber-400" />
                      <span className="text-sm text-amber-300 font-medium">Select at least one topic</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Panel - Question Types & Generate */}
              <div className="w-80 bg-white/5 backdrop-blur-xl p-6 flex flex-col space-y-6">
                {/* Question Types */}
                <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-2xl p-5 border border-cyan-400/20 flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-cyan-500/20 rounded-xl">
                        <FileText className="h-5 w-5 text-cyan-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">Question Types</h3>
                        <p className="text-sm text-white/60">{config.questionTypes.length} of {availableQuestionTypes.length} selected</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={handleSelectAllQuestionTypes}
                        className="px-3 py-1.5 bg-green-500/20 hover:bg-green-500/30 text-green-300 rounded-lg text-sm font-medium transition-all duration-200"
                      >
                        All
                      </button>
                      <button
                        onClick={handleDeselectAllQuestionTypes}
                        className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg text-sm font-medium transition-all duration-200"
                      >
                        Clear
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-3">
                    {availableQuestionTypes.map((questionType) => (
                      <label key={questionType} className="flex items-start space-x-3 p-3 hover:bg-white/5 rounded-xl cursor-pointer border border-white/10 hover:border-white/20 transition-all duration-200 group">
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={config.questionTypes.includes(questionType)}
                            onChange={() => handleQuestionTypeToggle(questionType)}
                            className="sr-only"
                          />
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                            config.questionTypes.includes(questionType)
                              ? 'bg-cyan-500 border-cyan-500 text-white'
                              : 'border-white/30 group-hover:border-cyan-400'
                          }`}>
                            {config.questionTypes.includes(questionType) && <CheckSquare className="h-3 w-3" />}
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-semibold text-white group-hover:text-white">{QUESTION_TYPES[questionType].label}</div>
                          <div className="text-xs text-white/60">{QUESTION_TYPES[questionType].description}</div>
                        </div>
                      </label>
                    ))}
                  </div>

                  {config.questionTypes.length === 0 && (
                    <div className="mt-4 p-3 bg-amber-500/10 border border-amber-400/30 rounded-xl">
                      <div className="flex items-center space-x-2">
                        <Lightbulb className="h-4 w-4 text-amber-400" />
                        <span className="text-sm text-amber-300 font-medium">Select at least one type</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Generate Button */}
                <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-2xl p-5 border border-indigo-400/20">
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-3 mb-4">
                      <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg">
                        <Sparkles className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">Ready to Generate?</h3>
                        <p className="text-sm text-white/60">Create your personalized AI test</p>
                      </div>
                    </div>
                    <button
                      onClick={handleGenerate}
                      disabled={isGenerating || config.topics.length === 0 || config.questionTypes.length === 0}
                      className="w-full px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 disabled:from-slate-600 disabled:to-slate-600 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 hover:shadow-xl flex items-center justify-center space-x-3 text-base font-bold"
                    >
                      {isGenerating ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                          <span>Generating...</span>
                        </>
                      ) : (
                        <>
                          <Zap className="h-5 w-5" />
                          <span>Generate AI Test</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-500/10 border border-red-400/30 rounded-2xl p-4 flex-shrink-0 backdrop-blur-xl">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-red-500/20 rounded-xl">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm text-red-300 font-semibold">AI Test Generation Failed</div>
                  <div className="text-sm text-red-400 mt-1">{error}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Custom Styles */}
      <style jsx global>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6, #6366f1);
          cursor: pointer;
          border: 2px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
          transition: all 0.2s ease;
        }
        
        .slider::-webkit-slider-thumb:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.4);
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6, #6366f1);
          cursor: pointer;
          border: 2px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
          transition: all 0.2s ease;
        }
        
        .slider::-moz-range-thumb:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.4);
        }
      `}</style>
    </DashboardLayout>
  )
}
