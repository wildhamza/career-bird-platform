"use server"

import { getSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export async function saveProfile(formData: {
  firstName: string
  lastName: string
  email: string
  phone?: string
  nationality?: string
  currentCountry?: string
  currentCity?: string
  dateOfBirth?: string
  bio?: string
  university?: string
  universityName?: string
  universityCountry?: string
  degree?: string
  fieldOfStudy?: string
  gpa?: string
  gpaScale?: string
  graduationYear?: string
  greVerbal?: string
  greQuant?: string
  greAwa?: string
  toeflScore?: string
  researchInterests?: string
}) {
  const supabase = await getSupabaseServerClient()

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const updates: any = {
    first_name: formData.firstName,
    last_name: formData.lastName,
    email: formData.email,
    phone: formData.phone || null,
    nationality: formData.nationality || null,
    current_country: formData.currentCountry || null,
    current_city: formData.currentCity || null,
    date_of_birth: formData.dateOfBirth || null,
    bio: formData.bio || null,
    university_id: formData.university || null,
    university_name: formData.universityName || null,
    university_country: formData.universityCountry || null,
    current_degree: formData.degree || null,
    field_of_study: formData.fieldOfStudy || null,
    gpa: formData.gpa ? Number.parseFloat(formData.gpa) : null,
    gpa_scale: formData.gpaScale ? Number.parseFloat(formData.gpaScale) : 4.0,
    graduation_year: formData.graduationYear ? Number.parseInt(formData.graduationYear) : null,
    gre_verbal: formData.greVerbal ? Number.parseInt(formData.greVerbal) : null,
    gre_quant: formData.greQuant ? Number.parseInt(formData.greQuant) : null,
    gre_awa: formData.greAwa ? Number.parseFloat(formData.greAwa) : null,
    toefl_score: formData.toeflScore ? Number.parseInt(formData.toeflScore) : null,
    research_interests: formData.researchInterests
      ? formData.researchInterests.split(",").map((s: string) => s.trim()).filter(Boolean)
      : [],
    updated_at: new Date().toISOString(),
    user_id: user.id,
  }

  try {
    const { error } = await supabase
      .from("profiles")
      .upsert(updates, { onConflict: "user_id" })

    if (error) {
      console.error("Error saving profile:", error)
      throw new Error("Failed to save profile")
    }

    return { success: true }
  } catch (error) {
    console.error("Error in saveProfile:", error)
    throw error
  }
}
