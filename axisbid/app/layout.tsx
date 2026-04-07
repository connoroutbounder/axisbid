import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AxisBid - CNC Machining Bids in Hours',
  description: 'Get competitive CNC machining bids in hours, not days. Upload your STEP file, get an AI-powered estimate, and receive bids from vetted local machine shops.',
  keywords: 'CNC machining, bids, quotes, manufacturing, precision',
  authors: [{ name: 'AxisBid' }],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-brand-light-bg">{children}</body>
    </html>
  )
}
