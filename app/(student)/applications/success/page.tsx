import Link from "next/link"
import { redirect } from "next/navigation"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2Icon, TrendingUpIcon } from "lucide-react"
import { FadeIn } from "@/components/animations/fade-in"

async function getApplicationData(applicationId: string) {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  // Fetch the application with all related data
  const { data: application, error } = await supabase
    .from("applications")
    .select(
      `
      *,
      grants:grant_id (
        id,
        title,
        description,
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
    .eq("id", applicationId)
    .eq("user_id", user.id)
    .single()

  if (error || !application) {
    redirect("/dashboard")
  }

  // Fetch user profile for recommendations
  const { data: profile } = await supabase
    .from("profiles")
    .select("field_of_study, research_interests, current_degree")
    .eq("user_id", user.id)
    .single()

  // Fetch recommended grants based on user profile
  const { data: recommendedGrants } = await supabase
    .from("grants")
    .select(
      `
      id,
      title,
      description,
      funding_amount,
      stipend_monthly,
      university:university_id (
        id,
        name,
        country
      )
    `,
    )
    .neq("id", application.grant_id)
    .limit(3)

  return { application, profile, recommendedGrants: recommendedGrants || [] }
}

export default async function ApplicationSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ applicationId?: string }>
}) {
  const params = await searchParams
  
  if (!params?.applicationId) {
    redirect("/dashboard")
  }

  const { application, recommendedGrants } = await getApplicationData(params.applicationId)

  const universityName = application.grants?.universities?.name || "the university"
  const rScore = application.r_score ?? null
  const globalRank = application.global_rank ?? null
  const matchScore = application.match_score ?? null

  // Calculate R-score percentage for the circle
  const rScorePercentage = rScore ?? 0
  const circumference = 2 * Math.PI * 50
  const offset = circumference - (rScorePercentage / 100) * circumference

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-indigo-50/30 dark:from-blue-950/10 dark:via-background dark:to-indigo-950/10">

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="max-w-4xl mx-auto">
          {/* Success Icon */}
          <FadeIn delay={0.1}>
          <div className="flex justify-center mb-4 sm:mb-6">
              <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-2xl shadow-green-500/30 animate-pulse">
                <CheckCircle2Icon className="h-10 w-10 sm:h-12 sm:w-12 text-white" />
              </div>
            </div>
          </FadeIn>

          {/* Header */}
          <FadeIn delay={0.2}>
          <div className="text-center mb-6 sm:mb-8">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Application Successfully Submitted!
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground">
                Your application to <strong className="text-foreground">{universityName}</strong> has been sent securely.
            </p>
          </div>
          </FadeIn>

          {/* R-Score Card */}
          <FadeIn delay={0.3}>
            <Card className="mb-6 sm:mb-8 border-2 shadow-lg">
            <CardContent className="p-4 sm:p-6 lg:p-8">
              <div className="flex flex-col lg:flex-row items-start gap-4 sm:gap-6">
                <div className="flex-1 w-full">
                  <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                    <svg className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <h2 className="text-lg sm:text-xl font-semibold">AI-VERIFIED ASSESSMENT</h2>
                  </div>

                  {rScore !== null ? (
                    <>
                      <h3 className="text-xl sm:text-2xl font-bold mb-2">Your Initial R-Score</h3>
                      <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
                        Based on 14 readiness parameters.
                      </p>

                      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 lg:gap-8">
                        <div className="relative shrink-0">
                          <svg className="h-24 w-24 sm:h-32 sm:w-32" viewBox="0 0 120 120">
                            <circle cx="60" cy="60" r="50" fill="none" stroke="#e5e7eb" strokeWidth="10" />
                            <circle
                              cx="60"
                              cy="60"
                              r="50"
                              fill="none"
                              stroke="#f97316"
                              strokeWidth="10"
                              strokeDasharray={circumference}
                              strokeDashoffset={offset}
                              strokeLinecap="round"
                              transform="rotate(-90 60 60)"
                            />
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-2xl sm:text-3xl lg:text-4xl font-bold">{rScore}</span>
                            <span className="text-xs text-muted-foreground">OUT OF 100</span>
                          </div>
                        </div>

                        <div className="flex-1 space-y-3 sm:space-y-4 w-full">
                          <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200">
                            <CardContent className="p-3 sm:p-4">
                              <div className="flex items-start gap-2 sm:gap-3">
                                <TrendingUpIcon className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 shrink-0 mt-0.5" />
                                <div>
                                  <h4 className="font-semibold text-sm sm:text-base text-blue-900 dark:text-blue-100 mb-1">
                                    {rScore >= 80 ? "Strong Application" : rScore >= 60 ? "Good Application" : "Application Submitted"}
                                  </h4>
                                  <p className="text-xs sm:text-sm text-blue-700 dark:text-blue-300">
                                    {rScore >= 80
                                      ? `You rank in the top ${Math.round((100 - rScore) / 2)}% of applicants for this program. Your research proposal and academic history are your strongest assets.`
                                      : "Your application has been submitted and is under review."}
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>

                          <div className="grid grid-cols-2 gap-2 sm:gap-3">
                            {globalRank !== null && (
                              <div>
                                <p className="text-xs sm:text-sm text-muted-foreground mb-1">Global Rank</p>
                                <p className="text-xl sm:text-2xl font-bold">#{globalRank}</p>
                              </div>
                            )}
                            {matchScore !== null && (
                              <div>
                                <p className="text-xs sm:text-sm text-muted-foreground mb-1">Match Score</p>
                                <p className="text-xl sm:text-2xl font-bold text-green-600">{matchScore}%</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <h3 className="text-xl sm:text-2xl font-bold mb-2">Application Submitted</h3>
                      <p className="text-sm sm:text-base text-muted-foreground">
                        Your application is being processed. Scores will be available once the review is complete.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          </FadeIn>

          <FadeIn delay={0.4}>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 mb-6 sm:mb-8">
              <Button size="lg" asChild className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg">
              <Link href="/dashboard">
                <svg className="mr-2 h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                Track Application Status
              </Link>
            </Button>
              <Button variant="outline" size="lg" className="w-full sm:w-auto border-2">
              <svg className="mr-2 h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Download Receipt
            </Button>
          </div>
          </FadeIn>

          {/* Based on R-Score */}
          {recommendedGrants.length > 0 && (
            <FadeIn delay={0.5}>
              <Card className="border-2 shadow-lg">
              <CardContent className="p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Recommended Opportunities</h3>
                <div className="space-y-3 sm:space-y-4">
                  {recommendedGrants.map((grant) => (
                    <div
                      key={grant.id}
                      className="flex flex-col sm:flex-row gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg border hover:bg-muted/50"
                    >
                      <div className="h-12 w-12 rounded bg-blue-600 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h4 className="font-semibold text-sm sm:text-base">
                            {(grant as any).university?.name || "University"}
                          </h4>
                          <Badge className="bg-green-100 text-green-700 border-0 text-xs">Recommended</Badge>
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground mb-2 truncate">{grant.title}</p>
                        <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-muted-foreground">
                          {(grant as any).university?.country && <span>{(grant as any).university.country}</span>}
                          {grant.funding_amount && (
                            <>
                              <span>•</span>
                              <span>{grant.funding_amount}</span>
                            </>
                          )}
                          {grant.stipend_monthly && (
                            <>
                              <span>•</span>
                              <span>Stipend: {grant.stipend_monthly}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <Link href={`/scholarships/${grant.id}`} className="shrink-0">
                        <Button variant="outline" size="sm" className="w-full sm:w-auto">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>

                <Link href="/scholarships">
                  <Button variant="link" className="w-full mt-4 text-primary">
                    View all suggestions →
                  </Button>
                </Link>
              </CardContent>
            </Card>
            </FadeIn>
          )}
        </div>
      </div>
    </div>
  )
}
