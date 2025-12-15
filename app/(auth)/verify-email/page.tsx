"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MailIcon, ArrowLeftIcon, CheckCircle } from "lucide-react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"

export default function VerifyEmailPage() {
  const [email, setEmail] = useState<string>("")
  const [resending, setResending] = useState(false)
  const [resent, setResent] = useState(false)

  useEffect(() => {
    // Get email from URL params or localStorage
    const params = new URLSearchParams(window.location.search)
    const emailParam = params.get("email")
    if (emailParam) {
      setEmail(emailParam)
    }
  }, [])

  const handleResendEmail = async () => {
    if (!email) return

    setResending(true)
    try {
      const response = await fetch("/api/auth/resend-confirmation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setResent(true)
        setTimeout(() => setResent(false), 5000)
      } else {
        console.error("Error resending email:", data.error)
      }
    } catch (error) {
      console.error("Error resending email:", error)
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-8 bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-blue-950/20 dark:via-background dark:to-indigo-950/20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg"
      >
        <Card className="border-2 shadow-xl">
          <CardContent className="p-8 sm:p-12 space-y-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto h-24 w-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg"
            >
              <MailIcon className="h-12 w-12 text-white" />
            </motion.div>

            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Check Your Email</h1>
              <p className="text-base sm:text-lg text-muted-foreground">
                We've sent a confirmation link to
              </p>
              <p className="text-lg sm:text-xl font-semibold text-blue-600 dark:text-blue-400 break-all">
                {email || "your email"}
            </p>
        </div>

            <Card className="bg-muted/50 border-2">
              <CardContent className="p-6 space-y-4 text-left">
                <h3 className="font-semibold text-base flex items-center gap-2">
                  <span className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-xs">1</span>
                  Next Steps
                </h3>
                <div className="space-y-3">
                  {[
                    "Open your email inbox",
                    "Look for an email from The Career Bird",
                    "Click the confirmation link in the email",
                    "You'll be redirected to your dashboard",
                  ].map((step, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-muted-foreground">{step}</p>
                    </motion.div>
                  ))}
        </div>
              </CardContent>
            </Card>

          {email && (
              <div className="space-y-3">
              <p className="text-sm text-muted-foreground">Didn't receive the email?</p>
              <Button
                variant="outline"
                onClick={handleResendEmail}
                disabled={resending || resent}
                  className="w-full border-2"
                  size="lg"
              >
                {resending ? "Sending..." : resent ? "Email sent! Check your inbox" : "Resend confirmation email"}
              </Button>
            </div>
          )}

            <div className="pt-6 border-t space-y-4">
            <Link href="/login">
                <Button variant="ghost" className="w-full" size="lg">
                <ArrowLeftIcon className="mr-2 h-4 w-4" />
                Back to login
              </Button>
            </Link>

        <p className="text-xs text-muted-foreground">
                The confirmation link will expire in 24 hours. Need help?{" "}
                <Link href="/contact" className="text-primary hover:underline font-medium">
                  Contact support
          </Link>
        </p>
      </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

