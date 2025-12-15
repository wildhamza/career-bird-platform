import { getSupabaseServerClient } from "@/lib/supabase/server"
import { MarketingNav } from "./marketing-nav"
import { StudentNav } from "./student-nav"

export async function GlobalNav() {
  const supabase = await getSupabaseServerClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Show student nav if logged in, marketing nav if not
  if (user) {
    return <StudentNav />
  }

  return <MarketingNav user={user} />
}
