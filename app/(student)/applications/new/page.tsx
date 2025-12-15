import { getSupabaseServerClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { NewApplicationClient } from "./new-application-client"

export default async function NewApplicationPage({
  searchParams,
}: {
  searchParams: Promise<{ grant?: string }>
}) {
  const { grant: grantId } = await searchParams
  
  if (!grantId) {
    redirect("/scholarships")
  }

  const supabase = await getSupabaseServerClient()
  
  // Check authentication
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
    redirect("/login")
      }

  // Load grant details server-side
  const { data: grant, error: grantError } = await supabase
        .from("grants")
        .select(
          `
          *,
          universities:university_id (
            id,
            name,
            country
          )
        `,
        )
        .eq("id", grantId)
        .single()

  if (grantError || !grant) {
    notFound()
  }

      // Check if application already exists
      const { data: existingApp } = await supabase
        .from("applications")
        .select("*")
        .eq("user_id", user.id)
        .eq("grant_id", grantId)
    .maybeSingle()

        // Load tryout submission if exists
  let existingTryout = null
  if (existingApp) {
        const { data: tryout } = await supabase
          .from("tryout_submissions")
          .select("*")
          .eq("application_id", existingApp.id)
      .maybeSingle()
    
    existingTryout = tryout
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-indigo-50/30 dark:from-blue-950/10 dark:via-background dark:to-indigo-950/10">

      <NewApplicationClient 
        grant={grant}
        application={existingApp}
        existingTryout={existingTryout}
        grantId={grantId}
      />
    </div>
  )
}
