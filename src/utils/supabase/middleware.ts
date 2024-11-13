import URLS, { PRIVATEURLS } from '@/constants/urls';
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export const updateSession = async (request: NextRequest) => {
  let supabaseResponse = NextResponse.next({
    request,
  });
  const requestPathname = request.nextUrl.pathname;

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options));
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isPrivate = PRIVATEURLS.includes(requestPathname as URLS);
  if (!user && isPrivate) {
    const url = request.nextUrl.clone();
    url.pathname = URLS.logIn;
    return NextResponse.redirect(url);
  }
  if (user?.id && requestPathname === '/') {
    const url = request.nextUrl.clone();
    url.pathname = URLS.groupList;
    return NextResponse.redirect(url);
  }

  // const isAdminRoute = requestPathname.startsWith('/admin');
  // const isAdminUser = user?.id === process.env.ADMIN_USER_ID;

  // if (isAdminRoute && !isAdminUser) {
  //   return NextResponse.redirect(new URL('/', request.url));
  // }

  return supabaseResponse;
};
