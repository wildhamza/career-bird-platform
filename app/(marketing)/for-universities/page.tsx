import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Building2, Users, TrendingUp, CheckCircle, Award, Target, Globe, BarChart } from "lucide-react"
import { FadeIn } from "@/components/animations/fade-in"
import { StaggerContainer, StaggerItem } from "@/components/animations/stagger-container"
import { ScaleIn } from "@/components/animations/scale-in"

export default function UniversitiesPage() {
  return (
    <div className="min-h-screen bg-background">

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-blue-950/20 dark:via-background dark:to-cyan-950/20" />
        <div 
          className="absolute inset-0 opacity-10 dark:opacity-5"
          style={{
            backgroundImage: 'url(/images/3.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />

        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="mx-auto max-w-3xl text-center">
            <FadeIn delay={0.1}>

            <h1 className="mb-6 text-balance text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Attract Top Global{" "}
              <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Talent
              </span>
            </h1>
            </FadeIn>

            <FadeIn delay={0.2}>
            <p className="mb-8 text-pretty text-lg text-muted-foreground md:text-xl">
                Streamline your graduate recruitment process and connect with highly-qualified students from around the world. Increase diversity, enhance your institution's global reach, and build a stronger academic community.
            </p>
            </FadeIn>

            <FadeIn delay={0.3}>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Button size="lg" asChild className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
                <Link href="/signup">Partner With Us</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/contact">Schedule a Demo</Link>
              </Button>
            </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-32 bg-muted/30">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Why Universities Choose Us
            </h2>
            <p className="text-lg text-muted-foreground">
                Transform your graduate recruitment with a comprehensive platform designed for modern universities
              </p>
            </div>
          </FadeIn>

          <StaggerContainer className="grid gap-8 md:grid-cols-3">
            <StaggerItem>
              <div className="group relative rounded-2xl border-2 bg-card p-8 hover:shadow-xl hover:border-blue-200 transition-all">
                <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-950 dark:to-blue-900">
                  <Users className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="mb-3 text-xl font-bold">Pre-Vetted Candidates</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Access a diverse pool of verified, high-quality students with complete academic profiles, verified test scores, and authentic research experience. Reduce administrative burden and focus on the best candidates.
                </p>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="group relative rounded-2xl border-2 bg-card p-8 hover:shadow-xl hover:border-blue-200 transition-all">
                <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-100 to-cyan-200 dark:from-cyan-950 dark:to-cyan-900">
                  <TrendingUp className="h-7 w-7 text-cyan-600 dark:text-cyan-400" />
                </div>
                <h3 className="mb-3 text-xl font-bold">Streamlined Process</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Manage applications, scholarships, and communications all in one centralized platform. Track applicant progress, coordinate with departments, and make data-driven decisions with powerful analytics.
                </p>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="group relative rounded-2xl border-2 bg-card p-8 hover:shadow-xl hover:border-blue-200 transition-all">
                <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-950 dark:to-indigo-900">
                  <Globe className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="mb-3 text-xl font-bold">Global Reach</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Reach talented students from around the world actively seeking graduate opportunities. Enhance your institution's diversity and international reputation while expanding your global academic network.
              </p>
            </div>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 md:py-32">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <ScaleIn>
              <Card className="border-2 shadow-xl">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-6">Complete Recruitment Solution</h3>
                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-950 flex items-center justify-center">
                          <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Scholarship Management</h4>
                        <p className="text-sm text-muted-foreground">
                          Post and manage multiple scholarship programs with custom criteria, deadlines, and application requirements
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-950 flex items-center justify-center">
                          <CheckCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Application Tracking</h4>
                        <p className="text-sm text-muted-foreground">
                          Monitor application status, review progress, and coordinate across departments with real-time updates
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-950 flex items-center justify-center">
                          <CheckCircle className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Analytics & Insights</h4>
                        <p className="text-sm text-muted-foreground">
                          Access detailed analytics on application trends, candidate demographics, and program performance
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-lg bg-orange-100 dark:bg-orange-950 flex items-center justify-center">
                          <CheckCircle className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Multi-Department Access</h4>
                        <p className="text-sm text-muted-foreground">
                          Enable multiple users from admissions, faculties, and administration with role-based permissions
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ScaleIn>

            <FadeIn delay={0.2}>
              <div>
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">
                  Trusted by Leading Institutions
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Join a growing network of universities that have modernized their recruitment process and increased their global student body.
                </p>
                <Button size="lg" asChild className="bg-gradient-to-r from-blue-600 to-cyan-600">
                  <Link href="/contact">Learn More About Partnership</Link>
                </Button>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 md:py-32 bg-muted/30">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="mx-auto max-w-2xl text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                Everything You Need
              </h2>
              <p className="text-lg text-muted-foreground">
                Comprehensive tools to manage your entire graduate recruitment lifecycle
              </p>
            </div>
          </FadeIn>

          <StaggerContainer className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <StaggerItem>
              <Card className="border-2 hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-950">
                    <Award className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-semibold mb-2">Scholarship Programs</h3>
                  <p className="text-sm text-muted-foreground">
                    Create and manage unlimited scholarship programs
                  </p>
                </CardContent>
              </Card>
            </StaggerItem>

            <StaggerItem>
              <Card className="border-2 hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-100 dark:bg-cyan-950">
                    <Target className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
                  </div>
                  <h3 className="font-semibold mb-2">Smart Matching</h3>
                  <p className="text-sm text-muted-foreground">
                    AI-powered candidate matching to your criteria
                  </p>
                </CardContent>
              </Card>
            </StaggerItem>

            <StaggerItem>
              <Card className="border-2 hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-950">
                    <BarChart className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h3 className="font-semibold mb-2">Analytics Dashboard</h3>
                  <p className="text-sm text-muted-foreground">
                    Track metrics and generate detailed reports
                  </p>
                </CardContent>
              </Card>
            </StaggerItem>

            <StaggerItem>
              <Card className="border-2 hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-950">
                    <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="font-semibold mb-2">Team Collaboration</h3>
                  <p className="text-sm text-muted-foreground">
                    Multi-user access with role permissions
                  </p>
                </CardContent>
              </Card>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScaleIn>
            <Card className="border-2 shadow-2xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20">
              <CardContent className="p-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Ready to Transform Your Recruitment?
            </h2>
                <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Join leading universities worldwide in discovering and recruiting top global talent. Modernize your graduate admissions process and expand your international reach.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                  <Button size="lg" asChild className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-lg">
                <Link href="/signup">Get Started</Link>
              </Button>
                  <Button size="lg" variant="outline" asChild className="border-2">
                <Link href="/contact">Contact Sales</Link>
              </Button>
            </div>
              </CardContent>
            </Card>
          </ScaleIn>
        </div>
      </section>
    </div>
  )
}
