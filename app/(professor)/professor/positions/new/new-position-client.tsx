"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import { createPosition } from "./actions"

interface NewPositionClientProps {
  defaultUniversityName?: string
  defaultUniversityCountry?: string
}

export function NewPositionClient({ defaultUniversityName, defaultUniversityCountry }: NewPositionClientProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    grant_type: "scholarship" as "scholarship" | "fellowship" | "research_grant" | "travel_grant",
    university_name: defaultUniversityName || "",
    university_country: defaultUniversityCountry || "",
    degree_levels: [] as string[],
    fields_of_study: [] as string[],
    eligible_countries: [] as string[],
    min_gpa: "",
    funding_amount: "",
    stipend_monthly: "",
    covers_tuition: true,
    covers_living: false,
    deadline: "",
    start_date: "",
    duration_months: "",
    language: "English",
    application_url: "",
  })

  const degreeLevels = ["bachelors", "masters", "phd", "postdoc"]
  const grantTypes = [
    { value: "scholarship", label: "Scholarship" },
    { value: "fellowship", label: "Fellowship" },
    { value: "research_grant", label: "Research Grant" },
    { value: "travel_grant", label: "Travel Grant" },
  ]

  const commonFields = [
    "Computer Science",
    "Engineering",
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "Medicine",
    "Business",
    "Economics",
    "Psychology",
    "Education",
    "Arts",
  ]

  const commonCountries = [
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

  const handleArrayToggle = (field: "degree_levels" | "fields_of_study" | "eligible_countries", value: string) => {
    setFormData((prev) => {
      const current = prev[field]
      const updated = current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value]
      return { ...prev, [field]: updated }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await createPosition({
        ...formData,
        degree_levels: formData.degree_levels as any[],
        fields_of_study: formData.fields_of_study,
        eligible_countries: formData.eligible_countries,
        min_gpa: formData.min_gpa ? parseFloat(formData.min_gpa) : null,
        duration_months: formData.duration_months ? parseInt(formData.duration_months) : null,
        deadline: formData.deadline || null,
        start_date: formData.start_date || null,
        university_name: formData.university_name || null,
        university_country: formData.university_country || null,
      })

      if (result.success) {
        router.push(`/professor/dashboard`)
      } else {
        alert(result.error || "Failed to create position")
      }
    } catch (error) {
      console.error("Error creating position:", error)
      alert("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/professor/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>Provide the essential details about this position</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Position Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., PhD Scholarship in Machine Learning"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the position, research focus, and what makes it unique..."
              rows={6}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="grant_type">Position Type *</Label>
            <Select
              value={formData.grant_type}
              onValueChange={(value: any) => setFormData({ ...formData, grant_type: value })}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {grantTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="university_name">University Name</Label>
              <Input
                id="university_name"
                value={formData.university_name || ""}
                onChange={(e) => setFormData({ ...formData, university_name: e.target.value })}
                placeholder="e.g., Massachusetts Institute of Technology"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="university_country">University Country</Label>
              <Select
                value={formData.university_country || ""}
                onValueChange={(value) => setFormData({ ...formData, university_country: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {commonCountries.map((country) => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Eligibility */}
      <Card>
        <CardHeader>
          <CardTitle>Eligibility Requirements</CardTitle>
          <CardDescription>Define who can apply for this position</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Degree Levels *</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {degreeLevels.map((level) => (
                <div key={level} className="flex items-center space-x-2">
                  <Checkbox
                    id={`degree-${level}`}
                    checked={formData.degree_levels.includes(level)}
                    onCheckedChange={() => handleArrayToggle("degree_levels", level)}
                  />
                  <Label
                    htmlFor={`degree-${level}`}
                    className="text-sm font-normal cursor-pointer capitalize"
                  >
                    {level}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Fields of Study</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-48 overflow-y-auto p-2 border rounded-md">
              {commonFields.map((field) => (
                <div key={field} className="flex items-center space-x-2">
                  <Checkbox
                    id={`field-${field}`}
                    checked={formData.fields_of_study.includes(field)}
                    onCheckedChange={() => handleArrayToggle("fields_of_study", field)}
                  />
                  <Label htmlFor={`field-${field}`} className="text-sm font-normal cursor-pointer">
                    {field}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Eligible Countries</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-h-48 overflow-y-auto p-2 border rounded-md">
              {commonCountries.map((country) => (
                <div key={country} className="flex items-center space-x-2">
                  <Checkbox
                    id={`country-${country}`}
                    checked={formData.eligible_countries.includes(country)}
                    onCheckedChange={() => handleArrayToggle("eligible_countries", country)}
                  />
                  <Label htmlFor={`country-${country}`} className="text-sm font-normal cursor-pointer">
                    {country}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="min_gpa">Minimum GPA (Optional)</Label>
            <Input
              id="min_gpa"
              type="number"
              step="0.1"
              min="0"
              max="4"
              value={formData.min_gpa}
              onChange={(e) => setFormData({ ...formData, min_gpa: e.target.value })}
              placeholder="e.g., 3.5"
            />
          </div>
        </CardContent>
      </Card>

      {/* Funding */}
      <Card>
        <CardHeader>
          <CardTitle>Funding Details</CardTitle>
          <CardDescription>Specify the financial support provided</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="funding_amount">Funding Amount</Label>
              <Input
                id="funding_amount"
                value={formData.funding_amount}
                onChange={(e) => setFormData({ ...formData, funding_amount: e.target.value })}
                placeholder="e.g., $30,000 per year"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stipend_monthly">Monthly Stipend</Label>
              <Input
                id="stipend_monthly"
                value={formData.stipend_monthly}
                onChange={(e) => setFormData({ ...formData, stipend_monthly: e.target.value })}
                placeholder="e.g., $2,500/month"
              />
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="covers_tuition"
                checked={formData.covers_tuition}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, covers_tuition: checked === true })
                }
              />
              <Label htmlFor="covers_tuition" className="cursor-pointer">
                Covers Tuition
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="covers_living"
                checked={formData.covers_living}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, covers_living: checked === true })
                }
              />
              <Label htmlFor="covers_living" className="cursor-pointer">
                Covers Living Expenses
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Timeline</CardTitle>
          <CardDescription>Important dates and duration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="deadline">Application Deadline</Label>
              <Input
                id="deadline"
                type="datetime-local"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="start_date">Start Date</Label>
              <Input
                id="start_date"
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration_months">Duration (Months)</Label>
              <Input
                id="duration_months"
                type="number"
                min="1"
                value={formData.duration_months}
                onChange={(e) => setFormData({ ...formData, duration_months: e.target.value })}
                placeholder="e.g., 36"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Details */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Select
                value={formData.language}
                onValueChange={(value) => setFormData({ ...formData, language: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="English">English</SelectItem>
                  <SelectItem value="German">German</SelectItem>
                  <SelectItem value="French">French</SelectItem>
                  <SelectItem value="Spanish">Spanish</SelectItem>
                  <SelectItem value="Chinese">Chinese</SelectItem>
                  <SelectItem value="Japanese">Japanese</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="application_url">Application URL (Optional)</Label>
              <Input
                id="application_url"
                type="url"
                value={formData.application_url}
                onChange={(e) => setFormData({ ...formData, application_url: e.target.value })}
                placeholder="https://..."
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submit */}
      <div className="flex justify-end gap-4">
        <Button variant="outline" type="button" asChild>
          <Link href="/professor/dashboard">Cancel</Link>
        </Button>
        <Button type="submit" disabled={loading || !formData.title || !formData.description || formData.degree_levels.length === 0}>
          <Save className="mr-2 h-4 w-4" />
          {loading ? "Creating..." : "Create Position"}
        </Button>
      </div>
    </form>
  )
}
