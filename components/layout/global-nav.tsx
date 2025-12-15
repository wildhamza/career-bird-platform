import { getSupabaseServerClient } from "@/lib/supabase/server"
import { MarketingNav } from "./marketing-nav"
import { StudentNav } from "./student-nav"
import { ProfessorNav } from "./professor-nav"

export async function GlobalNav() {
  const supabase = await getSupabaseServerClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Show marketing nav if not logged in
  if (!user) {
    return <MarketingNav user={user} />
  }

  // Check if user is a professor
  try {
    // First, try to get ALL roles from user_roles table
    const { data: allRoles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)

    const hasProfessorRole = allRoles?.some(r => r.role === "professor")

    if (hasProfessorRole) {
      return <ProfessorNav />
    }

    // Fallback: Check if user has a department (professor indicator)
    const { data: profile } = await supabase
      .from("profiles")
      .select("department")
      .eq("user_id", user.id)
      .maybeSingle()

    if (profile?.department) {
      return <ProfessorNav />
    }
  } catch (error) {
    // If role check fails, default to student nav
    console.error("Error checking user role in GlobalNav:", error)
  }

  // Default to student nav
  return <StudentNav />
}
