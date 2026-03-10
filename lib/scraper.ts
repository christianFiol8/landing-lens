import puppeteer from 'puppeteer'

export interface ScrapeResult{
  title: string
  metaDescription: string
  h1: string
  h2s: string[]
  ctas: string[]
  hasForm: boolean
  formFieldsCount: number
  hasNav: boolean
  hasTestimonials: boolean
  hasPricing: boolean
  hasTrustBadges: boolean
  hasHeroMedia: boolean
  screenshotBase64: string
  htmlSample: string
}

export async function scrapeLandingPage(url: string): Promise<ScrapeResult> {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })

  try {
    const page = await browser.newPage()

    // Simular pantalla de escritorio
    await page.setViewport({ width: 1280, height: 800 })

    // Timeout de 15 segundos
    await page.goto(url, {
      waitUntil: 'networkidle2',
      timeout: 15000
    })

    // Extraer información de la página
    const data = await page.evaluate(() => {
      // Título y meta
      const title = document.title || ''
      const metaDesc = document.querySelector('meta[name="description"]')
      const metaDescription = metaDesc ? metaDesc.getAttribute('content') || '' : ''

      // Headlines
      const h1El = document.querySelector('h1')
      const h1 = h1El ? h1El.innerText.trim() : ''

      const h2Els = Array.from(document.querySelectorAll('h2, h3'))
      const h2s = h2Els.slice(0, 5).map(el => (el as HTMLElement).innerText.trim())

      // CTAs — buscar botones y links destacados
      const ctaEls = Array.from(document.querySelectorAll('button, a[class*="btn"], a[class*="cta"], a[class*="button"]'))
      const ctas = ctaEls.slice(0, 5).map(el => (el as HTMLElement).innerText.trim()).filter(t => t.length > 0)

      // Estructura de la página
      const hasForm = document.querySelectorAll('form').length > 0
      const formFieldsCount = document.querySelectorAll('input, textarea, select').length
      const hasNav = document.querySelectorAll('nav, header').length > 0
      const hasHeroMedia = document.querySelectorAll('video, [class*="hero"] img').length > 0

      // Social proof y confianza
      const pageText = document.body.innerText.toLowerCase()
      const hasTestimonials = pageText.includes('testimon') ||
        pageText.includes('review') ||
        pageText.includes('client') ||
        document.querySelectorAll('[class*="testimonial"], [class*="review"]').length > 0

      const hasTrustBadges = document.querySelectorAll('[class*="trust"], [class*="badge"], [class*="logo"]').length > 0

      const hasPricing = pageText.includes('precio') ||
        pageText.includes('price') ||
        pageText.includes('plan') ||
        pageText.includes('$') ||
        document.querySelectorAll('[class*="pricing"], [class*="plan"]').length > 0

      // Muestra del HTML — primeros 8000 caracteres del body
      const htmlSample = document.body.innerHTML.slice(0, 8000)

      return {
        title,
        metaDescription,
        h1,
        h2s,
        ctas,
        hasForm,
        formFieldsCount,
        hasNav,
        hasTestimonials,
        hasPricing,
        hasTrustBadges,
        hasHeroMedia,
        htmlSample
      }
    })

    // Tomar screenshot
    const screenshotBuffer = await page.screenshot({ fullPage: false })
    const screenshotBase64 = Buffer.from(screenshotBuffer).toString('base64')

    return { ...data, screenshotBase64 }

  } finally {
    // Siempre cerrar el browser, aunque haya un error
    await browser.close()
  }
}