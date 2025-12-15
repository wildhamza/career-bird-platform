import { getSupabaseServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const type = requestUrl.searchParams.get("type")
  const origin = requestUrl.origin

  if (code) {
    const supabase = await getSupabaseServerClient()
    const { error, data } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      // If there's an error, redirect to login with error message
      return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error.message)}`)
    }

    // If this is an email confirmation (signup), redirect to confirmation success page
    if (type === "signup") {
      return NextResponse.redirect(`${origin}/confirm-email`)
    }

    // Check user role and redirect accordingly
    if (data?.user) {
      try {
        // First, try to get ALL roles from user_roles table (user might have multiple)
        const { data: allRoles, error: roleError } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", data.user.id)

        // Check if user has professor role
        const hasProfessorRole = allRoles?.some(r => r.role === "professor")

        if (hasProfessorRole) {
          return NextResponse.redirect(`${origin}/professor/dashboard`)
        }

        // Fallback: Check if user has a department (professor indicator)
        const { data: profile } = await supabase
          .from("profiles")
          .select("department")
          .eq("user_id", data.user.id)
          .maybeSingle()

        // If profile has department, user is a professor
        if (profile?.department) {
          return NextResponse.redirect(`${origin}/professor/dashboard`)
        }
      } catch (roleError) {
        // If role check fails, default to student dashboard
        console.error("Error checking user role:", roleError)
      }
    }
  }

  // Default redirect to student dashboard
  return NextResponse.redirect(`${origin}/dashboard`)
}
