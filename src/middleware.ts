import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const PUBLIC_ROUTES = ["/", "/auth/login", "/auth/signup", "/auth/callback"];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // If Supabase isn't configured, only protect dashboard routes
  if (!supabaseUrl || !supabaseAnonKey) {
    const isDashboard = pathname.startsWith("/dashboard");
    if (isDashboard) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
    return response;
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) =>
          request.cookies.set(name, value)
        );
        response = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isDashboard = pathname.startsWith("/dashboard");
  const isAuthPage = pathname.startsWith("/auth");
  const isPublic = PUBLIC_ROUTES.includes(pathname);

  // If unauthenticated and hitting a protected dashboard route -> login
  if (isDashboard && !user) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // If authenticated and hitting auth routes -> send to dashboard (role-based if available)
  if (isAuthPage && user) {
    const role =
      (user.user_metadata as { role?: string } | null)?.role ||
      (user.app_metadata as { role?: string } | null)?.role;
    const destination =
      role === "professor" ? "/dashboard/professor" : "/dashboard/student";
    return NextResponse.redirect(new URL(destination, request.url));
  }

  // Public routes stay accessible
  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

