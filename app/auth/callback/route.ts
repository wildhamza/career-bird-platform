import { getSupabaseServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { getUserRole } from "@/lib/auth/get-user-role"

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
        const role = await getUserRole(data.user.id)
        if (role === 'professor') {
          return NextResponse.redirect(`${origin}/professor/dashboard`)
        } else if (role === 'admin') {
          return NextResponse.redirect(`${origin}/admin/dashboard`)
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
