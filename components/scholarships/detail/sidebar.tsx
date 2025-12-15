"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, AlertCircle, Users, HelpCircle } from "lucide-react"
import Link from "next/link"

interface ScholarshipDetailSidebarProps {
  grant: any
}

export function ScholarshipDetailSidebar({ grant }: ScholarshipDetailSidebarProps) {
  const deadline = grant.deadline ? new Date(grant.deadline) : null
  const daysLeft = deadline ? Math.ceil((deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : null

  return (
    <div className="space-y-6">
      <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-transparent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Deadline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <p className="text-3xl font-bold">
              {deadline
                ? deadline.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                : "TBD"}
            </p>
            <p className="text-sm text-muted-foreground">Application close at 11:59 PM GMT</p>
          </div>

          {daysLeft !== null && daysLeft > 0 && (
            <div
              className={`mb-4 flex items-center gap-2 rounded-lg p-3 ${daysLeft <= 12 ? "bg-orange-100" : "bg-blue-100"}`}
            >
              {daysLeft <= 12 && <AlertCircle className="h-5 w-5 text-orange-600" />}
              <p className={`text-sm font-medium ${daysLeft <= 12 ? "text-orange-900" : "text-blue-900"}`}>
                {daysLeft <= 12 ? `Only ${daysLeft} days left!` : `${daysLeft} days remaining`}
              </p>
            </div>
          )}

          <Button asChild className="w-full" size="lg">
            <Link href={`/scholarships/${grant.id}/apply`}>Apply Now</Link>
          </Button>

          <Button variant="outline" className="mt-2 w-full bg-transparent">
            Save for Later
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-green-100 p-2">
              <Users className="h-5 w-5 text-green-700" />
            </div>
            <CardTitle>University of Oxford</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Ranking</p>
            <p className="font-semibold">#1 World Ranking (THE)</p>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground">Location</p>
            <p className="font-semibold">Oxford, United Kingdom</p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-transparent">
        <CardContent className="p-6">
          <div className="mb-4 flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-purple-600" />
            <p className="font-semibold">Need help applying?</p>
          </div>
          <p className="mb-4 text-sm text-muted-foreground">
            Connect with a Career Bird mentor who is an alum of this program.
          </p>
          <Button asChild variant="outline" className="w-full bg-transparent">
            <Link href="/mentors">Find a Mentor</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
