/**
 * Create a test professor account
 * Run with: npx tsx scripts/create-test-professor.ts
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { join } from 'path'

// Load environment variables
function loadEnvFile() {
  const envFiles = ['.env.local', '.env']
  
  for (const envFile of envFiles) {
    try {
      const envPath = join(process.cwd(), envFile)
      const envContent = readFileSync(envPath, 'utf-8')
      const lines = envContent.split('\n')
      
      for (const line of lines) {
        const trimmedLine = line.trim()
        if (trimmedLine && !trimmedLine.startsWith('#')) {
          const [key, ...valueParts] = trimmedLine.split('=')
          if (key && valueParts.length > 0) {
            const value = valueParts.join('=').trim().replace(/^["']|["']$/g, '')
            if (!process.env[key]) {
              process.env[key] = value
            }
          }
        }
      }
      console.log(`✅ Loaded environment variables from ${envFile}`)
      return
    } catch (e) {
      continue
    }
  }
}

loadEnvFile()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables!')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function createTestProfessor() {
  console.log('🎓 Creating test professor account...\n')

  const email = 'professor.test@university.edu'
  const password = 'Test123!@#'
  const firstName = 'John'
  const lastName = 'Smith'

  try {
    // Get a university
    const { data: universities } = await supabase
      .from('universities')
      .select('*')
      .limit(1)
      .single()

    if (!universities) {
      console.error('❌ No universities found. Please seed universities first.')
      return
    }

    // Create auth user
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        first_name: firstName,
        last_name: lastName
      }
    })

    if (authError) {
      if (authError.message.includes('already registered')) {
        console.log('ℹ️  User already exists. Fetching existing user...')
        const { data: existingUser } = await supabase.auth.admin.listUsers()
        const user = existingUser?.users.find(u => u.email === email)
        
        if (user) {
          console.log('\n✅ Existing professor account found!')
          console.log('\n📧 Login Credentials:')
          console.log(`   Email: ${email}`)
          console.log(`   Password: ${password}`)
          return
        }
      }
      throw authError
    }

    if (!authUser.user) {
      console.error('❌ Failed to create user')
      return
    }

    // Create profile
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        user_id: authUser.user.id,
        email,
        first_name: firstName,
        last_name: lastName,
        phone: '+1234567890',
        date_of_birth: '1980-05-15',
        nationality: 'United States',
        current_country: universities.country,
        current_city: universities.city,
        bio: `Professor of Computer Science with expertise in Machine Learning, Artificial Intelligence, and Data Science. Published 87 papers with h-index of 35.`,
        department: 'Computer Science',
        title: 'Professor',
        research_areas: ['Machine Learning', 'Artificial Intelligence', 'Data Science', 'Neural Networks'],
        h_index: 35,
        publications_count: 87,
        profile_completed: true,
        university_id: universities.id
      }, {
        onConflict: 'user_id'
      })

    if (profileError) {
      console.error('❌ Error creating profile:', profileError)
      return
    }

    // Create user role
    const { error: roleError } = await supabase
      .from('user_roles')
      .insert({
        user_id: authUser.user.id,
        role: 'professor'
      })

    if (roleError && !roleError.message.includes('duplicate')) {
      console.error('❌ Error creating role:', roleError)
      return
    }

    console.log('✅ Test professor account created successfully!\n')
    console.log('📧 Login Credentials:')
    console.log(`   Email: ${email}`)
    console.log(`   Password: ${password}`)
    console.log(`   University: ${universities.name}`)
    console.log(`   Department: Computer Science`)
    console.log(`   Title: Professor`)
    console.log('\n🔗 Login at: http://localhost:3000/login\n')

  } catch (error) {
    console.error('❌ Error:', error)
  }
}

createTestProfessor()
