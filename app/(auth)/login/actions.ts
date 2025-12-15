"use server"

import { getSupabaseServerClient } from "@/lib/supabase/server"

export async function getUserRoleAction(): Promise<'student' | 'professor' | 'admin'> {
  try {
    const supabase = await getSupabaseServerClient()
    
    // Get the current user from the session
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      // Default to student if no user found
      return 'student'
    }
    
    // First, try to get role from user_roles table
    const { data: roles, error: roleError } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .limit(1)
      .maybeSingle()

    if (!roleError && roles) {
      return roles.role as 'student' | 'professor' | 'admin'
    }

    // Fallback: Check if user has a department (professor indicator)
    const { data: profile } = await supabase
      .from("profiles")
      .select("department")
      .eq("user_id", user.id)
      .maybeSingle()

    if (profile?.department) {
      return 'professor'
    }

    // Default to student
    return 'student'
  } catch (error) {
    console.error("Error in getUserRoleAction:", error)
    // Default to student on any error
    return 'student'
  }
}
