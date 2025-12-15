import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, Globe, Target, Users, Award, TrendingUp, Lightbulb, CheckCircle } from "lucide-react"
import { FadeIn } from "@/components/animations/fade-in"
import { StaggerContainer, StaggerItem } from "@/components/animations/stagger-container"
import { ScaleIn } from "@/components/animations/scale-in"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-green-950/20 dark:via-background dark:to-emerald-950/20" />
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
          <FadeIn>
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-balance text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              About{" "}
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                The Career Bird
              </span>
            </h1>

              <p className="mb-8 text-pretty text-lg text-muted-foreground md:text-xl leading-relaxed">
                We're on a mission to democratize access to world-class education by connecting talented students with global academic opportunities. Breaking down barriers and building bridges to success.
            </p>
          </div>
          </FadeIn>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 md:py-32 bg-muted/30">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <StaggerContainer className="grid gap-8 md:grid-cols-3">
              <StaggerItem>
                <Card className="text-center border-2 hover:shadow-xl hover:border-green-200 transition-all h-full">
                  <CardContent className="p-8">
                    <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-green-100 to-green-200 dark:from-green-950 dark:to-green-900">
                      <Heart className="h-10 w-10 text-green-600 dark:text-green-400" />
                </div>
                    <h3 className="mb-4 text-2xl font-bold">Our Mission</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Empower students worldwide to pursue their academic dreams by providing accessible pathways to scholarship opportunities and connecting them with world-class institutions and mentors.
                </p>
                  </CardContent>
                </Card>
              </StaggerItem>

              <StaggerItem>
                <Card className="text-center border-2 hover:shadow-xl hover:border-blue-200 transition-all h-full">
                  <CardContent className="p-8">
                    <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-950 dark:to-blue-900">
                      <Globe className="h-10 w-10 text-blue-600 dark:text-blue-400" />
                </div>
                    <h3 className="mb-4 text-2xl font-bold">Global Impact</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Connecting talented students worldwide with opportunities at universities across the globe, fostering diversity and global collaboration in academia.
                </p>
                  </CardContent>
                </Card>
              </StaggerItem>

              <StaggerItem>
                <Card className="text-center border-2 hover:shadow-xl hover:border-purple-200 transition-all h-full">
                  <CardContent className="p-8">
                    <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-950 dark:to-purple-900">
                      <Target className="h-10 w-10 text-purple-600 dark:text-purple-400" />
                </div>
                    <h3 className="mb-4 text-2xl font-bold">Our Vision</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Build a future where exceptional talent and transformative opportunities connect seamlessly, regardless of geographical location or economic circumstances.
                </p>
                  </CardContent>
                </Card>
              </StaggerItem>
            </StaggerContainer>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 md:py-32">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <FadeIn>
              <div>
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">
              Our Story
            </h2>
                <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
              <p>
                    The Career Bird was founded on a simple belief: exceptional talent exists everywhere, but opportunity doesn't. Too many brilliant minds go unrecognized simply because they lack access to the right networks and resources.
              </p>
              <p>
                    We started with a vision to bridge this gap by creating a platform that connects ambitious students with professors and universities seeking exceptional candidates for their research programs. What began as a simple matching service has evolved into a comprehensive ecosystem supporting every step of the graduate journey.
              </p>
              <p>
                    Today, we're proud to have helped thousands of students secure life-changing scholarships and research positions at leading universities across the globe. But our work is far from finished—we continue to innovate and expand, driven by the belief that education can transform lives and shape a better future for all.
                  </p>
                </div>
              </div>
            </FadeIn>

            <ScaleIn delay={0.2}>
              <Card className="border-2 shadow-xl">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-6">Our Commitment</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    We're dedicated to connecting talented students with world-class academic opportunities. Every day, we work to break down barriers and make graduate education more accessible to exceptional minds around the globe.
                  </p>
                </CardContent>
              </Card>
            </ScaleIn>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 md:py-32 bg-muted/30">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="mx-auto max-w-2xl text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                Our Values
              </h2>
              <p className="text-lg text-muted-foreground">
                The principles that guide everything we do
              </p>
            </div>
          </FadeIn>

          <StaggerContainer className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <StaggerItem>
              <Card className="border-2 hover:shadow-lg transition-shadow h-full">
                <CardContent className="p-6">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-950">
                    <CheckCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-bold mb-2">Accessibility</h3>
                  <p className="text-sm text-muted-foreground">
                    Making world-class education accessible to talented students everywhere
                  </p>
                </CardContent>
              </Card>
            </StaggerItem>

            <StaggerItem>
              <Card className="border-2 hover:shadow-lg transition-shadow h-full">
                <CardContent className="p-6">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 dark:bg-green-950">
                    <Lightbulb className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="font-bold mb-2">Innovation</h3>
                  <p className="text-sm text-muted-foreground">
                    Continuously improving our platform with cutting-edge technology
                  </p>
                </CardContent>
              </Card>
            </StaggerItem>

            <StaggerItem>
              <Card className="border-2 hover:shadow-lg transition-shadow h-full">
                <CardContent className="p-6">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-950">
                    <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="font-bold mb-2">Community</h3>
                  <p className="text-sm text-muted-foreground">
                    Building a supportive global network of students and institutions
                  </p>
                </CardContent>
              </Card>
            </StaggerItem>

            <StaggerItem>
              <Card className="border-2 hover:shadow-lg transition-shadow h-full">
                <CardContent className="p-6">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 dark:bg-orange-950">
                    <Award className="h-6 w-6 text-orange-600 dark:text-orange-400" />
          </div>
                  <h3 className="font-bold mb-2">Excellence</h3>
                  <p className="text-sm text-muted-foreground">
                    Maintaining the highest standards in everything we deliver
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
            <Card className="border-2 shadow-2xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
              <CardContent className="p-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Join Our Community
            </h2>
                <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Be part of a global network of students, professors, and universities committed to advancing academic excellence and breaking down barriers to education.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                  <Button size="lg" asChild className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg">
                <Link href="/signup">Get Started Today</Link>
              </Button>
                  <Button size="lg" variant="outline" asChild className="border-2">
                <Link href="/scholarships">Browse Opportunities</Link>
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
