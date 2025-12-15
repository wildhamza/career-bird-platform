"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Edit, User, GraduationCap, Lightbulb, FileText, Mail, Phone, MapPin, Calendar } from "lucide-react"
import { ProfileBuilderForm } from "./profile-builder-form"

interface ProfileDisplayProps {
  profile: any
}

export function ProfileDisplay({ profile }: ProfileDisplayProps) {
  const [isEditing, setIsEditing] = useState(false)

  if (isEditing) {
    return <ProfileBuilderForm profile={profile} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-indigo-50/30 dark:from-blue-950/10 dark:via-background dark:to-indigo-950/10">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              My Profile
            </h1>
            <p className="text-muted-foreground mt-1">View and manage your academic profile</p>
          </div>
          <Button onClick={() => setIsEditing(true)} size="lg" className="gap-2">
            <Edit className="h-4 w-4" />
            Edit Profile
          </Button>
        </div>

        <div className="grid gap-6">
          {/* Personal Information */}
          <Card className="border-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-600" />
                  <CardTitle>Personal Information</CardTitle>
                </div>
                <Badge variant="secondary">Basic Info</Badge>
              </div>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Full Name</p>
                <p className="font-medium">
                  {profile?.first_name} {profile?.last_name}
                </p>
              </div>
              {profile?.email && (
                <div>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Mail className="h-3 w-3" /> Email
                  </p>
                  <p className="font-medium">{profile.email}</p>
                </div>
              )}
              {profile?.phone && (
                <div>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Phone className="h-3 w-3" /> Phone
                  </p>
                  <p className="font-medium">{profile.phone}</p>
                </div>
              )}
              {profile?.date_of_birth && (
                <div>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> Date of Birth
                  </p>
                  <p className="font-medium">{new Date(profile.date_of_birth).toLocaleDateString()}</p>
                </div>
              )}
              {profile?.nationality && (
                <div>
                  <p className="text-sm text-muted-foreground">Nationality</p>
                  <p className="font-medium">{profile.nationality}</p>
                </div>
              )}
              {profile?.current_country && (
                <div>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> Current Location
                  </p>
                  <p className="font-medium">
                    {profile.current_city && `${profile.current_city}, `}{profile.current_country}
                  </p>
                </div>
              )}
              {profile?.bio && (
                <div className="md:col-span-2">
                  <p className="text-sm text-muted-foreground">Bio</p>
                  <p className="font-medium text-sm mt-1">{profile.bio}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Academic Information */}
          <Card className="border-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-blue-600" />
                  <CardTitle>Academic History</CardTitle>
                </div>
                <Badge variant="secondary">Education</Badge>
              </div>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              {profile?.university_name && (
                <div className="md:col-span-2">
                  <p className="text-sm text-muted-foreground">University</p>
                  <p className="font-medium text-lg">
                    {profile.university_name}
                    {profile.university_country && (
                      <span className="text-sm text-muted-foreground ml-2">({profile.university_country})</span>
                    )}
                  </p>
                </div>
              )}
              {profile?.current_degree && (
                <div>
                  <p className="text-sm text-muted-foreground">Degree Level</p>
                  <p className="font-medium capitalize">{profile.current_degree}</p>
                </div>
              )}
              {profile?.field_of_study && (
                <div>
                  <p className="text-sm text-muted-foreground">Field of Study</p>
                  <p className="font-medium">{profile.field_of_study}</p>
                </div>
              )}
              {profile?.gpa && (
                <div>
                  <p className="text-sm text-muted-foreground">GPA</p>
                  <p className="font-medium">
                    {profile.gpa} / {profile.gpa_scale || 4.0}
                  </p>
                </div>
              )}
              {profile?.graduation_year && (
                <div>
                  <p className="text-sm text-muted-foreground">Graduation Year</p>
                  <p className="font-medium">{profile.graduation_year}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Test Scores */}
          {(profile?.gre_verbal || profile?.gre_quant || profile?.gre_awa || profile?.toefl_score) && (
            <Card className="border-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <CardTitle>Test Scores</CardTitle>
                  </div>
                  <Badge variant="secondary">Standardized Tests</Badge>
                </div>
              </CardHeader>
              <CardContent className="grid md:grid-cols-4 gap-4">
                {profile?.gre_verbal && (
                  <div>
                    <p className="text-sm text-muted-foreground">GRE Verbal</p>
                    <p className="font-medium text-lg">{profile.gre_verbal}</p>
                  </div>
                )}
                {profile?.gre_quant && (
                  <div>
                    <p className="text-sm text-muted-foreground">GRE Quantitative</p>
                    <p className="font-medium text-lg">{profile.gre_quant}</p>
                  </div>
                )}
                {profile?.gre_awa && (
                  <div>
                    <p className="text-sm text-muted-foreground">GRE Analytical</p>
                    <p className="font-medium text-lg">{profile.gre_awa}</p>
                  </div>
                )}
                {profile?.toefl_score && (
                  <div>
                    <p className="text-sm text-muted-foreground">TOEFL</p>
                    <p className="font-medium text-lg">{profile.toefl_score}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Research Interests */}
          {profile?.research_interests && profile.research_interests.length > 0 && (
            <Card className="border-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-blue-600" />
                    <CardTitle>Research Interests</CardTitle>
                  </div>
                  <Badge variant="secondary">{profile.research_interests.length} Topics</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {profile.research_interests.map((interest: string, index: number) => (
                    <Badge key={index} variant="outline" className="px-3 py-1">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Call to Action */}
          <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-semibold mb-2">Keep Your Profile Updated</h3>
              <p className="text-muted-foreground mb-4">
                An up-to-date profile helps professors find you and match you with the best opportunities.
              </p>
              <Button onClick={() => setIsEditing(true)} variant="default" size="lg" className="gap-2">
                <Edit className="h-4 w-4" />
                Update Your Information
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
