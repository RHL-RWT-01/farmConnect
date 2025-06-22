// context/CartContext.tsx
"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"
import type { CartItem, Product } from "@/types/product"
import { AuthContext } from "@/components/providers/AuthProvider"

interface CartContextType {
  cart: CartItem[]
  addToCart: (product: Product, quantity?: number) => Promise<void>
  removeFromCart: (productId: string) => Promise<void>
  updateQuantity: (productId: string, quantity: number) => Promise<void>
  loading: boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const useCartContext = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCartContext must be used within CartProvider")
  return ctx
}

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, isAuthenticated } = useContext(AuthContext)! // ✔ current user
  const { toast } = useToast()

  const [cart, setCart] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)

  /* ─────────────── Helper ─────────────── */
  const fetchCartFromServer = async (uid: string) => {
    const res = await fetch(`/api/cart?userId=${uid}`, {
      credentials: "include",
    })
    const data = await res.json()
    setCart(data.cartItems || [])
  }

  /* ─────────────── Initial load ─────────────── */
  useEffect(() => {
    if (!isAuthenticated || !user) {
      setLoading(false)
      return
    }
    ;(async () => {
      try {
        await fetchCartFromServer(user.id)
      } catch {
        console.error("Failed to load cart")
      } finally {
        setLoading(false)
      }
    })()
  }, [isAuthenticated, user])

  /* ─────────────── Cart Actions ─────────────── */
  const addToCart = async (product: Product, quantity = 1) => {
    if (!user) return
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, productId: product.id, quantity }),
      })
      if (!res.ok) throw new Error("Failed to add")
      const updated = await res.json()
      setCart(updated)
      toast({ title: "Added", description: `${product.name} x${quantity}` })
    } catch {
      toast({ title: "Error", description: "Unable to add item", variant: "destructive" })
    }
  }

  const removeFromCart = async (productId: string) => {
    if (!user) return
    try {
      await fetch("/api/cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, productId }),
      })
      setCart(prev => prev.filter(item => item.product.id !== productId))
    } catch {
      toast({ title: "Error", description: "Remove failed", variant: "destructive" })
    }
  }

  const updateQuantity = async (productId: string, quantity: number) => {
    if (!user) return
    try {
      await fetch("/api/cart", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, productId, quantity }),
      })
      setCart(prev =>
        prev.map(item =>
          item.product.id === productId ? { ...item, quantity } : item
        )
      )
    } catch {
      toast({ title: "Error", description: "Update failed", variant: "destructive" })
    }
  }

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity, loading }}
    >
      {children}
    </CartContext.Provider>
  )
}
