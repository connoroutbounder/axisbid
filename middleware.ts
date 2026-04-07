import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  const { pathname } = request.nextUrl

  // Public routes - always allow
  const publicRoutes = ['/auth', '/api/auth', '/api/upload/presigned']

  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route))

  if (isPublicRoute) {
    return NextResponse.next()
  }

  // Protected routes - require authentication
  const protectedRoutes = ['/dashboard', '/shop', '/profile']
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/auth/signin', request.url))
  }

  // Shop-only routes
  if (pathname.startsWith('/shop') && token?.role !== 'SHOP_OWNER' && token?.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // API route protection
  if (pathname.startsWith('/api')) {
    // POST requests to certain endpoints require auth
    if (request.method === 'POST' && pathname.match(/\/api\/(jobs|shops|reviews|payments)/)) {
      if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
    }

    // Shop-specific API endpoints
    if (pathname.includes('/shop') && request.method !== 'GET') {
      if (token?.role !== 'SHOP_OWNER' && token?.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/shop/:path*',
    '/profile/:path*',
    '/api/jobs/:path*',
    '/api/shops/:path*',
    '/api/bids/:path*',
    '/api/reviews/:path*',
    '/api/payments/:path*',
    '/api/stripe/:path*',
  ],
}
