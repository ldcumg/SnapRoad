import { updateSession } from './utils/supabase/middleware';
import { createClient } from './utils/supabase/server';
import { NextResponse, type NextRequest } from 'next/server';

export const middleware = async (request: NextRequest) => {
  // const serverClient = createClient();
  // const {
  //   data: { user },
  // } = await serverClient.auth.getUser();

  // console.log('middleware user :>> ', user);

  // const isLogin = !!user;

  // if (isLogin && (request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/signup'))) {
  //   return NextResponse.redirect(new URL('/', request.url));
  // }

  return await updateSession(request);
};

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
