"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { ProductGrid } from "@/components/product-grid"
import { ProductFilters } from "@/components/product-filters"
import type { ProductFilterOptions, Product } from "@/types/product"
import { useCartContext } from "@/contexts/CartContext"

export default function ProductsPage() {
  const { addToCart } = useCartContext()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [filterOptions, setFilterOptions] = useState<ProductFilterOptions>({})
  const [page, setPage] = useState<number>(1)
  const [hasMore, setHasMore] = useState<boolean>(true)
  const limit = 12

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/products?page=${page}&limit=${limit}`)
      const data = await res.json()

      setProducts((prev) => [...prev, ...data.products])
      setHasMore(data.products.length === limit)
    } catch (error) {
      console.error("Failed to fetch products:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [page])

  const observer = useRef<IntersectionObserver | null>(null)
  const lastProductRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return
      if (observer.current) observer.current.disconnect()

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1)
        }
      })

      if (node) observer.current.observe(node)
    },
    [loading, hasMore]
  )

  const maxPrice = products.length ? Math.max(...products.map((p) => p.price)) : 0

  const handleFilterChange = (newFilters: ProductFilterOptions) => {
    setFilterOptions(newFilters)
  }

  const filteredProducts = products.filter((product) => {
    // Match any selected category
    if (
      filterOptions.categories &&
      filterOptions.categories.length > 0 &&
      !filterOptions.categories.includes(product.category)
    ) {
      return false
    }

    if (filterOptions.organic && !product.organic) {
      return false
    }

    if (filterOptions.inStock && !product.inStock) {
      return false
    }

    if (filterOptions.priceRange) {
      const { min, max } = filterOptions.priceRange
      if (product.price < min || product.price > max) {
        return false
      }
    }

    return true
  })


  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (!filterOptions.sortBy) return 0
    switch (filterOptions.sortBy) {
      case "price-asc":
        return a.price - b.price
      case "price-desc":
        return b.price - a.price
      case "name-asc":
        return a.name.localeCompare(b.name)
      case "name-desc":
        return b.name.localeCompare(a.name)
      default:
        return 0
    }
  })

  return (
    <div className="container py-8 px-4 md:px-6">
      <div className="mb-7">
        <h1 className="text-3xl font-bold mb-2">Fresh Local Products</h1>
        <p className="text-muted-foreground">
          Browse our selection of fresh, locally-grown produce and artisanal goods.
        </p>
      </div>

      <div className="mb-6">
        <ProductFilters
          filterOptions={filterOptions}
          onFilterChange={handleFilterChange}
          maxPrice={maxPrice}
        />
      </div>

      <div className="mb-4">
        <p className="text-sm text-muted-foreground">
          Showing {sortedProducts.length} of {products.length} products
        </p>
      </div>

      {sortedProducts.length > 0 ? (
        <>
          <ProductGrid products={sortedProducts} onAddToCart={addToCart} />

          <div ref={lastProductRef} className="h-10" />

          {loading && (
            <div className="text-center py-4 text-muted-foreground">Loading more...</div>
          )}
        </>
      ) : loading ? (
        <div className="text-center py-12">Loading products...</div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium mb-2">No products found</h3>
          <p className="text-muted-foreground">
            Try adjusting your filters to find what you're looking for.
          </p>
        </div>
      )}
    </div>
  )
}
