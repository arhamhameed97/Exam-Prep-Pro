"use client"

import { useState, useEffect } from 'react'
import { 
  X, 
  Search, 
  Plus, 
  BookOpen, 
  Loader2,
  AlertCircle,
  GraduationCap
} from 'lucide-react'

interface AvailableSubject {
  name: string
  code: string
  description: string
}

interface AddSubjectModalProps {
  isOpen: boolean
  onClose: () => void
  onSubjectAdded: () => void
}

export default function AddSubjectModal({ isOpen, onClose, onSubjectAdded }: AddSubjectModalProps) {
  const [level, setLevel] = useState<'O-Level' | 'A-Level'>('O-Level')
  const [searchQuery, setSearchQuery] = useState('')
  const [availableSubjects, setAvailableSubjects] = useState<AvailableSubject[]>([])
  const [loading, setLoading] = useState(false)
  const [adding, setAdding] = useState<string | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isOpen) {
      fetchAvailableSubjects()
    }
  }, [isOpen, level])

  const fetchAvailableSubjects = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch(`/api/subjects/available?level=${level}`)
      const data = await response.json()
      
      if (data.success) {
        setAvailableSubjects(data.subjects)
      } else {
        setError(data.message || 'Failed to fetch subjects')
      }
    } catch (error) {
      setError('Failed to fetch subjects')
    } finally {
      setLoading(false)
    }
  }

  const addSubject = async (subjectCode: string) => {
    setAdding(subjectCode)
    setError('')
    try {
      const response = await fetch('/api/subjects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subjectCode,
          level
        }),
      })

      const data = await response.json()

      if (data.success) {
        onSubjectAdded()
        onClose()
        setSearchQuery('')
      } else {
        setError(data.message || 'Failed to add subject')
      }
    } catch (error) {
      setError('Failed to add subject')
    } finally {
      setAdding(null)
    }
  }

  const filteredSubjects = availableSubjects.filter(subject =>
    subject.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    subject.code.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Plus className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Add Subject</h2>
              <p className="text-sm text-slate-600">Choose a subject to track your progress</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-slate-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Level Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-3">
              Education Level
            </label>
            <div className="flex space-x-2">
              <button
                onClick={() => setLevel('O-Level')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  level === 'O-Level'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <GraduationCap className="h-4 w-4" />
                <span>O-Level</span>
              </button>
              <button
                onClick={() => setLevel('A-Level')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  level === 'A-Level'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <GraduationCap className="h-4 w-4" />
                <span>A-Level</span>
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-3">
              Search Subjects
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name or code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <span className="text-sm text-red-700">{error}</span>
            </div>
          )}

          {/* Subjects List */}
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
                <span className="ml-2 text-slate-600">Loading subjects...</span>
              </div>
            ) : filteredSubjects.length === 0 ? (
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600">No subjects found</p>
                <p className="text-sm text-slate-500">
                  {searchQuery ? 'Try adjusting your search' : 'All subjects have been added'}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredSubjects.map((subject) => (
                  <div
                    key={subject.code}
                    className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-slate-100 rounded-lg">
                          <BookOpen className="h-4 w-4 text-slate-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-slate-900">{subject.name}</h3>
                          <p className="text-sm text-slate-600">{subject.code}</p>
                          <p className="text-xs text-slate-500 mt-1">{subject.description}</p>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => addSubject(subject.code)}
                      disabled={adding === subject.code}
                      className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {adding === subject.code ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Adding...</span>
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4" />
                          <span>Add</span>
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-slate-200 bg-slate-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-700 hover:text-slate-900 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

