"use client"

import { useEffect, useState, useRef } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Paperclip, Send, Smile, MessageSquare } from "lucide-react"
import { format } from "date-fns"
import { Check, CheckCheck } from "lucide-react"

interface Message {
  id: string
  sender_id: string
  receiver_id: string
  content: string
  message_type: string
  file_url?: string
  file_name?: string
  is_read: boolean
  created_at: string
  sender?: {
    first_name?: string
    last_name?: string
    avatar_url?: string
  }
}

interface MessageClientProps {
  conversationId: string
  currentUserId: string
  otherUserId: string
  initialMessages?: Message[]
}

export function MessageClient({ conversationId, currentUserId, otherUserId, initialMessages = [] }: MessageClientProps) {
  const [messages, setMessages] = useState<Message[]>(() => 
    initialMessages.sort((a, b) => 
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    )
  )
  const [newMessage, setNewMessage] = useState("")
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const supabase = getSupabaseBrowserClient()

  // Update messages when initialMessages change (but preserve real-time updates)
  useEffect(() => {
    if (initialMessages && initialMessages.length > 0) {
      setMessages((prev) => {
        // Only update if we don't have messages yet, or merge if needed
        if (prev.length === 0) {
          return initialMessages.sort((a, b) => 
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          )
        }
        // Merge and deduplicate, keeping real-time updates
        const allMessages = [...prev, ...initialMessages]
        const uniqueMessages = allMessages.filter(
          (msg, index, self) => index === self.findIndex((m) => m.id === msg.id)
        )
        return uniqueMessages.sort((a, b) => 
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        )
      })
    }
  }, [conversationId]) // Only update when conversation changes

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Subscribe to real-time message updates
  useEffect(() => {
    const channel = supabase
      .channel(`conversation:${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          // Fetch the new message
          supabase
            .from("messages")
            .select("*")
            .eq("id", payload.new.id)
            .single()
            .then(async ({ data: messageData }) => {
              if (messageData) {
                // Fetch sender profile
                const { data: senderProfile } = await supabase
                  .from("profiles")
                  .select("first_name, last_name, avatar_url")
                  .eq("user_id", messageData.sender_id)
                  .maybeSingle()

                const messageWithSender = {
                  ...messageData,
                  sender: senderProfile || null,
                }

                setMessages((prev) => {
                  // Check if message already exists (from optimistic update or duplicate)
                  const exists = prev.some((msg) => msg.id === messageData.id)
                  if (exists) {
                    // Update existing message (replace optimistic one)
                    return prev.map((msg) =>
                      msg.id === messageData.id ? messageWithSender : msg
                    ).sort((a, b) => 
                      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
                    )
                  }
                  
                  // Remove any temporary optimistic messages with same content and sender
                  const filtered = prev.filter(
                    (msg) =>
                      !(
                        msg.id.startsWith("temp-") &&
                        msg.content === messageData.content &&
                        msg.sender_id === messageData.sender_id &&
                        Math.abs(
                          new Date(msg.created_at).getTime() - 
                          new Date(messageData.created_at).getTime()
                        ) < 5000 // Within 5 seconds
                      )
                  )
                  
                  // Add new message and sort by timestamp
                  return [...filtered, messageWithSender].sort((a, b) => 
                    new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
                  )
                })
                
                // Mark as read if it's for current user
                if (messageData.receiver_id === currentUserId) {
                  supabase
                    .from("messages")
                    .update({ is_read: true, read_at: new Date().toISOString() })
                    .eq("id", messageData.id)
                }
              }
            })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [conversationId, currentUserId, supabase])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || sending) return

    const messageContent = newMessage.trim()
    setNewMessage("")
    setSending(true)

    // Optimistically add the message to the UI immediately
    const tempMessageId = `temp-${Date.now()}`
    const optimisticMessage: Message = {
      id: tempMessageId,
      sender_id: currentUserId,
      receiver_id: otherUserId,
      content: messageContent,
      message_type: "text",
      is_read: false,
      created_at: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, optimisticMessage])

    try {
      const response = await fetch("/api/messages/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId,
          receiverId: otherUserId,
          content: messageContent,
          messageType: "text",
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to send message")
      }

      // The real-time subscription will pick up the actual message
      // and replace the optimistic message automatically
    } catch (error) {
      console.error("Error sending message:", error)
      // Remove optimistic message on error
      setMessages((prev) => prev.filter((msg) => msg.id !== tempMessageId))
      setNewMessage(messageContent) // Restore the message text
      alert("Failed to send message. Please try again.")
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
      {/* Messages List */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="mb-4 p-4 rounded-full bg-slate-100 dark:bg-slate-700">
              <MessageSquare className="h-8 w-8 text-slate-400 dark:text-slate-500" />
            </div>
            <p className="text-slate-700 dark:text-slate-300 font-medium mb-1">No messages yet</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Start the conversation!</p>
          </div>
        ) : (
          messages.map((message, index) => {
            const isOwn = message.sender_id === currentUserId
            const senderName = message.sender
              ? `${message.sender.first_name || ""} ${message.sender.last_name || ""}`.trim()
              : "Unknown"
            
            // Group messages by time (show date separator if needed)
            const messageDate = new Date(message.created_at)
            const prevMessage = index > 0 ? messages[index - 1] : null
            const showDateSeparator = !prevMessage || 
              new Date(prevMessage.created_at).toDateString() !== messageDate.toDateString()

            return (
              <div key={message.id}>
                {showDateSeparator && (
                  <div className="flex items-center justify-center my-6">
                    <div className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-xs font-medium text-slate-600 dark:text-slate-400">
                      {format(messageDate, "MMMM d, yyyy")}
                    </div>
                  </div>
                )}
                <div className={`flex gap-3 ${isOwn ? "justify-end" : "justify-start"} group`}>
                  {!isOwn && (
                    <div className="flex-shrink-0">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-slate-400 to-slate-600 dark:from-slate-500 dark:to-slate-700 text-xs font-bold text-white shadow-sm">
                        {senderName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2)}
                      </div>
                    </div>
                  )}
                  <div className={`flex flex-col gap-1 max-w-[75%] sm:max-w-[65%] ${isOwn ? "items-end" : "items-start"}`}>
                    {!isOwn && (
                      <span className="text-xs font-medium text-slate-600 dark:text-slate-400 px-2">
                        {senderName}
                      </span>
                    )}
                    <div className={`relative rounded-2xl px-4 py-2.5 shadow-sm ${
                      isOwn
                        ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-br-md"
                        : "bg-white dark:bg-slate-700 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-600 rounded-bl-md"
                    }`}>
                      <p className="text-sm leading-relaxed break-words whitespace-pre-wrap">
                        {message.content}
                      </p>
                    </div>
                    <div className={`flex items-center gap-1.5 px-2 ${isOwn ? "flex-row-reverse" : ""}`}>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">
                        {format(messageDate, "h:mm a")}
                      </span>
                      {isOwn && (
                        <div className="flex items-center">
                          {message.is_read ? (
                            <CheckCheck className="h-3.5 w-3.5 text-blue-400" />
                          ) : (
                            <Check className="h-3.5 w-3.5 text-slate-400" />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  {isOwn && <div className="w-9" />}
                </div>
              </div>
            )
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 flex-shrink-0">
        <div className="flex items-end gap-2 max-w-5xl mx-auto">
          <Button 
            variant="ghost" 
            size="icon" 
            type="button" 
            className="flex-shrink-0 h-10 w-10 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            <Paperclip className="h-5 w-5 text-slate-600 dark:text-slate-300" />
          </Button>
          <div className="flex-1 relative">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="rounded-full pr-12 py-6 border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 focus:bg-white dark:focus:bg-slate-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              disabled={sending}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Button 
                variant="ghost" 
                size="icon" 
                type="button" 
                className="h-8 w-8 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600"
              >
                <Smile className="h-4 w-4 text-slate-600 dark:text-slate-300" />
              </Button>
            </div>
          </div>
          <Button
            type="submit"
            size="icon"
            className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!newMessage.trim() || sending}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  )
}
