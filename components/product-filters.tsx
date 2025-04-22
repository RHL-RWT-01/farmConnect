"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Slider } from "@/components/ui/slider"
import type { ProductCategory, ProductFilterOptions } from "@/types/product"
import { ChevronDown, SlidersHorizontal, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface ProductFiltersProps {
  filterOptions: ProductFilterOptions
  onFilterChange: (filters: ProductFilterOptions) => void
  maxPrice: number
}

export function ProductFilters({ filterOptions, onFilterChange, maxPrice }: ProductFiltersProps) {
  const [priceRange, setPriceRange] = useState<[number, number]>([
    filterOptions.priceRange?.min || 0,
    filterOptions.priceRange?.max || maxPrice,
  ])

  const categories: { value: ProductCategory; label: string }[] = [
    { value: "vegetables", label: "Vegetables" },
    { value: "fruits", label: "Fruits" },
    { value: "spices", label: "Spices" },
    { value: "grains", label: "Grains" },
    { value: "pulses", label: "Pulses" },
  ]

  const sortOptions = [
    { value: "price-asc", label: "Price: Low to High" },
    { value: "price-desc", label: "Price: High to Low" },
    { value: "name-asc", label: "Name: A to Z" },
    { value: "name-desc", label: "Name: Z to A" },
  ]

  const handlePriceChange = (value: number[]) => {
    const newRange: [number, number] = [value[0], value[1]]
    setPriceRange(newRange)
    onFilterChange({
      ...filterOptions,
      priceRange: { min: newRange[0], max: newRange[1] },
    })
  }

  const handleCategoryChange = (category: ProductCategory) => {
    onFilterChange({
      ...filterOptions,
      category: filterOptions.category === category ? undefined : category,
    })
  }

  const handleCheckboxChange = (key: "organic" | "inStock") => {
    onFilterChange({
      ...filterOptions,
      [key]: !filterOptions[key],
    })
  }

  const handleSortChange = (value: string) => {
    onFilterChange({
      ...filterOptions,
      sortBy: value as ProductFilterOptions["sortBy"],
    })
  }

  const clearFilters = () => {
    setPriceRange([0, maxPrice])
    onFilterChange({})
  }

  const hasActiveFilters = () => {
    return (
      filterOptions.category !== undefined ||
      filterOptions.organic !== undefined ||
      filterOptions.inStock !== undefined ||
      filterOptions.priceRange !== undefined
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Filters
              {hasActiveFilters() && (
                <Badge variant="secondary" className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
                  !
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Categories</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-[200px] overflow-y-auto">
              {categories.map((category) => (
                <div key={category.value} className="flex items-center px-2 py-2">
                  <Checkbox
                    id={`category-${category.value}`}
                    checked={filterOptions.category === category.value}
                    onCheckedChange={() => handleCategoryChange(category.value)}
                  />
                  <label htmlFor={`category-${category.value}`} className="ml-2 text-sm font-medium cursor-pointer">
                    {category.label}
                  </label>
                </div>
              ))}
            </div>
            <DropdownMenuSeparator />
            <div className="px-2 py-2">
              <div className="flex items-center mb-2">
                <Checkbox
                  id="organic-filter"
                  checked={filterOptions.organic}
                  onCheckedChange={() => handleCheckboxChange("organic")}
                />
                <label htmlFor="organic-filter" className="ml-2 text-sm font-medium cursor-pointer">
                  Organic Only
                </label>
              </div>
              <div className="flex items-center">
                <Checkbox
                  id="instock-filter"
                  checked={filterOptions.inStock}
                  onCheckedChange={() => handleCheckboxChange("inStock")}
                />
                <label htmlFor="instock-filter" className="ml-2 text-sm font-medium cursor-pointer">
                  In Stock Only
                </label>
              </div>
            </div>
            <DropdownMenuSeparator />
            <div className="px-2 py-2">
              <p className="text-sm font-medium mb-2">Price Range</p>
              <div className="px-2">
                <Slider
                  defaultValue={[priceRange[0], priceRange[1]]}
                  max={maxPrice}
                  step={1}
                  value={[priceRange[0], priceRange[1]]}
                  onValueChange={handlePriceChange}
                  className="my-4"
                />
                <div className="flex items-center justify-between text-sm">
                  <span>₹{priceRange[0]}</span>
                  <span>₹{priceRange[1]}</span>
                </div>
              </div>
            </div>
            <DropdownMenuSeparator />
            <div className="p-2">
              <Button variant="outline" size="sm" className="w-full" onClick={clearFilters}>
                <X className="mr-2 h-4 w-4" />
                Clear Filters
              </Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              Sort By
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuRadioGroup value={filterOptions.sortBy} onValueChange={handleSortChange}>
              {sortOptions.map((option) => (
                <DropdownMenuRadioItem key={option.value} value={option.value}>
                  {option.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        {filterOptions.category && (
          <Badge variant="secondary" className="flex gap-1 items-center">
            {categories.find((c) => c.value === filterOptions.category)?.label}
            <X className="h-3 w-3 cursor-pointer" onClick={() => handleCategoryChange(filterOptions.category!)} />
          </Badge>
        )}

        {filterOptions.organic && (
          <Badge variant="secondary" className="flex gap-1 items-center">
            Organic
            <X className="h-3 w-3 cursor-pointer" onClick={() => handleCheckboxChange("organic")} />
          </Badge>
        )}

        {filterOptions.inStock && (
          <Badge variant="secondary" className="flex gap-1 items-center">
            In Stock
            <X className="h-3 w-3 cursor-pointer" onClick={() => handleCheckboxChange("inStock")} />
          </Badge>
        )}
      </div>
    </div>
  )
}
