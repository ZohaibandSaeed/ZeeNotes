import { NextResponse } from 'next/server';

export default function proxy(request) {
  const passwordCookie = request.cookies.get('auth_token')?.value;
  const url = request.nextUrl.clone();
  
  // Exclude login page and static assets
  if (url.pathname.startsWith('/login') || url.pathname.startsWith('/_next') || url.pathname.startsWith('/favicon.ico')) {
    return NextResponse.next();
  }

  // Check if password cookie exists
  // The actual validation is done during login, and since it's an httpOnly cookie, 
  // its presence indicates successful auth.
  if (!passwordCookie) {
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
};
