import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Users, MessageSquare, Award } from "lucide-react"
import { FadeIn } from "@/components/animations/fade-in"
import { StaggerContainer, StaggerItem } from "@/components/animations/stagger-container"

export default function MentorsPage() {
  return (
    <div className="min-h-screen bg-background">

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-purple-950/20 dark:via-background dark:to-pink-950/20" />

        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="mx-auto max-w-3xl text-center">
            <FadeIn delay={0.1}>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-4 py-2 text-sm text-purple-700 dark:border-purple-800 dark:bg-purple-950/30 dark:text-purple-300">
              <Users className="h-4 w-4" />
              Connect with Expert Mentors
            </div>
            </FadeIn>

            <FadeIn delay={0.2}>
            <h1 className="mb-6 text-balance text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Find Your Academic{" "}
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Mentor
              </span>
            </h1>
            </FadeIn>

            <FadeIn delay={0.3}>
            <p className="mb-8 text-pretty text-lg text-muted-foreground md:text-xl">
              Connect with experienced mentors from top universities worldwide. Get personalized guidance for your MS/PhD journey.
            </p>
            </FadeIn>

            <FadeIn delay={0.4}>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button size="lg" asChild>
                <Link href="/signup">Get Started</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/scholarships">Browse Scholarships</Link>
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
              Why Choose Our Mentors?
            </h2>
            <p className="text-lg text-muted-foreground">
              Our mentors are carefully vetted professors and researchers from leading universities
            </p>
          </div>
          </FadeIn>

          <StaggerContainer className="grid gap-8 md:grid-cols-3">
            <StaggerItem>
            <div className="group relative rounded-2xl border bg-card p-8 hover:shadow-lg transition-shadow">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-950">
                <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Expert Guidance</h3>
              <p className="text-muted-foreground">
                Get one-on-one mentorship from professors at top universities worldwide
              </p>
            </div>
            </StaggerItem>

            <StaggerItem>
            <div className="group relative rounded-2xl border bg-card p-8 hover:shadow-lg transition-shadow">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-pink-100 dark:bg-pink-950">
                <MessageSquare className="h-6 w-6 text-pink-600 dark:text-pink-400" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Direct Communication</h3>
              <p className="text-muted-foreground">
                Chat directly with mentors and get answers to your questions quickly
              </p>
            </div>
            </StaggerItem>

            <StaggerItem>
            <div className="group relative rounded-2xl border bg-card p-8 hover:shadow-lg transition-shadow">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-950">
                <Award className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Proven Success</h3>
              <p className="text-muted-foreground">
                Our mentors have helped hundreds of students secure scholarships and admissions
              </p>
            </div>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Ready to Get Mentored?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join thousands of students who found their path to academic success through our mentorship program.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button size="lg" asChild className="bg-purple-600 hover:bg-purple-700">
                <Link href="/signup">Find Your Mentor</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/">Learn More</Link>
              </Button>
            </div>
          </div>
          </FadeIn>
        </div>
      </section>
    </div>
  )
}
