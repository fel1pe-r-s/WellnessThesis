import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyJwt } from '@/lib/jwt';

export async function proxy(request: NextRequest) {
  const token = request.cookies.get('admin_token')?.value;

  // Protect /admin routes (except /admin/login)
  if (request.nextUrl.pathname.startsWith('/admin') && !request.nextUrl.pathname.startsWith('/admin/login')) {
    console.log('Proxy: Checking /admin route', request.nextUrl.pathname);
    console.log('Proxy: Token present?', !!token);
    
    if (!token) {
      console.log('Proxy: No token, redirecting to login');
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    const decoded = await verifyJwt(token);
    console.log('Proxy: Decoded token?', !!decoded);
    
    if (!decoded || (decoded as any).role !== 'admin') {
      console.log('Proxy: Invalid token or role, redirecting to login');
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    console.log('Proxy: Auth successful');
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
