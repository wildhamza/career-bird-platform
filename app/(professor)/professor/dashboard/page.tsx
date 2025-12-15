import { getSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, AlertCircle, Bookmark, Download, Briefcase, Plus, Calendar } from "lucide-react"
import Link from "next/link"
import { CandidateRanking } from "@/components/professor/candidate-ranking"

async function getDashboardData() {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  // Get all grants created by this professor with full details
  const { data: professorGrants } = await supabase
    .from("grants")
    .select(`
      id,
      title,
      deadline,
      created_at,
      universities:university_id (
        name,
        country
      )
    `)
    .eq("created_by", user.id)
    .order("created_at", { ascending: false })

  const grantIds = professorGrants?.map((g) => g.id) || []

  if (grantIds.length === 0) {
    return {
      stats: {
        totalApplicants: 0,
        avgResearchMatch: 0,
        pendingReviews: 0,
        shortlisted: 0,
        totalGrants: 0,
      },
      topCandidates: [],
      researchInterests: [],
      globalDistribution: [],
      recentGrants: [],
    }
  }

  // Get all applications for professor's grants
  const { data: applications, error: applicationsError } = await supabase
    .from("applications")
    .select(
      `
      *,
      grants:grant_id (
        id,
        title
      )
    `,
    )
    .in("grant_id", grantIds)
    .order("match_score", { ascending: false, nullsFirst: false })

  if (applicationsError) {
    console.error("Error fetching applications:", applicationsError)
  }

  // Fetch profiles separately for each application user
  const userIds = applications?.map((app) => app.user_id).filter(Boolean) || []
  let profilesMap: Record<string, any> = {}

  if (userIds.length > 0) {
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select(
        `
        user_id,
        id,
        first_name,
        last_name,
        nationality,
        current_country,
        university_id,
        gpa,
        research_interests,
        universities:university_id (
          name
        )
      `,
      )
      .in("user_id", userIds)

    if (profilesError) {
      console.error("Error fetching profiles:", profilesError)
    } else {
      // Create a map for easy lookup
      profiles?.forEach((profile) => {
        profilesMap[profile.user_id] = profile
      })
    }
  }

  // Attach profiles to applications
  const applicationsWithProfiles = applications?.map((app) => ({
    ...app,
    profiles: profilesMap[app.user_id] || null,
  })) || []

  // Calculate stats
  const totalApplicants = applicationsWithProfiles.length
  const pendingReviews =
    applicationsWithProfiles.filter((app) => app.status === "under_review" || app.status === "submitted").length
  const shortlisted = applicationsWithProfiles.filter((app) => app.status === "shortlisted").length

  // Calculate average match score
  const matchScores = applicationsWithProfiles.map((app) => app.match_score).filter((score) => score !== null)
  const avgResearchMatch =
    matchScores.length > 0 ? Math.round(matchScores.reduce((a, b) => a + b, 0) / matchScores.length) : 0

  // Get top candidates (top 10 by match score)
  const topCandidates = applicationsWithProfiles
    .slice(0, 10)
    .map((app, index) => ({
      id: app.id,
      rank: index + 1,
      name: `${app.profiles?.first_name || ""} ${app.profiles?.last_name || ""}`.trim() || "Unknown",
      candidateId: app.id.substring(0, 8),
      origin: app.profiles?.current_country || app.profiles?.nationality || "Unknown",
      university: Array.isArray(app.profiles?.universities)
        ? app.profiles?.universities[0]?.name || "Unknown"
        : app.profiles?.universities?.name || "Unknown",
      gpa: app.profiles?.gpa || 0,
      researchInterest: app.profiles?.research_interests?.[0] || "Not specified",
      aiMatch: app.match_score || 0,
      status: app.status,
    }))

  // Calculate research interests distribution
  const allInterests = applicationsWithProfiles
    .flatMap((app) => app.profiles?.research_interests || [])
    .filter(Boolean)

  const interestCounts: Record<string, number> = {}
  allInterests.forEach((interest) => {
    interestCounts[interest] = (interestCounts[interest] || 0) + 1
  })

  const researchInterests = Object.entries(interestCounts)
    .map(([field, count]) => ({
      field,
      percentage: allInterests.length > 0 ? Math.round((count / allInterests.length) * 100) : 0,
    }))
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 5)

  // Calculate global distribution
  const countryCounts: Record<string, number> = {}
  applicationsWithProfiles.forEach((app) => {
    const country = app.profiles?.current_country || app.profiles?.nationality || "Unknown"
    countryCounts[country] = (countryCounts[country] || 0) + 1
  })

  const globalDistribution = Object.entries(countryCounts)
    .map(([country, count]) => ({
      country,
      count,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

  return {
    stats: {
      totalApplicants,
      avgResearchMatch,
      pendingReviews,
      shortlisted,
      totalGrants: professorGrants?.length || 0,
    },
    topCandidates,
    researchInterests,
    globalDistribution,
    recentGrants: professorGrants?.slice(0, 5) || [],
  }
}

export default async function ProfessorDashboardPage() {
  const data = await getDashboardData()
  const hasNoGrants = data.stats.totalGrants === 0

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Dashboard</h1>
            <p className="mt-1 text-sm text-muted-foreground">Overview of Scholarship Applications</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
            <Button variant="outline" size="sm" className="w-full sm:w-auto">
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
            <Button asChild size="sm" className="w-full sm:w-auto">
              <Link href="/professor/positions/new">
                <Plus className="mr-2 h-4 w-4" />
                New Position
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mb-6 sm:mb-8 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Grants</CardTitle>
              <Briefcase className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold">{data.stats.totalGrants}</div>
              <p className="mt-1 text-xs text-muted-foreground">Active positions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Applicants</CardTitle>
              <Users className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold">{data.stats.totalApplicants}</div>
              <p className="mt-1 text-xs text-muted-foreground">All applications received</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Research Match</CardTitle>
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-purple-100">
                <span className="text-xs text-purple-600">★</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold">{data.stats.avgResearchMatch}%</div>
              <p className="mt-1 text-xs text-muted-foreground">Average match score</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
              <AlertCircle className="h-5 w-5 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold">{data.stats.pendingReviews}</div>
              <p className="mt-1 text-xs text-orange-600">Needs attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Shortlisted</CardTitle>
              <Bookmark className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold">{data.stats.shortlisted}</div>
              <p className="mt-1 text-xs text-muted-foreground">Top candidates</p>
            </CardContent>
          </Card>
        </div>

        {/* Empty State - No Grants */}
        {hasNoGrants && (
          <Card className="mb-6">
            <CardContent className="py-12 text-center">
              <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Positions Created Yet</h3>
              <p className="text-muted-foreground mb-6">
                Create your first scholarship position to start receiving applications from students.
              </p>
              <Button asChild>
                <Link href="/professor/positions/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Position
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Recent Grants */}
        {!hasNoGrants && data.recentGrants.length > 0 && (
          <Card className="mb-6">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Positions</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/professor/positions">View All</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.recentGrants.map((grant: any) => (
                  <div
                    key={grant.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm sm:text-base">{grant.title}</h3>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        {grant.universities && (
                          <span className="flex items-center gap-1">
                            <Briefcase className="h-3 w-3" />
                            {Array.isArray(grant.universities) 
                              ? grant.universities[0]?.name || "Unknown University"
                              : grant.universities?.name || "Unknown University"}
                          </span>
                        )}
                        {grant.deadline && (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(grant.deadline).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/professor/positions/${grant.id}`}>View</Link>
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Content Grid - Only show if there are grants */}
        {!hasNoGrants && (
          <div className="grid gap-6 lg:grid-cols-3 mb-6">
          {/* Global Distribution */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Global Applicant Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              {data.globalDistribution.length > 0 ? (
                <div className="space-y-4">
                  {data.globalDistribution.map((item) => (
                    <div key={item.country} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{item.country}</span>
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-32 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-600 rounded-full"
                            style={{
                              width: `${(item.count / data.stats.totalApplicants) * 100}%`,
                            }}
                          />
                        </div>
                        <span className="text-sm font-bold w-12 text-right">{item.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No applicants yet</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Research Interests */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Research Interests</CardTitle>
            </CardHeader>
            <CardContent>
              {data.researchInterests.length > 0 ? (
                <div className="space-y-4">
                  {data.researchInterests.map((interest, idx) => (
                    <div key={idx}>
                      <div className="mb-1 flex items-center justify-between">
                        <span className="text-sm font-medium truncate">{interest.field}</span>
                        <span className="text-sm font-bold ml-2">{interest.percentage}%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-blue-600"
                          style={{ width: `${interest.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-muted-foreground text-sm">No data available</div>
              )}
              <p className="mt-4 text-xs text-muted-foreground">Top categories based on applicant profiles</p>
            </CardContent>
          </Card>
        </div>
        )}

        {/* Candidate Ranking Table - Only show if there are applicants */}
        {!hasNoGrants && (
          <CandidateRanking candidates={data.topCandidates} totalApplicants={data.stats.totalApplicants} />
        )}
      </div>
    </div>
  )
}
