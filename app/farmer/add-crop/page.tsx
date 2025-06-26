// app/farmer/add-crop/page.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Plus, Loader2, ImagePlus, ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/useAuth"

const categories = ["vegetables", "fruits", "spices", "grains", "pulses", "dairy"] as const

type Category = (typeof categories)[number]

export default function AddCropPage() {
  const { toast } = useToast()
  const { user } = useAuth()
  const router = useRouter()

  /* ── state ─────────────────────────────────────── */
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState<string>("")
  const [quantity, setQuantity] = useState<string>("")
  const [unit, setUnit] = useState("kg")
  const [category, setCategory] = useState<Category>("vegetables")
  const [organic, setOrganic] = useState(false)
  const [inStock, setInStock] = useState(true)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  /* ── image preview ─────────────────────────────── */
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  /* ── submit ────────────────────────────────────── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // basic validation
    if (!name || !price || !quantity || !unit || !imageFile) {
      toast({ title: "Missing fields", description: "Please fill all required fields", variant: "destructive" })
      return
    }

    const priceNum = parseFloat(price)
    const qtyNum = parseInt(quantity)
    if (priceNum < 0 || qtyNum < 0) {
      toast({ title: "Invalid numbers", description: "Price and quantity must be non‑negative", variant: "destructive" })
      return
    }

    setSubmitting(true)
    try {
      // FormData to include image file
      const formData = new FormData()
      formData.append("name", name)
      formData.append("description", description)
      formData.append("price", priceNum.toString())
      formData.append("quantity", qtyNum.toString())
      formData.append("unit", unit)
      formData.append("category", category)
      formData.append("organic", String(organic))
      formData.append("inStock", String(inStock))
      formData.append("image", imageFile!)

      const res = await fetch("/api/farmer/products", { method: "POST", body: formData })
      if (!res.ok) throw new Error("Failed to add product")

      toast({ title: "Product added", description: `${name} saved successfully` })
      router.push("/farmer/dashboard")
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Something went wrong", variant: "destructive" })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="container py-8">
      <Link href="/farmer/dashboard">
        <Button variant="ghost" size="sm" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to dashboard
        </Button>
      </Link>

      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Add New Crop</CardTitle>
            <CardDescription>Fill the details to list your produce.</CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {/* name */}
              <div className="space-y-2">
                <Label>Name*</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} required />
              </div>

              {/* category */}
              <div className="space-y-2">
                <Label>Category*</Label>
                <Select value={category} onValueChange={(v: Category) => setCategory(v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="max-h-32 overflow-y-auto">
                    {categories.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* price & qty */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Price (₹)*</Label>
                  <Input type="number" min="0" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label>Quantity*</Label>
                  <Input type="number" min="0" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
                </div>
              </div>

              {/* unit */}
              <div className="space-y-2">
                <Label>Unit*</Label>
                <Input value={unit} onChange={(e) => setUnit(e.target.value)} placeholder="kg, piece, bunch …" required />
              </div>

              {/* description */}
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>

              {/* image upload with preview */}
              <div className="space-y-2">
                <Label>Product Image*</Label>
                <div className="flex items-center gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-32 border-dashed flex flex-col items-center justify-center"
                    onClick={() => document.getElementById("image-input")?.click()}
                  >
                    <ImagePlus className="h-8 w-8 mb-2 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Click to upload</span>
                  </Button>
                  <input id="image-input" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />

                  {previewUrl && (
                    <div className="relative h-32 w-32 rounded-md overflow-hidden">
                      <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-1 right-1 h-6 w-6 p-0"
                        onClick={() => { setImageFile(null); setPreviewUrl(null) }}
                      >
                        ×
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* checkboxes */}
              <div className="flex items-center space-x-2">
                <Checkbox id="organic" checked={organic} onCheckedChange={checked => setOrganic(checked === true)} />
                <Label htmlFor="organic">Organic</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="instock" checked={inStock} onCheckedChange={checked => setInStock(checked === true)} />
                <Label htmlFor="instock">In Stock</Label>
              </div>
            </CardContent>

            <CardFooter className="flex justify-between">
              <Button type="button" variant="ghost" onClick={() => router.back()} disabled={submitting}>Cancel</Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? (<><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving</>) : "Save"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
