import { getSupabaseServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const supabase = await getSupabaseServerClient()
    
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get all conversations where user is a participant
    const { data: conversations, error } = await supabase
      .from("conversations")
      .select("*")
      .or(`participant1_id.eq.${user.id},participant2_id.eq.${user.id}`)
      .order("last_message_at", { ascending: false, nullsFirst: false })

    if (error) {
      console.error("Error fetching conversations:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Get unread counts for each conversation
    const conversationIds = conversations?.map((c) => c.id) || []
    let unreadCounts: Record<string, number> = {}

    if (conversationIds.length > 0) {
      const { data: unreadData } = await supabase
        .from("messages")
        .select("conversation_id")
        .in("conversation_id", conversationIds)
        .eq("receiver_id", user.id)
        .eq("is_read", false)

      unreadData?.forEach((msg) => {
        unreadCounts[msg.conversation_id] = (unreadCounts[msg.conversation_id] || 0) + 1
      })
    }

    // Fetch profiles for other participants
    const otherUserIds = conversations?.map((conv) =>
      conv.participant1_id === user.id ? conv.participant2_id : conv.participant1_id
    ) || []

    let profilesMap: Record<string, any> = {}
    if (otherUserIds.length > 0) {
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, first_name, last_name, email, avatar_url")
        .in("user_id", otherUserIds)

      profiles?.forEach((profile) => {
        profilesMap[profile.user_id] = profile
      })
    }

    // Format conversations with participant info
    const formattedConversations = conversations?.map((conv) => {
      const otherUserId = conv.participant1_id === user.id ? conv.participant2_id : conv.participant1_id
      const profile = profilesMap[otherUserId]

      return {
        id: conv.id,
        otherUserId,
        name: `${profile?.first_name || ""} ${profile?.last_name || ""}`.trim() || "Unknown",
        email: profile?.email || "",
        avatarUrl: profile?.avatar_url || null,
        lastMessage: conv.last_message_preview || "",
        lastMessageAt: conv.last_message_at,
        unreadCount: unreadCounts[conv.id] || 0,
        applicationId: conv.application_id,
        grantId: conv.grant_id,
      }
    })

    return NextResponse.json({ conversations: formattedConversations || [] })
  } catch (error: any) {
    console.error("Error in get conversations:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}
