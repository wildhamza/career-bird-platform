"use server"

import { getSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

interface CreatePositionData {
  title: string
  description: string
  grant_type: "scholarship" | "fellowship" | "research_grant" | "travel_grant"
  university_name: string | null
  university_country: string | null
  degree_levels: string[]
  fields_of_study: string[]
  eligible_countries: string[]
  min_gpa: number | null
  funding_amount: string
  stipend_monthly: string
  covers_tuition: boolean
  covers_living: boolean
  deadline: string | null
  start_date: string | null
  duration_months: number | null
  language: string
  application_url: string
}

export async function createPosition(data: CreatePositionData): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await getSupabaseServerClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      redirect("/login")
    }

    // Validate required fields
    if (!data.title || !data.description || data.degree_levels.length === 0) {
      return { success: false, error: "Title, description, and at least one degree level are required" }
    }

    // Try to find or create university
    let universityId: string | null = null
    if (data.university_name && data.university_country) {
      // First, try to find existing university
      const { data: existingUni } = await supabase
        .from("universities")
        .select("id")
        .eq("name", data.university_name)
        .eq("country", data.university_country)
        .maybeSingle()

      if (existingUni) {
        universityId = existingUni.id
      } else {
        // Create new university if it doesn't exist
        const { data: newUni, error: uniError } = await supabase
          .from("universities")
          .insert({
            name: data.university_name,
            country: data.university_country,
          })
          .select("id")
          .single()

        if (!uniError && newUni) {
          universityId = newUni.id
        }
      }
    }

    // Prepare the grant data
    const grantData: any = {
      title: data.title,
      description: data.description,
      grant_type: data.grant_type,
      degree_levels: data.degree_levels,
      fields_of_study: data.fields_of_study.length > 0 ? data.fields_of_study : null,
      eligible_countries: data.eligible_countries.length > 0 ? data.eligible_countries : null,
      min_gpa: data.min_gpa,
      funding_amount: data.funding_amount || null,
      stipend_monthly: data.stipend_monthly || null,
      covers_tuition: data.covers_tuition,
      covers_living: data.covers_living,
      language: data.language,
      application_url: data.application_url || null,
      created_by: user.id,
    }

    if (universityId) {
      grantData.university_id = universityId
    }

    if (data.deadline) {
      grantData.deadline = new Date(data.deadline).toISOString()
    }

    if (data.start_date) {
      grantData.start_date = data.start_date
    }

    if (data.duration_months) {
      grantData.duration_months = data.duration_months
    }

    const { error } = await supabase.from("grants").insert(grantData)

    if (error) {
      console.error("Error creating grant:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error: any) {
    console.error("Error in createPosition:", error)
    return { success: false, error: error.message || "An unexpected error occurred" }
  }
}
