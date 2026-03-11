import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAFAF0' }}>

      {/* Header */}
      <header className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#F26522' }}>
            <span className="text-white font-bold text-sm">✦</span>
          </div>
          <span className="font-bold text-gray-900 text-lg">UXRay</span>
        </div>
        <Link
          href="/signup"
          className="border border-gray-900 text-gray-900 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-900 hover:text-white transition-colors"
        >
          Probar gratis
        </Link>
      </header>

      {/* Hero */}
      <section className="max-w-3xl mx-auto px-6 pt-20 pb-16 text-center">

        {/* Social proof pill */}
        <div className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2 mb-8">
          <div className="flex -space-x-1">
            {['#4F46E5', '#10B981', '#8B5CF6'].map((color, i) => (
              <div
                key={i}
                className="w-6 h-6 rounded-full border-2 border-white"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">Ya lo usan 500+ fundadores</span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl font-bold text-gray-900 leading-tight mb-4">
          ¿Por qué tu landing
          <br />
          <span style={{ color: '#F26522' }}>no está convirtiendo?</span>
        </h1>

        <p className="text-lg text-gray-500 mb-8 leading-relaxed">
          Pega tu URL y en 30 segundos te decimos exactamente qué está fallando.
          <br />
          Sin rodeos, sin jerga. Solo feedback que puedes aplicar ya.
        </p>

        {/* CTAs */}
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/signup"
            className="flex items-center gap-2 text-white px-6 py-3 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity"
            style={{ backgroundColor: '#F26522' }}
          >
            Analizar mi landing →
          </Link>
          <div className="flex items-center gap-1 text-sm" style={{ color: '#10B981' }}>
            <span>✓</span>
            <span>Primer análisis gratis</span>
          </div>
        </div>

        {/* Product preview */}
        <div className="mt-14 relative">
          <div className="bg-gray-900 rounded-2xl overflow-hidden shadow-2xl">
            <div className="bg-gray-800 px-4 py-3 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
              <div className="flex-1 bg-gray-700 rounded-md mx-4 px-3 py-1">
                <span className="text-gray-400 text-xs">https://tu-landing.com</span>
              </div>
            </div>
            <div className="bg-gray-100 h-48 flex items-center justify-center">
              <p className="text-gray-400 text-sm">Vista previa de tu landing</p>
            </div>
          </div>

          {/* Score flotante */}
          <div className="absolute top-4 left-4 bg-white rounded-xl shadow-lg p-3">
            <p className="text-xs text-gray-400 mb-1">Score de conversión</p>
            <p className="text-2xl font-bold" style={{ color: '#F26522' }}>62/100</p>
          </div>
        </div>
      </section>

      {/* Testimonio */}
      <section className="max-w-2xl mx-auto px-6 py-16">
        <div className="bg-white rounded-2xl border border-gray-200 p-8 flex gap-6 items-start">
          <div className="w-14 h-14 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
            <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400" />
          </div>
          <div className="flex-1">
            <p className="text-gray-700 mb-3 leading-relaxed">
              "Cambié 3 cosas que me sugirieron y mi tasa de conversión subió de 2% a 5.8% en una semana. Increíble."
            </p>
            <p className="font-semibold text-gray-900 text-sm">María González</p>
            <p className="text-gray-400 text-sm">Fundadora de TaskFlow</p>
          </div>
          <div className="flex gap-1 flex-shrink-0">
            {[1,2,3,4,5].map(i => (
              <span key={i} style={{ color: '#F26522' }}>★</span>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <span className="text-sm px-3 py-1 rounded-full font-medium mb-4 inline-block" style={{ backgroundColor: '#FEF3C7', color: '#92400E' }}>
            Análisis completo
          </span>
          <h2 className="text-4xl font-bold text-gray-900 mb-3">Qué vas a obtener</h2>
          <p className="text-gray-500">No es magia, es análisis objetivo basado en las mejores prácticas de conversión</p>
        </div>

        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {[
            { icon: '👁', label: 'Análisis UX', desc: 'Problemas de navegación, jerarquía visual y usabilidad que están perdiendo usuarios', bg: '#FEF3C7', color: '#92400E' },
            { icon: '💬', label: 'Errores de Copy', desc: 'Mensajes confusos, propuestas de valor débiles y CTAs que nadie entiende', bg: '#DBEAFE', color: '#1E40AF' },
            { icon: '📈', label: 'Recomendaciones', desc: 'Acciones concretas priorizadas por impacto. No teoría, solo qué cambiar', bg: '#D1FAE5', color: '#065F46' },
            { icon: '🖱', label: 'Heatmap Simulado', desc: 'Predicción de dónde miran tus usuarios y qué están ignorando completamente', bg: '#EDE9FE', color: '#5B21B6' },
          ].map((feature) => (
            <div key={feature.label} className="bg-white rounded-2xl border border-gray-100 p-6">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-xl mb-4"
                style={{ backgroundColor: feature.bg }}
              >
                {feature.icon}
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{feature.label}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <span className="text-sm px-3 py-1 rounded-full font-medium mb-4 inline-block" style={{ backgroundColor: '#D1FAE5', color: '#065F46' }}>
            Precios transparentes
          </span>
          <h2 className="text-4xl font-bold text-gray-900 mb-3">Sin suscripciones raras</h2>
          <p className="text-gray-500">Paga por lo que necesitas</p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">

          {/* Plan básico */}
          <div className="bg-white rounded-2xl border border-gray-200 p-8">
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-3">Pago único</p>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Un análisis</h3>
            <div className="flex items-end gap-1 mb-4">
              <span className="text-5xl font-bold text-gray-900">$9</span>
              <span className="text-gray-400 mb-2">USD</span>
            </div>
            <p className="text-gray-500 text-sm mb-6">Perfecto para validar una landing específica</p>
            <ul className="space-y-3 mb-8">
              {['Análisis completo de tu landing', 'Reporte descargable en PDF', 'Válido 48 horas'].map(item => (
                <li key={item} className="flex items-center gap-2 text-sm text-gray-600">
                  <span style={{ color: '#10B981' }}>✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/signup"
              className="block text-center border border-gray-900 text-gray-900 py-3 rounded-xl font-semibold text-sm hover:bg-gray-900 hover:text-white transition-colors"
            >
              Probar ahora
            </Link>
          </div>

          {/* Plan popular */}
          <div className="relative rounded-2xl border-2 p-8" style={{ borderColor: '#F26522', backgroundColor: '#FFFBF5' }}>
            <div
              className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-white text-sm font-semibold"
              style={{ backgroundColor: '#F26522' }}
            >
              Popular
            </div>
            <p className="text-xs uppercase tracking-wide mb-3" style={{ color: '#F26522' }}>Suscripción</p>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Mensual</h3>
            <div className="flex items-end gap-1 mb-4">
              <span className="text-5xl font-bold text-gray-900">$19</span>
              <span className="text-gray-400 mb-2">/mes</span>
            </div>
            <p className="text-gray-500 text-sm mb-6">Para founders iterando constantemente</p>
            <ul className="space-y-3 mb-8">
              {['Análisis ilimitados', 'Historial de cambios', 'Comparación antes/después', 'Cancela cuando quieras'].map(item => (
                <li key={item} className="flex items-center gap-2 text-sm text-gray-600">
                  <span style={{ color: '#10B981' }}>✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/signup"
              className="block text-center text-white py-3 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity"
              style={{ backgroundColor: '#F26522' }}
            >
              Empezar ahora
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ backgroundColor: '#F26522' }}>
              <span className="text-white font-bold text-xs">✦</span>
            </div>
            <span className="font-bold text-gray-900 text-sm">TuProducto</span>
          </div>
          <p className="text-gray-400 text-sm">© 2025. Todos los derechos reservados.</p>
        </div>
      </footer>

    </div>
  )
}