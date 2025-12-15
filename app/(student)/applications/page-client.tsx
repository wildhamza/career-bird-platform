"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Filter, FileText, Calendar, MapPin, CheckCircle2, Clock, XCircle, Eye, Download } from "lucide-react"
import Link from "next/link"
import { ApplicationsList } from "@/components/applications/applications-list"
import { FadeIn } from "@/components/animations/fade-in"
import { StaggerContainer, StaggerItem } from "@/components/animations/stagger-container"

interface Application {
  id: string
  status: string
  submitted_at?: string
  r_score?: number
  match_score?: number
  grants?: {
    id: string
    title?: string
    deadline?: string
    universities?: {
      name?: string
      city?: string
      country?: string
    }
  }
}

interface ApplicationsPageClientProps {
  applications: Application[]
}

function getStatusBadge(status: string) {
  switch (status) {
    case "accepted":
      return (
        <Badge className="bg-green-100 text-green-700 border-green-200 dark:bg-green-900 dark:text-green-300">
          <CheckCircle2 className="mr-1 h-3 w-3" />
          Accepted
        </Badge>
      )
    case "rejected":
      return (
        <Badge className="bg-red-100 text-red-700 border-red-200 dark:bg-red-900 dark:text-red-300">
          <XCircle className="mr-1 h-3 w-3" />
          Rejected
        </Badge>
      )
    case "under_review":
    case "submitted":
      return (
        <Badge className="bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900 dark:text-blue-300">
          <Clock className="mr-1 h-3 w-3" />
          Under Review
        </Badge>
      )
    case "shortlisted":
      return (
        <Badge className="bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900 dark:text-purple-300">
          <CheckCircle2 className="mr-1 h-3 w-3" />
          Shortlisted
        </Badge>
      )
    case "interview":
      return (
        <Badge className="bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900 dark:text-orange-300">
          <Calendar className="mr-1 h-3 w-3" />
          Interview
        </Badge>
      )
    case "draft":
      return (
        <Badge variant="outline" className="border-gray-300">
          <FileText className="mr-1 h-3 w-3" />
          Draft
        </Badge>
      )
    default:
      return (
        <Badge variant="outline">
          <Clock className="mr-1 h-3 w-3" />
          {status}
        </Badge>
      )
  }
}

export function ApplicationsPageClient({ applications }: ApplicationsPageClientProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const stats = useMemo(() => {
    const filtered = searchQuery
      ? applications.filter((app) => {
          const query = searchQuery.toLowerCase()
          const grant = app.grants
          const university = grant?.universities
          return (
            grant?.title?.toLowerCase().includes(query) ||
            university?.name?.toLowerCase().includes(query) ||
            university?.country?.toLowerCase().includes(query) ||
            app.status.toLowerCase().includes(query)
          )
        })
      : applications

    return {
      total: applications.length,
      submitted: applications.filter((app) => app.status === "submitted" || app.status === "under_review").length,
      accepted: applications.filter((app) => app.status === "accepted").length,
      pending: applications.filter((app) => app.status === "draft").length,
      filtered: filtered.length,
    }
  }, [applications, searchQuery])

  const filteredApplications = useMemo(() => {
    if (!searchQuery.trim()) return applications

    const query = searchQuery.toLowerCase()
    return applications.filter((application) => {
      const grant = application.grants
      const university = grant?.universities
      return (
        grant?.title?.toLowerCase().includes(query) ||
        university?.name?.toLowerCase().includes(query) ||
        university?.country?.toLowerCase().includes(query) ||
        application.status.toLowerCase().includes(query)
      )
    })
  }, [applications, searchQuery])

  return (
    <>
      {/* Stats Cards */}
      <FadeIn delay={0.1}>
        <StaggerContainer className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <StaggerItem>
            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="text-3xl sm:text-4xl font-bold">{stats.total}</div>
                <p className="text-sm text-muted-foreground mt-2">Total Applications</p>
          </CardContent>
        </Card>
          </StaggerItem>
          <StaggerItem>
            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="text-3xl sm:text-4xl font-bold text-blue-600">{stats.submitted}</div>
                <p className="text-sm text-muted-foreground mt-2">Under Review</p>
          </CardContent>
        </Card>
          </StaggerItem>
          <StaggerItem>
            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="text-3xl sm:text-4xl font-bold text-green-600">{stats.accepted}</div>
                <p className="text-sm text-muted-foreground mt-2">Accepted</p>
          </CardContent>
        </Card>
          </StaggerItem>
          <StaggerItem>
            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="text-3xl sm:text-4xl font-bold text-gray-600">{stats.pending}</div>
                <p className="text-sm text-muted-foreground mt-2">Drafts</p>
          </CardContent>
        </Card>
          </StaggerItem>
        </StaggerContainer>
      </FadeIn>

      {/* Search and Filter */}
      <FadeIn delay={0.3}>
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search applications by university, grant title, or status..."
              className="pl-12 h-12 border-2"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
          <Button variant="outline" className="w-full sm:w-auto h-12 border-2">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
      </div>
      </FadeIn>

      {/* Applications List */}
      <FadeIn delay={0.4}>
      <ApplicationsList applications={filteredApplications} searchQuery={searchQuery} />
      </FadeIn>
    </>
  )
}
