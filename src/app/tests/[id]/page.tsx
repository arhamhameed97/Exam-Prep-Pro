"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  ArrowLeft, 
  ArrowRight,
  Play,
  Pause,
  RotateCcw,
  AlertCircle,
  BookOpen,
  Trophy
} from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useState, useEffect, useCallback } from "react"
import { 
  prepareSecureQuestionData, 
  validateAnswer, 
  getInstantFeedback,
  calculateTestScore,
  SecureQuestionData 
} from "@/lib/mcq-validator"

interface Test {
  id: string
  title: string
  description?: string
  duration: number
  totalMarks: number
  difficulty: string
  questions: Array<{
    id: string
    questionText: string
    options: string[]
    correctAnswer: string
    explanation?: string
    marks: number
    difficulty: string
    topic?: string
    questionType: string
  }>
}

interface TestResult {
  score: number
  totalMarks: number
  correctAnswers: number
  totalQuestions: number
  timeSpent: number
  grade: string
}

export default function TestPage() {
  const params = useParams()
  const router = useRouter()
  const testId = params.id as string

  const [test, setTest] = useState<Test | null>(null)
  const [secureQuestions, setSecureQuestions] = useState<SecureQuestionData[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<{ [questionId: string]: string }>({})
  const [feedback, setFeedback] = useState<{ [questionId: string]: string }>({})
  const [timeLeft, setTimeLeft] = useState(0)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [isTestCompleted, setIsTestCompleted] = useState(false)
  const [testResult, setTestResult] = useState<TestResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Load test data
  useEffect(() => {
    loadTestData()
  }, [testId])

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => {
          if (time <= 1) {
            setIsTimerRunning(false)
            handleTestSubmit()
            return 0
          }
          return time - 1
        })
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isTimerRunning, timeLeft])

  const loadTestData = async () => {
    try {
      setLoading(true)
      
      // Fetch actual test data from API
      const response = await fetch(`/api/tests/${testId}`)
      
      if (!response.ok) {
        throw new Error('Test not found')
      }
      
      const testData = await response.json()
      
      if (!testData.success || !testData.test) {
        throw new Error('Invalid test data')
      }
      
      const fetchedTest: Test = {
        id: testData.test.id,
        title: testData.test.title,
        description: testData.test.description,
        duration: testData.test.duration,
        totalMarks: testData.test.totalMarks,
        difficulty: testData.test.difficulty,
        questions: testData.test.questions.map((q: any) => ({
          id: q.id,
          questionText: q.questionText,
          options: q.options,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
          marks: q.marks,
          difficulty: q.difficulty,
          topic: q.topic,
          questionType: q.questionType
        }))
      }

      setTest(fetchedTest)
      setTimeLeft(fetchedTest.duration * 60) // Convert minutes to seconds
      
      // Prepare secure questions with encrypted answers
      const secure = fetchedTest.questions.map(prepareSecureQuestionData)
      setSecureQuestions(secure)
      
    } catch (error) {
      console.error('Error loading test:', error)
      setError('Failed to load test. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleAnswerChange = useCallback((questionId: string, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }))

    // Remove instant feedback - only store the answer
    // Feedback will be shown after test submission
  }, [secureQuestions])

  const handleNextQuestion = () => {
    if (currentQuestionIndex < secureQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
    }
  }

  const handleTestSubmit = useCallback(async () => {
    setIsTimerRunning(false)
    
    // Calculate test score
    const result = calculateTestScore(answers, secureQuestions)
    
    // Determine grade
    const percentage = (result.score / result.totalMarks) * 100
    let grade = 'F'
    if (percentage >= 90) grade = 'A+'
    else if (percentage >= 80) grade = 'A'
    else if (percentage >= 70) grade = 'B'
    else if (percentage >= 60) grade = 'C'
    else if (percentage >= 50) grade = 'D'

    const timeSpent = test ? (test.duration * 60) - timeLeft : 0

    const testResult = {
      ...result,
      timeSpent,
      grade
    }

    setTestResult(testResult)
    
    // Save test attempt to database
    try {
      const response = await fetch('/api/tests/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          testId: test?.id,
          score: result.score,
          grade,
          timeSpent,
          answers
        }),
      })

      if (response.ok) {
        console.log('Test attempt saved successfully')
      }
    } catch (error) {
      console.error('Error saving test attempt:', error)
      // Don't block the UI if saving fails
    }
    
    setIsTestCompleted(true)
  }, [answers, secureQuestions, test, timeLeft])

  const toggleTimer = () => {
    setIsTimerRunning(prev => !prev)
  }

  const resetTest = () => {
    setAnswers({})
    setFeedback({})
    setCurrentQuestionIndex(0)
    setTimeLeft(test?.duration ? test.duration * 60 : 0)
    setIsTimerRunning(false)
    setIsTestCompleted(false)
    setTestResult(null)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (error || !test) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-slate-900 mb-2">Test Not Found</h2>
            <p className="text-slate-600 mb-4">{error || 'The requested test could not be found.'}</p>
            <button
              onClick={() => router.back()}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  const currentQuestion = secureQuestions[currentQuestionIndex]
  const currentAnswer = answers[currentQuestion?.id || '']
  const currentFeedback = feedback[currentQuestion?.id || '']

  if (isTestCompleted && testResult) {
    return (
      <DashboardLayout>
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-slate-600" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Test Results</h1>
              <p className="text-slate-600">{test.title}</p>
            </div>
          </div>

          {/* Score Summary */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg text-white p-8">
            <div className="text-center mb-6">
              <Trophy className="h-20 w-20 text-yellow-300 mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-2">Test Completed!</h2>
              <div className="text-6xl font-bold mb-2">
                {testResult.grade}
              </div>
              <p className="text-xl opacity-90">
                {testResult.score} / {testResult.totalMarks} marks
              </p>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium opacity-90">Overall Performance</span>
                <span className="text-sm font-medium opacity-90">
                  {Math.round((testResult.correctAnswers / testResult.totalQuestions) * 100)}%
                </span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-3">
                <div 
                  className="bg-yellow-300 h-3 rounded-full transition-all duration-1000 ease-out"
                  style={{ 
                    width: `${(testResult.correctAnswers / testResult.totalQuestions) * 100}%` 
                  }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                <div className="text-2xl font-bold">{testResult.correctAnswers}</div>
                <div className="text-sm opacity-90">Correct</div>
              </div>
              <div className="text-center p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                <div className="text-2xl font-bold">{testResult.totalQuestions - testResult.correctAnswers}</div>
                <div className="text-sm opacity-90">Incorrect</div>
              </div>
              <div className="text-center p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                <div className="text-2xl font-bold">{testResult.totalQuestions}</div>
                <div className="text-sm opacity-90">Total Questions</div>
              </div>
              <div className="text-center p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                <div className="text-2xl font-bold">
                  {formatTime(testResult.timeSpent)}
                </div>
                <div className="text-sm opacity-90">Time Spent</div>
              </div>
            </div>
          </div>

          {/* Detailed Question Review */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center space-x-2">
              <BookOpen className="h-6 w-6 text-indigo-600" />
              <span>Question Review</span>
            </h3>
            
            <div className="space-y-6">
              {test.questions.map((question, index) => {
                const userAnswer = answers[question.id]
                const isCorrect = userAnswer === question.correctAnswer
                
                // Handle different question types for answer display
                let userAnswerText = "Not answered"
                let correctAnswerText = question.correctAnswer
                
                if (userAnswer) {
                  if (question.questionType === 'mcq' || question.questionType === 'true-false') {
                    // For MCQ and True/False, get the option text
                    const optionIndex = parseInt(userAnswer) - 1
                    userAnswerText = question.options[optionIndex] || userAnswer
                  } else {
                    // For other types, use the answer directly
                    userAnswerText = userAnswer
                  }
                }
                
                if (question.questionType === 'mcq' || question.questionType === 'true-false') {
                  // For MCQ and True/False, get the correct option text
                  const correctOptionIndex = parseInt(question.correctAnswer) - 1
                  correctAnswerText = question.options[correctOptionIndex] || question.correctAnswer
                }
                
                return (
                  <div key={question.id} className={`p-6 rounded-lg border-2 ${
                    isCorrect 
                      ? 'border-green-200 bg-green-50' 
                      : 'border-red-200 bg-red-50'
                  }`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          isCorrect 
                            ? 'bg-green-500 text-white' 
                            : 'bg-red-500 text-white'
                        }`}>
                          {index + 1}
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-slate-600">{question.topic}</span>
                          <span className="text-sm text-slate-600">•</span>
                          <span className="text-sm text-slate-600">{question.difficulty}</span>
                          <span className="text-sm text-slate-600">•</span>
                          <span className="text-sm text-slate-600">{question.marks} marks</span>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                        isCorrect 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {isCorrect ? 'Correct' : 'Incorrect'}
                      </div>
                    </div>

                    <h4 className="text-lg font-semibold text-slate-900 mb-4">
                      {question.questionText}
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className={`p-4 rounded-lg border-2 ${
                        isCorrect 
                          ? 'border-green-300 bg-green-100' 
                          : 'border-red-300 bg-red-100'
                      }`}>
                        <h5 className="font-semibold text-slate-900 mb-2 flex items-center space-x-2">
                          <span className={`w-2 h-2 rounded-full ${
                            isCorrect ? 'bg-green-500' : 'bg-red-500'
                          }`}></span>
                          <span>Your Answer</span>
                        </h5>
                        <p className="text-slate-700">
                          {userAnswer ? (
                            question.questionType === 'mcq' || question.questionType === 'true-false' 
                              ? `${userAnswer}. ${userAnswerText}` 
                              : userAnswerText
                          ) : "No answer provided"}
                        </p>
                      </div>

                      <div className="p-4 rounded-lg border-2 border-green-300 bg-green-100">
                        <h5 className="font-semibold text-slate-900 mb-2 flex items-center space-x-2">
                          <span className="w-2 h-2 rounded-full bg-green-500"></span>
                          <span>Correct Answer</span>
                        </h5>
                        <p className="text-slate-700">
                          {question.questionType === 'mcq' || question.questionType === 'true-false' 
                            ? `${question.correctAnswer}. ${correctAnswerText}` 
                            : correctAnswerText}
                        </p>
                      </div>
                    </div>

                    {question.explanation && (
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <h5 className="font-semibold text-slate-900 mb-2 flex items-center space-x-2">
                          <AlertCircle className="h-4 w-4 text-blue-600" />
                          <span>Explanation</span>
                        </h5>
                        <p className="text-slate-700">{question.explanation}</p>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4">
            <button
              onClick={resetTest}
              className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2 shadow-lg"
            >
              <RotateCcw className="h-5 w-5" />
              <span>Retake Test</span>
            </button>
            <button
              onClick={() => router.push('/tests')}
              className="px-8 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors shadow-lg"
            >
              Back to Tests
            </button>
            <button
              onClick={() => router.push('/dashboard')}
              className="px-8 py-3 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors shadow-lg"
            >
              Dashboard
            </button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
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
              <h1 className="text-2xl font-bold text-slate-900">{test.title}</h1>
              <p className="text-slate-600">{test.description}</p>
            </div>
          </div>

          {/* Timer */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-slate-600" />
              <span className={`text-lg font-mono font-bold ${
                timeLeft < 300 ? 'text-red-600' : 'text-slate-900'
              }`}>
                {formatTime(timeLeft)}
              </span>
            </div>
            <button
              onClick={toggleTimer}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              {isTimerRunning ? (
                <Pause className="h-5 w-5 text-slate-600" />
              ) : (
                <Play className="h-5 w-5 text-slate-600" />
              )}
            </button>
          </div>
        </div>

        {/* Progress */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-700">
              Question {currentQuestionIndex + 1} of {secureQuestions.length}
            </span>
            <span className="text-sm text-slate-600">
              {Math.round(((currentQuestionIndex + 1) / secureQuestions.length) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div 
              className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / secureQuestions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question */}
        {currentQuestion && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="mb-6">
              <div className="flex items-center space-x-2 mb-4">
                <BookOpen className="h-5 w-5 text-slate-600" />
                <span className="text-sm text-slate-600">
                  {currentQuestion.topic} • {currentQuestion.difficulty} • {currentQuestion.marks} marks
                </span>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                {currentQuestion.questionText}
              </h3>
            </div>

            {/* Answer Options */}
            <div className="space-y-3 mb-6">
              {currentQuestion.options.map((option, index) => {
                const optionKey = String.fromCharCode(65 + index) // A, B, C, D
                const isSelected = currentAnswer === optionKey
                
                return (
                  <label
                    key={index}
                    className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name={`question-${currentQuestion.id}`}
                      value={optionKey}
                      checked={isSelected}
                      onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                      className="sr-only"
                    />
                    <div className="flex items-center space-x-3 w-full">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        isSelected ? 'border-indigo-500 bg-indigo-500' : 'border-slate-300'
                      }`}>
                        {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                      </div>
                      <span className="font-medium text-slate-900">{optionKey}.</span>
                      <span className="text-slate-700">{option}</span>
                    </div>
                  </label>
                )
              })}
            </div>

            {/* No instant feedback - results shown after submission */}

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <button
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Previous</span>
              </button>

              <div className="flex space-x-2">
                {secureQuestions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentQuestionIndex(index)}
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                      index === currentQuestionIndex
                        ? 'bg-indigo-600 text-white'
                        : answers[secureQuestions[index].id]
                        ? 'bg-green-100 text-green-700'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>

              {currentQuestionIndex === secureQuestions.length - 1 ? (
                <button
                  onClick={handleTestSubmit}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                >
                  <span>Submit Test</span>
                  <CheckCircle className="h-4 w-4" />
                </button>
              ) : (
                <button
                  onClick={handleNextQuestion}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
                >
                  <span>Next</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
