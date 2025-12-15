import { getSupabaseServerClient } from "@/lib/supabase/server"
import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BookmarkIcon,
  ShareIcon,
  CheckCircle2Icon,
  CalendarIcon,
  GlobeIcon,
  DollarSignIcon,
  AlertCircleIcon,
} from "lucide-react"
import { ScholarshipBookmarkButton } from "@/components/scholarships/detail/bookmark-button"

export default async function ScholarshipDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await getSupabaseServerClient()
  // Optional: Check for user but don't require authentication (public page)
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Fetch scholarship details (students cannot see created_by - professors are hidden)
  const { data: grant, error } = await supabase
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
      eligible_countries,
      min_gpa,
      funding_amount,
      stipend_monthly,
      covers_tuition,
      covers_living,
      deadline,
      start_date,
      duration_months,
      language,
      application_url,
      is_featured,
      created_at,
      updated_at,
      universities:university_id (
        id,
        name,
        country,
        city,
        logo_url,
        ranking,
        website
      )
    `,
    )
    .eq("id", id)
    .single()

  if (error || !grant) {
    notFound()
  }

  // Check if user has saved this grant
  let isSaved = false
  if (user) {
    const { data: saved } = await supabase
      .from("saved_grants")
      .select("id")
      .eq("user_id", user.id)
      .eq("grant_id", grant.id)
      .single()
    isSaved = !!saved
  }

  // Calculate days until deadline
  const daysUntilDeadline = grant.deadline
    ? Math.ceil((new Date(grant.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : null

  const formatDeadline = (deadline: string | null) => {
    if (!deadline) return null
    return new Date(deadline).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  }

  // Handle universities as array or single object
  const university: any = Array.isArray(grant.universities) 
    ? grant.universities[0] 
    : grant.universities

  const universityInitials = university?.name
    ?.split(" ")
    .map((w: string) => w[0])
    .join("")
    .substring(0, 3)
    .toUpperCase() || "UNI"

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8">
              <Image 
                src="/logo.png" 
                alt="The Career Bird Logo" 
                width={32} 
                height={32}
                className="object-contain"
              />
            </div>
            <span className="font-semibold text-lg hidden sm:inline-block">The Career Bird</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/scholarships" className="text-sm font-medium text-primary">
              Scholarships
            </Link>
            {user && (
              <>
                <Link
                  href="/dashboard"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  Dashboard
                </Link>
                <Link
                  href="/profile/edit"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  Profile
                </Link>
              </>
            )}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            {user ? (
              <>
                <Link href="/profile/edit">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 cursor-pointer hover:opacity-80 transition-opacity" />
                </Link>
              </>
            ) : (
              <Button size="sm" asChild>
                <Link href="/login">Log In</Link>
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="border-b bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
            <Link href="/" className="hover:text-foreground">
              Home
            </Link>
            <span>/</span>
            <Link href="/scholarships" className="hover:text-foreground">
              Scholarships
            </Link>
            {university?.country && (
              <>
                <span>/</span>
                <span className="text-foreground">{university.country}</span>
              </>
            )}
            <span>/</span>
            <span className="text-foreground truncate max-w-[200px] sm:max-w-none">{grant.title}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid lg:grid-cols-[1fr_380px] gap-6 lg:gap-8">
          {/* Main Content - Appears first on mobile and desktop */}
          <div className="lg:order-1 space-y-6">
            {/* Header Card */}
            <Card>
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center gap-2 mb-4 flex-wrap">
                  <Badge className="bg-green-100 text-green-700 border-0">
                    <CheckCircle2Icon className="h-3 w-3 mr-1" />
                    Verified Opportunity
                  </Badge>
                  {grant.is_featured && (
                    <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                      Featured
                    </Badge>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                  <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex-shrink-0 flex items-center justify-center">
                    {university?.logo_url ? (
                      <img
                        src={university.logo_url}
                        alt={university.name}
                        className="h-full w-full object-cover rounded-lg"
                      />
                    ) : (
                      <span className="text-white text-sm sm:text-base font-bold">{universityInitials}</span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h1 className="text-2xl sm:text-3xl font-bold mb-2 break-words">{grant.title}</h1>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground mb-4">
                      {university?.name && (
                        <div className="flex items-center gap-1">
                          <CheckCircle2Icon className="h-4 w-4" />
                          <span>{university.name}</span>
                        </div>
                      )}
                      {university?.city && university?.country && (
                        <div className="flex items-center gap-1">
                          <GlobeIcon className="h-4 w-4" />
                          <span>
                            {university.city}, {university.country}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* What's Covered */}
            {(grant.covers_tuition || grant.covers_living || grant.funding_amount || grant.stipend_monthly) && (
              <Card>
                <CardContent className="p-4 sm:p-6">
                  <h2 className="text-xl font-semibold mb-4">What's Covered</h2>
                  <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                    {grant.covers_tuition && (
                      <div className="flex gap-4">
                        <div className="h-12 w-12 rounded-lg bg-orange-100 dark:bg-orange-950 flex items-center justify-center flex-shrink-0">
                          <DollarSignIcon className="h-6 w-6 text-orange-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold mb-1">Tuition Fees</h3>
                          <p className="text-sm text-muted-foreground">
                            {grant.funding_amount || "Full tuition coverage"}
                          </p>
                        </div>
                      </div>
                    )}

                    {grant.stipend_monthly && (
                      <div className="flex gap-4">
                        <div className="h-12 w-12 rounded-lg bg-green-100 dark:bg-green-950 flex items-center justify-center flex-shrink-0">
                          <DollarSignIcon className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold mb-1">Monthly Stipend</h3>
                          <p className="text-sm text-muted-foreground">{grant.stipend_monthly}</p>
                        </div>
                      </div>
                    )}

                    {grant.covers_living && (
                      <div className="flex gap-4">
                        <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-950 flex items-center justify-center flex-shrink-0">
                          <DollarSignIcon className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold mb-1">Living Expenses</h3>
                          <p className="text-sm text-muted-foreground">Living cost coverage included</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Tabs */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent overflow-x-auto">
                <TabsTrigger
                  value="overview"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent whitespace-nowrap"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="eligibility"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent whitespace-nowrap"
                >
                  Eligibility
                </TabsTrigger>
                <TabsTrigger
                  value="funding"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent whitespace-nowrap"
                >
                  Funding
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6 space-y-6">
                <Card>
                  <CardContent className="p-4 sm:p-6">
                    <h2 className="text-xl font-semibold mb-4">About the Opportunity</h2>
                    <div className="prose prose-sm max-w-none text-muted-foreground">
                      {grant.description ? (
                        <p className="whitespace-pre-wrap">{grant.description}</p>
                      ) : (
                        <p>No description available for this opportunity.</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {grant.degree_levels && grant.degree_levels.length > 0 && (
                  <Card>
                    <CardContent className="p-4 sm:p-6">
                      <h2 className="text-xl font-semibold mb-4">Eligibility Criteria</h2>
                      <div className="space-y-3">
                        <div className="flex gap-3">
                          <CheckCircle2Icon className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <p className="text-sm">
                            Degree Level: {grant.degree_levels.map((l: string) => l.toUpperCase()).join(", ")}
                          </p>
                        </div>
                        {grant.fields_of_study && grant.fields_of_study.length > 0 && (
                          <div className="flex gap-3">
                            <CheckCircle2Icon className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <p className="text-sm">
                              Fields: {grant.fields_of_study.join(", ")}
                            </p>
                          </div>
                        )}
                        {grant.min_gpa && (
                          <div className="flex gap-3">
                            <CheckCircle2Icon className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <p className="text-sm">Minimum GPA: {grant.min_gpa}</p>
                          </div>
                        )}
                        {grant.language && (
                          <div className="flex gap-3">
                            <CheckCircle2Icon className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <p className="text-sm">Language: {grant.language}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="eligibility" className="mt-6">
                <Card>
                  <CardContent className="p-4 sm:p-6">
                    <h2 className="text-xl font-semibold mb-4">Eligibility Requirements</h2>
                    <div className="space-y-3">
                      {grant.degree_levels && grant.degree_levels.length > 0 && (
                        <div>
                          <h3 className="font-medium mb-2">Degree Levels</h3>
                          <div className="flex flex-wrap gap-2">
                            {grant.degree_levels.map((level: string) => (
                              <Badge key={level} variant="secondary" className="capitalize">
                                {level}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {grant.fields_of_study && grant.fields_of_study.length > 0 && (
                        <div>
                          <h3 className="font-medium mb-2">Fields of Study</h3>
                          <div className="flex flex-wrap gap-2">
                            {grant.fields_of_study.map((field: string) => (
                              <Badge key={field} variant="secondary">
                                {field}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {grant.eligible_countries && grant.eligible_countries.length > 0 && (
                        <div>
                          <h3 className="font-medium mb-2">Eligible Countries</h3>
                          <p className="text-sm text-muted-foreground">{grant.eligible_countries.join(", ")}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="funding" className="mt-6">
                <Card>
                  <CardContent className="p-4 sm:p-6">
                    <h2 className="text-xl font-semibold mb-4">Funding Details</h2>
                    <div className="space-y-4">
                      {grant.funding_amount && (
                        <div>
                          <h3 className="font-medium mb-1">Funding Amount</h3>
                          <p className="text-sm text-muted-foreground">{grant.funding_amount}</p>
                        </div>
                      )}
                      {grant.stipend_monthly && (
                        <div>
                          <h3 className="font-medium mb-1">Monthly Stipend</h3>
                          <p className="text-sm text-muted-foreground">{grant.stipend_monthly}</p>
                        </div>
                      )}
                      <div>
                        <h3 className="font-medium mb-1">Coverage</h3>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <CheckCircle2Icon
                              className={`h-4 w-4 ${grant.covers_tuition ? "text-green-600" : "text-muted-foreground"}`}
                            />
                            <span className="text-sm">Tuition Fees</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle2Icon
                              className={`h-4 w-4 ${grant.covers_living ? "text-green-600" : "text-muted-foreground"}`}
                            />
                            <span className="text-sm">Living Expenses</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar - Appears second on mobile and desktop */}
          <div className="lg:order-2 space-y-6">
            {/* Deadline Card */}
            {grant.deadline && (
              <Card
                className={`border-2 ${daysUntilDeadline !== null && daysUntilDeadline <= 7 ? "border-orange-200 bg-orange-50 dark:bg-orange-950/20" : "border-blue-200 bg-blue-50 dark:bg-blue-950/20"}`}
              >
                <CardContent className="p-4 sm:p-6 space-y-4">
                  <div className="flex items-center gap-2 text-orange-700 dark:text-orange-300">
                    <CalendarIcon className="h-5 w-5" />
                    <span className="font-semibold">Deadline</span>
                  </div>
                  <div>
                    <p className="text-2xl sm:text-3xl font-bold text-orange-900 dark:text-orange-100 mb-1">
                      {formatDeadline(grant.deadline)}
                    </p>
                    {daysUntilDeadline !== null && daysUntilDeadline > 0 && (
                      <p className="text-sm text-orange-700 dark:text-orange-300">
                        {daysUntilDeadline} day{daysUntilDeadline !== 1 ? "s" : ""} remaining
                      </p>
                    )}
                  </div>
                  {user ? (
                    <Button className="w-full bg-primary" asChild>
                      <Link href={`/applications/new?grant=${grant.id}`}>Apply Now</Link>
                    </Button>
                  ) : (
                    <Button className="w-full bg-primary" asChild>
                      <Link href="/signup">Sign Up to Apply</Link>
                    </Button>
                  )}
                  <div className="flex gap-2">
                    <ScholarshipBookmarkButton grantId={grant.id} initialSaved={isSaved} />
                    <Button variant="outline" size="icon" className="flex-1">
                      <ShareIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* University Profile */}
            {university && (
              <Card>
                <CardContent className="p-4 sm:p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex-shrink-0 flex items-center justify-center">
                      {university.logo_url ? (
                        <img
                          src={university.logo_url}
                          alt={university.name}
                          className="h-full w-full object-cover rounded-lg"
                        />
                      ) : (
                        <span className="text-white text-sm font-bold">{universityInitials}</span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold truncate">{university.name}</h3>
                      {university.ranking && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <span>Ranking: #{university.ranking}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  {university.website && (
                    <Button variant="link" className="text-primary p-0 h-auto" asChild>
                      <Link href={university.website} target="_blank" rel="noopener noreferrer">
                        Visit University Website →
                      </Link>
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Application URL */}
            {grant.application_url && (
              <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200">
                <CardContent className="p-4 sm:p-6 space-y-3">
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100">Apply Directly</h3>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    This opportunity has an external application link.
                  </p>
                  <Button variant="outline" size="sm" className="w-full border-blue-300 bg-transparent" asChild>
                    <Link href={grant.application_url} target="_blank" rel="noopener noreferrer">
                      Go to Application
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
