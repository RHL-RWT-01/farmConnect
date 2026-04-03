"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  Bell,
  Check,
  CheckCheck,
  Package,
  AlertTriangle,
  Info,
  Clock,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/hooks/useAuth"

interface Notification {
  id: string
  title: string
  message: string
  type: string
  read: boolean
  link: string | null
  createdAt: string
}

const typeIcons: Record<string, React.ReactNode> = {
  success: <Check className="h-4 w-4 text-green-500" />,
  warning: <AlertTriangle className="h-4 w-4 text-amber-500" />,
  info: <Info className="h-4 w-4 text-blue-500" />,
  order: <Package className="h-4 w-4 text-purple-500" />,
}

export default function NotificationsPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth()
  const router = useRouter()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.push("/login")
  }, [authLoading, isAuthenticated, router])

  useEffect(() => {
    if (!user) return
    ;(async () => {
      try {
        const res = await fetch("/api/notifications", { credentials: "include" })
        const data = await res.json()
        setNotifications(data.notifications || [])
      } catch {
        console.error("Failed to load notifications")
      } finally {
        setLoading(false)
      }
    })()
  }, [user])

  const markAsRead = async (id: string) => {
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ id }),
      })
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      )
    } catch {}
  }

  const markAllRead = async () => {
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ markAll: true }),
      })
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    } catch {}
  }

  if (authLoading || !user) return null

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center">
            <Bell className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold gradient-text">Notifications</h1>
            <p className="text-sm text-muted-foreground">
              {unreadCount > 0 ? `${unreadCount} unread` : "All caught up!"}
            </p>
          </div>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={markAllRead} className="gap-2">
            <CheckCheck className="h-4 w-4" /> Mark all read
          </Button>
        )}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <Card className="py-16 border-border/50">
          <CardContent className="text-center">
            <Bell className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-1">No notifications</h3>
            <p className="text-muted-foreground text-sm">
              You&apos;re all caught up! We&apos;ll notify you when something important happens.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2 stagger-children">
          {notifications.map((notif) => {
            const content = (
              <div
                key={notif.id}
                className={`flex items-start gap-4 p-4 rounded-xl transition-colors cursor-pointer ${
                  notif.read
                    ? "bg-muted/30 hover:bg-muted/50"
                    : "bg-green-50/50 dark:bg-green-900/10 hover:bg-green-50 dark:hover:bg-green-900/20 border border-green-200/50 dark:border-green-800/30"
                }`}
                onClick={() => !notif.read && markAsRead(notif.id)}
              >
                <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
                  {typeIcons[notif.type] || typeIcons.info}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className={`text-sm font-medium ${!notif.read ? "text-foreground" : "text-muted-foreground"}`}>
                      {notif.title}
                    </p>
                    {!notif.read && (
                      <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{notif.message}</p>
                  <p className="text-xs text-muted-foreground/60 mt-1 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {new Date(notif.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            )

            return notif.link ? (
              <Link key={notif.id} href={notif.link}>
                {content}
              </Link>
            ) : (
              <div key={notif.id}>{content}</div>
            )
          })}
        </div>
      )}
    </div>
  )
}
