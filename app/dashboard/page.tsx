import { createServerSupabaseClient } from "@/lib/supabase-server";
import {redirect} from 'next/navigation'

export default async function DashboardPage(){
  const supabase = await createServerSupabaseClient()
  const {data:{user}} = await supabase.auth.getUser()
  if(!user){
    redirect('/login')
  }

  return(
     <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-blue-600">LandingLens</h1>
          <span className="text-sm text-gray-500">{user.email}</span>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Analiza tu landing page
          </h2>
          <p className="text-gray-500 text-lg">
            Pega la URL y recibe un diagnóstico completo en segundos
          </p>
        </div>

        {/* Input de URL */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            URL de tu landing page
          </label>
          <div className="flex gap-3">
            <input
              type="url"
              placeholder="https://tu-landing.com"
              className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
              Analizar
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            El análisis toma aproximadamente 30 segundos
          </p>
        </div>

        {/* Historial vacío */}
        <div className="mt-10">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Análisis recientes
          </h3>
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
            <p className="text-gray-400 text-sm">
              Aún no tienes análisis. ¡Empieza pegando una URL arriba!
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}















