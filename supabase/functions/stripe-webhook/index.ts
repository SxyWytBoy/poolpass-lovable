
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const stripe = new (await import('https://esm.sh/stripe@12.0.0')).Stripe(
  Deno.env.get('STRIPE_SECRET_KEY') || '',
  { apiVersion: '2023-10-16' }
)

const supabaseClient = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

serve(async (req) => {
  const signature = req.headers.get('Stripe-Signature')!
  const body = await req.text()
  
  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      Deno.env.get('STRIPE_WEBHOOK_SECRET') || ''
    )

    console.log(`Processing webhook event: ${event.type}`)

    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object
        
        // Update payment status
        const { error: paymentError } = await supabaseClient
          .from('payments')
          .update({ 
            status: 'succeeded',
            processed_at: new Date().toISOString()
          })
          .eq('stripe_payment_intent_id', paymentIntent.id)

        if (paymentError) {
          console.error('Error updating payment:', paymentError)
          throw paymentError
        }

        // Update booking status to confirmed
        const { data: payment } = await supabaseClient
          .from('payments')
          .select('booking_id, host_payout_amount')
          .eq('stripe_payment_intent_id', paymentIntent.id)
          .single()

        if (payment) {
          await supabaseClient
            .from('bookings')
            .update({ status: 'confirmed' })
            .eq('id', payment.booking_id)

          // Get host info for payout
          const { data: booking } = await supabaseClient
            .from('bookings')
            .select('pools(host_id)')
            .eq('id', payment.booking_id)
            .single()

          if (booking?.pools?.host_id && payment.host_payout_amount) {
            // Create host payout record
            await supabaseClient
              .from('host_payouts')
              .insert({
                host_id: booking.pools.host_id,
                payment_id: payment.booking_id,
                amount: payment.host_payout_amount,
                status: 'pending'
              })
          }
        }
        break

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object
        
        await supabaseClient
          .from('payments')
          .update({ status: 'failed' })
          .eq('stripe_payment_intent_id', failedPayment.id)

        await supabaseClient
          .from('bookings')
          .update({ status: 'cancelled' })
          .eq('id', failedPayment.metadata.booking_id)
        break
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error('Webhook error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
