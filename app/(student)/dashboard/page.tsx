import { getSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  SendIcon,
  FileTextIcon,
  CalendarIcon,
  AlertCircleIcon,
  BookmarkIcon,
  SparklesIcon,
  BellIcon,
} from "lucide-react"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { SavedOpportunities } from "@/components/dashboard/saved-opportunities"
import { ProfileStrength } from "@/components/dashboard/profile-strength"
import { ThisWeek } from "@/components/dashboard/this-week"
import { PremiumCard } from "@/components/dashboard/premium-card"
import { AIRecommendation } from "@/components/dashboard/ai-recommendation"
import { FadeIn } from "@/components/animations/fade-in"
import { StaggerContainer, StaggerItem } from "@/components/animations/stagger-container"

export default async function StudentDashboard() {
  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect("/login")
  }

  // Check if user is a professor and redirect them
  // First, try to get ALL roles from user_roles table
  const { data: allRoles, error: roleError } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)

  console.log("🔍 Dashboard role check:", { 
    userId: user.id, 
    allRoles, 
    roleError,
    hasRoles: !!allRoles,
    roleCount: allRoles?.length 
  })

  // Check if user has professor role
  const hasProfessorRole = allRoles?.some(r => r.role === "professor")

  if (hasProfessorRole) {
    console.log("✅ Professor role found, redirecting to professor dashboard")
    redirect("/professor/dashboard")
  }

  // Fetch user profile (we'll use this for both role check and display)
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .single()

  console.log("🔍 Dashboard profile check:", { 
    profile: profile ? { hasDepartment: !!profile.department, department: profile.department } : null, 
    profileError,
    hasDepartment: !!profile?.department,
    department: profile?.department 
  })

  // Check if user has a department (professor indicator)
  if (profile?.department) {
    console.log("✅ Department found in profile, redirecting to professor dashboard")
    redirect("/professor/dashboard")
  }

  // Fetch applications with error handling
  const { data: applications, error: applicationsError } = await supabase
    .from("applications")
    .select(
      `
      *,
      grants:grant_id (
        id,
        title,
        university_id,
        universities:university_id (
          name,
          country
        )
      )
    `,
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5)

  // Fetch saved opportunities with error handling
  const { data: savedGrants, error: savedGrantsError } = await supabase
    .from("saved_grants")
    .select(
      `
      *,
      grants:grant_id (
        id,
        title,
        deadline,
        universities:university_id (
          name,
          country
        )
      )
    `,
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(3)

  // Fetch a recommended grant (for now, just get the first available grant)
  // In the future, this would use AI matching based on user profile
  // Note: Students cannot see created_by field (professors are hidden)
  const { data: recommendedGrantData } = await supabase
    .from("grants")
    .select(
      `
      id,
      title,
      funding_amount,
      stipend_monthly,
      language,
      deadline,
      start_date,
      universities:university_id (
        name,
        country
      )
    `,
    )
    .limit(1)
    .single()
  
  // Transform to match expected type (handle universities as single object)
  const recommendedGrant = recommendedGrantData ? {
    id: recommendedGrantData.id,
    title: recommendedGrantData.title,
    funding_type: recommendedGrantData.funding_amount,
    stipend_amount: recommendedGrantData.stipend_monthly,
    language: recommendedGrantData.language,
    universities: Array.isArray(recommendedGrantData.universities) 
      ? recommendedGrantData.universities[0] 
      : recommendedGrantData.universities
  } : undefined

  // Fetch upcoming deadlines from applications
  const { data: upcomingDeadlines } = await supabase
    .from("applications")
    .select(
      `
      *,
      grants:grant_id (
        deadline,
        title,
        universities:university_id (
          name
        )
      )
    `,
    )
    .eq("user_id", user.id)
    .not("grants.deadline", "is", null)
    .order("grants.deadline", { ascending: true })
    .limit(5)

  // Calculate stats
  const applicationsSent = applications?.length || 0
  const pendingReview = applications?.filter((app) => app.status === "under_review" || app.status === "pending").length || 0
  const interviewsScheduled = applications?.filter((app) => app.status === "interview" || app.status === "interview_scheduled").length || 0

  // Count upcoming deadlines this week
  const now = new Date()
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
  const deadlinesThisWeek = upcomingDeadlines?.filter((app) => {
    if (!app.grants?.deadline) return false
    const deadline = new Date(app.grants.deadline)
    return deadline >= now && deadline <= nextWeek
  }).length || 0

  // Get user's first name
  const firstName = profile?.first_name || profile?.full_name?.split(" ")[0] || "there"

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-indigo-50/30 dark:from-blue-950/10 dark:via-background dark:to-indigo-950/10">

      <main className="w-full max-w-7xl mx-auto px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {/* Welcome Section */}
        <FadeIn>
          <div className="mb-8 sm:mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Welcome back, {firstName}! 👋
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground">
            {deadlinesThisWeek > 0 ? (
              <>
                You have{" "}
                  <span className="font-bold text-orange-600 dark:text-orange-400">
                  {deadlinesThisWeek} upcoming deadline{deadlinesThisWeek !== 1 ? "s" : ""}
                </span>{" "}
                  this week. Stay on track!
              </>
            ) : (
                <>
                  <span className="font-semibold text-green-600 dark:text-green-400">All caught up!</span> No upcoming deadlines this week.
                </>
            )}
          </p>
        </div>
        </FadeIn>

        {/* Stats Cards */}
        <FadeIn delay={0.1}>
          <div className="mb-8 sm:mb-10">
          <DashboardStats
            applicationsSent={applicationsSent}
            pendingReview={pendingReview}
            interviewsScheduled={interviewsScheduled}
          />
        </div>
        </FadeIn>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:gap-8 lg:grid-cols-3">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6 lg:space-y-8">
            <StaggerContainer>
              <StaggerItem>
            {/* AI Recommended Opportunity */}
            <AIRecommendation grant={recommendedGrant || undefined} />
              </StaggerItem>

              <StaggerItem>
            {/* Saved Opportunities */}
            <SavedOpportunities savedGrants={savedGrants || []} />
              </StaggerItem>
            </StaggerContainer>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            <StaggerContainer staggerDelay={0.15}>
              <StaggerItem>
            <ProfileStrength profile={profile} />
              </StaggerItem>

              <StaggerItem>
            <ThisWeek upcomingDeadlines={upcomingDeadlines || []} />
              </StaggerItem>

              <StaggerItem>
            <PremiumCard />
              </StaggerItem>
            </StaggerContainer>
          </div>
        </div>
      </main>
    </div>
  )
}
