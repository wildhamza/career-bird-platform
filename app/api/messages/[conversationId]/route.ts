import { getSupabaseServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  try {
    const { conversationId } = await params
    const supabase = await getSupabaseServerClient()
    
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify user is part of the conversation
    const { data: conversation, error: convError } = await supabase
      .from("conversations")
      .select("participant1_id, participant2_id")
      .eq("id", conversationId)
      .single()

    if (convError || !conversation) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 })
    }

    if (conversation.participant1_id !== user.id && conversation.participant2_id !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Get all messages in the conversation
    const { data: messages, error: messagesError } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true })

    // Fetch sender profiles
    const senderIds = [...new Set(messages?.map((m) => m.sender_id) || [])]
    let senderProfilesMap: Record<string, any> = {}

    if (senderIds.length > 0) {
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, first_name, last_name, avatar_url")
        .in("user_id", senderIds)

      profiles?.forEach((profile) => {
        senderProfilesMap[profile.user_id] = profile
      })
    }

    // Attach sender info to messages
    const messagesWithSenders = messages?.map((msg) => ({
      ...msg,
      sender: senderProfilesMap[msg.sender_id] || null,
    }))

    if (messagesError) {
      console.error("Error fetching messages:", error)
      return NextResponse.json({ error: messagesError.message }, { status: 500 })
    }

    // Mark messages as read
    await supabase
      .from("messages")
      .update({ is_read: true, read_at: new Date().toISOString() })
      .eq("conversation_id", conversationId)
      .eq("receiver_id", user.id)
      .eq("is_read", false)

    return NextResponse.json({ messages: messagesWithSenders || [] })
  } catch (error: any) {
    console.error("Error in get messages:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}
