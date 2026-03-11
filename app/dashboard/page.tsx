'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function DashboardPage() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  async function handleAnalyze() {
    if (!url) {
      setError('Ingresa una URL')
      return
    }

    if (!url.startsWith('https://')) {
      setError('La URL debe comenzar con https://')
      return
    }

    setLoading(true)
    setError('')

    const { data: { session } } = await supabase.auth.getSession()

    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session?.access_token}`
      },
      body: JSON.stringify({ url })
    })

    const data = await response.json()

    if (!response.ok) {
      setError(data.error || 'Ocurrió un error')
      setLoading(false)
      return
    }

    router.push(`/dashboard/analysis/${data.analysis_id}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-blue-600">LandingLens</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Analiza tu landing page
          </h2>
          <p className="text-gray-500 text-lg">
            Pega la URL y recibe un diagnóstico completo en segundos
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            URL de tu landing page
          </label>
          <div className="flex gap-3">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://tu-landing.com"
              className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Analizando...' : 'Analizar'}
            </button>
          </div>

          {error && (
            <p className="text-red-500 text-sm mt-2">{error}</p>
          )}

          {loading && (
            <p className="text-gray-400 text-xs mt-2">
              Esto puede tomar hasta 30 segundos...
            </p>
          )}
        </div>
      </main>
    </div>
  )
}