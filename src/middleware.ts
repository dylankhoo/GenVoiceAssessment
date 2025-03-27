import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAuthRoute =
    request.nextUrl.pathname === "/login" ||
    request.nextUrl.pathname === "/register";
  const isAdminRoute = request.nextUrl.pathname === "/admin";
  const isDefaultRoute = request.nextUrl.pathname === "/";

  if (isAuthRoute) {
    if (user) {
      return NextResponse.redirect(new URL("/view", request.url));
    }
  } else {
    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  if (isAdminRoute) {
    if (user) {
      const allowedEmails = ["admin@mailinator.com"]; //add admin accounts here
      if (!user.email || !allowedEmails.includes(user.email)) {
        return NextResponse.redirect(new URL("/view", request.url));
      }
    }
  }

  if (isDefaultRoute) {
    if (user) {
      return NextResponse.redirect(new URL("/view", request.url));
    } else {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return supabaseResponse;
}
