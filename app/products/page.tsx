"use client"

import { useState } from "react"
import { ProductGrid } from "@/components/product-grid"
import { ProductFilters } from "@/components/product-filters"
import type { ProductFilterOptions } from "@/types/product"
import { useProductContext } from "@/contexts/ProductContext"
import { useCartContext } from "@/contexts/CartContext"

export default function ProductsPage() {
  const { products, loading } = useProductContext()
  const { addToCart } = useCartContext()
  const [filterOptions, setFilterOptions] = useState<ProductFilterOptions>({})

  const maxPrice = products.length ? Math.max(...products.map((p) => p.price)) : 0

  const handleFilterChange = (newFilters: ProductFilterOptions) => {
    setFilterOptions(newFilters)
  }

  const filteredProducts = products.filter((product) => {
    if (filterOptions.category && product.category !== filterOptions.category) {
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
      <div className="mb-8">
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

      {loading ? (
        <div className="text-center py-12">Loading products...</div>
      ) : sortedProducts.length > 0 ? (
        <ProductGrid products={sortedProducts} onAddToCart={addToCart} />
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
