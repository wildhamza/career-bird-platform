import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Users, Search, Award, CheckCircle, TrendingUp, Globe, Clock, Shield } from "lucide-react"
import { FadeIn } from "@/components/animations/fade-in"
import { StaggerContainer, StaggerItem } from "@/components/animations/stagger-container"
import { ScaleIn } from "@/components/animations/scale-in"

export default function ForProfessorsPage() {
  return (
    <div className="min-h-screen bg-background">

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-amber-50 dark:from-orange-950/20 dark:via-background dark:to-amber-950/20" />
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
              Find Exceptional{" "}
              <span className="bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                Research Talent
              </span>
            </h1>
            </FadeIn>

            <FadeIn delay={0.2}>
            <p className="mb-8 text-pretty text-lg text-muted-foreground md:text-xl">
                Connect with pre-vetted, high-potential graduate students from around the world. Build your dream research team with qualified candidates ready to contribute to cutting-edge research.
            </p>
            </FadeIn>

            <FadeIn delay={0.3}>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Button size="lg" asChild className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700">
                <Link href="/signup">Post a Position</Link>
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
              Build Your Dream Research Team
            </h2>
            <p className="text-lg text-muted-foreground">
                Save time and find the perfect candidates for your research positions with our comprehensive platform
              </p>
            </div>
          </FadeIn>

          <StaggerContainer className="grid gap-8 md:grid-cols-3">
            <StaggerItem>
              <div className="group relative rounded-2xl border-2 bg-card p-8 hover:shadow-xl hover:border-orange-200 transition-all">
                <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-950 dark:to-orange-900">
                  <Search className="h-7 w-7 text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="mb-3 text-xl font-bold">Smart Matching Algorithm</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Our AI-powered system analyzes research interests, publications, and skills to match you with candidates who align perfectly with your lab's focus and requirements.
                </p>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="group relative rounded-2xl border-2 bg-card p-8 hover:shadow-xl hover:border-orange-200 transition-all">
                <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-950 dark:to-amber-900">
                  <Shield className="h-7 w-7 text-amber-600 dark:text-amber-400" />
                </div>
                <h3 className="mb-3 text-xl font-bold">Pre-Vetted Candidates</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Every candidate profile includes verified academic records, test scores, research experience, and publications. Save time on initial screening and focus on the best matches.
              </p>
            </div>
            </StaggerItem>

            <StaggerItem>
              <div className="group relative rounded-2xl border-2 bg-card p-8 hover:shadow-xl hover:border-orange-200 transition-all">
                <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-red-100 to-red-200 dark:from-red-950 dark:to-red-900">
                  <Globe className="h-7 w-7 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="mb-3 text-xl font-bold">Global Talent Pool</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Access talented students from around the world actively seeking research opportunities. Expand your lab's diversity and bring in fresh perspectives from across the globe.
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
            <FadeIn>
              <div>
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">
                  Why Leading Researchers Choose Us
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Join hundreds of professors who have streamlined their recruitment process and found exceptional talent through our platform.
                </p>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-950 flex items-center justify-center">
                        <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Save Time on Recruitment</h3>
                      <p className="text-muted-foreground">
                        Pre-qualified candidates and smart filters streamline your recruitment process
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-950 flex items-center justify-center">
                        <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Increase Application Quality</h3>
                      <p className="text-muted-foreground">
                        Receive applications from motivated students who match your research criteria
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-950 flex items-center justify-center">
                        <Clock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Manage Applications Efficiently</h3>
              <p className="text-muted-foreground">
                        Track, organize, and respond to applications all in one centralized dashboard
              </p>
            </div>
                  </div>
                </div>
              </div>
            </FadeIn>

            <ScaleIn delay={0.2}>
              <Card className="border-2 shadow-xl">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-4">Global Reach</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Connect with talented candidates from around the world who are actively seeking research opportunities. Our platform brings together qualified students and leading researchers to facilitate meaningful academic collaborations.
                  </p>
                </CardContent>
              </Card>
            </ScaleIn>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 md:py-32 bg-muted/30">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground">
                Get started in minutes and find your next research star with our streamlined process
              </p>
            </div>
          </FadeIn>

          <StaggerContainer className="mx-auto max-w-5xl space-y-8">
            <StaggerItem>
              <Card className="border-2 hover:shadow-lg transition-shadow">
                <CardContent className="p-8">
                  <div className="flex flex-col md:flex-row gap-6 items-start">
                    <div className="flex-shrink-0">
                      <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-orange-600 to-amber-600 text-white flex items-center justify-center text-3xl font-bold shadow-lg">
                        1
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-3">Create Your Position Listing</h3>
                      <p className="text-muted-foreground mb-4">
                        Post detailed information about your research position, including project description, required qualifications, funding details, and application deadlines. Our intuitive form guides you through the process.
                      </p>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          Add your research focus and lab information
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          Specify degree level and required skills
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          Set application deadlines and start dates
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </StaggerItem>

            <StaggerItem>
              <Card className="border-2 hover:shadow-lg transition-shadow">
                <CardContent className="p-8">
                  <div className="flex flex-col md:flex-row gap-6 items-start">
                    <div className="flex-shrink-0">
                      <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-orange-600 to-amber-600 text-white flex items-center justify-center text-3xl font-bold shadow-lg">
                2
              </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-3">Receive Qualified Applications</h3>
                      <p className="text-muted-foreground mb-4">
                        Our platform automatically matches your position with qualified students based on their academic background, research interests, and career goals. Review applications efficiently with our organized dashboard.
                      </p>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          View complete candidate profiles with verified credentials
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          Filter and sort applications by key criteria
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          Bookmark promising candidates for later review
                        </li>
                      </ul>
                    </div>
            </div>
                </CardContent>
              </Card>
            </StaggerItem>

            <StaggerItem>
              <Card className="border-2 hover:shadow-lg transition-shadow">
                <CardContent className="p-8">
                  <div className="flex flex-col md:flex-row gap-6 items-start">
                    <div className="flex-shrink-0">
                      <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-orange-600 to-amber-600 text-white flex items-center justify-center text-3xl font-bold shadow-lg">
                3
              </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-3">Connect and Hire</h3>
                      <p className="text-muted-foreground mb-4">
                        Communicate directly with candidates through our secure messaging system. Schedule interviews, request additional materials, and make offers all within the platform. Start your research collaboration seamlessly.
              </p>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          Direct messaging with applicants
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          Schedule interviews and track responses
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          Send offers and manage onboarding
                        </li>
                      </ul>
            </div>
          </div>
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
            <Card className="border-2 shadow-2xl bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20">
              <CardContent className="p-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                  Ready to Build Your Dream Team?
            </h2>
                <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Join hundreds of professors who have found exceptional research talent through our platform. Start posting positions and receive qualified applications within days.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                  <Button size="lg" asChild className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 shadow-lg">
                <Link href="/signup">Get Started Free</Link>
              </Button>
                  <Button size="lg" variant="outline" asChild className="border-2">
                <Link href="/contact">Talk to Sales</Link>
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
