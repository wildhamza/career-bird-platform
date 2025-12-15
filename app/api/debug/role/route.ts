import { getSupabaseServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const supabase = await getSupabaseServerClient()
    
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    // Get all roles
    const { data: allRoles, error: roleError } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)

    // Get profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("department, user_id")
      .eq("user_id", user.id)
      .maybeSingle()

    return NextResponse.json({
      userId: user.id,
      email: user.email,
      roles: allRoles || [],
      roleError: roleError?.message,
      profile: profile ? {
        hasDepartment: !!profile.department,
        department: profile.department
      } : null,
      profileError: profileError?.message,
      isProfessor: allRoles?.some(r => r.role === "professor") || !!profile?.department
    })
  } catch (error: any) {
    return NextResponse.json({ 
      error: error.message 
    }, { status: 500 })
  }
}
