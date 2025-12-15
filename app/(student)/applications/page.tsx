import { getSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { ApplicationsPageClient } from "./page-client"
import { FadeIn } from "@/components/animations/fade-in"

async function getApplicationsData() {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  // Fetch all applications for the user
  const { data: applications, error } = await supabase
    .from("applications")
    .select(
      `
      *,
      grants:grant_id (
        id,
        title,
        description,
        deadline,
        funding_amount,
        stipend_monthly,
        universities:university_id (
          id,
          name,
          country,
          city
        )
      )
    `,
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching applications:", error)
    return { applications: [] }
  }

  return { applications: applications || [] }
}

export default async function ApplicationsPage() {
  const { applications } = await getApplicationsData()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-indigo-50/30 dark:from-blue-950/10 dark:via-background dark:to-indigo-950/10">

      <main className="w-full max-w-7xl mx-auto py-8 sm:py-10 lg:py-12 px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <FadeIn>
          <div className="mb-8 sm:mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              My Applications
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground">
            Track and manage all your scholarship applications in one place.
          </p>
        </div>
        </FadeIn>

        {/* Client Component for Search and List */}
        <ApplicationsPageClient applications={applications} />
      </main>
    </div>
  )
}


