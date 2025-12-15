"use client"

import { useState, useEffect, useMemo, memo, useCallback } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { SearchIcon, BookmarkIcon, ArrowRightIcon, CalendarIcon, Filter, X, ChevronLeft, ChevronRight, Loader2, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"
import { FadeIn } from "@/components/animations/fade-in"
import { StaggerContainer, StaggerItem } from "@/components/animations/stagger-container"
import { motion, AnimatePresence } from "framer-motion"

interface ScholarshipsPageClientProps {
  initialGrants: any[]
  initialUser?: any
  initialSavedGrants?: string[]
  totalCount?: number
}

export function ScholarshipsPageClient({ 
  initialGrants, 
  initialUser = null,
  initialSavedGrants = [],
  totalCount = 0
}: ScholarshipsPageClientProps) {
  const router = useRouter()
  const [grants, setGrants] = useState<any[]>(initialGrants)
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState({
    degreeLevels: [] as string[],
    countries: [] as string[],
    fields: [] as string[],
  })
  const [savedGrants, setSavedGrants] = useState<Set<string>>(new Set(initialSavedGrants))
  const [user, setUser] = useState<any>(initialUser)
  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 15
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(totalCount > initialGrants.length)

  // Try to get user on client side (optional, won't fail if not authenticated)
  useEffect(() => {
    const checkUser = async () => {
      try {
        const supabase = getSupabaseBrowserClient()
        const { data: { user: currentUser }, error } = await supabase.auth.getUser()
        
        // If there's a storage error, silently fail
        if (error) {
          console.debug('Auth check skipped:', error.message)
          return
        }
        
        if (currentUser) {
          setUser(currentUser)
          // Fetch saved grants if user is logged in
          const { data: saved } = await supabase
            .from("saved_grants")
            .select("grant_id")
            .eq("user_id", currentUser.id)
          if (saved) {
            setSavedGrants(new Set(saved.map((s: { grant_id: string }) => s.grant_id)))
          }
        }
      } catch (error) {
        // User is not authenticated or storage is blocked - this is fine
        console.debug('User authentication skipped')
      }
    }
    
    // Only run if we haven't already got the user from server
    if (!initialUser) {
      checkUser()
    }
  }, [initialUser])

  const filteredGrants = useMemo(() => {
    let filtered = [...grants]

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (grant) =>
          grant.title?.toLowerCase().includes(query) ||
          grant.description?.toLowerCase().includes(query) ||
          grant.universities?.name?.toLowerCase().includes(query) ||
          grant.universities?.country?.toLowerCase().includes(query),
      )
    }

    // Degree level filter
    if (filters.degreeLevels.length > 0) {
      filtered = filtered.filter((grant) =>
        filters.degreeLevels.some((level) => grant.degree_levels?.includes(level)),
      )
    }

    // Country filter
    if (filters.countries.length > 0) {
      filtered = filtered.filter((grant) =>
        filters.countries.includes(grant.universities?.country),
      )
    }

    // Field filter
    if (filters.fields.length > 0) {
      filtered = filtered.filter((grant) =>
        filters.fields.some((field) => grant.fields_of_study?.includes(field)),
      )
    }

    return filtered
  }, [grants, searchQuery, filters])

  // Pagination logic
  const totalPages = Math.ceil(filteredGrants.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedGrants = filteredGrants.slice(startIndex, endIndex)

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, filters])

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [currentPage])

  const toggleFilter = (type: "degreeLevels" | "countries" | "fields", value: string) => {
    setFilters((prev) => {
      const current = prev[type]
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value]
      return { ...prev, [type]: updated }
    })
  }

  const clearFilters = () => {
    setFilters({ degreeLevels: [], countries: [], fields: [] })
    setSearchQuery("")
  }

  const getDaysUntilDeadline = (deadline: string | null) => {
    if (!deadline) return null
    const now = new Date()
    const deadlineDate = new Date(deadline)
    const diffTime = deadlineDate.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const formatDeadline = (deadline: string | null) => {
    if (!deadline) return null
    return new Date(deadline).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const handleBookmark = useCallback(async (grantId: string) => {
    // Redirect to login if not authenticated
    if (!user) {
      router.push("/login")
      return
    }

    try {
      const supabase = getSupabaseBrowserClient()
      const isSaved = savedGrants.has(grantId)

      if (isSaved) {
        // Optimistic update
        setSavedGrants((prev) => {
          const newSet = new Set(prev)
          newSet.delete(grantId)
          return newSet
        })
        await supabase.from("saved_grants").delete().eq("user_id", user.id).eq("grant_id", grantId)
      } else {
        // Optimistic update
        setSavedGrants((prev) => new Set([...prev, grantId]))
        await supabase.from("saved_grants").insert({
          user_id: user.id,
          grant_id: grantId,
        })
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error)
      // Revert optimistic update on error
      setSavedGrants((prev) => {
        const newSet = new Set(prev)
        if (savedGrants.has(grantId)) {
          newSet.add(grantId)
        } else {
          newSet.delete(grantId)
        }
        return newSet
      })
    }
  }, [user, router, savedGrants])

  // Load more scholarships
  const loadMore = useCallback(async () => {
    if (isLoadingMore || !hasMore) return
    
    setIsLoadingMore(true)
    try {
      const supabase = getSupabaseBrowserClient()
      const BATCH_SIZE = 30
      const { data: newGrants } = await supabase
        .from("grants")
        .select(
          `
          id,
          title,
          description,
          grant_type,
          university_id,
          degree_levels,
          fields_of_study,
          min_gpa,
          funding_amount,
          covers_tuition,
          covers_living,
          deadline,
          is_featured,
          created_at,
          universities:university_id (
            id,
            name,
            country,
            city,
            logo_url
          )
        `,
        )
        .order("created_at", { ascending: false })
        .range(grants.length, grants.length + BATCH_SIZE - 1)

      if (newGrants && newGrants.length > 0) {
        setGrants(prev => [...prev, ...newGrants])
        setHasMore(grants.length + newGrants.length < totalCount)
      } else {
        setHasMore(false)
      }
    } catch (error) {
      console.error("Error loading more scholarships:", error)
    } finally {
      setIsLoadingMore(false)
    }
  }, [isLoadingMore, hasMore, grants.length, totalCount])

  // Get unique countries and fields for filters
  const uniqueCountries = Array.from(new Set(grants.map((g) => g.universities?.country).filter(Boolean)))
  const uniqueFields = Array.from(
    new Set(grants.flatMap((g) => g.fields_of_study || []).filter(Boolean)),
  ).slice(0, 10)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-indigo-50/30 dark:from-blue-950/10 dark:via-background dark:to-indigo-950/10">

      {/* Hero Section */}
      <div className="relative overflow-hidden border-b bg-gradient-to-br from-blue-50/50 via-white to-indigo-50/50 dark:from-blue-950/10 dark:via-background dark:to-indigo-950/10">
        <div 
          className="absolute inset-0 opacity-10 dark:opacity-5"
          style={{
            backgroundImage: 'url(/images/3.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 relative">
          <FadeIn>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <span>/</span>
              <span className="text-foreground font-medium">Scholarships</span>
          </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Find Your Next Global Opportunity
            </h1>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl">
              Discover master's and PhD scholarships at top global institutions. Connect with professors and secure your
              future.
            </p>
          </FadeIn>
        </div>
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

        <div className="grid lg:grid-cols-[300px_1fr] gap-6 lg:gap-8">
          {/* Filters Sidebar */}
          <AnimatePresence>
            {(showFilters || !showFilters) && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className={`${showFilters ? "block" : "hidden"} lg:block space-y-6`}
              >
            {/* Mobile filter header */}
            <div className="lg:hidden flex items-center justify-between mb-4 pb-4 border-b">
                  <h3 className="font-semibold text-lg">Filters</h3>
              <Button variant="ghost" size="icon" onClick={() => setShowFilters(false)}>
                    <X className="h-5 w-5" />
              </Button>
            </div>

                <FadeIn>
                  <Card className="border-2 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-6 space-y-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-base flex items-center gap-2">
                    Degree Level
                  </h3>
                  <div className="space-y-3">
                    {["masters", "phd", "postdoc"].map((level) => (
                      <motion.div
                        key={level}
                        whileHover={{ x: 4 }}
                        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-accent/50 transition-colors"
                      >
                        <Checkbox
                          id={`degree-${level}`}
                          checked={filters.degreeLevels.includes(level)}
                          onCheckedChange={() => toggleFilter("degreeLevels", level)}
                          className="data-[state=checked]:bg-blue-600"
                        />
                        <Label htmlFor={`degree-${level}`} className="text-sm cursor-pointer capitalize font-medium flex-1">
                          {level === "phd" ? "PhD" : level === "postdoc" ? "Postdoc" : "Master's"}
                        </Label>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-base flex items-center gap-2">
                    Country
                  </h3>
                  <div className="space-y-2 max-h-56 overflow-y-auto custom-scrollbar">
                    {uniqueCountries.slice(0, 10).map((country) => (
                      <motion.div
                        key={country}
                        whileHover={{ x: 4 }}
                        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-accent/50 transition-colors"
                      >
                        <Checkbox
                          id={`country-${country}`}
                          checked={filters.countries.includes(country)}
                          onCheckedChange={() => toggleFilter("countries", country)}
                          className="data-[state=checked]:bg-blue-600"
                        />
                        <Label htmlFor={`country-${country}`} className="text-sm cursor-pointer font-medium flex-1">
                          {country}
                        </Label>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-base flex items-center gap-2">
                    Field of Study
                  </h3>
                  <div className="space-y-2 max-h-56 overflow-y-auto custom-scrollbar">
                    {uniqueFields.map((field) => (
                      <motion.div
                        key={field}
                        whileHover={{ x: 4 }}
                        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-accent/50 transition-colors"
                      >
                        <Checkbox
                          id={`field-${field}`}
                          checked={filters.fields.includes(field)}
                          onCheckedChange={() => toggleFilter("fields", field)}
                          className="data-[state=checked]:bg-blue-600"
                        />
                        <Label htmlFor={`field-${field}`} className="text-sm cursor-pointer font-medium flex-1">
                          {field}
                        </Label>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
                </FadeIn>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Content */}
          <div className="space-y-6">
            {/* Search and Filter Toggle */}
            <FadeIn delay={0.2}>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <div className="relative flex-1">
                  <SearchIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search scholarships by title, university, or country..."
                    className="pl-12 h-12 text-base border-2 focus:border-blue-500 transition-colors"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button
                variant="outline"
                size="lg"
                  className="lg:hidden h-12 border-2"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
                  {(filters.degreeLevels.length + filters.countries.length + filters.fields.length) > 0 && (
                    <Badge className="ml-2 bg-blue-600 text-white">
                      {filters.degreeLevels.length + filters.countries.length + filters.fields.length}
                    </Badge>
                  )}
              </Button>
            </div>
            </FadeIn>

            {/* Results Header */}
            <FadeIn delay={0.3}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-lg bg-muted/50 border">
              <div>
                  <p className="text-sm font-medium">
                    Showing <span className="text-blue-600 font-bold">{startIndex + 1}-{Math.min(endIndex, filteredGrants.length)}</span> of{" "}
                    <span className="text-blue-600 font-bold">{filteredGrants.length}</span> 
                  {searchQuery || filters.degreeLevels.length > 0 || filters.countries.length > 0 || filters.fields.length > 0
                    ? " filtered" 
                    : grants.length < totalCount 
                    ? " loaded" 
                    : ""} Scholarships
                  {grants.length < totalCount && (
                      <span className="ml-1 text-muted-foreground">
                      ({totalCount} total in database)
                    </span>
                  )}
                </p>
                {(filters.degreeLevels.length > 0 || filters.countries.length > 0 || filters.fields.length > 0) && (
                    <div className="flex items-center gap-2 mt-3 flex-wrap">
                      <span className="text-xs text-muted-foreground font-medium">Active filters:</span>
                    {filters.degreeLevels.map((level) => (
                        <motion.div
                          key={level}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                        >
                          <Badge variant="secondary" className="bg-blue-600 text-white border-0 capitalize hover:bg-blue-700 cursor-pointer">
                        {level}
                        <button
                              className="ml-2 hover:bg-blue-800 rounded-full px-1.5 transition-colors"
                          onClick={() => toggleFilter("degreeLevels", level)}
                        >
                          ×
                        </button>
                      </Badge>
                        </motion.div>
                    ))}
                    {filters.countries.map((country) => (
                        <motion.div
                          key={country}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                        >
                          <Badge variant="secondary" className="bg-green-600 text-white border-0 hover:bg-green-700 cursor-pointer">
                        {country}
                        <button
                              className="ml-2 hover:bg-green-800 rounded-full px-1.5 transition-colors"
                          onClick={() => toggleFilter("countries", country)}
                        >
                          ×
                        </button>
                      </Badge>
                        </motion.div>
                    ))}
                    {filters.fields.map((field) => (
                        <motion.div
                          key={field}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                        >
                          <Badge variant="secondary" className="bg-purple-600 text-white border-0 hover:bg-purple-700 cursor-pointer">
                        {field}
                        <button
                              className="ml-2 hover:bg-purple-800 rounded-full px-1.5 transition-colors"
                          onClick={() => toggleFilter("fields", field)}
                        >
                          ×
                        </button>
                      </Badge>
                        </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            </FadeIn>

            {/* Scholarship Cards */}
            {filteredGrants.length === 0 ? (
              <FadeIn>
                <Card className="border-2">
                <CardContent className="p-12 text-center">
                    <h3 className="text-xl font-semibold mb-2">No scholarships found</h3>
                    <p className="text-muted-foreground mb-6">Try adjusting your filters or search terms</p>
                    <Button variant="outline" onClick={clearFilters} size="lg">
                      <X className="mr-2 h-4 w-4" />
                      Clear All Filters
                  </Button>
                </CardContent>
              </Card>
              </FadeIn>
            ) : (
              <StaggerContainer className="space-y-4">
                {paginatedGrants.map((grant, index) => {
                  const daysLeft = getDaysUntilDeadline(grant.deadline)
                  const isSaved = savedGrants.has(grant.id)
                  const universityInitials = grant.universities?.name
                    ?.split(" ")
                    .map((w: string) => w[0])
                    .join("")
                    .substring(0, 3)
                    .toUpperCase() || "UNI"

                  return (
                    <StaggerItem key={grant.id}>
                      <motion.div
                        whileHover={{ y: -4 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Card className="border-2 hover:border-blue-300 hover:shadow-xl transition-all duration-300 overflow-hidden group">
                          <CardContent className="p-6">
                        <div className="flex flex-col sm:flex-row gap-4">
                          <div className="relative">
                            <div className="absolute inset-0 bg-blue-600 rounded-xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity"></div>
                            <div className="relative h-16 w-16 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 flex-shrink-0 flex items-center justify-center shadow-lg">
                            {grant.universities?.logo_url ? (
                              <img
                                src={grant.universities.logo_url}
                                alt={grant.universities.name}
                                  className="h-full w-full object-cover rounded-xl"
                              />
                            ) : (
                              <span className="text-white text-xs font-bold">{universityInitials}</span>
                            )}
                            </div>
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4 mb-2">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                  {grant.universities?.country && (
                                    <span className="text-xs font-medium text-muted-foreground uppercase">
                                      {grant.universities.country}
                                    </span>
                                  )}
                                </div>
                                <h3 className="font-semibold text-base sm:text-lg mb-1 truncate">
                                  {grant.universities?.name || "University"}
                                </h3>
                              </div>
                              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                              <Button
                                variant="ghost"
                                size="icon"
                                  className="flex-shrink-0 h-10 w-10 rounded-full hover:bg-blue-50 dark:hover:bg-blue-950"
                                onClick={() => handleBookmark(grant.id)}
                              >
                                <BookmarkIcon
                                    className={`h-5 w-5 transition-all ${isSaved ? "fill-blue-600 text-blue-600 scale-110" : "text-muted-foreground"}`}
                                />
                              </Button>
                              </motion.div>
                            </div>

                            <h4 className="font-bold text-lg sm:text-xl mb-3 group-hover:text-blue-600 transition-colors">{grant.title}</h4>

                            <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
                              {grant.description || "No description available."}
                            </p>

                            <div className="flex flex-wrap gap-2 mb-4">
                              {grant.grant_type && (
                                <Badge variant="secondary" className="text-xs capitalize bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 font-medium">
                                  {grant.grant_type.replace("_", " ")}
                                </Badge>
                              )}
                              {grant.degree_levels?.map((level: string) => (
                                <Badge key={level} variant="secondary" className="text-xs capitalize bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 font-medium">
                                  {level}
                                </Badge>
                              ))}
                              {grant.covers_tuition && (
                                <Badge variant="secondary" className="text-xs bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300 font-medium">
                                  Fully Funded
                                </Badge>
                              )}
                            </div>

                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                              <div className="flex items-center gap-1 text-sm">
                                {grant.deadline && (
                                  <>
                                    <CalendarIcon
                                      className={`h-4 w-4 ${daysLeft !== null && daysLeft <= 7 ? "text-orange-600" : "text-muted-foreground"}`}
                                    />
                                    {daysLeft !== null && daysLeft > 0 ? (
                                      <span
                                        className={daysLeft <= 7 ? "text-orange-600 font-medium" : "text-muted-foreground"}
                                      >
                                        {daysLeft} day{daysLeft !== 1 ? "s" : ""} left
                                      </span>
                                    ) : (
                                      <span className="text-muted-foreground">
                                        Deadline: {formatDeadline(grant.deadline)}
                                      </span>
                                    )}
                                  </>
                                )}
                              </div>
                              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button asChild size="sm" className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md">
                                <Link href={`/scholarships/${grant.id}`}>
                                  View Details
                                    <ArrowRightIcon className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                              </Button>
                              </motion.div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                      </motion.div>
                    </StaggerItem>
                  )
                })}
              </StaggerContainer>
            )}

            {/* Pagination */}
            {filteredGrants.length > itemsPerPage && (
              <FadeIn>
                <div className="flex items-center justify-center gap-2 mt-8 p-4 rounded-lg bg-muted/50 border-2">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                      size="default"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                      className="font-medium"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                  </motion.div>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(page => {
                      // Show first page, last page, current page, and pages around current
                      if (page === 1 || page === totalPages) return true
                      if (Math.abs(page - currentPage) <= 1) return true
                      return false
                    })
                    .map((page, index, array) => (
                      <div key={page} className="flex items-center">
                        {index > 0 && array[index - 1] !== page - 1 && (
                            <span className="px-2 text-muted-foreground font-bold">...</span>
                        )}
                          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <Button
                          variant={currentPage === page ? "default" : "outline"}
                              size="default"
                          onClick={() => setCurrentPage(page)}
                              className={`min-w-[2.5rem] font-semibold ${currentPage === page ? "bg-blue-600 hover:bg-blue-700" : ""}`}
                        >
                          {page}
                        </Button>
                          </motion.div>
                      </div>
                    ))}
                </div>

                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                      size="default"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                      className="font-medium"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
                  </motion.div>
              </div>
              </FadeIn>
            )}

            {/* Load More Button */}
            {hasMore && !searchQuery && filters.degreeLevels.length === 0 && filters.countries.length === 0 && filters.fields.length === 0 && (
              <FadeIn>
              <div className="flex justify-center mt-8">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  onClick={loadMore} 
                  disabled={isLoadingMore}
                  variant="outline"
                  size="lg"
                      className="min-w-[240px] h-12 border-2 font-semibold text-base"
                >
                  {isLoadingMore ? (
                    <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Loading More...
                    </>
                  ) : (
                        <>
                          <Sparkles className="mr-2 h-5 w-5" />
                          Load More Scholarships
                        </>
                  )}
                </Button>
                  </motion.div>
              </div>
              </FadeIn>
            )}
            
            {hasMore && (searchQuery || filters.degreeLevels.length > 0 || filters.countries.length > 0 || filters.fields.length > 0) && (
              <FadeIn>
                <Card className="mt-8 border-2 border-dashed">
                  <CardContent className="p-8 text-center">
                    <p className="font-semibold text-lg mb-2">Viewing filtered results</p>
                    <p className="text-muted-foreground mb-1">Showing {filteredGrants.length} of {grants.length} loaded scholarships.</p>
                    <p className="text-sm text-muted-foreground">Clear filters to load more from database ({totalCount} total available).</p>
                  </CardContent>
                </Card>
              </FadeIn>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
