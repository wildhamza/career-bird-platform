import { getSupabaseServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const supabase = await getSupabaseServerClient()
    
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { otherUserId, applicationId, grantId } = body

    if (!otherUserId) {
      return NextResponse.json({ error: "otherUserId is required" }, { status: 400 })
    }

    if (otherUserId === user.id) {
      return NextResponse.json({ error: "Cannot create conversation with yourself" }, { status: 400 })
    }

    // Use the database function to get or create conversation
    const { data: conversationId, error } = await supabase.rpc("get_or_create_conversation", {
      _participant1_id: user.id,
      _participant2_id: otherUserId,
      _application_id: applicationId || null,
      _grant_id: grantId || null,
    })

    if (error) {
      console.error("Error creating conversation:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, conversationId })
  } catch (error: any) {
    console.error("Error in create conversation:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}
