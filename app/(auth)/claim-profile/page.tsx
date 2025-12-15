"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SearchIcon, CheckCircle2Icon, GraduationCap, Building2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface ProfileResult {
  id: string
  name: string
  title: string
  department: string
  university: string
  isVerified: boolean
  avatarUrl?: string
  status: "available" | "pending" | "locked"
}

export default function ClaimProfilePage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<ProfileResult[]>([])
  const [hasSearched, setHasSearched] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim() || searchQuery.trim().length < 2) {
      return
    }

    setLoading(true)
    setHasSearched(true)

    try {
      const response = await fetch(`/api/profiles/search?q=${encodeURIComponent(searchQuery.trim())}`)
      if (!response.ok) {
        throw new Error("Search failed")
      }
      const data = await response.json()
      setSearchResults(data.results || [])
    } catch (error) {
      console.error("Search error:", error)
      setSearchResults([])
    } finally {
      setLoading(false)
    }
  }

  const handleClaimProfile = (profileId: string) => {
    router.push(`/verify-identity?profile=${profileId}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-blue-950/20 dark:via-background dark:to-indigo-950/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="h-8 w-8 group-hover:scale-110 transition-transform">
              <Image 
                src="/logo.png" 
                alt="The Career Bird Logo" 
                width={32} 
                height={32}
                className="object-contain"
              />
            </div>
            <span className="font-bold text-base sm:text-lg">The Career Bird</span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              href="/for-professors"
              className="text-xs sm:text-sm text-muted-foreground hover:text-foreground hidden sm:inline transition-colors"
            >
              For Professors
            </Link>
            <Link
              href="/for-universities"
              className="text-xs sm:text-sm text-muted-foreground hover:text-foreground hidden sm:inline transition-colors"
            >
              For Universities
            </Link>
            <Link
              href="/about"
              className="text-xs sm:text-sm text-muted-foreground hover:text-foreground hidden sm:inline transition-colors"
            >
              About
            </Link>
            <Button size="sm" asChild className="bg-gradient-to-r from-blue-600 to-indigo-600">
              <Link href="/login">Login</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-12 sm:py-16 px-4 sm:px-6">
        <div className="mx-auto max-w-4xl space-y-8 sm:space-y-12">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-4 sm:space-y-6"
          >
            <div className="inline-flex h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 items-center justify-center mb-4">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
              Claim Your Academic Profile
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Verify your identity to manage scholarships, showcase your research, and connect with global talent from leading universities.
            </p>
          </motion.div>

          {/* Search Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-2 shadow-lg">
              <CardContent className="p-6 sm:p-8">
                <form onSubmit={handleSearch} className="space-y-4 sm:space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Search for your profile</label>
                    <div className="relative">
                      <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder="Search by name, title, or department..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-12 text-base h-14 border-2 focus:border-blue-500"
                        required
                        minLength={2}
                      />
                    </div>
                    {searchQuery.trim().length > 0 && searchQuery.trim().length < 2 && (
                      <p className="text-xs text-muted-foreground">
                        Please enter at least 2 characters to search
                      </p>
                    )}
                  </div>
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 h-14 text-base shadow-lg"
                    disabled={loading || searchQuery.trim().length < 2}
                  >
                    {loading ? "Searching..." : "Search Profiles"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Search Results */}
          <AnimatePresence mode="wait">
            {hasSearched && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <h2 className="text-xl sm:text-2xl font-bold">
                    Search Results
                    <Badge variant="secondary" className="ml-3 text-sm">
                      {searchResults.length} profile{searchResults.length !== 1 ? "s" : ""} found
                    </Badge>
                  </h2>
                </div>

                {searchResults.length > 0 ? (
                  <div className="space-y-4">
                    {searchResults.map((profile, index) => (
                      <motion.div
                        key={profile.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card className="hover:shadow-xl transition-all border-2 hover:border-blue-200">
                          <CardContent className="p-6 sm:p-8">
                            <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                              {/* Avatar */}
                              <div className="relative">
                                <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shrink-0 flex items-center justify-center">
                                  <Building2 className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                                </div>
                                {profile.isVerified && (
                                  <div className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-green-500 flex items-center justify-center border-4 border-background">
                                    <CheckCircle2Icon className="h-4 w-4 text-white" />
                                  </div>
                                )}
                              </div>

                              {/* Profile Info */}
                              <div className="flex-1 min-w-0 w-full">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                  <div className="space-y-2 min-w-0 flex-1">
                                    <h3 className="font-bold text-lg sm:text-xl">{profile.name}</h3>
                                    <p className="text-base text-muted-foreground font-medium">{profile.title}</p>
                                    <div className="flex flex-wrap gap-2">
                                      <Badge variant="secondary" className="text-xs">
                                        {profile.department}
                                      </Badge>
                                      {profile.university && (
                                        <Badge variant="outline" className="text-xs">
                                          {profile.university}
                                        </Badge>
                                      )}
                                    </div>
                                  </div>

                                  {/* Action Button */}
                                  <div className="shrink-0 w-full sm:w-auto">
                                    {profile.status === "available" && (
                                      <Button
                                        onClick={() => handleClaimProfile(profile.id)}
                                        className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg"
                                        size="lg"
                                      >
                                        Claim Profile
                                      </Button>
                                    )}
                                    {profile.status === "pending" && (
                                      <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                                        Pending Verification
                                      </Badge>
                                    )}
                                    {profile.status === "locked" && (
                                      <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                                        Profile Locked
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <Card className="border-2 border-dashed bg-muted/30">
                    <CardContent className="p-8 sm:p-12 text-center space-y-4">
                      <SearchIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-bold text-xl sm:text-2xl">No profiles found</h3>
                      <p className="text-base text-muted-foreground max-w-md mx-auto">
                        Try a different search query or create a new verified academic profile to get started.
                      </p>
                      <Button size="lg" asChild className="bg-gradient-to-r from-blue-600 to-indigo-600">
                        <Link href="/signup">Create New Profile</Link>
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {/* Create New Profile */}
                {searchResults.length > 0 && (
                  <Card className="border-2 border-dashed bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30">
                    <CardContent className="p-8 sm:p-12 text-center space-y-4">
                      <h3 className="font-bold text-xl sm:text-2xl">Don't see your profile?</h3>
                      <p className="text-base text-muted-foreground max-w-xl mx-auto">
                        If you couldn't find your existing profile in our database, you can create a new verified
                        academic profile to get started.
                      </p>
                      <Button size="lg" asChild className="bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg">
                        <Link href="/signup">Create New Profile</Link>
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-20 py-8 bg-background/50 backdrop-blur-sm">
        <div className="container flex flex-col sm:flex-row items-center justify-between gap-4 px-4 sm:px-6 text-sm text-muted-foreground">
          <p>&copy; 2025 The Career Bird. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-6">
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">
              Terms of Service
            </Link>
            <Link href="/contact" className="hover:text-foreground transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
