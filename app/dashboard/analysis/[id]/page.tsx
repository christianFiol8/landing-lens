import { createServerSupabaseClient } from "@/lib/supabase-server"; 
import { redirect } from "next/navigation";

interface Props{
  params: Promise<{id:string}>
}

export default async function AnalysisPage({params} : Props){
  const {id} = await params
  const supabase = await createServerSupabaseClient()
  const {data: {user} } = await supabase.auth.getUser()
  if(!user)redirect('/login')
  const { data: analysis } = await supabase
    .from('analyses')
    .select('*')
    .eq('id', id)
    .single()

  if (!analysis) redirect('/dashboard')

  const report = analysis.report_json
  return(
    <div className="min-h-screen" style={{ backgroundColor: '#FAFAF0' }}>

      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#F26522' }}>
              <span className="text-white font-bold text-xs">✦</span>
            </div>
            <h1 className="text-lg font-bold text-gray-900">TuProducto</h1>
          </div>
          <a
            href="/dashboard"
            className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            ← Volver al dashboard
          </a>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-10">

        {/* URL + fecha */}
        <div className="mb-8">
          <p className="text-sm text-gray-400 mb-1">Análisis de</p>
          <h2 className="text-xl font-bold text-gray-900 break-all">{analysis.url}</h2>
          <p className="text-xs text-gray-400 mt-1">
            {new Date(analysis.created_at).toLocaleDateString('es-MX', {
              year: 'numeric', month: 'long', day: 'numeric',
              hour: '2-digit', minute: '2-digit'
            })}
          </p>
        </div>

        {/* Scores */}
        <div className="grid grid-cols-2 gap-4 mb-8 sm:grid-cols-4">
          {[
            { label: 'Score General', value: analysis.overall_score, color: '#F26522' },
            { label: 'UX', value: analysis.ux_score, color: '#8B5CF6' },
            { label: 'Copy', value: analysis.copy_score, color: '#10B981' },
            { label: 'Conversión', value: analysis.conversion_score, color: '#F59E0B' },
          ].map((item) => (
            <div key={item.label} className="bg-white rounded-2xl border border-gray-200 p-4 text-center">
              <p className="text-3xl font-bold" style={{ color: item.color }}>{item.value}</p>
              <p className="text-xs text-gray-400 mt-1">{item.label}</p>
            </div>
          ))}
        </div>

        {/* Resumen */}
        <div className="rounded-2xl p-6 mb-6" style={{ backgroundColor: '#FFF7F0', border: '1px solid #FED7AA' }}>
          <h3 className="font-semibold mb-2" style={{ color: '#C2410C' }}>Diagnóstico General</h3>
          <p className="text-sm leading-relaxed" style={{ color: '#7C2D12' }}>{report.summary}</p>
        </div>

        {/* Análisis UX */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg" style={{ backgroundColor: '#FEF3C7' }}>
                👁
              </div>
              <h3 className="font-semibold text-gray-900">Análisis UX</h3>
            </div>
            <span className="text-2xl font-bold" style={{ color: '#8B5CF6' }}>{analysis.ux_score}/100</span>
          </div>

          {report.ux_analysis.strengths.length > 0 && (
            <div className="mb-5">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Puntos positivos</p>
              <ul className="space-y-2">
                {report.ux_analysis.strengths.map((strength: string, i: number) => (
                  <li key={i} className="flex gap-2 text-sm text-gray-600">
                    <span className="mt-0.5 flex-shrink-0" style={{ color: '#10B981' }}>✓</span>
                    {strength}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {report.ux_analysis.issues.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Problemas detectados</p>
              <div className="space-y-3">
                {report.ux_analysis.issues.map((issue: any, i: number) => (
                  <div key={i} className="rounded-xl p-4" style={{ backgroundColor: '#F9FAFB' }}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        issue.severity === 'high' ? 'bg-red-100 text-red-700' :
                        issue.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-500'
                      }`}>
                        {issue.severity === 'high' ? '● Alto' : issue.severity === 'medium' ? '● Medio' : '● Bajo'}
                      </span>
                      <p className="text-sm font-medium text-gray-800">{issue.title}</p>
                    </div>
                    <p className="text-sm text-gray-500 ml-0">{issue.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Análisis Copy */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg" style={{ backgroundColor: '#DBEAFE' }}>
                💬
              </div>
              <h3 className="font-semibold text-gray-900">Análisis de Copy</h3>
            </div>
            <span className="text-2xl font-bold" style={{ color: '#10B981' }}>{analysis.copy_score}/100</span>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="rounded-xl p-3" style={{ backgroundColor: '#F9FAFB' }}>
              <p className="text-xs text-gray-400 mb-1">Calidad del Headline</p>
              <p className="text-sm font-semibold text-gray-800 capitalize">{report.copy_analysis.headline_rating}</p>
            </div>
            <div className="rounded-xl p-3" style={{ backgroundColor: '#F9FAFB' }}>
              <p className="text-xs text-gray-400 mb-1">Claridad de Propuesta de Valor</p>
              <p className="text-sm font-semibold text-gray-800">{report.copy_analysis.value_proposition_clarity}/100</p>
            </div>
          </div>

          <div className="mb-5">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Efectividad del CTA</p>
            <p className="text-sm text-gray-600">{report.copy_analysis.cta_effectiveness}</p>
          </div>

          {report.copy_analysis.issues.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Problemas de copy</p>
              <div className="space-y-3">
                {report.copy_analysis.issues.map((issue: any, i: number) => (
                  <div key={i} className="rounded-xl p-4" style={{ backgroundColor: '#F9FAFB' }}>
                    <p className="text-xs text-gray-400 uppercase mb-1">{issue.type}</p>
                    <p className="text-sm text-gray-600 mb-3">{issue.description}</p>
                    <div className="rounded-lg p-3" style={{ backgroundColor: '#F0FDF4' }}>
                      <p className="text-xs font-semibold mb-1" style={{ color: '#065F46' }}>Sugerencia</p>
                      <p className="text-sm" style={{ color: '#065F46' }}>{issue.suggestion}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Recomendaciones de Conversión */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg" style={{ backgroundColor: '#D1FAE5' }}>
                📈
              </div>
              <h3 className="font-semibold text-gray-900">Recomendaciones de Conversión</h3>
            </div>
            <span className="text-2xl font-bold" style={{ color: '#F59E0B' }}>{analysis.conversion_score}/100</span>
          </div>

          {report.conversion_recommendations.quick_wins.length > 0 && (
            <div className="mb-5">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Quick wins</p>
              <div className="space-y-3">
                {report.conversion_recommendations.quick_wins.map((win: any, i: number) => (
                  <div key={i} className="rounded-xl p-4" style={{ backgroundColor: '#F9FAFB' }}>
                    <p className="text-sm text-gray-800 mb-3">{win.action}</p>
                    <div className="flex gap-2">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        win.impact === 'high' ? 'bg-green-100 text-green-700' :
                        win.impact === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-500'
                      }`}>
                        Impacto {win.impact === 'high' ? 'Alto' : win.impact === 'medium' ? 'Medio' : 'Bajo'}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        win.effort === 'low' ? 'bg-green-100 text-green-700' :
                        win.effort === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        Esfuerzo {win.effort === 'low' ? 'Bajo' : win.effort === 'medium' ? 'Medio' : 'Alto'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {report.conversion_recommendations.ab_test_ideas.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Ideas para A/B Testing</p>
              <ul className="space-y-2">
                {report.conversion_recommendations.ab_test_ideas.map((idea: string, i: number) => (
                  <li key={i} className="flex gap-2 text-sm text-gray-600">
                    <span className="flex-shrink-0 mt-0.5" style={{ color: '#F26522' }}>→</span>
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