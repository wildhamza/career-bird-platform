"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, MapPin, Building2, Mail, BookOpen, Users, Filter, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { FadeIn } from "@/components/animations/fade-in"
import { StaggerContainer, StaggerItem } from "@/components/animations/stagger-container"

interface Professor {
  id: string
  user_id: string
  first_name: string
  last_name: string
  email: string
  department: string
  title?: string
  research_interests?: string[]
  research_areas?: string[]
  h_index?: number
  publications_count?: number
  university_id: string
  universities: {
    id: string
    name: string
    country: string
    city: string
  }
}

interface ProfessorsClientProps {
  professors: Professor[]
}

export function ProfessorsClient({ professors }: ProfessorsClientProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCountry, setSelectedCountry] = useState<string>("")
  const [selectedDepartment, setSelectedDepartment] = useState<string>("")
  const [showFilters, setShowFilters] = useState(false)

  // Get unique countries and departments
  const countries = useMemo(() => {
    return Array.from(new Set(professors.map(p => p.universities?.country).filter(Boolean)))
  }, [professors])

  const departments = useMemo(() => {
    return Array.from(new Set(professors.map(p => p.department).filter(Boolean)))
  }, [professors])

  // Filter professors
  const filteredProfessors = useMemo(() => {
    return professors.filter(professor => {
      const searchLower = searchQuery.toLowerCase()
      const researchTopics = professor.research_areas || professor.research_interests || []
      
      const matchesSearch = 
        professor.first_name?.toLowerCase().includes(searchLower) ||
        professor.last_name?.toLowerCase().includes(searchLower) ||
        professor.department?.toLowerCase().includes(searchLower) ||
        professor.universities?.name?.toLowerCase().includes(searchLower) ||
        researchTopics.some(interest => 
          interest.toLowerCase().includes(searchLower)
        )

      const matchesCountry = !selectedCountry || professor.universities?.country === selectedCountry
      const matchesDepartment = !selectedDepartment || professor.department === selectedDepartment

      return matchesSearch && matchesCountry && matchesDepartment
    })
  }, [professors, searchQuery, selectedCountry, selectedDepartment])

  const clearFilters = () => {
    setSelectedCountry("")
    setSelectedDepartment("")
    setSearchQuery("")
  }

  const activeFiltersCount = [selectedCountry, selectedDepartment].filter(Boolean).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-indigo-50/30 dark:from-blue-950/10 dark:via-background dark:to-indigo-950/10">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <FadeIn>
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Find Professors
            </h1>
            <p className="text-muted-foreground">
              Connect with {professors.length} professors and researchers at top universities worldwide
            </p>
          </div>
        </FadeIn>

        {/* Search and Filter Bar */}
        <FadeIn delay={0.1}>
          <Card className="mb-6 border-2">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, department, university, or research interest..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Filter Toggle */}
                <Button
                  variant={showFilters ? "default" : "outline"}
                  onClick={() => setShowFilters(!showFilters)}
                  className="gap-2"
                >
                  <Filter className="h-4 w-4" />
                  Filters
                  {activeFiltersCount > 0 && (
                    <Badge variant="secondary" className="ml-1">
                      {activeFiltersCount}
                    </Badge>
                  )}
                </Button>
              </div>

              {/* Expandable Filters */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="grid md:grid-cols-3 gap-4 mt-4 pt-4 border-t">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Country</label>
                        <select
                          value={selectedCountry}
                          onChange={(e) => setSelectedCountry(e.target.value)}
                          className="w-full h-10 px-3 rounded-md border bg-background"
                        >
                          <option value="">All Countries</option>
                          {countries.map(country => (
                            <option key={country} value={country}>{country}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">Department</label>
                        <select
                          value={selectedDepartment}
                          onChange={(e) => setSelectedDepartment(e.target.value)}
                          className="w-full h-10 px-3 rounded-md border bg-background"
                        >
                          <option value="">All Departments</option>
                          {departments.map(dept => (
                            <option key={dept} value={dept}>{dept}</option>
                          ))}
                        </select>
                      </div>

                      <div className="flex items-end">
                        <Button
                          variant="outline"
                          onClick={clearFilters}
                          className="w-full gap-2"
                        >
                          <X className="h-4 w-4" />
                          Clear Filters
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </FadeIn>

        {/* Results Count */}
        <FadeIn delay={0.2}>
          <div className="mb-4 text-sm text-muted-foreground">
            Showing {filteredProfessors.length} of {professors.length} professors
          </div>
        </FadeIn>

        {/* Professors Grid */}
        {filteredProfessors.length === 0 ? (
          <FadeIn delay={0.3}>
            <Card className="p-12 text-center">
              <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No professors found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search or filters
              </p>
              <Button onClick={clearFilters} variant="outline">
                Clear Filters
              </Button>
            </Card>
          </FadeIn>
        ) : (
          <StaggerContainer>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProfessors.map((professor) => {
                const initials = `${professor.first_name?.[0] || ""}${professor.last_name?.[0] || ""}`.toUpperCase()
                
                return (
                  <StaggerItem key={professor.id}>
                    <Card className="h-full hover:shadow-lg transition-shadow border-2 hover:border-blue-200">
                      <CardContent className="p-6">
                        {/* Professor Header */}
                        <div className="flex items-start gap-4 mb-4">
                          <Avatar className="h-16 w-16">
                            <AvatarImage src="" />
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-lg">
                              {initials}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-lg truncate">
                              {professor.title && `${professor.title} `}
                              {professor.first_name} {professor.last_name}
                            </h3>
                            {professor.department && (
                              <p className="text-sm text-muted-foreground truncate">
                                {professor.department}
                              </p>
                            )}
                            {professor.h_index && (
                              <p className="text-xs text-muted-foreground">
                                h-index: {professor.h_index} • {professor.publications_count} publications
                              </p>
                            )}
                          </div>
                        </div>

                        {/* University */}
                        {professor.universities && (
                          <div className="flex items-start gap-2 mb-3 text-sm">
                            <Building2 className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="font-medium">{professor.universities.name}</p>
                              <p className="text-muted-foreground text-xs">
                                {professor.universities.city && `${professor.universities.city}, `}
                                {professor.universities.country}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Research Areas */}
                        {(() => {
                          const researchTopics = professor.research_areas || professor.research_interests || []
                          return researchTopics.length > 0 && (
                            <div className="mb-4">
                              <div className="flex items-center gap-1 mb-2">
                                <BookOpen className="h-3 w-3 text-muted-foreground" />
                                <span className="text-xs font-medium text-muted-foreground">Research Areas</span>
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {researchTopics.slice(0, 3).map((interest, idx) => (
                                  <Badge key={idx} variant="secondary" className="text-xs">
                                    {interest}
                                  </Badge>
                                ))}
                                {researchTopics.length > 3 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{researchTopics.length - 3} more
                                  </Badge>
                                )}
                              </div>
                            </div>
                          )
                        })()}

                        {/* Contact */}
                        <Button className="w-full gap-2" asChild>
                          <Link href={`/messages?userId=${professor.user_id}`}>
                            <Mail className="h-4 w-4" />
                            Contact Professor
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  </StaggerItem>
                )
              })}
            </div>
          </StaggerContainer>
        )}
      </div>
    </div>
  )
}
