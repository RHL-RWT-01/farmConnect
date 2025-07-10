"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Loader2, ImagePlus, ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card, CardContent, CardDescription, CardFooter,
  CardHeader, CardTitle
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/useAuth"
import { uploadProductImage } from "@/lib/upload-image"
import DeleteDialog from "@/components/ui/deletedialog"

const categories = ["vegetables", "fruits", "spices", "grains", "pulses", "dairy"] as const
type Category = (typeof categories)[number]

export default function EditCropPage() {
  const { toast } = useToast()
  const { user } = useAuth()
  const router = useRouter()
  const { id } = useParams()

  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [quantity, setQuantity] = useState("")
  const [unit, setUnit] = useState("kg")
  const [category, setCategory] = useState<Category>("vegetables")
  const [organic, setOrganic] = useState(false)
  const [inStock, setInStock] = useState(true)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/farmer/products/${id}`)
        const data = await res.json()
        if (!res.ok) throw new Error("Product not found")
        setProduct(data)
        setName(data.name)
        setDescription(data.description || "")
        setPrice(data.price.toString())
        setQuantity(data.quantity.toString())
        setUnit(data.unit || "kg")
        setCategory(data.category || "vegetables")
        setOrganic(data.organic ?? false)
        setInStock(data.inStock ?? true)
        setPreviewUrl(data.image || null)
      } catch (err: any) {
        toast({ title: "Error", description: err.message, variant: "destructive" })
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchProduct()
  }, [id, toast])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const imageUrl = imageFile ? await uploadProductImage(imageFile) : previewUrl

      const res = await fetch(`/api/farmer/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          price: parseFloat(price),
          quantity: parseInt(quantity),
          unit,
          category,
          organic,
          inStock,
          image: imageUrl,
        }),
      })

      if (!res.ok) throw new Error("Update failed")

      toast({ title: "Product updated", description: `${name} saved successfully` })
      router.push("/farmer/dashboard")
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" })
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/farmer/products/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Delete failed")

      toast({ title: "🗑️ Product deleted", description: `"${name}" has been removed.` })
      router.push("/farmer/dashboard")
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" })
    }
  }


  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center text-lg text-muted-foreground">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading product...
      </div>
    )
  }

  if (!product) {
    return (
      <div className="text-center py-10 text-red-500">
        Product not found.
      </div>
    )
  }

  return (
    <div className="container py-10">
      <div className="mb-6">
        <Button asChild variant="ghost" size="sm" className="text-green-600 hover:text-green-700">
          <Link href="/farmer/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to dashboard
          </Link>
        </Button>
      </div>

      <div className="max-w-3xl mx-auto">
        <Card className="border border-green-300 shadow-md">
          <CardHeader>
            <CardTitle className="text-3xl text-green-700 font-bold">Edit Crop</CardTitle>
            <CardDescription className="text-green-600">Update your product details below.</CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              {/* Name */}
              <div className="grid gap-2">
                <Label className="text-green-700">Name*</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} required />
              </div>

              {/* Category */}
              <div className="grid gap-2">
                <Label className="text-green-700">Category*</Label>
                <Select value={category} onValueChange={(v: Category) => setCategory(v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(c => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Price + Quantity */}
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label className="text-green-700">Price (₹)*</Label>
                  <Input type="number" min="0" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} required />
                </div>
                <div className="grid gap-2">
                  <Label className="text-green-700">Quantity*</Label>
                  <Input type="number" min="0" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
                </div>
              </div>

              {/* Unit */}
              <div className="grid gap-2">
                <Label className="text-green-700">Unit*</Label>
                <Input value={unit} onChange={(e) => setUnit(e.target.value)} placeholder="kg, piece, bunch…" required />
              </div>

              {/* Description */}
              <div className="grid gap-2">
                <Label className="text-green-700">Description</Label>
                <Textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>

              {/* Image Upload */}
              <div className="grid gap-2">
                <Label className="text-green-700">Product Image*</Label>
                <div className="flex items-center gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="h-32 w-full border-2 border-dashed border-green-600 hover:bg-green-50"
                    onClick={() => document.getElementById("image-input")?.click()}
                  >
                    <div className="flex flex-col items-center justify-center w-full h-full text-muted-foreground">
                      <ImagePlus className="h-6 w-6 mb-1" />
                      <span className="text-sm">Click to upload</span>
                    </div>
                  </Button>
                  <input id="image-input" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                  {previewUrl && (
                    <div className="relative h-32 w-32 rounded-md overflow-hidden">
                      <img src={previewUrl} alt="Preview" className="object-cover h-full w-full" />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-1 right-1 h-6 w-6 p-0"
                        onClick={() => { setImageFile(null); setPreviewUrl(null) }}
                      >×</Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Checkboxes */}
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="organic" checked={organic} onCheckedChange={val => setOrganic(val === true)} />
                  <Label htmlFor="organic" className="text-green-700">Organic</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="instock" checked={inStock} onCheckedChange={val => setInStock(val === true)} />
                  <Label htmlFor="instock" className="text-green-700">In Stock</Label>
                </div>
              </div>
            </CardContent>

            {/* Footer Buttons */}
            <CardFooter className="flex justify-between flex-wrap gap-2 pt-4">
              <Button type="button" variant="ghost" onClick={() => router.back()} disabled={submitting}>Cancel</Button>
              <div className="flex gap-2 ml-auto">
                <DeleteDialog onDelete={handleDelete} />
                <Button type="submit" className="bg-green-600 text-white hover:bg-green-700" disabled={submitting}>
                  {submitting ? (<><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving</>) : "Save"}
                </Button>


              </div>
            </CardFooter>
          </form>
        </Card>

        <footer className="text-center text-sm text-muted-foreground mt-10 space-x-4">
          <span className="text-green-700 font-semibold">AgriConnect</span>
          <span>|</span>
          <Link href="#" className="hover:underline">Terms</Link>
          <span>|</span>
          <Link href="#" className="hover:underline">Privacy</Link>
          <span>|</span>
          <Link href="#" className="hover:underline">Contact</Link>
        </footer>
      </div>
    </div>
  )
}

