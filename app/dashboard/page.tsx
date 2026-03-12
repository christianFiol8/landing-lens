import { createServerSupabaseClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import LogoutButton from './LogoutButton'
import AnalyzeForm from './AnalyzeForm'

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: analyses } = await supabase
    .from('analyses')
    .select('id, url, overall_score, ux_score, copy_score, conversion_score, status, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(10)

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAFAF0' }}>
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#F26522' }}>
              <span className="text-white font-bold text-xs">✦</span>
            </div>
            <h1 className="text-lg font-bold text-gray-900">TuProducto</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">{user.email}</span>
            <LogoutButton />
          </div>
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

        <AnalyzeForm />

        <div className="mt-10">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Análisis recientes
          </h3>

          {!analyses || analyses.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
              <p className="text-gray-400 text-sm">
                Aún no tienes análisis. ¡Empieza pegando una URL arriba!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {analyses.map((analysis) => (
                <Link
                  key={analysis.id}
                  href={`/dashboard/analysis/${analysis.id}`}
                  className="block bg-white rounded-xl border border-gray-200 p-5 hover:border-orange-300 hover:shadow-sm transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {analysis.url}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(analysis.created_at).toLocaleDateString('es-MX', {
                          year: 'numeric', month: 'long', day: 'numeric',
                          hour: '2-digit', minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 ml-4">
                      {analysis.status === 'completed' ? (
                        <>
                          <div className="text-center">
                            <p className="text-xs text-gray-400">UX</p>
                            <p className="text-sm font-semibold text-purple-600">{analysis.ux_score}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-gray-400">Copy</p>
                            <p className="text-sm font-semibold text-green-600">{analysis.copy_score}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-gray-400">Conv.</p>
                            <p className="text-sm font-semibold text-green-600">{analysis.conversion_score}</p>
                          </div>
                          <div className="text-center bg-orange-50 rounded-lg px-3 py-2">
                            <p className="text-xs text-gray-400">Score</p>
                            <p className="text-lg font-bold" style={{ color: '#F26522' }}>{analysis.overall_score}</p>
                          </div>
                        </>
                      ) : (
                        <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                          {analysis.status === 'processing' ? 'Procesando...' : 'Error'}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}