// context/ProductContext.tsx
"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import type { Product } from "@/types/product"

interface ProductContextType {
  products: Product[]
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>
  loading: boolean
}

const ProductContext = createContext<ProductContextType | undefined>(undefined)

export const useProductContext = () => {
  const context = useContext(ProductContext)
  if (!context) throw new Error("useProductContext must be used within ProductProvider")
  return context
}

export const ProductProvider = ({ children }: { children: React.ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products")
        const data = await res.json()
        setProducts(data.products || [])
      } catch (err) {
        console.error("Failed to fetch products:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  return (
    <ProductContext.Provider value={{ products, setProducts, loading }}>
      {children}
    </ProductContext.Provider>
  )
}
