"use client"

import { useState, useRef, useEffect } from "react"
import { MessageCircle, X, Send, Bot, User, Loader2, Sparkles, Minimize2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ChatMessage {
  role: "user" | "assistant"
  content: string
}

export default function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "👋 Hello! I'm your FarmConnect AI Assistant. I can help you with:\n\n• **Finding products** and farming tips\n• **Order tracking** and support\n• **Agricultural advice** and best practices\n\nHow can I help you today?",
    },
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const sendMessage = async () => {
    if (!input.trim() || loading) return

    const userMessage: ChatMessage = { role: "user", content: input.trim() }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setLoading(true)

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].filter(
            (_, i) => i > 0
          ),
        }),
      })

      const data = await res.json()

      if (data.message) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.message },
        ])
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "Sorry, I couldn't process your request. Please try again.",
          },
        ])
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I'm having trouble connecting. Please check your connection and try again.",
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  // Simple markdown: bold, bullet lists
  const renderMarkdown = (text: string) => {
    return text.split("\n").map((line, i) => {
      let processed = line.replace(
        /\*\*(.*?)\*\*/g,
        '<strong class="font-semibold">$1</strong>'
      )

      if (line.startsWith("• ") || line.startsWith("- ")) {
        processed = `<span class="flex items-start gap-1.5"><span class="text-green-500 mt-0.5">•</span><span>${processed.slice(2)}</span></span>`
      }

      return (
        <span
          key={i}
          className="block"
          dangerouslySetInnerHTML={{ __html: processed || "&nbsp;" }}
        />
      )
    })
  }

  return (
    <>
      {/* Floating Button */}
      <button
        id="ai-chat-toggle"
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
          isOpen
            ? "bg-red-500 hover:bg-red-600 rotate-0"
            : "bg-gradient-to-br from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 animate-pulse-glow"
        }`}
        aria-label={isOpen ? "Close chat" : "Open AI chat"}
      >
        {isOpen ? (
          <X className="h-6 w-6 text-white" />
        ) : (
          <MessageCircle className="h-6 w-6 text-white" />
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          className="fixed bottom-24 right-6 z-50 w-[380px] max-h-[560px] flex flex-col rounded-2xl shadow-2xl border border-border/50 bg-card overflow-hidden animate-scale-in"
          style={{ maxWidth: "calc(100vw - 3rem)" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">FarmConnect AI</h3>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-7 h-7 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <Minimize2 className="h-4 w-4" />
            </button>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto px-4 py-3 space-y-3 min-h-[300px] max-h-[380px]"
          >
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-2 ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                } animate-fade-in-up`}
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                {msg.role === "assistant" && (
                  <div className="w-7 h-7 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Bot className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-green-600 text-white rounded-br-md"
                      : "bg-muted text-foreground rounded-bl-md"
                  }`}
                >
                  {msg.role === "assistant"
                    ? renderMarkdown(msg.content)
                    : msg.content}
                </div>
                {msg.role === "user" && (
                  <div className="w-7 h-7 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <User className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex gap-2 items-start">
                <div className="w-7 h-7 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center flex-shrink-0">
                  <Bot className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: "0s" }} />
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: "0.15s" }} />
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: "0.3s" }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t px-3 py-2.5 bg-background">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask me anything..."
                className="flex-1 px-3 py-2 text-sm bg-muted rounded-xl border-0 outline-none focus:ring-2 focus:ring-green-500/30 placeholder:text-muted-foreground"
                disabled={loading}
                id="ai-chat-input"
              />
              <Button
                size="icon"
                onClick={sendMessage}
                disabled={!input.trim() || loading}
                className="h-9 w-9 rounded-xl bg-green-600 hover:bg-green-700 text-white shrink-0"
                id="ai-chat-send"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
