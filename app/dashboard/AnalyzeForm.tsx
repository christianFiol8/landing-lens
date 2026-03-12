'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function AnalyzeForm() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPaywall, setShowPaywall] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleAnalyze() {
    console.log('handleAnalyze ejecutado', url)
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
    setShowPaywall(false)

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

    if (response.status === 402) {
      setShowPaywall(true)
      setLoading(false)
      return
    }

    if (!response.ok) {
      setError(data.error || 'Ocurrió un error')
      setLoading(false)
      return
    }

    router.push(`/dashboard/analysis/${data.analysis_id}`)
  }

  async function handleCheckout(plan: 'one_time' | 'monthly') {
    const { data: { session } } = await supabase.auth.getSession()

    const response = await fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session?.access_token}`
      },
      body: JSON.stringify({ plan })
    })

    const data = await response.json()

    if (data.checkout_url) {
      window.location.href = data.checkout_url
    }
  }

  return (
    <div>
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          URL de tu landing page
        </label>
        <div className="flex gap-3">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://tu-landing.com"
            className="flex-1 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="text-white px-6 py-3 rounded-xl text-sm font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
            style={{ backgroundColor: '#F26522' }}
          >
            {loading ? 'Analizando...' : 'Analizar →'}
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

      {/* Paywall */}
      {showPaywall && (
        <div className="mt-4 bg-white rounded-2xl border-2 p-6" style={{ borderColor: '#F26522' }}>
          <h3 className="font-bold text-gray-900 text-lg mb-1">
            Necesitas créditos para analizar
          </h3>
          <p className="text-gray-500 text-sm mb-6">
            Elige el plan que mejor se adapte a ti
          </p>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="border border-gray-200 rounded-xl p-5">
              <p className="text-xs text-gray-400 uppercase mb-2">Pago único</p>
              <p className="text-3xl font-bold text-gray-900 mb-1">$9</p>
              <p className="text-sm text-gray-500 mb-4">1 análisis completo</p>
              <button
                onClick={() => handleCheckout('one_time')}
                className="w-full border border-gray-900 text-gray-900 py-2 rounded-xl text-sm font-semibold hover:bg-gray-900 hover:text-white transition-colors"
              >
                Comprar análisis
              </button>
            </div>

            <div className="rounded-xl p-5" style={{ backgroundColor: '#FFF7F0', border: '2px solid #F26522' }}>
              <p className="text-xs uppercase mb-2 font-semibold" style={{ color: '#F26522' }}>Popular</p>
              <p className="text-3xl font-bold text-gray-900 mb-1">$19<span className="text-sm text-gray-400 font-normal">/mes</span></p>
              <p className="text-sm text-gray-500 mb-4">Análisis ilimitados</p>
              <button
                onClick={() => handleCheckout('monthly')}
                className="w-full text-white py-2 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
                style={{ backgroundColor: '#F26522' }}
              >
                Suscribirse
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}