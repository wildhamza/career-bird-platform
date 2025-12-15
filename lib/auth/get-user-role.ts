import { getSupabaseServerClient } from "@/lib/supabase/server"

export async function getUserRole(userId: string): Promise<'student' | 'professor' | 'admin' | null> {
  const supabase = await getSupabaseServerClient()
  
  const { data: roles, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .limit(1)
    .single()

  if (error || !roles) {
    // Default to student if no role found
    return 'student'
  }

  return roles.role as 'student' | 'professor' | 'admin'
}
