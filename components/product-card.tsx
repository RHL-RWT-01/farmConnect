"use client"

import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Leaf, ShoppingCart, Star, MapPin } from "lucide-react"
import type { Product } from "@/types/product"

interface ProductCardProps {
  product: Product
  onAddToCart: (product: Product) => void
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const rating = product.rating || 0
  const reviewCount = product.reviewCount || 0

  return (
    <Card className="overflow-hidden premium-card border-border/50 group">
      <div className="relative aspect-square overflow-hidden bg-muted">
        <Link href={`/products/${product.id}`}>
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {!product.inStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
              <Badge variant="destructive" className="text-sm font-semibold px-4 py-1.5 rounded-full">
                Sold Out
              </Badge>
            </div>
          )}

          {product.organic && (
            <Badge className="absolute top-3 left-3 bg-green-600 hover:bg-green-700 rounded-full shadow-lg text-xs">
              <Leaf className="mr-1 h-3 w-3" />
              Organic
            </Badge>
          )}

          {product.inStock && product.quantity < 10 && product.quantity > 0 && (
            <Badge className="absolute top-3 right-3 bg-amber-500 hover:bg-amber-600 rounded-full shadow-lg text-xs">
              Low Stock
            </Badge>
          )}
        </Link>
      </div>

      <CardContent className="p-4 space-y-2">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3" />
          <span className="truncate">{product.farmer.name} • {product.farmer.location}</span>
        </div>
        <Link href={`/products/${product.id}`} className="hover:underline decoration-green-500">
          <h3 className="font-semibold text-base line-clamp-1 group-hover:text-green-600 transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        {/* Rating */}
        {reviewCount > 0 && (
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-3.5 w-3.5 ${
                    star <= Math.round(rating)
                      ? "text-amber-400 fill-amber-400"
                      : "text-muted-foreground/30"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">({reviewCount})</span>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex items-center justify-between p-4 pt-0">
        <div>
          <span className="text-lg font-bold text-green-600">
            ₹{product.price.toFixed(2)}
          </span>
          <span className="text-xs font-normal text-muted-foreground ml-1">
            / {product.unit}
          </span>
        </div>
        <Button
          size="sm"
          onClick={() => onAddToCart(product)}
          disabled={!product.inStock}
          className="bg-green-600 hover:bg-green-700 text-white rounded-full px-4 shadow-sm hover:shadow-md transition-all"
        >
          <ShoppingCart className="mr-1.5 h-3.5 w-3.5" />
          Add
        </Button>
      </CardFooter>
    </Card>
  )
}
