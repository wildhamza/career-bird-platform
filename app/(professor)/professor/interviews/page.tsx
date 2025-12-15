import { getSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, Mail, User, Video, CheckCircle, XCircle } from "lucide-react"
import { format } from "date-fns"

export default async function InterviewsPage() {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Get all grants created by this professor
  const { data: professorGrants } = await supabase
    .from("grants")
    .select("id")
    .eq("created_by", user.id)

  const grantIds = professorGrants?.map((g) => g.id) || []

  // Get applications with interview status
  let interviews: any[] = []
  if (grantIds.length > 0) {
    const { data: applications, error } = await supabase
      .from("applications")
      .select(
        `
        *,
        grants:grant_id (
          id,
          title,
          universities:university_id (
            name,
            country
          )
        )
      `,
      )
      .in("grant_id", grantIds)
      .eq("status", "interview")
      .order("submitted_at", { ascending: false })

    if (error) {
      console.error("Error fetching interviews:", error)
    } else {
      // Fetch profiles for each application
      const userIds = applications?.map((app) => app.user_id).filter(Boolean) || []
      let profilesMap: Record<string, any> = {}

      if (userIds.length > 0) {
        const { data: profiles } = await supabase
          .from("profiles")
          .select("user_id, first_name, last_name, email, current_country, nationality")
          .in("user_id", userIds)

        profiles?.forEach((profile) => {
          profilesMap[profile.user_id] = profile
        })
      }

      // Combine applications with profiles
      interviews =
        applications?.map((app) => ({
          ...app,
          profile: profilesMap[app.user_id] || null,
        })) || []
    }
  }

  // Group interviews by status/date
  const upcomingInterviews = interviews.filter((interview) => {
    // For now, all interviews are considered upcoming
    // In the future, you could add interview_date field to applications table
    return true
  })

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Interviews</h1>
            <p className="mt-2 text-muted-foreground">Manage interviews with shortlisted candidates</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-3 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Interviews</p>
                  <p className="text-2xl font-bold">{interviews.length}</p>
                </div>
                <Video className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Upcoming</p>
                  <p className="text-2xl font-bold">{upcomingInterviews.length}</p>
                </div>
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">This Month</p>
                  <p className="text-2xl font-bold">
                    {interviews.filter((i) => {
                      const created = new Date(i.created_at)
                      const now = new Date()
                      return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear()
                    }).length}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Interviews List */}
        {interviews.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Video className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Interviews Scheduled</h3>
              <p className="text-muted-foreground mb-6">
                Interviews will appear here once you move candidates to the interview stage.
              </p>
              <Button variant="outline" asChild>
                <Link href="/professor/dashboard">View Applications</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {interviews.map((interview: any) => {
              const grant = Array.isArray(interview.grants) ? interview.grants[0] : interview.grants
              const university = Array.isArray(grant?.universities)
                ? grant?.universities[0]
                : grant?.universities

              return (
                <Card key={interview.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold">
                            {interview.profile?.first_name?.[0] || "?"}
                            {interview.profile?.last_name?.[0] || ""}
                          </div>
                          <div>
                            <CardTitle className="text-lg">
                              {interview.profile?.first_name || ""} {interview.profile?.last_name || "Unknown Candidate"}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">
                              {grant?.title || "Unknown Position"}
                            </p>
                          </div>
                        </div>
                      </div>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                        Interview Stage
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        <span>{interview.profile?.email || "No email"}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>
                          {interview.profile?.current_country || interview.profile?.nationality || "Unknown"}
                        </span>
                      </div>
                      {university && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <User className="h-4 w-4" />
                          <span>{university.name} {university.country && `(${university.country})`}</span>
                        </div>
                      )}
                      {interview.submitted_at && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>Applied {format(new Date(interview.submitted_at), "MMM dd, yyyy")}</span>
                        </div>
                      )}
                    </div>

                    {interview.match_score && (
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Match Score</span>
                          <span className="font-semibold">{interview.match_score}%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-600 rounded-full"
                            style={{ width: `${interview.match_score}%` }}
                          />
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/professor/applications/${interview.id}`}>View Application</Link>
                      </Button>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Video className="h-4 w-4" />
                        Schedule Interview
                      </Button>
                      <Button variant="outline" size="sm" className="gap-2 text-green-600 hover:text-green-700">
                        <CheckCircle className="h-4 w-4" />
                        Accept
                      </Button>
                      <Button variant="outline" size="sm" className="gap-2 text-red-600 hover:text-red-700">
                        <XCircle className="h-4 w-4" />
                        Reject
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
