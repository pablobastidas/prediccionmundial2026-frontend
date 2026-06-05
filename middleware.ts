import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PROTECTED_ROUTES = [
  '/home',
  '/predictions',
  '/simulator',
  '/leagues',
  '/me',
  '/create-league',
  '/explore-leagues',
  '/join-league'
];

const AUTH_ROUTES = ['/login', '/register'];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('sb-access-token')?.value;
  const { pathname } = request.nextUrl;

  // 1. Check if route is protected
  const isProtected = PROTECTED_ROUTES.some(route => pathname.startsWith(route));
  
  if (isProtected && !token) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Redirect logged-in users away from login/register to dashboard
  const isAuthRoute = AUTH_ROUTES.some(route => pathname === route);
  
  if (isAuthRoute && token) {
    const homeUrl = new URL('/home', request.url);
    return NextResponse.redirect(homeUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/home/:path*',
    '/predictions/:path*',
    '/simulator/:path*',
    '/leagues/:path*',
    '/me/:path*',
    '/create-league/:path*',
    '/explore-leagues/:path*',
    '/join-league/:path*',
    '/login',
    '/register'
  ],
};
