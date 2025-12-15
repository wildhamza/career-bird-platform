"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Check, ChevronLeft, ChevronRight, Upload, CalendarIcon, Plus } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"

interface ProfileEditFormProps {
  profile: any
}

export function ProfileEditForm({ profile }: ProfileEditFormProps) {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  // Form state
  const [firstName, setFirstName] = useState(profile?.first_name || "")
  const [lastName, setLastName] = useState(profile?.last_name || "")
  const [email, setEmail] = useState(profile?.email || "")
  const [phone, setPhone] = useState(profile?.phone || "")
  const [dateOfBirth, setDateOfBirth] = useState<Date | undefined>(
    profile?.date_of_birth ? new Date(profile.date_of_birth) : undefined,
  )
  const [nationality, setNationality] = useState(profile?.nationality || "")
  const [currentCountry, setCurrentCountry] = useState(profile?.current_country || "")
  const [currentCity, setCurrentCity] = useState(profile?.current_city || "")
  const [bio, setBio] = useState(profile?.bio || "")

  // Academic info
  const [universityName, setUniversityName] = useState(profile?.university_name || "")
  const [universityCountry, setUniversityCountry] = useState(profile?.university_country || "")
  const [currentDegree, setCurrentDegree] = useState(profile?.current_degree || "")
  const [fieldOfStudy, setFieldOfStudy] = useState(profile?.field_of_study || "")
  const [gpa, setGpa] = useState(profile?.gpa?.toString() || "")
  const [gpaScale, setGpaScale] = useState(profile?.gpa_scale?.toString() || "4.0")
  const [graduationYear, setGraduationYear] = useState(profile?.graduation_year?.toString() || "")

  const countries = [
    "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Argentina", "Armenia", "Australia",
    "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium",
    "Benin", "Bhutan", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria",
    "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Canada", "Cape Verde", "Central African Republic",
    "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica", "Croatia", "Cuba",
    "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominican Republic", "DR Congo", "Ecuador",
    "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia", "Fiji", "Finland",
    "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Guatemala", "Guinea",
    "Guinea-Bissau", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq",
    "Ireland", "Israel", "Italy", "Ivory Coast", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya",
    "Kiribati", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya",
    "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali",
    "Malta", "Marshall Islands", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia",
    "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands",
    "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway", "Oman",
    "Other", "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Peru", "Philippines",
    "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Samoa", "San Marino", "Saudi Arabia",
    "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands",
    "Somalia", "South Africa", "South Korea", "Spain", "Sri Lanka", "Sudan", "Swaziland", "Sweden",
    "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Togo", "Tonga", "Trinidad and Tobago",
    "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "UAE", "Uganda", "Ukraine", "United Kingdom",
    "United States", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
  ]

  // Test scores
  const [greVerbal, setGreVerbal] = useState(profile?.gre_verbal?.toString() || "")
  const [greQuant, setGreQuant] = useState(profile?.gre_quant?.toString() || "")
  const [greAwa, setGreAwa] = useState(profile?.gre_awa?.toString() || "")
  const [toeflScore, setToeflScore] = useState(profile?.toefl_score?.toString() || "")

  // Research
  const [researchInterests, setResearchInterests] = useState(profile?.research_interests?.join(", ") || "")

  const totalSteps = 5
  const progress = (step / totalSteps) * 100

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleSaveDraft = async () => {
    await handleSubmit(false)
  }

  const handleSubmit = async (isComplete = true) => {
    setIsLoading(true)

    const supabase = getSupabaseBrowserClient()

    const updates = {
      first_name: firstName,
      last_name: lastName,
      email,
      phone,
      date_of_birth: dateOfBirth?.toISOString(),
      nationality,
      current_country: currentCountry,
      current_city: currentCity,
      bio,
      university_name: universityName || null,
      university_country: universityCountry || null,
      current_degree: currentDegree || null,
      field_of_study: fieldOfStudy,
      gpa: gpa ? Number.parseFloat(gpa) : null,
      gpa_scale: gpaScale ? Number.parseFloat(gpaScale) : 4.0,
      graduation_year: graduationYear ? Number.parseInt(graduationYear) : null,
      gre_verbal: greVerbal ? Number.parseInt(greVerbal) : null,
      gre_quant: greQuant ? Number.parseInt(greQuant) : null,
      gre_awa: greAwa ? Number.parseFloat(greAwa) : null,
      toefl_score: toeflScore ? Number.parseInt(toeflScore) : null,
      research_interests: researchInterests
        ? researchInterests
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : null,
      profile_completed: isComplete,
      updated_at: new Date().toISOString(),
    }

    const { error } = await supabase.from("profiles").upsert(updates, { onConflict: "user_id" })

    setIsLoading(false)

    if (!error) {
      router.push("/dashboard")
      router.refresh()
    }
  }

  const completedSteps = [true, step > 1, step > 2, step > 3, step > 4]

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold">Academic History</h1>
          <p className="mt-1 text-sm sm:text-base text-muted-foreground">Please provide details about your educational background.</p>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-xs sm:text-sm font-medium text-green-700 shrink-0">
          <Check className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="hidden sm:inline">All changes saved</span>
          <span className="sm:hidden">Saved</span>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto pb-2">
        {[1, 2, 3, 4, 5].map((s) => (
          <div key={s} className="flex flex-1 items-center gap-1 sm:gap-2 min-w-0">
            <div
              className={cn(
                "flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-full text-xs sm:text-sm font-medium shrink-0",
                step === s
                  ? "bg-blue-600 text-white"
                  : completedSteps[s - 1]
                    ? "bg-green-500 text-white"
                    : "bg-muted text-muted-foreground",
              )}
            >
              {completedSteps[s - 1] && s < step ? <Check className="h-3 w-3 sm:h-4 sm:w-4" /> : s}
            </div>
            {s < 5 && <div className="h-0.5 flex-1 bg-muted min-w-[20px]" />}
          </div>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {step === 1 && "Introduction"}
            {step === 2 && "Personal Details"}
            {step === 3 && "Academic History"}
            {step === 4 && "Research Interests"}
            {step === 5 && "Documents"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {step === 1 && (
            <>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="space-y-2">
                <Label>Date of Birth</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !dateOfBirth && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateOfBirth ? format(dateOfBirth, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={dateOfBirth} onSelect={setDateOfBirth} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="nationality">Nationality *</Label>
                  <Input id="nationality" value={nationality} onChange={(e) => setNationality(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currentCountry">Current Country *</Label>
                  <Input
                    id="currentCountry"
                    value={currentCountry}
                    onChange={(e) => setCurrentCountry(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="currentCity">Current City</Label>
                <Input id="currentCity" value={currentCity} onChange={(e) => setCurrentCity(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about yourself..."
                  rows={4}
                />
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="university_name">University / Institution Name *</Label>
                <Input
                  id="university_name"
                  value={universityName}
                  onChange={(e) => setUniversityName(e.target.value)}
                  placeholder="e.g., Massachusetts Institute of Technology"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="university_country">University Country *</Label>
                <Select value={universityCountry} onValueChange={setUniversityCountry} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {countries.map((country) => (
                      <SelectItem key={country} value={country}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="degree">Degree Level *</Label>
                  <Select value={currentDegree} onValueChange={setCurrentDegree}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select degree" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bachelors">Bachelor of Science (BSc)</SelectItem>
                      <SelectItem value="masters">Master of Science (MSc)</SelectItem>
                      <SelectItem value="phd">PhD</SelectItem>
                      <SelectItem value="postdoc">Postdoc</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="field">Major / Field of Study *</Label>
                  <Input id="field" value={fieldOfStudy} onChange={(e) => setFieldOfStudy(e.target.value)} />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="gpa">CGPA / Grade *</Label>
                  <Input id="gpa" type="number" step="0.01" value={gpa} onChange={(e) => setGpa(e.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gpaScale">Maximum Possible CGPA</Label>
                  <Input
                    id="gpaScale"
                    type="number"
                    step="0.1"
                    value={gpaScale}
                    onChange={(e) => setGpaScale(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="graduation">Graduation Year</Label>
                  <Input
                    id="graduation"
                    type="number"
                    value={graduationYear}
                    onChange={(e) => setGraduationYear(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Test Scores (Optional)</Label>
                <div className="grid gap-4 md:grid-cols-2">
                  <Input
                    placeholder="GRE Verbal"
                    type="number"
                    value={greVerbal}
                    onChange={(e) => setGreVerbal(e.target.value)}
                  />
                  <Input
                    placeholder="GRE Quantitative"
                    type="number"
                    value={greQuant}
                    onChange={(e) => setGreQuant(e.target.value)}
                  />
                  <Input
                    placeholder="GRE Analytical Writing"
                    type="number"
                    step="0.1"
                    value={greAwa}
                    onChange={(e) => setGreAwa(e.target.value)}
                  />
                  <Input
                    placeholder="TOEFL Score"
                    type="number"
                    value={toeflScore}
                    onChange={(e) => setToeflScore(e.target.value)}
                  />
                </div>
              </div>
            </>
          )}

          {step === 4 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="research">Research Interests</Label>
                <Textarea
                  id="research"
                  value={researchInterests}
                  onChange={(e) => setResearchInterests(e.target.value)}
                  placeholder="Machine Learning, Healthcare AI, Computer Vision (comma separated)"
                  rows={4}
                />
                <p className="text-sm text-muted-foreground">
                  Separate multiple interests with commas. This helps us match you with relevant opportunities.
                </p>
              </div>

              <div className="rounded-lg bg-blue-50 p-4">
                <p className="text-sm font-medium">Pro Tip:</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Professors look for consistency in research topics. Align your major with your stated interests.
                </p>
              </div>
            </>
          )}

          {step === 5 && (
            <>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Transcripts & Certificates</Label>
                  <div className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors hover:border-primary">
                    <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
                    <p className="text-sm font-medium">Click to upload or drag and drop</p>
                    <p className="text-xs text-muted-foreground">PDF, JPG (MAX. 5MB)</p>
                  </div>
                </div>
              </div>

              <Button
                onClick={() => {
                  // Add degree functionality here
                }}
                variant="outline"
                className="w-full"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add another degree
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <Button onClick={handleBack} variant="outline" disabled={step === 1} className="w-full sm:w-auto order-2 sm:order-1">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <Button onClick={handleSaveDraft} variant="ghost" disabled={isLoading} className="w-full sm:w-auto order-3 sm:order-2">
          Save as Draft
        </Button>

        {step < totalSteps ? (
          <Button onClick={handleNext} className="w-full sm:w-auto order-1 sm:order-3">
            Next: {step === 1 ? "Personal" : step === 2 ? "Academic" : step === 3 ? "Research" : "Documents"}
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={() => handleSubmit(true)} disabled={isLoading} className="w-full sm:w-auto order-1 sm:order-3">
            {isLoading ? "Saving..." : "Complete Profile"}
          </Button>
        )}
      </div>
    </div>
  )
}
