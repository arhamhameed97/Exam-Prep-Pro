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
  TestTube, 
  Archive, 
  Clock, 
  Award,
  Play,
  Download,
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
  Zap
} from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { TestConfig, SUBJECT_TOPICS, DEFAULT_TOPICS, QuestionType, QUESTION_TYPES, getQuestionTypesForSubject } from "@/types/test"

// Subject data mapping (same as in the main subject page)
const subjectData: Record<string, { name: string; code: string; level: string; description: string; icon: any; color: string }> = {
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
    numberOfQuestions: 10,
    difficulty: 'medium',
    topics: [],
    questionTypes: [],
    duration: 20
  })
  
  const [isGenerating, setIsGenerating] = useState(false)
  const [availableTopics, setAvailableTopics] = useState<string[]>([])
  const [availableQuestionTypes, setAvailableQuestionTypes] = useState<QuestionType[]>([])
  const [error, setError] = useState('')

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
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-slate-600" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Generate AI Test</h1>
              <p className="text-slate-600 mt-1">Create a custom practice test using AI</p>
            </div>
          </div>
        </div>

        {/* Subject Info */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center space-x-4">
            <div className={`p-4 rounded-xl ${subject.color}`}>
              <IconComponent className="h-8 w-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">{subject.name}</h2>
              <div className="flex items-center space-x-4 mt-1">
                <span className="text-lg text-slate-600">{subject.code}</span>
                <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium">
                  {subject.level}
                </span>
              </div>
              <p className="text-slate-600 mt-2">{subject.description}</p>
            </div>
          </div>
        </div>

        {/* Configuration Form */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Settings className="h-6 w-6 text-slate-600" />
            <h3 className="text-xl font-semibold text-slate-900">Test Configuration</h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Number of Questions */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Number of Questions
                </label>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="5"
                    max="50"
                    value={config.numberOfQuestions}
                    onChange={(e) => setConfig(prev => ({ ...prev, numberOfQuestions: parseInt(e.target.value) }))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>5</span>
                    <span className="font-medium text-slate-900">{config.numberOfQuestions} questions</span>
                    <span>50</span>
                  </div>
                </div>
              </div>

              {/* Difficulty Level */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  Difficulty Level
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(['easy', 'medium', 'hard'] as const).map((level) => (
                    <button
                      key={level}
                      onClick={() => setConfig(prev => ({ ...prev, difficulty: level }))}
                      className={`p-3 rounded-lg border-2 transition-colors ${
                        config.difficulty === level
                          ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <div className="capitalize font-medium">{level}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Question Types */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  Question Types ({config.questionTypes.length} selected)
                </label>
                <div className="space-y-2">
                  {availableQuestionTypes.map((questionType) => (
                    <label key={questionType} className="flex items-start space-x-3 p-3 hover:bg-slate-50 rounded-lg cursor-pointer border border-slate-200">
                      <input
                        type="checkbox"
                        checked={config.questionTypes.includes(questionType)}
                        onChange={() => handleQuestionTypeToggle(questionType)}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded mt-0.5"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-slate-900">{QUESTION_TYPES[questionType].label}</div>
                        <div className="text-sm text-slate-600">{QUESTION_TYPES[questionType].description}</div>
                      </div>
                    </label>
                  ))}
                </div>
                {config.questionTypes.length === 0 && (
                  <p className="text-sm text-amber-600 mt-2">Please select at least one question type</p>
                )}
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Test Duration (minutes)
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="number"
                    min="5"
                    max="300"
                    value={config.duration}
                    onChange={(e) => setConfig(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Auto-calculated: {config.numberOfQuestions + 10} minutes (1 minute per question + 10 minutes buffer)
                </p>
              </div>
            </div>

            {/* Right Column - Topics */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">
                Select Topics ({config.topics.length} selected)
              </label>
              <div className="max-h-64 overflow-y-auto border border-slate-200 rounded-lg p-4">
                <div className="grid grid-cols-1 gap-2">
                  {availableTopics.map((topic) => (
                    <label key={topic} className="flex items-center space-x-3 p-2 hover:bg-slate-50 rounded cursor-pointer">
                      <input
                        type="checkbox"
                        checked={config.topics.includes(topic)}
                        onChange={() => handleTopicToggle(topic)}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded"
                      />
                      <span className="text-sm text-slate-700">{topic}</span>
                    </label>
                  ))}
                </div>
              </div>
              {config.topics.length === 0 && (
                <p className="text-sm text-amber-600 mt-2">Please select at least one topic to generate questions</p>
              )}
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mt-6 p-6 bg-red-50 border-2 border-red-300 rounded-lg">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-red-800 mb-2">AI Test Generation Failed</h3>
                  <div className="text-sm text-red-700 whitespace-pre-line">{error}</div>
                </div>
              </div>
            </div>
          )}

          {/* Generate Button */}
          <div className="mt-8 flex justify-end">
            <button
              onClick={handleGenerate}
              disabled={isGenerating || config.topics.length === 0 || config.questionTypes.length === 0}
              className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>Generating Test...</span>
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4" />
                  <span>Generate AI Test</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* AI Features Info */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100">
          <div className="flex items-center space-x-3 mb-3">
            <Brain className="h-6 w-6 text-indigo-600" />
            <h3 className="text-lg font-semibold text-slate-900">Powered by AI</h3>
          </div>
          <p className="text-slate-700 mb-4">
            Our AI will generate high-quality, curriculum-aligned questions based on your selected topics and difficulty level. 
            Each question includes detailed explanations to help you learn.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
              <span className="text-slate-600">Curriculum-aligned questions</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
              <span className="text-slate-600">Detailed explanations</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
              <span className="text-slate-600">Multiple difficulty levels</span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
