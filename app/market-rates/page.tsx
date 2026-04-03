"use client"

import { useState } from "react"
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Search,
  BarChart3,
  IndianRupee,
  Info,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

// Simulated market rates data for Indian crops (per quintal unless specified)
const marketRates = [
  { crop: "Wheat", msp: 2275, market: 2350, unit: "quintal", trend: "up", change: "+3.2%", category: "grains" },
  { crop: "Rice (Paddy)", msp: 2183, market: 2250, unit: "quintal", trend: "up", change: "+2.8%", category: "grains" },
  { crop: "Maize", msp: 2090, market: 1980, unit: "quintal", trend: "down", change: "-1.5%", category: "grains" },
  { crop: "Soybean", msp: 4600, market: 4750, unit: "quintal", trend: "up", change: "+4.1%", category: "pulses" },
  { crop: "Cotton", msp: 6620, market: 6850, unit: "quintal", trend: "up", change: "+2.5%", category: "pulses" },
  { crop: "Tomato", msp: null, market: 1800, unit: "quintal", trend: "down", change: "-8.2%", category: "vegetables" },
  { crop: "Onion", msp: null, market: 2200, unit: "quintal", trend: "up", change: "+12.5%", category: "vegetables" },
  { crop: "Potato", msp: null, market: 1200, unit: "quintal", trend: "stable", change: "+0.3%", category: "vegetables" },
  { crop: "Apple", msp: null, market: 8500, unit: "quintal", trend: "up", change: "+5.1%", category: "fruits" },
  { crop: "Banana", msp: null, market: 2800, unit: "quintal", trend: "stable", change: "-0.5%", category: "fruits" },
  { crop: "Mango", msp: null, market: 6200, unit: "quintal", trend: "up", change: "+7.8%", category: "fruits" },
  { crop: "Turmeric", msp: null, market: 14500, unit: "quintal", trend: "up", change: "+15.2%", category: "spices" },
  { crop: "Black Pepper", msp: null, market: 52000, unit: "quintal", trend: "stable", change: "+1.2%", category: "spices" },
  { crop: "Cumin", msp: null, market: 42000, unit: "quintal", trend: "down", change: "-3.8%", category: "spices" },
  { crop: "Milk", msp: null, market: 55, unit: "litre", trend: "up", change: "+2.0%", category: "dairy" },
  { crop: "Ghee", msp: null, market: 550, unit: "kg", trend: "up", change: "+4.5%", category: "dairy" },
  { crop: "Chickpea (Chana)", msp: 5440, market: 5600, unit: "quintal", trend: "up", change: "+2.9%", category: "pulses" },
  { crop: "Mustard", msp: 5650, market: 5400, unit: "quintal", trend: "down", change: "-2.1%", category: "pulses" },
]

const categories = ["all", "grains", "vegetables", "fruits", "spices", "pulses", "dairy"]

export default function MarketRatesPage() {
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const filtered = marketRates.filter((item) => {
    const matchesSearch = item.crop.toLowerCase().includes(search.toLowerCase())
    const matchesCat = selectedCategory === "all" || item.category === selectedCategory
    return matchesSearch && matchesCat
  })

  const trendIcon = (trend: string) => {
    if (trend === "up") return <TrendingUp className="h-4 w-4 text-green-500" />
    if (trend === "down") return <TrendingDown className="h-4 w-4 text-red-500" />
    return <Minus className="h-4 w-4 text-muted-foreground" />
  }

  const trendColor = (trend: string) => {
    if (trend === "up") return "text-green-600"
    if (trend === "down") return "text-red-500"
    return "text-muted-foreground"
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <BarChart3 className="h-8 w-8 text-green-600" />
          <span className="gradient-text">Market Rates</span>
        </h1>
        <p className="text-muted-foreground mt-1">
          Current market prices and MSP (Minimum Support Price) for agricultural commodities
        </p>
      </div>

      {/* Info Banner */}
      <Card className="mb-6 border-blue-200 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-900/10">
        <CardContent className="p-4 flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-700 dark:text-blue-400">Price Disclaimer</p>
            <p className="text-xs text-blue-600/70 dark:text-blue-400/70">
              Prices are indicative and based on average mandi rates. Actual prices may vary by location and quality. MSP is set by the Government of India.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search crops..."
            className="pl-10 bg-muted border-0 rounded-xl h-11"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? "default" : "outline"}
              size="sm"
              className={`capitalize rounded-full ${
                selectedCategory === cat ? "bg-green-600 hover:bg-green-700 text-white" : ""
              }`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      {/* Rates Table */}
      <Card className="border-border/50">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="p-4 text-left font-medium">Commodity</th>
                  <th className="p-4 text-left font-medium">Category</th>
                  <th className="p-4 text-right font-medium">
                    <span className="flex items-center justify-end gap-1">
                      <IndianRupee className="h-3.5 w-3.5" /> MSP
                    </span>
                  </th>
                  <th className="p-4 text-right font-medium">
                    <span className="flex items-center justify-end gap-1">
                      <IndianRupee className="h-3.5 w-3.5" /> Market Rate
                    </span>
                  </th>
                  <th className="p-4 text-right font-medium">Unit</th>
                  <th className="p-4 text-right font-medium">Trend</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item, i) => (
                  <tr
                    key={i}
                    className="border-t border-border/50 hover:bg-muted/30 transition-colors"
                  >
                    <td className="p-4 font-medium">{item.crop}</td>
                    <td className="p-4">
                      <Badge variant="outline" className="capitalize text-xs rounded-full">
                        {item.category}
                      </Badge>
                    </td>
                    <td className="p-4 text-right">
                      {item.msp ? (
                        <span className="font-medium">₹{item.msp.toLocaleString("en-IN")}</span>
                      ) : (
                        <span className="text-muted-foreground text-xs">N/A</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <span className="font-bold text-green-600">
                        ₹{item.market.toLocaleString("en-IN")}
                      </span>
                    </td>
                    <td className="p-4 text-right text-muted-foreground capitalize">
                      {item.unit}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {trendIcon(item.trend)}
                        <span className={`text-xs font-medium ${trendColor(item.trend)}`}>
                          {item.change}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-muted-foreground">
                      No crops found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid sm:grid-cols-3 gap-4 mt-6">
        <Card className="border-green-200 dark:border-green-900/50">
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-6 w-6 text-green-500 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Rising Crops</p>
            <p className="text-xl font-bold text-green-600">
              {marketRates.filter((r) => r.trend === "up").length}
            </p>
          </CardContent>
        </Card>
        <Card className="border-red-200 dark:border-red-900/50">
          <CardContent className="p-4 text-center">
            <TrendingDown className="h-6 w-6 text-red-500 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Falling Crops</p>
            <p className="text-xl font-bold text-red-500">
              {marketRates.filter((r) => r.trend === "down").length}
            </p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4 text-center">
            <Minus className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Stable Crops</p>
            <p className="text-xl font-bold">
              {marketRates.filter((r) => r.trend === "stable").length}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
