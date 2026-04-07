import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-06-20' as any,
})

export const PLATFORM_FEE_PERCENT = parseInt(process.env.PLATFORM_FEE_PERCENT || '20')
export const SHOP_PAYOUT_PERCENT = 100 - PLATFORM_FEE_PERCENT

export async function createConnectedAccount(shopData: {
  email: string
  name: string
  url?: string
}): Promise<string> {
  const account = await stripe.accounts.create({
    type: 'standard',
    email: shopData.email,
    business_profile: {
      name: shopData.name,
      url: shopData.url || undefined,
    },
  })

  return account.id
}

export async function createAccountLink(accountId: string, refreshUrl: string): Promise<string> {
  const link = await stripe.accountLinks.create({
    account: accountId,
    type: 'account_onboarding',
    refresh_url: refreshUrl,
    return_url: refreshUrl,
  })

  return link.url
}

export async function createPaymentIntent(
  amountInCents: number,
  stripeAccountId: string,
  metadata: Record<string, string>
): Promise<Stripe.PaymentIntent> {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amountInCents,
    currency: 'usd',
    application_fee_amount: Math.round((amountInCents * PLATFORM_FEE_PERCENT) / 100),
    transfer_data: {
      destination: stripeAccountId,
    },
    metadata,
  })

  return paymentIntent
}

export async function confirmPayment(paymentIntentId: string): Promise<Stripe.PaymentIntent> {
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
  return paymentIntent
}

export async function refundPayment(paymentIntentId: string): Promise<Stripe.Refund> {
  const refund = await stripe.refunds.create({
    payment_intent: paymentIntentId,
  })

  return refund
}

export async function getAccountBalance(
  stripeAccountId: string
): Promise<Stripe.Balance> {
  const balance = await stripe.balance.retrieve(
    {},
    {
      stripeAccount: stripeAccountId,
    }
  )

  return balance
}

export async function transferToShop(
  amountInCents: number,
  stripeAccountId: string,
  metadata?: Record<string, string>
): Promise<Stripe.Transfer> {
  const transfer = await stripe.transfers.create({
    amount: amountInCents,
    currency: 'usd',
    destination: stripeAccountId,
    metadata: metadata || {},
  })

  return transfer
}

export function parseWebhookEvent(body: string, signature: string): Stripe.Event {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || ''
  const event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  return event
}

export function isPaymentSucceeded(event: Stripe.Event): event is Stripe.Event & {
  data: { object: Stripe.PaymentIntent }
} {
  return event.type === 'payment_intent.succeeded'
}

export function isPaymentFailed(event: Stripe.Event): event is Stripe.Event & {
  data: { object: Stripe.PaymentIntent }
} {
  return event.type === 'payment_intent.payment_failed'
}

export function isChargeSucceeded(event: Stripe.Event): event is Stripe.Event & {
  data: { object: Stripe.Charge }
} {
  return event.type === 'charge.succeeded'
}
