import Anthropic from "@anthropic-ai/sdk";
import { ScrapeResult } from "./scraper";

const anthropic = new Anthropic({
  apiKey : process.env.ANTHROPIC_API_KEY
})

export interface AnalysisResult{
ux_analysis: {
    score: number
    issues: {
      severity: 'high' | 'medium' | 'low'
      title: string
      description: string
    }[]
    strengths: string[]
  }
  copy_analysis: {
    score: number
    headline_rating: 'poor' | 'fair' | 'good' | 'excellent'
    cta_effectiveness: string
    issues: {
      type: string
      description: string
      suggestion: string
    }[]
    value_proposition_clarity: number
  }
  conversion_recommendations: {
    score: number
    quick_wins: {
      action: string
      impact: 'high' | 'medium' | 'low'
      effort: 'low' | 'medium' | 'high'
    }[]
    ab_test_ideas: string[]
  }
  summary: string
}

export async function analyzeLandingPage(scrapeData: ScrapeResult): Promise<AnalysisResult> {
  const prompt = `
Eres un experto en CRO (Conversion Rate Optimization) y UX con 10 años de experiencia auditando landing pages de startups.

Analiza esta landing page con la siguiente información extraída:

TÍTULO: ${scrapeData.title}
META DESCRIPCIÓN: ${scrapeData.metaDescription}
HEADLINE PRINCIPAL (H1): ${scrapeData.h1}
HEADLINES SECUNDARIOS: ${scrapeData.h2s.join(' | ')}
CALL TO ACTIONS DETECTADOS: ${scrapeData.ctas.join(' | ')}

ESTRUCTURA:
- Tiene formulario: ${scrapeData.hasForm ? 'Sí' : 'No'} ${scrapeData.hasForm ? `(${scrapeData.formFieldsCount} campos)` : ''}
- Tiene navegación: ${scrapeData.hasNav ? 'Sí' : 'No'}
- Tiene media en hero: ${scrapeData.hasHeroMedia ? 'Sí' : 'No'}
- Tiene testimonios: ${scrapeData.hasTestimonials ? 'Sí' : 'No'}
- Tiene sección de precios: ${scrapeData.hasPricing ? 'Sí' : 'No'}
- Tiene trust badges: ${scrapeData.hasTrustBadges ? 'Sí' : 'No'}

MUESTRA DEL HTML:
${scrapeData.htmlSample}

`
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2000,
    messages: [
      { role: 'user', content: prompt }
    ]
  })

  // Extraer el texto de la respuesta
  const content = response.content[0]
  if (content.type !== 'text') {
    throw new Error('Respuesta inesperada de Claude')
  }

  // Parsear el JSON
  const result = JSON.parse(content.text) as AnalysisResult
  return result
}