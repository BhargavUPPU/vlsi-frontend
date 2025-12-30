import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Check if the request is for admin routes
  // if (pathname.startsWith('/admin')) {
  //   // Get token from cookies
  //   const token = request.cookies.get('accessToken')?.value;
    
  //   // If no token and not on login page, redirect to login
  //   if (!token && !pathname.startsWith('/admin/login')) {
  //     const loginUrl = new URL('/login', request.url);
  //     return NextResponse.redirect(loginUrl);
  //   }
    
  //   // If token exists and on login page, redirect to admin dashboard
  //   if (token && pathname === '/admin/login') {
  //     const dashboardUrl = new URL('/admin/projects', request.url);
  //     return NextResponse.redirect(dashboardUrl);
  //   }
  // }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*']
};