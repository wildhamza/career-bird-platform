"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2Icon, Sparkles, Award, Target } from "lucide-react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

export default function ConfirmEmailPage() {
  const router = useRouter()
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          window.location.href = "/dashboard"
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-8 bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-green-950/20 dark:via-background dark:to-emerald-950/20">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg"
      >
        <Card className="border-2 shadow-xl">
          <CardContent className="p-8 sm:p-12 space-y-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: 360 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto h-24 w-24 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg relative"
            >
              <CheckCircle2Icon className="h-12 w-12 text-white" />
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute inset-0 rounded-full bg-green-500/20"
              />
            </motion.div>

            <div className="space-y-3">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent"
              >
                Email Confirmed!
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-base sm:text-lg text-muted-foreground"
              >
                Your email has been successfully verified. Your account is now active and ready to use!
              </motion.p>
          </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="grid gap-4"
            >
              <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-2">
                <CardContent className="p-4 flex items-center gap-3 text-left">
                  <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="h-5 w-5 text-white" />
          </div>
                  <div>
                    <p className="font-semibold text-sm">Full Access Unlocked</p>
                    <p className="text-xs text-muted-foreground">Browse thousands of scholarships</p>
        </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border-2">
                <CardContent className="p-4 flex items-center gap-3 text-left">
                  <div className="h-10 w-10 rounded-xl bg-purple-600 flex items-center justify-center flex-shrink-0">
                    <Target className="h-5 w-5 text-white" />
            </div>
            <div>
                    <p className="font-semibold text-sm">Personalized Matches</p>
                    <p className="text-xs text-muted-foreground">Get opportunities tailored to you</p>
            </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 border-2">
                <CardContent className="p-4 flex items-center gap-3 text-left">
                  <div className="h-10 w-10 rounded-xl bg-orange-600 flex items-center justify-center flex-shrink-0">
                    <Award className="h-5 w-5 text-white" />
          </div>
                  <div>
                    <p className="font-semibold text-sm">Application Tracking</p>
                    <p className="text-xs text-muted-foreground">Manage all your applications</p>
        </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="space-y-4"
            >
              <Button
                onClick={() => window.location.href = "/dashboard"}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg"
                size="lg"
              >
            Go to Dashboard
          </Button>

              <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            Redirecting automatically in {countdown} second{countdown !== 1 ? "s" : ""}...
          </p>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

