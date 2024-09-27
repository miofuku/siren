import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Get the pathname of the request (e.g. /, /protected)
  const path = request.nextUrl.pathname

  // Define an array of protected paths that require authentication
  const protectedPaths = ['/profile', '/settings', '/api/posts']

  // Check if the path is a protected path
  const isProtectedPath = protectedPaths.some(protectedPath => 
    path.startsWith(protectedPath)
  )

  // Get the token from the cookies
  const token = request.cookies.get('next-auth.session-token')

  // If it's a protected path and there's no token, redirect to the login page
  if (isProtectedPath && !token) {
    return NextResponse.redirect(new URL('/auth/signin', request.url))
  }

  // If it's not a protected path or there is a token, continue the request
  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}