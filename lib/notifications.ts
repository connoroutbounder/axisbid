import { Resend } from 'resend'
import { prisma } from './prisma'

const FROM_EMAIL = 'noreply@axisbid.com'
const SUPPORT_EMAIL = 'support@axisbid.com'

function getResend() {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not set — skipping email')
    return null
  }
  return new Resend(process.env.RESEND_API_KEY)
}

export async function sendWelcomeEmail(email: string, name: string): Promise<void> {
  const resend = getResend()
  if (!resend) return
  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: 'Welcome to AxisBid - Your CNC Machining Marketplace',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1>Welcome to AxisBid, ${name}!</h1>
        <p>We're excited to have you join our CNC machining marketplace.</p>
        <p>AxisBid connects customers with precision machine shops for fast, accurate quotes on custom parts.</p>
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2>Getting Started:</h2>
          <ul>
            <li>Upload your STEP files to get instant AI-powered cost estimates</li>
            <li>Receive bids from qualified machine shops worldwide</li>
            <li>Compare quotes and select the best fit for your needs</li>
            <li>Track your manufacturing from quote to delivery</li>
          </ul>
        </div>
        <p>Questions? Contact us at ${SUPPORT_EMAIL}</p>
        <p>Happy manufacturing!</p>
        <p>The AxisBid Team</p>
      </div>
    `,
  })
}

export async function sendNewBidNotification(
  jobId: string,
  customerEmail: string,
  shopName: string,
  bidPrice: number
): Promise<void> {
  const job = await prisma.job.findUnique({
    where: { id: jobId },
  })

  if (!job) return

  const resend = getResend()
  if (!resend) return
  await resend.emails.send({
    from: FROM_EMAIL,
    to: customerEmail,
    subject: `New Bid Received: ${shopName} quoted $${bidPrice.toFixed(2)}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1>New Bid Received!</h1>
        <p><strong>${shopName}</strong> has submitted a bid for your job:</p>
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Job:</strong> ${job.title || 'Untitled'}</p>
          <p><strong>Material:</strong> ${job.material}</p>
          <p><strong>Quantity:</strong> ${job.quantity}</p>
          <p style="font-size: 18px; color: #2563eb;"><strong>Bid Price: $${bidPrice.toFixed(2)}</strong></p>
        </div>
        <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/jobs/${jobId}" style="background: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">View All Bids</a></p>
        <p>Questions? Contact us at ${SUPPORT_EMAIL}</p>
      </div>
    `,
  })
}

export async function sendBidAcceptedNotification(
  jobId: string,
  shopEmail: string,
  _shopName: string,
  totalPrice: number
): Promise<void> {
  const job = await prisma.job.findUnique({
    where: { id: jobId },
  })

  if (!job) return

  const resend = getResend()
  if (!resend) return
  await resend.emails.send({
    from: FROM_EMAIL,
    to: shopEmail,
    subject: `Bid Accepted! New Job for ${job.material} Part`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1>Congratulations! Your Bid Was Accepted</h1>
        <p>Your bid has been selected for manufacturing.</p>
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Job Title:</strong> ${job.title || 'Custom Part'}</p>
          <p><strong>Material:</strong> ${job.material}</p>
          <p><strong>Quantity:</strong> ${job.quantity}</p>
          <p><strong>Tolerance:</strong> ${job.tolerance}</p>
          <p><strong>Needed By:</strong> ${job.neededBy?.toLocaleDateString() || 'Not specified'}</p>
          <p style="font-size: 18px; color: #16a34a;"><strong>Total Price: $${totalPrice.toFixed(2)}</strong></p>
        </div>
        <p>Your shop payout (80%): <strong>$${(totalPrice * 0.8).toFixed(2)}</strong></p>
        <p>Next steps:</p>
        <ol>
          <li>Review the full job specifications</li>
          <li>Download the CAD file</li>
          <li>Confirm production schedule</li>
          <li>Begin manufacturing</li>
        </ol>
        <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/shop/jobs/${jobId}" style="background: #16a34a; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">View Job Details</a></p>
        <p>Questions? Contact us at ${SUPPORT_EMAIL}</p>
      </div>
    `,
  })
}

export async function sendJobStatusUpdate(
  jobId: string,
  customerEmail: string,
  status: string,
  details?: string
): Promise<void> {
  const job = await prisma.job.findUnique({
    where: { id: jobId },
  })

  if (!job) return

  const statusMessages: Record<string, string> = {
    QUOTING: 'Your part has been analyzed. AI estimates are ready.',
    BIDDING: 'Bids are now open from qualified machine shops.',
    AWARDED: 'A shop has been selected for your job.',
    IN_PRODUCTION: 'Your part is now being manufactured.',
    SHIPPED: 'Your part has been shipped!',
    DELIVERED: 'Your part has been delivered.',
    COMPLETED: 'Job completed and closed.',
  }

  const resend = getResend()
  if (!resend) return
  await resend.emails.send({
    from: FROM_EMAIL,
    to: customerEmail,
    subject: `Job Update: ${statusMessages[status] || status}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1>Job Status Update</h1>
        <p>${statusMessages[status] || `Your job status has changed to ${status}`}</p>
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Job:</strong> ${job.title || 'Untitled'}</p>
          <p><strong>Status:</strong> ${status}</p>
          ${details ? `<p><strong>Details:</strong> ${details}</p>` : ''}
        </div>
        <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/jobs/${jobId}" style="background: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">View Job</a></p>
        <p>Questions? Contact us at ${SUPPORT_EMAIL}</p>
      </div>
    `,
  })
}

export async function sendPaymentConfirmation(
  jobId: string,
  customerEmail: string,
  totalPrice: number,
  shopName: string
): Promise<void> {
  const job = await prisma.job.findUnique({
    where: { id: jobId },
  })

  if (!job) return

  const resend = getResend()
  if (!resend) return
  await resend.emails.send({
    from: FROM_EMAIL,
    to: customerEmail,
    subject: 'Payment Confirmed - Job Awarded to ' + shopName,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1>Payment Confirmed</h1>
        <p>Your payment has been processed successfully. Your manufacturing job has been awarded.</p>
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Job:</strong> ${job.title || 'Custom Part'}</p>
          <p><strong>Machine Shop:</strong> ${shopName}</p>
          <p style="font-size: 18px; color: #16a34a;"><strong>Amount Paid: $${totalPrice.toFixed(2)}</strong></p>
        </div>
        <p>You'll receive updates as your part moves through production. Track progress anytime in your dashboard.</p>
        <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/jobs/${jobId}" style="background: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Track Your Job</a></p>
        <p>Questions? Contact us at ${SUPPORT_EMAIL}</p>
      </div>
    `,
  })
}

export async function sendReviewRequest(
  jobId: string,
  customerEmail: string,
  shopName: string
): Promise<void> {
  const job = await prisma.job.findUnique({
    where: { id: jobId },
  })

  if (!job) return

  const resend = getResend()
  if (!resend) return
  await resend.emails.send({
    from: FROM_EMAIL,
    to: customerEmail,
    subject: 'Please Review Your Experience with ' + shopName,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1>Your Job is Complete - Please Review</h1>
        <p>Your manufacturing job has been completed and delivered. We'd love to hear about your experience with ${shopName}!</p>
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Job:</strong> ${job.title || 'Custom Part'}</p>
          <p><strong>Machine Shop:</strong> ${shopName}</p>
          <p>Your feedback helps us maintain quality and helps other customers make informed decisions.</p>
        </div>
        <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/jobs/${jobId}/review" style="background: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Leave a Review</a></p>
        <p>Thank you for using AxisBid!</p>
        <p>Questions? Contact us at ${SUPPORT_EMAIL}</p>
      </div>
    `,
  })
}

export async function sendShopWelcomeEmail(email: string, name: string): Promise<void> {
  const resend = getResend()
  if (!resend) return
  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: 'Welcome to AxisBid - Start Bidding on Jobs',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1>Welcome to AxisBid, ${name}!</h1>
        <p>Your machine shop profile has been created successfully.</p>
        <p>You can now start bidding on manufacturing jobs from customers worldwide.</p>
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2>Next Steps:</h2>
          <ol>
            <li>Complete your shop profile with machines and capabilities</li>
            <li>Set up Stripe Connect for payment processing</li>
            <li>Browse available jobs in your dashboard</li>
            <li>Submit competitive bids and win work</li>
          </ol>
        </div>
        <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/shop/setup" style="background: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Complete Profile Setup</a></p>
        <p>Questions? Contact us at ${SUPPORT_EMAIL}</p>
        <p>Happy bidding!</p>
        <p>The AxisBid Team</p>
      </div>
    `,
  })
}
