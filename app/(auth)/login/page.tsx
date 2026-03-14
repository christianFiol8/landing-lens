'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleLogin() {
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('Email o contraseña incorrectos')
      setLoading(false)
      return
    }

    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#FAFAF0' }}>

      {/* Panel izquierdo */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12" style={{ backgroundColor: '#F26522' }}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
            <span className="font-bold text-sm" style={{ color: '#F26522' }}>✦</span>
          </div>
          <span className="font-bold text-white text-lg">TuProducto</span>
        </div>

        <div>
          <p className="text-white text-3xl font-bold leading-snug mb-6">
            "Cambié 3 cosas que me sugirieron y mi conversión subió de 2% a 5.8% en una semana."
          </p>
          <p className="text-orange-100 font-medium">María González</p>
          <p className="text-orange-200 text-sm">Fundadora de TaskFlow</p>
        </div>

        <div className="flex gap-6">
          {[
            { value: '500+', label: 'Fundadores' },
            { value: '2,400+', label: 'Análisis hechos' },
            { value: '4.9', label: 'Valoración media' },
          ].map(stat => (
            <div key={stat.label}>
              <p className="text-white text-2xl font-bold">{stat.value}</p>
              <p className="text-orange-200 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Panel derecho */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-md">

          {/* Logo mobile */}
          <div className="flex items-center gap-2 mb-10 lg:hidden">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#F26522' }}>
              <span className="text-white font-bold text-sm">✦</span>
            </div>
            <span className="font-bold text-gray-900 text-lg">TuProducto</span>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">Bienvenido de vuelta</h1>
          <p className="text-gray-500 mb-8">Ingresa tus datos para continuar</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:border-transparent"
                style={{ '--tw-ring-color': '#F26522' } as any}
                onFocus={e => e.target.style.borderColor = '#F26522'}
                onBlur={e => e.target.style.borderColor = '#D1D5DB'}
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none"
                onFocus={e => e.target.style.borderColor = '#F26522'}
                onBlur={e => e.target.style.borderColor = '#D1D5DB'}
                placeholder="••••••••"
              />
            </div>

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full text-white py-3 rounded-xl text-sm font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
              style={{ backgroundColor: '#F26522' }}
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar sesión →'}
            </button>
          </div>

          <p className="text-center text-sm text-gray-500 mt-6">
            ¿No tienes cuenta?{' '}
            <Link href="/signup" className="font-semibold hover:opacity-80" style={{ color: '#F26522' }}>
              Regístrate gratis
            </Link>
          </p>

          <p className="text-center text-xs text-gray-400 mt-8">
            Al continuar aceptas nuestros{' '}
            <span className="underline cursor-pointer">Términos de servicio</span>
            {' '}y{' '}
            <span className="underline cursor-pointer">Política de privacidad</span>
          </p>

        </div>
      </div>
    </div>
  )
}