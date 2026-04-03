"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { ProductGrid } from "@/components/product-grid";
import { ProductFilters } from "@/components/product-filters";
import type { ProductFilterOptions, Product } from "@/types/product";
import { useCartContext } from "@/contexts/CartContext";
import { Search, Sprout, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ProductsPage() {
  const { addToCart } = useCartContext();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [filterOptions, setFilterOptions] = useState<ProductFilterOptions>({});
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");
  const [showFilters, setShowFilters] = useState(true);

  const limit = 12;
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const fetchProducts = async (reset = false, searchQuery = "") => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/products?page=${reset ? 1 : page}&limit=${limit}&search=${encodeURIComponent(searchQuery)}`
      );
      const data = await res.json();

      setProducts((prev) => (reset ? data?.products : [...prev, ...data.products]));
      setHasMore(data?.products?.length === limit);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(true, search);
  }, []);

  useEffect(() => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

    debounceTimeout.current = setTimeout(() => {
      setPage(1);
      fetchProducts(true, search);
    }, 500);

    return () => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    };
  }, [search]);

  const observer = useRef<IntersectionObserver | null>(null);
  const lastProductRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  useEffect(() => {
    if (page === 1) return;
    fetchProducts(false, search);
  }, [page]);

  const maxPrice = products.length ? Math.max(...products.map((p) => p.price)) : 0;

  const handleFilterChange = (newFilters: ProductFilterOptions) => {
    setFilterOptions(newFilters);
  };

  const filteredProducts = products.filter((product) => {
    if (
      filterOptions.categories &&
      filterOptions.categories.length > 0 &&
      !filterOptions.categories.includes(product.category)
    ) return false;

    if (filterOptions.organic && !product.organic) return false;
    if (filterOptions.inStock && !product.inStock) return false;

    if (filterOptions.priceRange) {
      const { min, max } = filterOptions.priceRange;
      if (product.price < min || product.price > max) return false;
    }

    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (!filterOptions.sortBy) return 0;
    switch (filterOptions.sortBy) {
      case "price-asc": return a.price - b.price;
      case "price-desc": return b.price - a.price;
      case "name-asc": return a.name.localeCompare(b.name);
      case "name-desc": return b.name.localeCompare(a.name);
      default: return 0;
    }
  });

  return (
    <div className="container py-8 px-4 md:px-6 max-w-7xl">
      {/* Header */}
      <div className="mb-8 animate-fade-in-up">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
            <Sprout className="h-5 w-5 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold gradient-text">Fresh Local Products</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl">
          Browse our selection of fresh, locally-grown produce and artisanal goods directly from verified farmers across India.
        </p>
      </div>

      {/* Search + Filter Toggle */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search products, farmers, categories..."
            className="pl-10 rounded-xl bg-muted border-0 focus-visible:ring-2 focus-visible:ring-green-500/30 h-11"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            id="product-search"
          />
        </div>
        <Button
          variant="outline"
          size="default"
          className="gap-2 rounded-xl"
          onClick={() => setShowFilters(!showFilters)}
        >
          <SlidersHorizontal className="h-4 w-4" />
          {showFilters ? "Hide" : "Show"} Filters
        </Button>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="mb-6 animate-fade-in-down">
          <ProductFilters
            filterOptions={filterOptions}
            onFilterChange={handleFilterChange}
            maxPrice={maxPrice}
          />
        </div>
      )}

      {/* Count */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing <span className="font-medium text-foreground">{sortedProducts?.length ?? 0}</span> of{" "}
          <span className="font-medium text-foreground">{products?.length}</span> products
        </p>
      </div>

      {/* Products */}
      {sortedProducts.length > 0 ? (
        <>
          <ProductGrid products={sortedProducts} onAddToCart={addToCart} />
          <div ref={lastProductRef} className="h-10" />
          {loading && (
            <div className="text-center py-6">
              <div className="inline-flex items-center gap-2 text-muted-foreground">
                <div className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
                Loading more products...
              </div>
            </div>
          )}
        </>
      ) : loading ? (
        <div className="text-center py-16">
          <div className="inline-flex items-center gap-2 text-muted-foreground">
            <div className="w-5 h-5 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
            Loading products...
          </div>
        </div>
      ) : (
        <div className="text-center py-16 animate-fade-in-up">
          <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-2xl flex items-center justify-center">
            <Search className="h-8 w-8 text-muted-foreground/40" />
          </div>
          <h3 className="text-lg font-semibold mb-1">No products found</h3>
          <p className="text-muted-foreground text-sm">
            Try adjusting your filters or search query.
          </p>
        </div>
      )}
    </div>
  );
}
