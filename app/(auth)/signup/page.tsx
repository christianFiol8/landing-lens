'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleSignup() {
    setLoading(true)
    setError('')

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      setLoading(false)
      return
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
      },
    })

    if (error) {
      setError(error.message)
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

        <div className="space-y-6">
          {[
            { icon: '👁', title: 'Análisis UX completo', desc: 'Detectamos problemas de navegación y jerarquía visual que están perdiendo usuarios' },
            { icon: '💬', title: 'Errores de Copy', desc: 'Mensajes confusos, CTAs débiles y propuestas de valor que no convencen' },
            { icon: '📈', title: 'Quick wins priorizados', desc: 'Acciones concretas ordenadas por impacto. Sin teoría, solo qué cambiar hoy' },
          ].map(feature => (
            <div key={feature.title} className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-white bg-opacity-20 flex items-center justify-center text-lg flex-shrink-0">
                {feature.icon}
              </div>
              <div>
                <p className="text-white font-semibold text-sm">{feature.title}</p>
                <p className="text-orange-200 text-sm mt-0.5">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white bg-opacity-10 rounded-2xl p-5">
          <p className="text-white text-sm leading-relaxed">
            "En 30 segundos me dijeron exactamente qué estaba fallando. Apliqué los cambios ese mismo día."
          </p>
          <p className="text-orange-200 text-sm mt-3 font-medium">— Carlos Mendoza, Founder de Shipfast</p>
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

          <div className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-3 py-1.5 mb-6">
            <span className="text-xs font-medium" style={{ color: '#10B981' }}>✓</span>
            <span className="text-xs text-gray-600">Primer análisis gratis — sin tarjeta</span>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">Crea tu cuenta</h1>
          <p className="text-gray-500 mb-8">Empieza a optimizar tu landing page hoy</p>

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
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none"
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
                placeholder="Mínimo 6 caracteres"
              />
            </div>

            <button
              onClick={handleSignup}
              disabled={loading}
              className="w-full text-white py-3 rounded-xl text-sm font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
              style={{ backgroundColor: '#F26522' }}
            >
              {loading ? 'Creando cuenta...' : 'Crear cuenta gratis →'}
            </button>
          </div>

          <p className="text-center text-sm text-gray-500 mt-6">
            ¿Ya tienes cuenta?{' '}
            <Link href="/login" className="font-semibold hover:opacity-80" style={{ color: '#F26522' }}>
              Inicia sesión
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