import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define protected and auth routes
const protectedRoutes = ['/dashboard', '/server-control']
const authRoutes = ['/login', '/signup']
const publicRoutes = ['/', '/about', '/pricing', '/contact', '/terms', '/privacy-policy', '/refund-policy']

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Get token from cookies

    // Check if the current path is a protected route
    const isProtectedRoute = protectedRoutes.some(route =>
        pathname.startsWith(route)
    )

    // Check if the current path is an auth route
    const isAuthRoute = authRoutes.some(route =>
        pathname.startsWith(route)
    )

    // Check if the current path is a public route
    const isPublicRoute = publicRoutes.some(route =>
        pathname === route || pathname.startsWith(route)
    )

    // For public routes, always allow access
    if (isPublicRoute) {
        return NextResponse.next()
    }

    // For auth routes, allow access (client-side AuthGuard will handle redirects)
    if (isAuthRoute) {
        return NextResponse.next()
    }

    // For protected routes, let the client-side AuthGuard handle authentication
    // This prevents middleware from blocking access when cookies are cleared
    if (isProtectedRoute) {
        return NextResponse.next()
    }

    // For all other routes, continue normally
    return NextResponse.next()
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder files
         */
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
