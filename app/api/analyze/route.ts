import { createServerSupabaseClient } from '@/lib/supabase-server'
import { scrapeLandingPage } from '@/lib/scraper'
import { analyzeLandingPage } from '@/lib/analyzer'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {

    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      )
    }
    const body = await request.json()
    const { url } = body

    if (!url || !url.startsWith('https://')) {
      return NextResponse.json(
        { error: 'URL inválida. Debe comenzar con https://' },
        { status: 400 }
      )
    }

    const { data: analysis, error: dbError } = await supabase
      .from('analyses')
      .insert({
        user_id: user.id,
        url,
        status: 'processing'
      })
      .select()
      .single()

    if (dbError) {
      return NextResponse.json(
        { error: 'Error al crear el análisis' },
        { status: 500 }
      )
    }
    const scrapeData = await scrapeLandingPage(url)

    const reportJson = await analyzeLandingPage(scrapeData)

    const overallScore = Math.round(
      (reportJson.ux_analysis.score +
        reportJson.copy_analysis.score +
        reportJson.conversion_recommendations.score) / 3
    )
    const { data: updatedAnalysis } = await supabase
      .from('analyses')
      .update({
        status: 'completed',
        ux_score: reportJson.ux_analysis.score,
        copy_score: reportJson.copy_analysis.score,
        conversion_score: reportJson.conversion_recommendations.score,
        overall_score: overallScore,
        report_json: reportJson,
        screenshot_url: scrapeData.screenshotBase64
      })
      .eq('id', analysis.id)
      .select()
      .single()

    return NextResponse.json({
      analysis_id: analysis.id,
      status: 'completed',
      overall_score: overallScore,
      report: reportJson
    })

  } catch (error) {
    console.error('Error en /api/analyze:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}