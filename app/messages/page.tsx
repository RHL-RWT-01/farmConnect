"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import {
  MessageCircle,
  Send,
  Search,
  ArrowLeft,
  User,
  Clock,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/useAuth"

interface Contact {
  id: string
  name: string
  image: string | null
  role: string
  lastMessage?: string
  lastMessageTime?: string
  unreadCount?: number
}

interface Message {
  id: string
  senderId: string
  receiverId: string
  content: string
  read: boolean
  createdAt: string
}

export default function MessagesPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth()
  const router = useRouter()
  const [contacts, setContacts] = useState<Contact[]>([])
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.push("/login")
  }, [authLoading, isAuthenticated, router])

  // Fetch contacts (users who have messaged you or you've messaged)
  useEffect(() => {
    if (!user) return
    ;(async () => {
      try {
        const res = await fetch("/api/messages?contacts=true", { credentials: "include" })
        const data = await res.json()
        setContacts(data.contacts || [])
      } catch {
        console.error("Failed to load contacts")
      } finally {
        setLoading(false)
      }
    })()
  }, [user])

  // Fetch messages for selected contact
  useEffect(() => {
    if (!selectedContact || !user) return
    ;(async () => {
      try {
        const res = await fetch(`/api/messages?userId=${selectedContact.id}`, {
          credentials: "include",
        })
        const data = await res.json()
        setMessages(data.messages || [])
      } catch {
        console.error("Failed to load messages")
      }
    })()

    // Poll for new messages
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/messages?userId=${selectedContact.id}`, {
          credentials: "include",
        })
        const data = await res.json()
        setMessages(data.messages || [])
      } catch {}
    }, 5000)

    return () => clearInterval(interval)
  }, [selectedContact, user])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedContact || sending) return
    setSending(true)
    try {
      await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          receiverId: selectedContact.id,
          content: newMessage.trim(),
        }),
      })
      setNewMessage("")
      // Refresh messages
      const res = await fetch(`/api/messages?userId=${selectedContact.id}`, {
        credentials: "include",
      })
      const data = await res.json()
      setMessages(data.messages || [])
    } catch {
      console.error("Failed to send message")
    } finally {
      setSending(false)
    }
  }

  const filteredContacts = contacts.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (authLoading || !user) return null

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <MessageCircle className="h-8 w-8 text-green-600" />
          <span className="gradient-text">Messages</span>
        </h1>
        <p className="text-muted-foreground mt-1">
          {user.role === "FARMER"
            ? "Communicate with your buyers directly"
            : "Chat with farmers about their products"}
        </p>
      </div>

      <div className="grid md:grid-cols-[320px_1fr] gap-4 h-[600px]">
        {/* Contacts Sidebar */}
        <Card className="border-border/50 flex flex-col overflow-hidden">
          <CardHeader className="pb-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search contacts..."
                className="pl-10 bg-muted border-0 rounded-xl"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-2 space-y-1">
            {loading ? (
              <div className="space-y-2 p-2">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-16 w-full rounded-xl" />
                ))}
              </div>
            ) : filteredContacts.length === 0 ? (
              <div className="text-center py-12">
                <MessageCircle className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">
                  {contacts.length === 0
                    ? "No conversations yet"
                    : "No matching contacts"}
                </p>
              </div>
            ) : (
              filteredContacts.map((contact) => (
                <button
                  key={contact.id}
                  onClick={() => setSelectedContact(contact)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-colors ${
                    selectedContact?.id === contact.id
                      ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                      : "hover:bg-muted"
                  }`}
                >
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-muted flex-shrink-0">
                    {contact.image ? (
                      <Image
                        src={contact.image}
                        alt={contact.name}
                        width={40}
                        height={40}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                        <User className="h-5 w-5 text-green-600" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium truncate">{contact.name}</p>
                      {(contact.unreadCount || 0) > 0 && (
                        <Badge className="bg-green-600 text-white text-[10px] h-5 min-w-[20px] flex items-center justify-center rounded-full">
                          {contact.unreadCount}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {contact.lastMessage || `${contact.role === "FARMER" ? "Farmer" : "Buyer"}`}
                    </p>
                  </div>
                </button>
              ))
            )}
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="border-border/50 flex flex-col overflow-hidden">
          {selectedContact ? (
            <>
              {/* Chat header */}
              <div className="flex items-center gap-3 px-4 py-3 border-b">
                <button
                  onClick={() => setSelectedContact(null)}
                  className="md:hidden p-1.5 rounded-lg hover:bg-muted"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <div className="w-9 h-9 rounded-full overflow-hidden bg-muted flex-shrink-0">
                  {selectedContact.image ? (
                    <Image
                      src={selectedContact.image}
                      alt={selectedContact.name}
                      width={36}
                      height={36}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                      <User className="h-4 w-4 text-green-600" />
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-semibold text-sm">{selectedContact.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {selectedContact.role.toLowerCase()}
                  </p>
                </div>
              </div>

              {/* Messages */}
              <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
                {messages.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-center">
                    <div>
                      <MessageCircle className="h-12 w-12 text-muted-foreground/20 mx-auto mb-3" />
                      <p className="text-sm text-muted-foreground">
                        No messages yet. Start the conversation!
                      </p>
                    </div>
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isMine = msg.senderId === user.id
                    return (
                      <div
                        key={msg.id}
                        className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                            isMine
                              ? "bg-green-600 text-white rounded-br-md"
                              : "bg-muted text-foreground rounded-bl-md"
                          }`}
                        >
                          <p>{msg.content}</p>
                          <p
                            className={`text-[10px] mt-1 ${
                              isMine ? "text-green-200" : "text-muted-foreground"
                            }`}
                          >
                            {new Date(msg.createdAt).toLocaleTimeString("en-IN", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>

              {/* Input */}
              <div className="border-t px-4 py-3">
                <div className="flex items-center gap-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        sendMessage()
                      }
                    }}
                    placeholder="Type a message..."
                    className="flex-1 bg-muted border-0 rounded-xl"
                    disabled={sending}
                  />
                  <Button
                    size="icon"
                    onClick={sendMessage}
                    disabled={!newMessage.trim() || sending}
                    className="bg-green-600 hover:bg-green-700 text-white rounded-xl h-10 w-10"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-center">
              <div>
                <MessageCircle className="h-16 w-16 text-muted-foreground/20 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-1">Select a conversation</h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Choose a contact from the left to start messaging, or message a farmer from their product page.
                </p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
