import { getSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ProfileDisplay } from "@/components/profile-display"
import { ProfileBuilderForm } from "@/components/profile-builder-form"

export default async function ProfileEditPage() {
  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Fetch profile with full data
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle()

  if (profileError) {
    console.error("Error fetching profile:", profileError)
  }

  // Merge user email into profile if profile exists or create base profile object
  const enrichedProfile = profile ? {
    ...profile,
    email: profile.email || user.email,
  } : {
    user_id: user.id,
    email: user.email,
    first_name: user.user_metadata?.first_name || "",
    last_name: user.user_metadata?.last_name || "",
  }

  // If profile is complete (has basic info), show display view, otherwise show form
  const isProfileComplete = enrichedProfile.first_name && enrichedProfile.last_name && enrichedProfile.current_degree

  if (isProfileComplete) {
    return <ProfileDisplay profile={enrichedProfile} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-indigo-50/30 dark:from-blue-950/10 dark:via-background dark:to-indigo-950/10">
      <ProfileBuilderForm profile={enrichedProfile} />
    </div>
  )
}
