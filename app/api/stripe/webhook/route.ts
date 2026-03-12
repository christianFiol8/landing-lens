import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

// Cliente de Supabase con service role para bypasear RLS
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')!

  let event: Stripe.Event

  // Verificar que el webhook viene de Stripe
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error) {
    console.error('Webhook signature inválida:', error)
    return NextResponse.json(
      { error: 'Webhook inválido' },
      { status: 400 }
    )
  }

  try {
    switch (event.type) {

      // Pago único completado
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.user_id
        const plan = session.metadata?.plan

        if (!userId) break

        if (plan === 'one_time') {
          // Agregar 1 crédito al usuario
          const { data: profile } = await supabase
            .from('profiles')
            .select('credits')
            .eq('id', userId)
            .single()

          await supabase
            .from('profiles')
            .update({
              credits: (profile?.credits || 0) + 1,
              plan: 'pay_per_use'
            })
            .eq('id', userId)
        }

        if (plan === 'monthly') {
          await supabase
            .from('profiles')
            .update({
              plan: 'monthly',
              subscription_status: 'active'
            })
            .eq('id', userId)
        }

        // Registrar el pago
        await supabase.from('payments').insert({
          user_id: userId,
          stripe_payment_intent_id: session.payment_intent as string,
          amount: session.amount_total || 0,
          currency: session.currency || 'usd',
          type: plan === 'one_time' ? 'one_time' : 'subscription',
          status: 'succeeded'
        })

        break
      }

      // Suscripción cancelada
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single()

        if (profile) {
          await supabase
            .from('profiles')
            .update({
              plan: 'free',
              subscription_status: 'inactive'
            })
            .eq('id', profile.id)
        }

        break
      }

      // Pago de suscripción fallido
      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        const customerId = invoice.customer as string

        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single()

        if (profile) {
          await supabase
            .from('profiles')
            .update({ subscription_status: 'past_due' })
            .eq('id', profile.id)
        }

        break
      }
    }

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('Error procesando webhook:', error)
    return NextResponse.json(
      { error: 'Error procesando evento' },
      { status: 500 }
    )
  }
}