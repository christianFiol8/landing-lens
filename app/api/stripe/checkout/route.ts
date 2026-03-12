import { createServerSupabaseClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
export async function POST(request: Request) {
  try {
    // 1. Verificar que el usuario está autenticado
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      )
    }

    // 2. Obtener el plan elegido
    const body = await request.json()
    const { plan } = body

    if (!plan || !['one_time', 'monthly'].includes(plan)) {
      return NextResponse.json(
        { error: 'Plan inválido' },
        { status: 400 }
      )
    }

    // 3. Determinar el Price ID según el plan
    const priceId = plan === 'one_time'
      ? process.env.STRIPE_PRICE_ONE_TIME_ID!
      : process.env.STRIPE_PRICE_MONTHLY_ID!

    // 4. Crear o recuperar el customer de Stripe
    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single()

    let customerId = profile?.stripe_customer_id

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { supabase_user_id: user.id }
      })
      customerId = customer.id

      await supabase
        .from('profiles')
        .update({ stripe_customer_id: customerId })
        .eq('id', user.id)
    }

    // 5. Crear la sesión de checkout
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: plan === 'one_time' ? 'payment' : 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment=cancelled`,
      metadata: {
        user_id: user.id,
        plan
      }
    })

    return NextResponse.json({ checkout_url: session.url })

  } catch (error) {
    console.error('Error en /api/stripe/checkout:', error)
    return NextResponse.json(
      { error: 'Error al crear el checkout' },
      { status: 500 }
    )
  }
}