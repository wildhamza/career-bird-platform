import { getSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { NewPositionClient } from "./new-position-client"

export default async function NewPositionPage() {
  const supabase = await getSupabaseServerClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Fetch professor's profile to get their university info
  const { data: profile } = await supabase
    .from("profiles")
    .select("university_name, university_country")
    .eq("user_id", user.id)
    .maybeSingle()

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Create New Position</h1>
            <p className="mt-2 text-muted-foreground">
              Post a new scholarship, fellowship, or research position opportunity
            </p>
          </div>

          <NewPositionClient 
            defaultUniversityName={profile?.university_name || undefined}
            defaultUniversityCountry={profile?.university_country || undefined}
          />
        </div>
      </div>
    </div>
  )
}
