import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Public routes that don't require authentication
  const publicRoutes = ['/auth/login', '/auth/change-password', '/'];
  
  // Check if it's a public route
  const isPublicRoute = publicRoutes.some(route => pathname === route || pathname.startsWith(route + '/'));
  
  // Allow public routes and static files
  if (isPublicRoute || pathname.startsWith('/_next') || pathname.startsWith('/api')) {
    return NextResponse.next();
  }
  
  // For admin routes, we'll handle auth in client-side middleware
  // This is because we need to check localStorage which isn't available in server middleware
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};