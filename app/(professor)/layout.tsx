import type React from "react"
import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function ProfessorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Verify user is actually a professor
  try {
    // Check user_roles table
    const { data: allRoles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)

    const hasProfessorRole = allRoles?.some(r => r.role === "professor")

    if (!hasProfessorRole) {
      // Fallback: Check profile for department
      const { data: profile } = await supabase
        .from("profiles")
        .select("department")
        .eq("user_id", user.id)
        .maybeSingle()

      if (!profile?.department) {
        // Not a professor, redirect to student dashboard
        redirect("/dashboard")
      }
    }
  } catch (error) {
    console.error("Error verifying professor role:", error)
    // On error, redirect to student dashboard for safety
    redirect("/dashboard")
  }

  return <>{children}</>
}
