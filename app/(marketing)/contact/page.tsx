import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Mail, MessageSquare, Send } from "lucide-react"
import { FadeIn } from "@/components/animations/fade-in"
import { StaggerContainer, StaggerItem } from "@/components/animations/stagger-container"
import { ScaleIn } from "@/components/animations/scale-in"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">

      {/* Contact Section */}
      <section className="py-20 md:py-32">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl">
            <FadeIn>
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
                Get in Touch
              </h1>
              <p className="text-lg text-muted-foreground">
                Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
              </p>
            </div>
            </FadeIn>

            <StaggerContainer className="grid gap-6 md:grid-cols-2 mb-12">
              <StaggerItem>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-950">
                    <Mail className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-semibold mb-2">Email Us</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    For general inquiries
                  </p>
                  <a href="mailto:info@thecareerbird.com" className="text-sm text-primary hover:underline">
                    info@thecareerbird.com
                  </a>
                </CardContent>
              </Card>
              </StaggerItem>

              <StaggerItem>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-950">
                    <MessageSquare className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="font-semibold mb-2">Support</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Need help? Contact support
                  </p>
                  <a href="mailto:support@thecareerbird.com" className="text-sm text-primary hover:underline">
                    support@thecareerbird.com
                  </a>
                </CardContent>
              </Card>
              </StaggerItem>
            </StaggerContainer>

            <ScaleIn delay={0.3}>
            <Card>
              <CardContent className="p-6">
                <form className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" placeholder="John" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" placeholder="Doe" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="john@example.com" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input id="subject" placeholder="How can we help?" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea 
                      id="message" 
                      placeholder="Tell us more about your inquiry..." 
                      rows={6}
                      className="resize-none"
                    />
                  </div>

                  <Button className="w-full" size="lg">
                    <Send className="mr-2 h-4 w-4" />
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
            </ScaleIn>

            <FadeIn delay={0.5}>
            <p className="text-center text-sm text-muted-foreground mt-6">
              We typically respond within 24 hours during business days.
            </p>
            </FadeIn>
          </div>
        </div>
      </section>
    </div>
  )
}
