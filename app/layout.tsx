import type { Metadata, Viewport } from 'next'
import { Toaster } from 'sonner'
import { AuthSessionProvider } from '@/components/providers/session-provider'
import './globals.css'

export const metadata: Metadata = {
  title: 'AxisBid - CNC Machining Bid Marketplace',
  description:
    'Get competitive CNC bids in hours, not days. Upload your STEP file and receive quotes from vetted local machine shops.',
  keywords: [
    'CNC',
    'machining',
    'bids',
    'quotes',
    'manufacturing',
    'marketplace',
    'machine shop',
  ],
  authors: [{ name: 'AxisBid' }],
  icons: { icon: '/favicon.ico' },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className="bg-brand-light">
        <AuthSessionProvider>
          {children}
          <Toaster position="top-right" />
        </AuthSessionProvider>
      </body>
    </html>
  )
}
