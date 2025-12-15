"use client"

import { useState, useMemo, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, MessageSquare, Check } from "lucide-react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"

interface Conversation {
  id: string
  name: string
  title?: string
  lastMessage: string
  timestamp: string
  unread: number
  verified: boolean
  online?: boolean
  otherUserId?: string
}

interface ProfessorConversationsListProps {
  conversations: Conversation[]
  activeConversationId?: string | null
  currentUserId?: string
}

export function ProfessorConversationsList({ 
  conversations: initialConversations, 
  activeConversationId,
  currentUserId 
}: ProfessorConversationsListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations)
  const supabase = getSupabaseBrowserClient()

  // Update conversations when initialConversations change
  useEffect(() => {
    setConversations(initialConversations)
  }, [initialConversations])

  // Set up real-time subscriptions (same as student conversations list)
  useEffect(() => {
    if (!currentUserId) return

    // Subscribe to conversation updates
    const conversationsChannel = supabase
      .channel("professor-conversations-updates")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "conversations",
          filter: `participant1_id=eq.${currentUserId}`,
        },
        async (payload) => {
          const updatedConv = payload.new as any
          const otherUserId = updatedConv.participant1_id === currentUserId 
            ? updatedConv.participant2_id 
            : updatedConv.participant1_id
          
          const { data: profile } = await supabase
            .from("profiles")
            .select("user_id, first_name, last_name, email")
            .eq("user_id", otherUserId)
            .maybeSingle()

          setConversations((prev) => {
            const existing = prev.find(c => c.id === updatedConv.id)
            
            if (existing) {
              const updated = {
                ...existing,
                lastMessage: updatedConv.last_message_preview || existing.lastMessage,
                timestamp: updatedConv.last_message_at 
                  ? new Date(updatedConv.last_message_at).toLocaleDateString() 
                  : existing.timestamp,
              }
              
              return [
                updated,
                ...prev.filter(c => c.id !== updatedConv.id),
              ]
            } else {
              // Build name with fallbacks
              const fullName = profile ? `${profile.first_name || ""} ${profile.last_name || ""}`.trim() : ""
              const displayName = fullName || profile?.email || "Unknown"
              
              return [
                {
                  id: updatedConv.id,
                  name: displayName,
                  title: profile?.email || "",
                  lastMessage: updatedConv.last_message_preview || "No messages yet",
                  timestamp: updatedConv.last_message_at 
                    ? new Date(updatedConv.last_message_at).toLocaleDateString() 
                    : "",
                  unread: 0,
                  verified: false,
                  active: false,
                  otherUserId,
                },
                ...prev,
              ]
            }
          })
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "conversations",
          filter: `participant2_id=eq.${currentUserId}`,
        },
        async (payload) => {
          const updatedConv = payload.new as any
          const otherUserId = updatedConv.participant1_id === currentUserId 
            ? updatedConv.participant2_id 
            : updatedConv.participant1_id
          
          const { data: profile } = await supabase
            .from("profiles")
            .select("user_id, first_name, last_name, email")
            .eq("user_id", otherUserId)
            .maybeSingle()

          setConversations((prev) => {
            const existing = prev.find(c => c.id === updatedConv.id)
            
            if (existing) {
              const updated = {
                ...existing,
                lastMessage: updatedConv.last_message_preview || existing.lastMessage,
                timestamp: updatedConv.last_message_at 
                  ? new Date(updatedConv.last_message_at).toLocaleDateString() 
                  : existing.timestamp,
              }
              
              return [
                updated,
                ...prev.filter(c => c.id !== updatedConv.id),
              ]
            } else {
              // Build name with fallbacks
              const fullName = profile ? `${profile.first_name || ""} ${profile.last_name || ""}`.trim() : ""
              const displayName = fullName || profile?.email || "Unknown"
              
              return [
                {
                  id: updatedConv.id,
                  name: displayName,
                  title: profile?.email || "",
                  lastMessage: updatedConv.last_message_preview || "No messages yet",
                  timestamp: updatedConv.last_message_at 
                    ? new Date(updatedConv.last_message_at).toLocaleDateString() 
                    : "",
                  unread: 0,
                  verified: false,
                  active: false,
                  otherUserId,
                },
                ...prev,
              ]
            }
          })
        }
      )
      .subscribe()

    // Subscribe to new messages
    const messagesChannel = supabase
      .channel("professor-messages-updates")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `receiver_id=eq.${currentUserId}`,
        },
        async (payload) => {
          const newMessage = payload.new as any
          
          const { data: conversation } = await supabase
            .from("conversations")
            .select("*")
            .eq("id", newMessage.conversation_id)
            .single()

          if (conversation) {
            const otherUserId = conversation.participant1_id === currentUserId 
              ? conversation.participant2_id 
              : conversation.participant1_id
            
            const { data: profile } = await supabase
              .from("profiles")
              .select("user_id, first_name, last_name, email")
              .eq("user_id", otherUserId)
              .maybeSingle()

            setConversations((prev) => {
              const existing = prev.find(c => c.id === conversation.id)
              
              if (existing) {
                const newUnread = activeConversationId === existing.id 
                  ? existing.unread 
                  : existing.unread + 1
                
                const updated = {
                  ...existing,
                  lastMessage: conversation.last_message_preview || existing.lastMessage,
                  timestamp: conversation.last_message_at 
                    ? new Date(conversation.last_message_at).toLocaleDateString() 
                    : existing.timestamp,
                  unread: newUnread,
                }
                
                return [
                  updated,
                  ...prev.filter(c => c.id !== conversation.id),
                ]
              } else {
                // Build name with fallbacks
                const fullName = profile ? `${profile.first_name || ""} ${profile.last_name || ""}`.trim() : ""
                const displayName = fullName || profile?.email || "Unknown"
                
                return [
                  {
                    id: conversation.id,
                    name: displayName,
                    title: profile?.email || "",
                    lastMessage: conversation.last_message_preview || "No messages yet",
                    timestamp: conversation.last_message_at 
                      ? new Date(conversation.last_message_at).toLocaleDateString() 
                      : "",
                    unread: activeConversationId === conversation.id ? 0 : 1,
                    verified: false,
                    active: false,
                    otherUserId,
                  },
                  ...prev,
                ]
              }
            })
          }
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "messages",
          filter: `receiver_id=eq.${currentUserId}`,
        },
        (payload) => {
          const updatedMessage = payload.new as any
          if (updatedMessage.is_read) {
            setConversations((prev) => {
              return prev.map(c => {
                if (c.id === updatedMessage.conversation_id) {
                  return {
                    ...c,
                    unread: Math.max(0, c.unread - 1),
                  }
                }
                return c
              })
            })
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(conversationsChannel)
      supabase.removeChannel(messagesChannel)
    }
  }, [currentUserId, activeConversationId, supabase])

  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) {
      return conversations
    }

    const query = searchQuery.toLowerCase()
    return conversations.filter((conversation) => {
      return (
        conversation.name.toLowerCase().includes(query) ||
        conversation.title?.toLowerCase().includes(query) ||
        conversation.lastMessage.toLowerCase().includes(query)
      )
    })
  }, [conversations, searchQuery])

  return (
    <div className="w-full lg:w-96 border-r bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 flex flex-col shadow-sm">
      <div className="border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 shrink-0">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Messages</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {filteredConversations.length} {filteredConversations.length === 1 ? 'conversation' : 'conversations'}
            </p>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="shrink-0 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full"
          >
            <Plus className="h-5 w-5 text-slate-600 dark:text-slate-300" />
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 rounded-full border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 focus:bg-white dark:focus:bg-slate-600"
          />
        </div>
      </div>

      <div className="overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600">
        {filteredConversations.length > 0 ? (
          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {filteredConversations.map((conversation) => (
              <Link
                key={conversation.id}
                href={`/professor/messages?conversation=${conversation.id}`}
                className={`block p-4 transition-all duration-200 ${
                  activeConversationId === conversation.id 
                    ? "bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-l-4 border-blue-500" 
                    : "hover:bg-slate-50 dark:hover:bg-slate-700/50"
                }`}
              >
                <div className="flex gap-3">
                  <div className="relative shrink-0">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold text-white shadow-md ${
                      activeConversationId === conversation.id
                        ? "bg-gradient-to-br from-blue-500 to-indigo-600 ring-2 ring-blue-300 dark:ring-blue-600"
                        : "bg-gradient-to-br from-slate-400 to-slate-600 dark:from-slate-500 dark:to-slate-700"
                    }`}>
                      {conversation.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)}
                    </div>
                    {conversation.unread > 0 && (
                      <div className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 border-2 border-white dark:border-slate-800 shadow-sm">
                        <span className="text-[10px] font-bold text-white">{conversation.unread > 9 ? '9+' : conversation.unread}</span>
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className={`truncate font-semibold text-sm ${
                        activeConversationId === conversation.id 
                          ? "text-blue-900 dark:text-blue-100" 
                          : "text-slate-900 dark:text-white"
                      }`}>
                        {conversation.name}
                      </p>
                      <span className={`shrink-0 text-xs font-medium ${
                        activeConversationId === conversation.id
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-slate-500 dark:text-slate-400"
                      }`}>
                        {conversation.timestamp}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className={`truncate text-sm flex-1 ${
                        conversation.unread > 0
                          ? "font-semibold text-slate-900 dark:text-white"
                          : "text-slate-600 dark:text-slate-300"
                      }`}>
                        {conversation.lastMessage || "No messages yet"}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <div className="mb-4 p-4 rounded-full bg-slate-100 dark:bg-slate-700">
              <MessageSquare className="h-8 w-8 text-slate-400 dark:text-slate-500" />
            </div>
            <p className="text-slate-700 dark:text-slate-300 font-medium mb-1">
              {searchQuery ? "No conversations found" : "No messages yet"}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {searchQuery
                ? "Try adjusting your search"
                : "Conversations are created when students contact you or apply to your positions"}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
