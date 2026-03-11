import { createServerSupabaseClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'

interface Props {
  params: { id: string }
}

export default async function AnalysisPage({ params }: Props) {
  const supabase = await createServerSupabaseClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: analysis } = await supabase
    .from('analyses')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!analysis) redirect('/dashboard')

  const report = analysis.report_json

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-blue-600">LandingLens</h1>
          <a href="/dashboard" className="text-sm text-gray-500 hover:text-gray-700">
            ← Volver
          </a>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-10">

        {/* URL analizada */}
        <div className="mb-8">
          <p className="text-sm text-gray-500 mb-1">Análisis de</p>
          <h2 className="text-xl font-bold text-gray-900 break-all">{analysis.url}</h2>
        </div>

        {/* Scores generales */}
        <div className="grid grid-cols-2 gap-4 mb-8 sm:grid-cols-4">
          {[
            { label: 'Score General', value: analysis.overall_score, color: 'blue' },
            { label: 'UX', value: analysis.ux_score, color: 'purple' },
            { label: 'Copy', value: analysis.copy_score, color: 'green' },
            { label: 'Conversión', value: analysis.conversion_score, color: 'orange' },
          ].map((item) => (
            <div key={item.label} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
              <p className="text-3xl font-bold text-gray-900">{item.value}</p>
              <p className="text-sm text-gray-500 mt-1">{item.label}</p>
            </div>
          ))}
        </div>

        {/* Resumen */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
          <h3 className="font-semibold text-blue-900 mb-2">Diagnóstico General</h3>
          <p className="text-blue-800 text-sm leading-relaxed">{report.summary}</p>
        </div>

        {/* Análisis UX */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Análisis UX</h3>
            <span className="text-2xl font-bold text-purple-600">{analysis.ux_score}/100</span>
          </div>

          {/* Fortalezas */}
          {report.ux_analysis.strengths.length > 0 && (
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Puntos positivos</p>
              <ul className="space-y-1">
                {report.ux_analysis.strengths.map((strength: string, i: number) => (
                  <li key={i} className="text-sm text-gray-600 flex gap-2">
                    <span className="text-green-500 mt-0.5">✓</span>
                    {strength}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Problemas */}
          {report.ux_analysis.issues.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Problemas detectados</p>
              <div className="space-y-3">
                {report.ux_analysis.issues.map((issue: any, i: number) => (
                  <div key={i} className="border border-gray-100 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        issue.severity === 'high' ? 'bg-red-100 text-red-700' :
                        issue.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {issue.severity === 'high' ? 'Alto' : issue.severity === 'medium' ? 'Medio' : 'Bajo'}
                      </span>
                      <p className="text-sm font-medium text-gray-800">{issue.title}</p>
                    </div>
                    <p className="text-sm text-gray-500">{issue.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Análisis Copy */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Análisis de Copy</h3>
            <span className="text-2xl font-bold text-green-600">{analysis.copy_score}/100</span>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1">Calidad del Headline</p>
              <p className="text-sm font-semibold text-gray-800 capitalize">{report.copy_analysis.headline_rating}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1">Claridad de Propuesta de Valor</p>
              <p className="text-sm font-semibold text-gray-800">{report.copy_analysis.value_proposition_clarity}/100</p>
            </div>
          </div>

          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-1">Efectividad del CTA</p>
            <p className="text-sm text-gray-600">{report.copy_analysis.cta_effectiveness}</p>
          </div>

          {report.copy_analysis.issues.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Problemas de copy</p>
              <div className="space-y-3">
                {report.copy_analysis.issues.map((issue: any, i: number) => (
                  <div key={i} className="border border-gray-100 rounded-lg p-3">
                    <p className="text-xs text-gray-400 uppercase mb-1">{issue.type}</p>
                    <p className="text-sm text-gray-600 mb-2">{issue.description}</p>
                    <div className="bg-green-50 rounded p-2">
                      <p className="text-xs font-medium text-green-700">Sugerencia</p>
                      <p className="text-sm text-green-800">{issue.suggestion}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Recomendaciones de Conversión */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Recomendaciones de Conversión</h3>
            <span className="text-2xl font-bold text-orange-600">{analysis.conversion_score}/100</span>
          </div>

          {report.conversion_recommendations.quick_wins.length > 0 && (
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Quick wins</p>
              <div className="space-y-3">
                {report.conversion_recommendations.quick_wins.map((win: any, i: number) => (
                  <div key={i} className="border border-gray-100 rounded-lg p-3">
                    <p className="text-sm text-gray-800 mb-2">{win.action}</p>
                    <div className="flex gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        win.impact === 'high' ? 'bg-green-100 text-green-700' :
                        win.impact === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        Impacto: {win.impact === 'high' ? 'Alto' : win.impact === 'medium' ? 'Medio' : 'Bajo'}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        win.effort === 'low' ? 'bg-green-100 text-green-700' :
                        win.effort === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        Esfuerzo: {win.effort === 'low' ? 'Bajo' : win.effort === 'medium' ? 'Medio' : 'Alto'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {report.conversion_recommendations.ab_test_ideas.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Ideas para A/B Testing</p>
              <ul className="space-y-1">
                {report.conversion_recommendations.ab_test_ideas.map((idea: string, i: number) => (
                  <li key={i} className="text-sm text-gray-600 flex gap-2">
                    <span className="text-blue-400 mt-0.5">→</span>
                    {idea}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

      </main>
    </div>
  )
}