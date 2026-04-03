"use client"

import { useState } from "react"
import { Calendar, Sprout, Sun, Cloud, Droplets, Snowflake, Info } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/useAuth"

// Seasonal crop data for Indian agriculture
const seasons = [
  {
    name: "Kharif",
    months: "June – October",
    icon: <Droplets className="h-5 w-5" />,
    color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600",
    crops: [
      { name: "Rice", type: "Grains", tip: "Transplant with onset of monsoon" },
      { name: "Cotton", type: "Cash crop", tip: "Requires 6+ months growing period" },
      { name: "Soybean", type: "Pulses", tip: "Plant in early June, harvest by October" },
      { name: "Maize", type: "Grains", tip: "Thrives in warm, humid conditions" },
      { name: "Groundnut", type: "Oilseed", tip: "Sandy loam soil preferred" },
      { name: "Sugarcane", type: "Cash crop", tip: "Long duration, high water requirement" },
      { name: "Turmeric", type: "Spices", tip: "Plant in June, harvest after 8-9 months" },
      { name: "Green Gram", type: "Pulses", tip: "Short duration, 60-75 days" },
    ],
  },
  {
    name: "Rabi",
    months: "October – March",
    icon: <Snowflake className="h-5 w-5" />,
    color: "bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600",
    crops: [
      { name: "Wheat", type: "Grains", tip: "Sow in November, irrigate every 20-25 days" },
      { name: "Mustard", type: "Oilseed", tip: "Ready in 110-140 days" },
      { name: "Chickpea", type: "Pulses", tip: "Drought-tolerant, minimal irrigation" },
      { name: "Barley", type: "Grains", tip: "Drought resistant, ready in 110-120 days" },
      { name: "Peas", type: "Vegetables", tip: "Cool weather crop, matures in 60-80 days" },
      { name: "Linseed", type: "Oilseed", tip: "Requires light irrigation" },
      { name: "Coriander", type: "Spices", tip: "Sow in October-November" },
      { name: "Potato", type: "Vegetables", tip: "Plant Oct-Nov, harvest Jan-Feb" },
    ],
  },
  {
    name: "Zaid",
    months: "March – June",
    icon: <Sun className="h-5 w-5" />,
    color: "bg-amber-100 dark:bg-amber-900/30 text-amber-600",
    crops: [
      { name: "Watermelon", type: "Fruits", tip: "Hot weather, heavy watering needed" },
      { name: "Muskmelon", type: "Fruits", tip: "Sandy soil, full sun required" },
      { name: "Cucumber", type: "Vegetables", tip: "Quick harvest in 40-60 days" },
      { name: "Bitter Gourd", type: "Vegetables", tip: "Thrives in heat, vine crop" },
      { name: "Pumpkin", type: "Vegetables", tip: "Large yield per plant" },
      { name: "Moong Dal", type: "Pulses", tip: "Summer pulse, 60-65 days crop" },
    ],
  },
]

const currentMonth = new Date().getMonth() // 0-indexed

function getCurrentSeason() {
  if (currentMonth >= 5 && currentMonth <= 9) return "Kharif"
  if (currentMonth >= 9 || currentMonth <= 2) return "Rabi"
  return "Zaid"
}

export default function CropCalendarPage() {
  const { user } = useAuth()
  const [selectedSeason, setSelectedSeason] = useState(getCurrentSeason())
  const activeSeason = seasons.find((s) => s.name === selectedSeason)!

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Calendar className="h-8 w-8 text-green-600" />
          <span className="gradient-text">Crop Calendar</span>
        </h1>
        <p className="text-muted-foreground mt-1">
          Seasonal planting guide for Indian agriculture — know what to grow and when
        </p>
      </div>

      {/* Current Season Banner */}
      <Card className="mb-8 border-green-200 dark:border-green-900/50 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10">
        <CardContent className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <Sprout className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Current Season</p>
            <p className="text-xl font-bold text-green-600">
              {getCurrentSeason()} Season
            </p>
          </div>
          <Badge className="ml-auto bg-green-600 text-white">
            {new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
          </Badge>
        </CardContent>
      </Card>

      {/* Season Tabs */}
      <div className="flex gap-3 mb-8">
        {seasons.map((season) => (
          <button
            key={season.name}
            onClick={() => setSelectedSeason(season.name)}
            className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all ${
              selectedSeason === season.name
                ? "border-green-500 bg-green-50 dark:bg-green-900/20 shadow-lg shadow-green-500/10"
                : "border-border hover:border-green-300"
            }`}
          >
            <div className={`w-10 h-10 rounded-xl ${season.color} flex items-center justify-center`}>
              {season.icon}
            </div>
            <div className="text-left">
              <p className={`font-semibold text-sm ${
                selectedSeason === season.name ? "text-green-700 dark:text-green-400" : ""
              }`}>
                {season.name}
              </p>
              <p className="text-xs text-muted-foreground">{season.months}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Crops Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
        {activeSeason.crops.map((crop, i) => (
          <Card key={i} className="border-border/50 premium-card">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-lg">{crop.name}</h3>
                <Badge variant="outline" className="text-xs capitalize">
                  {crop.type}
                </Badge>
              </div>
              <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50">
                <Info className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground leading-relaxed">{crop.tip}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Farming Tips */}
      <Card className="mt-8 border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cloud className="h-5 w-5 text-green-600" />
            General Tips for {selectedSeason} Season
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 gap-4">
            {selectedSeason === "Kharif" && (
              <>
                <TipCard title="Water Management" tip="Prepare drainage systems for excess monsoon rainfall. Ensure field leveling for uniform water distribution." />
                <TipCard title="Pest Control" tip="Monsoon humidity increases pest activity. Use IPM techniques and neem-based sprays." />
                <TipCard title="Soil Prep" tip="Add organic matter before sowing. Green manuring with dhaincha improves soil." />
                <TipCard title="Seed Selection" tip="Use certified, disease-resistant varieties. Treat seeds with fungicide before sowing." />
              </>
            )}
            {selectedSeason === "Rabi" && (
              <>
                <TipCard title="Frost Protection" tip="Use mulching and smoke screens to protect crops from frost in December-January." />
                <TipCard title="Irrigation" tip="Rabi crops depend on irrigation. Schedule watering at critical growth stages." />
                <TipCard title="Fertilization" tip="Apply phosphorus and potassium at sowing. Top-dress nitrogen after first irrigation." />
                <TipCard title="Harvest Timing" tip="Harvest wheat at 14% grain moisture. Delay can cause shattering losses." />
              </>
            )}
            {selectedSeason === "Zaid" && (
              <>
                <TipCard title="Heat Management" tip="Use drip irrigation to conserve water. Mulch to reduce soil temperature." />
                <TipCard title="Quick Rotation" tip="Zaid crops have short durations. Plan succession planting for continuous harvest." />
                <TipCard title="Market Timing" tip="Summer fruits fetch premium prices. Regular harvesting ensures quality." />
                <TipCard title="Storage" tip="Hot weather requires quick sale or cold storage. Pre-cool produce after harvest." />
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function TipCard({ title, tip }: { title: string; tip: string }) {
  return (
    <div className="p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
      <h4 className="text-sm font-semibold mb-1">{title}</h4>
      <p className="text-xs text-muted-foreground leading-relaxed">{tip}</p>
    </div>
  )
}
