import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
        },
      },
    },
  )

  // Refresh session if expired
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Protect authenticated routes
  if (!user && request.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Redirect authenticated users away from auth pages
  if (user && (request.nextUrl.pathname === "/login" || request.nextUrl.pathname === "/signup")) {
    // First, try to get ALL roles from user_roles table (user might have multiple)
    const { data: allRoles, error: roleError } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)

    // Check if user has professor role
    const hasProfessorRole = allRoles?.some(r => r.role === "professor")

    if (hasProfessorRole) {
      return NextResponse.redirect(new URL("/professor/dashboard", request.url))
    }

    // Fallback: Check if user has a department (professor indicator)
    const { data: profile } = await supabase
      .from("profiles")
      .select("department")
      .eq("user_id", user.id)
      .maybeSingle()

    // If profile has department, user is a professor
    if (profile?.department) {
      return NextResponse.redirect(new URL("/professor/dashboard", request.url))
    }
    
    // Default to student dashboard
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return supabaseResponse
}
