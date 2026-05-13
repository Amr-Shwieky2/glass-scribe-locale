import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_FILE = /\.(.*)$/;

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip public files and API routes
  if (
    PUBLIC_FILE.test(pathname) ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/')
  ) {
    return NextResponse.next();
  }

  // Redirect root to default language (Hebrew)
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/he', request.url));
  }

  // Gallery redirect from old site
  if (pathname.match(/^\/[^/]+\/gallery$/)) {
    const lang = pathname.split('/')[1];
    return NextResponse.redirect(new URL(`/${lang}/projects`, request.url));
  }

  // Admin routing: redirect `/admin` to `/he/admin`
  if (pathname === '/admin') {
    return NextResponse.redirect(new URL('/he/admin', request.url));
  }

  return NextResponse.next();
}

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
};
