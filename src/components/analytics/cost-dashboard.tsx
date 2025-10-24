"use client"

import { useState, useEffect } from 'react'
import { 
  DollarSign, 
  TrendingUp, 
  Zap, 
  Database,
  CheckCircle
} from 'lucide-react'

interface CostAnalytics {
  usage: {
    daily: { tokens: number, cost: number, requests: number }
    monthly: { tokens: number, cost: number, requests: number }
    total: { tokens: number, cost: number, requests: number }
    averagePerRequest: { tokens: number, cost: number }
  }
  cache: {
    size: number
    keys: string[]
    estimatedSavings: number
  }
  limits: {
    daily: { limit: number, used: number, percentage: number }
    monthly: { limit: number, used: number, percentage: number }
  }
  recommendations: string[]
}

export default function CostAnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<CostAnalytics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/analytics/cost')
      const data = await response.json()
      
      if (data.success) {
        setAnalytics(data.data)
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="text-center text-red-600">
        Failed to load cost analytics
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Cost Analytics</h2>
        <button
          onClick={fetchAnalytics}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Refresh
        </button>
      </div>

      {/* Cost Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <div className="flex items-center space-x-3">
            <DollarSign className="h-8 w-8 text-green-600" />
            <div>
              <p className="text-sm text-slate-600">Daily Cost</p>
              <p className="text-2xl font-bold text-slate-900">
                ${analytics.usage.daily.cost.toFixed(4)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <div className="flex items-center space-x-3">
            <TrendingUp className="h-8 w-8 text-blue-600" />
            <div>
              <p className="text-sm text-slate-600">Monthly Cost</p>
              <p className="text-2xl font-bold text-slate-900">
                ${analytics.usage.monthly.cost.toFixed(4)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <div className="flex items-center space-x-3">
            <Zap className="h-8 w-8 text-yellow-600" />
            <div>
              <p className="text-sm text-slate-600">Daily Tokens</p>
              <p className="text-2xl font-bold text-slate-900">
                {analytics.usage.daily.tokens.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <div className="flex items-center space-x-3">
            <Database className="h-8 w-8 text-purple-600" />
            <div>
              <p className="text-sm text-slate-600">Cache Savings</p>
              <p className="text-2xl font-bold text-slate-900">
                ${analytics.cache.estimatedSavings.toFixed(4)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Usage Limits */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Daily Usage</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Tokens Used</span>
              <span>{analytics.usage.daily.tokens.toLocaleString()} / {analytics.limits.daily.limit.toLocaleString()}</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  analytics.limits.daily.percentage > 80 ? 'bg-red-500' : 
                  analytics.limits.daily.percentage > 60 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${Math.min(analytics.limits.daily.percentage, 100)}%` }}
              />
            </div>
            <p className="text-sm text-slate-600">
              {analytics.limits.daily.percentage.toFixed(1)}% of daily limit
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Monthly Usage</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Tokens Used</span>
              <span>{analytics.usage.monthly.tokens.toLocaleString()} / {analytics.limits.monthly.limit.toLocaleString()}</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  analytics.limits.monthly.percentage > 80 ? 'bg-red-500' : 
                  analytics.limits.monthly.percentage > 60 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${Math.min(analytics.limits.monthly.percentage, 100)}%` }}
              />
            </div>
            <p className="text-sm text-slate-600">
              {analytics.limits.monthly.percentage.toFixed(1)}% of monthly limit
            </p>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Optimization Recommendations</h3>
        <div className="space-y-2">
          {analytics.recommendations.map((recommendation, index) => (
            <div key={index} className="flex items-start space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-slate-700">{recommendation}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Cache Stats */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Cache Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-slate-900">{analytics.cache.size}</p>
            <p className="text-sm text-slate-600">Cached Items</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-slate-900">{analytics.usage.daily.requests}</p>
            <p className="text-sm text-slate-600">Daily Requests</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-slate-900">
              {analytics.usage.averagePerRequest.tokens.toFixed(0)}
            </p>
            <p className="text-sm text-slate-600">Avg Tokens/Request</p>
          </div>
        </div>
      </div>
    </div>
  )
}

