import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createMiddlewareClient({ req: request, res: response });
  const { data: { session } } = await supabase.auth.getSession();

  const isAuthPage = request.nextUrl.pathname.startsWith('/login');
  const isDashboardPage = request.nextUrl.pathname.startsWith('/dashboard') ||
                          request.nextUrl.pathname.startsWith('/calls') ||
                          request.nextUrl.pathname.startsWith('/analytics') ||
                          request.nextUrl.pathname.startsWith('/integrations') ||
                          request.nextUrl.pathname.startsWith('/learning') ||
                          request.nextUrl.pathname.startsWith('/sop-generator') ||
                          request.nextUrl.pathname.startsWith('/knowledge') ||
                          request.nextUrl.pathname.startsWith('/settings') ||
                          request.nextUrl.pathname.startsWith('/admin') ||
                          request.nextUrl.pathname.startsWith('/reports') ||
                          request.nextUrl.pathname.startsWith('/live-calls');

  if (!session && isDashboardPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (session && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return response;
}
