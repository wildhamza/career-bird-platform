"use server"

import { getSupabaseServerClient } from "@/lib/supabase/server"

export async function signOut() {
  const supabase = await getSupabaseServerClient()
  
  try {
    await supabase.auth.signOut()
  } catch (error) {
    // Ignore errors - client will handle redirect
    console.error("Sign out error:", error)
  }
  
  // Return success - client will handle redirect
  return { success: true }
}
