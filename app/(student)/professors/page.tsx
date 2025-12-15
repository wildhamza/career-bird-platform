import { getSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ProfessorsClient } from "./professors-client"

export default async function ProfessorsPage() {
  const supabase = await getSupabaseServerClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Debug: Check total profiles and those with department
  const { data: allProfiles, error: allError } = await supabase
    .from("profiles")
    .select("id, first_name, last_name, department, university_id")
    .limit(10)
  
  const { data: withDepartment, error: deptError } = await supabase
    .from("profiles")
    .select("id, first_name, last_name, department")
    .not("department", "is", null)
    .limit(10)
  
  console.log('🔍 Debug Info:', {
    totalProfilesSample: allProfiles?.length || 0,
    profilesWithDepartment: withDepartment?.length || 0,
    sampleProfile: allProfiles?.[0],
    sampleWithDept: withDepartment?.[0]
  })

  // Fetch all professors with their university information
  // Professors are identified by having a department field
  const { data: professors, error } = await supabase
    .from("profiles")
    .select(`
      id,
      user_id,
      first_name,
      last_name,
      email,
      department,
      title,
      research_areas,
      research_interests,
      h_index,
      publications_count,
      university_id,
      universities:university_id (
        id,
        name,
        country,
        city
      )
    `)
    .not("department", "is", null)
    .order("last_name", { ascending: true })
  
  console.log('👥 Professors query result:', { 
    count: professors?.length, 
    error,
    sample: professors?.[0] 
  })

  if (error) {
    console.error("Error fetching professors:", error)
  }

  return <ProfessorsClient professors={professors || []} />
}
