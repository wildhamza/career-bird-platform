export interface Profile {
  id: string
  user_id: string
  full_name: string | null
  university: string | null
  gpa: number | null
  skills: string[] | null
  r_score: number | null
  resume_link: string | null
  created_at?: string
  updated_at?: string
}

export interface Job {
  id: string
  professor_id: string
  title: string
  university: string
  country: string
  funding: string
  type: string
  skills: string[]
  degree: 'MS' | 'PhD'
  field: string
  description?: string | null
  created_at?: string
  updated_at?: string
}

export interface Application {
  id: string
  job_id: string
  student_id: string
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected'
  created_at?: string
  updated_at?: string
  student_profile?: Profile
  job?: Job
}

