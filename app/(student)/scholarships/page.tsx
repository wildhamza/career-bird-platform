import { getSupabaseServerClient } from "@/lib/supabase/server"
import { ScholarshipsPageClient } from "./page-client"

export default async function ScholarshipsPage() {
  const supabase = await getSupabaseServerClient()
  
  // Optional: Check for user but don't require authentication (public page)
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Fetch only first batch of grants for BLAZING FAST initial load
  const INITIAL_BATCH_SIZE = 15 // Reduced for faster initial render
  
  // Run queries in parallel for speed
  const [grantsResult, countResult, savedResult] = await Promise.all([
    // Grants query
    supabase
    .from("grants")
    .select(
      `
      id,
      title,
      description,
      grant_type,
      university_id,
      degree_levels,
      fields_of_study,
      min_gpa,
      funding_amount,
      covers_tuition,
      covers_living,
      deadline,
      is_featured,
      created_at,
      universities:university_id (
        id,
        name,
        country,
        city,
        logo_url
      )
    `,
    )
    .order("created_at", { ascending: false })
      .limit(INITIAL_BATCH_SIZE),

    // Total count query
    supabase
    .from("grants")
      .select("*", { count: "exact", head: true }),

    // Saved grants query (only if user is logged in)
    user
      ? supabase
      .from("saved_grants")
      .select("grant_id")
      .eq("user_id", user.id)
      : Promise.resolve({ data: null }),
  ])

  const grants = grantsResult.data || []
  const totalCount = countResult.count || 0
  const savedGrants = savedResult.data?.map((s: { grant_id: string }) => s.grant_id) || []

  return (
    <ScholarshipsPageClient 
      initialGrants={grants || []} 
      initialUser={user || null}
      initialSavedGrants={savedGrants}
      totalCount={totalCount || 0}
    />
  )
}
