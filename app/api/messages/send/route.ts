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
    const { conversationId, receiverId, content, messageType = "text", fileUrl, fileName, fileType, fileSize } = body

    if (!conversationId || !receiverId || !content) {
      return NextResponse.json(
        { error: "Missing required fields: conversationId, receiverId, content" },
        { status: 400 }
      )
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

    // Insert message
    const { data: message, error: messageError } = await supabase
      .from("messages")
      .insert({
        conversation_id: conversationId,
        sender_id: user.id,
        receiver_id: receiverId,
        content,
        message_type: messageType,
        file_url: fileUrl || null,
        file_name: fileName || null,
        file_type: fileType || null,
        file_size: fileSize || null,
      })
      .select()
      .single()

    if (messageError) {
      console.error("Error sending message:", messageError)
      return NextResponse.json({ error: messageError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, message })
  } catch (error: any) {
    console.error("Error in send message:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}
