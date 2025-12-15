import { getSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Phone, Video, Info, Smile, Paperclip, Send, Check, MessageSquare } from "lucide-react"
import { ProfessorConversationsList } from "./professor-conversations-list"
import { MessageClient } from "@/components/messages/message-client"

async function getMessagesData(conversationId?: string) {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  // Fetch conversations from the conversations table
  const { data: conversations, error: convError } = await supabase
    .from("conversations")
    .select("*")
    .or(`participant1_id.eq.${user.id},participant2_id.eq.${user.id}`)
    .order("last_message_at", { ascending: false, nullsFirst: false })

  // Get unread counts
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

  // Format conversations for ConversationsList component
  const formattedConversations = (conversations || []).map((conv) => {
    const otherUserId = conv.participant1_id === user.id ? conv.participant2_id : conv.participant1_id
    const profile = profilesMap[otherUserId]

    // Build name with fallbacks
    let displayName = "Unknown"
    if (profile) {
      const fullName = `${profile.first_name || ""} ${profile.last_name || ""}`.trim()
      displayName = fullName || profile.email || "Unknown"
    }

    return {
      id: conv.id,
      name: displayName,
      title: profile?.email || "",
      lastMessage: conv.last_message_preview || "No messages yet",
      timestamp: conv.last_message_at ? new Date(conv.last_message_at).toLocaleDateString() : "",
      unread: unreadCounts[conv.id] || 0,
      verified: false,
      active: false,
    }
  })

  // Fetch active conversation if conversationId is provided
  let activeConversation = null
  if (conversationId) {
    // Verify user is part of the conversation
    const { data: conversation, error: convError } = await supabase
      .from("conversations")
      .select("participant1_id, participant2_id")
      .eq("id", conversationId)
      .single()

    if (!convError && conversation) {
      if (conversation.participant1_id === user.id || conversation.participant2_id === user.id) {
        const otherUserId = conversation.participant1_id === user.id ? conversation.participant2_id : conversation.participant1_id
        
        // Fetch profile for the other user if not already in profilesMap
        let profile = profilesMap[otherUserId]
        if (!profile) {
          const { data: otherProfile } = await supabase
            .from("profiles")
            .select("user_id, first_name, last_name, email, avatar_url")
            .eq("user_id", otherUserId)
            .maybeSingle()
          
          if (otherProfile) {
            profile = otherProfile
            profilesMap[otherUserId] = otherProfile
          }
        }

        // Get all messages in the conversation
        const { data: messages, error: messagesError } = await supabase
          .from("messages")
          .select("*")
          .eq("conversation_id", conversationId)
          .order("created_at", { ascending: true })

        // Fetch sender profiles for messages
        const senderIds = [...new Set(messages?.map((m) => m.sender_id) || [])]
        let senderProfilesMap: Record<string, any> = {}

        if (senderIds.length > 0) {
          const { data: senderProfiles } = await supabase
            .from("profiles")
            .select("user_id, first_name, last_name, avatar_url")
            .in("user_id", senderIds)

          senderProfiles?.forEach((p) => {
            senderProfilesMap[p.user_id] = p
          })
        }

        // Attach sender info to messages
        const messagesWithSenders = messages?.map((msg) => ({
          ...msg,
          sender: senderProfilesMap[msg.sender_id] || null,
        }))

        // Mark messages as read
        await supabase
          .from("messages")
          .update({ is_read: true, read_at: new Date().toISOString() })
          .eq("conversation_id", conversationId)
          .eq("receiver_id", user.id)
          .eq("is_read", false)

        // Build name with fallbacks
        let displayName = "Unknown"
        if (profile) {
          const fullName = `${profile.first_name || ""} ${profile.last_name || ""}`.trim()
          displayName = fullName || profile.email || "Unknown"
        }

        activeConversation = {
          id: conversationId,
          otherUserId,
          name: displayName,
          messages: messagesWithSenders || [],
        }
      }
    }
  }

  return {
    conversations: formattedConversations,
    activeConversation,
    currentUserId: user.id,
  }
}

export default async function ProfessorMessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ conversation?: string }>
}) {
  const params = await searchParams
  const data = await getMessagesData(params.conversation)

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col lg:flex-row bg-slate-50 dark:bg-slate-900">
      {/* Conversations List */}
      <ProfessorConversationsList 
        conversations={data.conversations} 
        activeConversationId={params.conversation || null}
        currentUserId={data.currentUserId}
      />

      {/* Active Conversation */}
      {data.activeConversation ? (
        <div className="flex flex-1 flex-col bg-white dark:bg-slate-800 shadow-inner">
          {/* Conversation Header */}
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 sm:p-5 flex-shrink-0 shadow-sm">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="relative flex-shrink-0">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-bold text-white shadow-md ring-2 ring-blue-100 dark:ring-blue-900">
                  {data.activeConversation.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)}
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-base text-slate-900 dark:text-white truncate">
                  {data.activeConversation.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Active now</p>
              </div>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-9 w-9 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <Phone className="h-4 w-4 text-slate-600 dark:text-slate-300" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-9 w-9 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <Video className="h-4 w-4 text-slate-600 dark:text-slate-300" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-9 w-9 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <Info className="h-4 w-4 text-slate-600 dark:text-slate-300" />
              </Button>
            </div>
          </div>

          {/* Messages - Use MessageClient component */}
          <MessageClient
            conversationId={data.activeConversation.id}
            currentUserId={data.currentUserId}
            otherUserId={data.activeConversation.otherUserId}
            initialMessages={data.activeConversation.messages}
          />
        </div>
      ) : (
        <div className="hidden lg:flex flex-1 flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 p-8">
          <div className="text-center max-w-md">
            <div className="mb-6 p-6 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 inline-block">
              <MessageSquare className="h-12 w-12 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              Select a conversation
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Choose a conversation from the list to start messaging with students.
            </p>
          </div>
        </div>
      )}

      {/* Mobile: Show empty state when no conversation selected */}
      {!data.activeConversation && (
        <div className="lg:hidden flex-1 flex items-center justify-center bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 p-8">
          <div className="text-center max-w-md">
            <div className="mb-6 p-6 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 inline-block">
              <MessageSquare className="h-12 w-12 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              Select a conversation
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Choose a conversation from the list to start messaging.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
