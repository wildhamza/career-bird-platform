"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2Icon, CircleIcon, UploadIcon, Menu, X } from "lucide-react"
import { saveProfile } from "@/app/(student)/profile/edit/actions"

interface ProfileBuilderFormProps {
  profile: any
}

type Step = "introduction" | "personal" | "academic" | "research" | "documents" | "review"

export function ProfileBuilderForm({ profile }: ProfileBuilderFormProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<Step>("introduction")
  const [loading, setLoading] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [transcriptFile, setTranscriptFile] = useState<File | null>(null)
  const [documentFile, setDocumentFile] = useState<File | null>(null)
  const [formData, setFormData] = useState({
    firstName: profile?.first_name || "",
    lastName: profile?.last_name || "",
    email: profile?.email || "",
    phone: profile?.phone || "",
    nationality: profile?.nationality || "",
    currentCountry: profile?.current_country || "",
    currentCity: profile?.current_city || "",
    dateOfBirth: profile?.date_of_birth || "",
    bio: profile?.bio || "",
    university: profile?.university_id || "",
    universityName: profile?.university_name || "",
    universityCountry: profile?.university_country || "",
    degree: profile?.current_degree || "",
    fieldOfStudy: profile?.field_of_study || "",
    gpa: profile?.gpa?.toString() || "",
    gpaScale: profile?.gpa_scale?.toString() || "4.0",
    graduationYear: profile?.graduation_year?.toString() || "",
    greVerbal: profile?.gre_verbal?.toString() || "",
    greQuant: profile?.gre_quant?.toString() || "",
    greAwa: profile?.gre_awa?.toString() || "",
    toeflScore: profile?.toefl_score?.toString() || "",
    startDate: "",
    endDate: "",
    researchInterests: profile?.research_interests?.join(", ") || "",
  })

  // Sync form data when profile changes
  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.first_name || "",
        lastName: profile.last_name || "",
        email: profile.email || "",
        phone: profile.phone || "",
        nationality: profile.nationality || "",
        currentCountry: profile.current_country || "",
        currentCity: profile.current_city || "",
        dateOfBirth: profile.date_of_birth || "",
        bio: profile.bio || "",
        university: profile.university_id || "",
        universityName: profile.university_name || "",
        universityCountry: profile.university_country || "",
        degree: profile.current_degree || "",
        fieldOfStudy: profile.field_of_study || "",
        gpa: profile.gpa?.toString() || "",
        gpaScale: profile.gpa_scale?.toString() || "4.0",
        graduationYear: profile.graduation_year?.toString() || "",
        greVerbal: profile.gre_verbal?.toString() || "",
        greQuant: profile.gre_quant?.toString() || "",
        greAwa: profile.gre_awa?.toString() || "",
        toeflScore: profile.toefl_score?.toString() || "",
        startDate: "",
        endDate: "",
        researchInterests: profile.research_interests?.join(", ") || "",
      })
    }
  }, [profile])


  // Check if each step is completed based on form data
  const isStepComplete = (stepId: Step): boolean => {
    switch (stepId) {
      case "introduction":
        return !!(formData.firstName && formData.lastName && formData.email)
      case "personal":
        return !!(formData.dateOfBirth || formData.nationality || formData.bio)
      case "academic":
        return !!(formData.universityName && formData.degree && formData.fieldOfStudy)
      case "research":
        return !!formData.researchInterests
      case "documents":
        return !!(transcriptFile || documentFile)
      case "review":
        return false // Review is never marked complete
      default:
        return false
    }
  }

  const steps: { id: Step; label: string; completed: boolean }[] = [
    { id: "introduction", label: "Introduction", completed: isStepComplete("introduction") },
    { id: "personal", label: "Personal Details", completed: isStepComplete("personal") },
    { id: "academic", label: "Academic History", completed: isStepComplete("academic") },
    { id: "research", label: "Research Interests", completed: isStepComplete("research") },
    { id: "documents", label: "Documents", completed: isStepComplete("documents") },
    { id: "review", label: "Review", completed: false },
  ]

  const currentStepIndex = steps.findIndex((step) => step.id === currentStep)
  const progress = ((currentStepIndex + 1) / steps.length) * 100

  const handleSave = async () => {
    setLoading(true)

    try {
      // Call server action to save profile
      await saveProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        nationality: formData.nationality,
        currentCountry: formData.currentCountry,
        currentCity: formData.currentCity,
        dateOfBirth: formData.dateOfBirth,
        bio: formData.bio,
        university: formData.university,
        universityName: formData.universityName,
        universityCountry: formData.universityCountry,
        degree: formData.degree,
        fieldOfStudy: formData.fieldOfStudy,
        gpa: formData.gpa,
        gpaScale: formData.gpaScale,
        graduationYear: formData.graduationYear,
        greVerbal: formData.greVerbal,
        greQuant: formData.greQuant,
        greAwa: formData.greAwa,
        toeflScore: formData.toeflScore,
        researchInterests: formData.researchInterests,
      })

      setLoading(false)

      if (currentStep === "review") {
        // Force full reload to update navbar and profile data everywhere
        window.location.href = "/dashboard"
      } else {
        // Move to next step
        const nextIndex = currentStepIndex + 1
        if (nextIndex < steps.length) {
          setCurrentStep(steps[nextIndex].id)
        }
      }
    } catch (error) {
      setLoading(false)
      console.error("Error saving profile:", error)
      alert("Failed to save profile. Please try again.")
    }
  }

  const handleBack = () => {
    const prevIndex = currentStepIndex - 1
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex].id)
    }
  }

  // Calculate actual completion percentage based on completed steps
  const calculateCompletion = () => {
    const completedSteps = steps.filter(step => step.completed).length
    const totalSteps = steps.length - 1 // Exclude review step from total
    return Math.round((completedSteps / totalSteps) * 100)
  }

  const completion = calculateCompletion()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8">
              <Image 
                src="/logo.png" 
                alt="The Career Bird Logo" 
                width={32} 
                height={32}
                className="object-contain"
              />
            </div>
            <span className="font-semibold text-lg hidden sm:inline-block">The Career Bird</span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-sm text-muted-foreground hidden sm:inline-block">
              {formData.firstName || "Profile"}
            </span>
            <Link href="/dashboard">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 cursor-pointer hover:opacity-80 transition-opacity" />
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Mobile Menu Toggle */}
        <div className="lg:hidden mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-full justify-between"
          >
            <span>Profile Builder Menu</span>
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>

        <div className="grid lg:grid-cols-[280px_1fr] gap-6 lg:gap-8">
          {/* Sidebar - Hidden on mobile, shown on desktop or when mobile menu is open */}
          <div className={`${mobileMenuOpen ? "block" : "hidden"} lg:block space-y-6`}>
            <div>
              <h3 className="font-semibold mb-2 text-sm sm:text-base">Profile Builder</h3>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-muted-foreground">{completion}% Complete</span>
                </div>
                <Progress value={completion} className="h-2" />
              </div>
            </div>

            <nav className="space-y-1">
              {steps.map((step) => (
                <button
                  key={step.id}
                  onClick={() => setCurrentStep(step.id)}
                  className={`w-full flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 rounded-lg text-xs sm:text-sm transition-colors ${
                    currentStep === step.id
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted text-muted-foreground"
                  }`}
                >
                  {step.completed ? (
                    <CheckCircle2Icon className="h-4 w-4 flex-shrink-0 text-green-600" />
                  ) : (
                    <CircleIcon className="h-4 w-4 flex-shrink-0" />
                  )}
                  <span className="truncate">{step.label}</span>
                </button>
              ))}
            </nav>

            <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-start gap-2">
                  <div className="h-6 w-6 rounded bg-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs">💡</span>
                  </div>
                  <div className="text-sm">
                    <p className="font-medium text-blue-900 dark:text-blue-100 mb-1">Pro Tip:</p>
                    <p className="text-blue-700 dark:text-blue-300 text-xs">
                      Professors look for consistency in research topics. Align your major with your stated interests.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="space-y-6">
            {/* Introduction Step */}
            {currentStep === "introduction" && (
              <div>
                <div className="mb-4 sm:mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold mb-2">Introduction</h2>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    Let's start with your basic information.
                  </p>
                </div>

                <Card>
                  <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                          id="firstName"
                          value={formData.firstName}
                          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input
                          id="lastName"
                          value={formData.lastName}
                          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                  </CardContent>
                </Card>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 sm:pt-6">
                  <div className="w-full sm:w-auto" />
                  <Button 
                    onClick={handleSave} 
                    disabled={loading || !formData.firstName || !formData.lastName || !formData.email} 
                    className="w-full sm:w-auto"
                  >
                    {loading ? "Saving..." : "Next: Personal Details"}
                    <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Button>
                </div>
              </div>
            )}

            {/* Personal Details Step */}
            {currentStep === "personal" && (
              <div>
                <div className="mb-4 sm:mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold mb-2">Personal Details</h2>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    Tell us more about yourself.
                  </p>
                </div>

                <Card>
                  <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="dateOfBirth">Date of Birth</Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="nationality">Nationality</Label>
                        <Input
                          id="nationality"
                          value={formData.nationality}
                          onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="currentCountry">Current Country</Label>
                        <Input
                          id="currentCountry"
                          value={formData.currentCountry}
                          onChange={(e) => setFormData({ ...formData, currentCountry: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="currentCity">Current City</Label>
                      <Input
                        id="currentCity"
                        value={formData.currentCity}
                        onChange={(e) => setFormData({ ...formData, currentCity: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        placeholder="Tell us about yourself..."
                        rows={4}
                      />
                    </div>
                  </CardContent>
                </Card>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 sm:pt-6">
                  <Button variant="outline" onClick={handleBack} className="w-full sm:w-auto">
                    Back
                  </Button>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
                    <Button variant="outline" onClick={handleSave} disabled={loading} className="w-full sm:w-auto">
                      Save as Draft
                    </Button>
                    <Button onClick={handleSave} disabled={loading} className="w-full sm:w-auto">
                      Next: Academic History
                      <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Academic Step */}
            {currentStep === "academic" && (
              <div>
                <div className="mb-4 sm:mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold mb-2">Academic History</h2>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    Please provide details about your educational background.
                  </p>
                </div>

                <Card>
                  <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="universityName">University / Institution Name *</Label>
                        <Input
                          id="universityName"
                          placeholder="e.g., Harvard University, MIT, Oxford University"
                          value={formData.universityName}
                          onChange={(e) => setFormData({ ...formData, universityName: e.target.value })}
                          required
                        />
                        <p className="text-xs text-muted-foreground">
                          Enter the full name of your university or institution
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="universityCountry">Country *</Label>
                        <Input
                          id="universityCountry"
                          placeholder="e.g., United States, United Kingdom, Pakistan"
                          value={formData.universityCountry}
                          onChange={(e) => setFormData({ ...formData, universityCountry: e.target.value })}
                          required
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="degree">Degree Level *</Label>
                          <Select
                            value={formData.degree}
                            onValueChange={(value) => setFormData({ ...formData, degree: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select your degree level" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="bachelors">Bachelor's Degree</SelectItem>
                              <SelectItem value="masters">Master of Science (MSc)</SelectItem>
                              <SelectItem value="phd">PhD / Doctorate</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="field">Major / Field of Study *</Label>
                          <Input
                            id="field"
                            placeholder="Computer Science"
                            value={formData.fieldOfStudy}
                            onChange={(e) => setFormData({ ...formData, fieldOfStudy: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="startDate">Start Date</Label>
                          <Input
                            id="startDate"
                            type="date"
                            value={formData.startDate}
                            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="endDate">End Date (Expected)</Label>
                          <Input
                            id="endDate"
                            type="date"
                            value={formData.endDate}
                            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="gpa">CGPA / Grade</Label>
                          <Input
                            id="gpa"
                            type="number"
                            step="0.01"
                            placeholder="3.8"
                            value={formData.gpa}
                            onChange={(e) => setFormData({ ...formData, gpa: e.target.value })}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="gpaScale">Maximum Possible CGPA</Label>
                          <Input
                            id="gpaScale"
                            type="number"
                            step="0.1"
                            placeholder="4.0"
                            value={formData.gpaScale}
                            onChange={(e) => setFormData({ ...formData, gpaScale: e.target.value })}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="graduationYear">Graduation Year</Label>
                          <Input
                            id="graduationYear"
                            type="number"
                            placeholder="2025"
                            value={formData.graduationYear}
                            onChange={(e) => setFormData({ ...formData, graduationYear: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Test Scores (Optional)</Label>
                        <div className="grid md:grid-cols-2 gap-4">
                          <Input
                            placeholder="GRE Verbal"
                            type="number"
                            value={formData.greVerbal}
                            onChange={(e) => setFormData({ ...formData, greVerbal: e.target.value })}
                          />
                          <Input
                            placeholder="GRE Quantitative"
                            type="number"
                            value={formData.greQuant}
                            onChange={(e) => setFormData({ ...formData, greQuant: e.target.value })}
                          />
                          <Input
                            placeholder="GRE Analytical Writing"
                            type="number"
                            step="0.1"
                            value={formData.greAwa}
                            onChange={(e) => setFormData({ ...formData, greAwa: e.target.value })}
                          />
                          <Input
                            placeholder="TOEFL Score"
                            type="number"
                            value={formData.toeflScore}
                            onChange={(e) => setFormData({ ...formData, toeflScore: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="transcripts">Transcripts & Certificates (Optional)</Label>
                        <div 
                          className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary cursor-pointer transition-colors"
                          onClick={() => document.getElementById('transcript-upload')?.click()}
                        >
                          <input
                            id="transcript-upload"
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (file) {
                                if (file.size > 5 * 1024 * 1024) {
                                  alert('File size must be less than 5MB')
                                  return
                                }
                                setTranscriptFile(file)
                              }
                            }}
                          />
                          <UploadIcon className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                          {transcriptFile ? (
                            <>
                              <p className="text-sm font-medium mb-1 text-green-600">
                                ✓ {transcriptFile.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {(transcriptFile.size / 1024).toFixed(0)} KB - Click to change
                              </p>
                            </>
                          ) : (
                            <>
                              <p className="text-sm font-medium mb-1">Click to upload or drag and drop</p>
                              <p className="text-xs text-muted-foreground">PDF, JPG, PNG (MAX. 5MB)</p>
                            </>
                          )}
                        </div>
                        {transcriptFile && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              setTranscriptFile(null)
                              const input = document.getElementById('transcript-upload') as HTMLInputElement
                              if (input) input.value = ''
                            }}
                            className="w-full text-red-600 hover:text-red-700"
                          >
                            Remove File
                          </Button>
                        )}
                      </div>

                      <Button variant="link" className="text-primary">
                        + Add another degree
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 sm:pt-6">
                  <Button variant="outline" onClick={handleBack} className="w-full sm:w-auto">
                    Back
                  </Button>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
                    <Button variant="outline" onClick={handleSave} disabled={loading} className="w-full sm:w-auto">
                      Save as Draft
                    </Button>
                    <Button onClick={handleSave} disabled={loading} className="w-full sm:w-auto">
                      Next: Research
                      <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Research Interests Step */}
            {currentStep === "research" && (
              <div>
                <div className="mb-4 sm:mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold mb-2">Research Interests</h2>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    Tell us about your research interests and areas of expertise.
                  </p>
                </div>

                <Card>
                  <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="researchInterests">Research Interests</Label>
                      <Textarea
                        id="researchInterests"
                        value={formData.researchInterests}
                        onChange={(e) => setFormData({ ...formData, researchInterests: e.target.value })}
                        placeholder="Machine Learning, Healthcare AI, Computer Vision (comma separated)"
                        rows={6}
                      />
                      <p className="text-sm text-muted-foreground">
                        Separate multiple interests with commas. This helps us match you with relevant opportunities.
                      </p>
                    </div>

                    <div className="rounded-lg bg-blue-50 dark:bg-blue-950/20 p-4">
                      <p className="text-sm font-medium text-blue-900 dark:text-blue-100">Pro Tip:</p>
                      <p className="mt-1 text-sm text-blue-700 dark:text-blue-300">
                        Professors look for consistency in research topics. Align your major with your stated interests.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 sm:pt-6">
                  <Button variant="outline" onClick={handleBack} className="w-full sm:w-auto">
                    Back
                  </Button>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
                    <Button variant="outline" onClick={handleSave} disabled={loading} className="w-full sm:w-auto">
                      Save as Draft
                    </Button>
                    <Button onClick={handleSave} disabled={loading} className="w-full sm:w-auto">
                      Next: Documents
                      <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Documents Step */}
            {currentStep === "documents" && (
              <div>
                <div className="mb-4 sm:mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold mb-2">Documents</h2>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    Upload your academic documents and certificates.
                  </p>
                </div>

                <Card>
                  <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="documents">Transcripts & Certificates</Label>
                        <div 
                          className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary cursor-pointer transition-colors"
                          onClick={() => document.getElementById('document-upload')?.click()}
                        >
                          <input
                            id="document-upload"
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (file) {
                                if (file.size > 5 * 1024 * 1024) {
                                  alert('File size must be less than 5MB')
                                  return
                                }
                                setDocumentFile(file)
                              }
                            }}
                          />
                          <UploadIcon className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                          {documentFile ? (
                            <>
                              <p className="text-sm font-medium mb-1 text-green-600">
                                ✓ {documentFile.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {(documentFile.size / 1024).toFixed(0)} KB - Click to change
                              </p>
                            </>
                          ) : (
                            <>
                              <p className="text-sm font-medium mb-1">Click to upload or drag and drop</p>
                              <p className="text-xs text-muted-foreground">PDF, JPG, PNG (MAX. 5MB)</p>
                            </>
                          )}
                        </div>
                        {documentFile && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              setDocumentFile(null)
                              const input = document.getElementById('document-upload') as HTMLInputElement
                              if (input) input.value = ''
                            }}
                            className="w-full text-red-600 hover:text-red-700"
                          >
                            Remove File
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 sm:pt-6">
                  <Button variant="outline" onClick={handleBack} className="w-full sm:w-auto">
                    Back
                  </Button>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
                    <Button variant="outline" onClick={handleSave} disabled={loading} className="w-full sm:w-auto">
                      Save as Draft
                    </Button>
                    <Button onClick={handleSave} disabled={loading} className="w-full sm:w-auto">
                      Next: Review
                      <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Review Step */}
            {currentStep === "review" && (
              <div>
                <div className="mb-4 sm:mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold mb-2">Review Your Profile</h2>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    Please review all your information before completing your profile.
                  </p>
                </div>

                <Card>
                  <CardContent className="p-4 sm:p-6 space-y-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold mb-2">Personal Information</h3>
                        <div className="text-sm space-y-1 text-muted-foreground">
                          <p><strong className="text-foreground">Name:</strong> {formData.firstName} {formData.lastName}</p>
                          <p><strong className="text-foreground">Email:</strong> {formData.email}</p>
                          {formData.phone && <p><strong className="text-foreground">Phone:</strong> {formData.phone}</p>}
                          {formData.nationality && <p><strong className="text-foreground">Nationality:</strong> {formData.nationality}</p>}
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold mb-2">Academic Information</h3>
                        <div className="text-sm space-y-1 text-muted-foreground">
                          {formData.universityName && <p><strong className="text-foreground">University:</strong> {formData.universityName}</p>}
                          {formData.universityCountry && <p><strong className="text-foreground">Country:</strong> {formData.universityCountry}</p>}
                          {formData.degree && <p><strong className="text-foreground">Degree:</strong> {formData.degree}</p>}
                          {formData.fieldOfStudy && <p><strong className="text-foreground">Field of Study:</strong> {formData.fieldOfStudy}</p>}
                          {formData.gpa && <p><strong className="text-foreground">GPA:</strong> {formData.gpa} / {formData.gpaScale}</p>}
                        </div>
                      </div>

                      {formData.researchInterests && (
                        <div>
                          <h3 className="font-semibold mb-2">Research Interests</h3>
                          <p className="text-sm text-muted-foreground">{formData.researchInterests}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 sm:pt-6">
                  <Button variant="outline" onClick={handleBack} className="w-full sm:w-auto">
                    Back
                  </Button>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
                    <Button variant="outline" onClick={handleSave} disabled={loading} className="w-full sm:w-auto">
                      Save as Draft
                    </Button>
                    <Button onClick={handleSave} disabled={loading} className="w-full sm:w-auto">
                      {loading ? "Completing..." : "Complete Profile"}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
