"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Play, Loader2 } from "lucide-react"

export default function DemoPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Set a demo flag in localStorage to bypass authentication checks
    localStorage.setItem('demoMode', 'true')
    
    // Small delay for better UX
    setTimeout(() => {
      setLoading(false)
      router.push('/demo/dashboard')
    }, 1500)
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 flex items-center justify-center">
      <div className="text-center space-y-6 p-8">
        <div className="relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-24 w-24 rounded-full bg-gradient-to-r from-purple-400 to-indigo-400 opacity-20 animate-ping"></div>
          </div>
          <div className="relative bg-gradient-to-r from-purple-600 to-indigo-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
            {loading ? (
              <Loader2 className="h-10 w-10 text-white animate-spin" />
            ) : (
              <Play className="h-10 w-10 text-white" />
            )}
          </div>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">
            Launching Demo Mode
          </h1>
          <p className="text-gray-600">
            Setting up your test environment...
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
          <p className="text-sm text-blue-800">
            <span className="font-semibold">Demo Mode:</span> Explore all features without creating an account. 
            Some features like saving progress may be limited.
          </p>
        </div>
      </div>
    </div>
  )
}

