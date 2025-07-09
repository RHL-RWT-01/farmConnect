'use client'

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

  if (loading) return <div className="p-8 text-center">Loading product...</div>

  if (!product) return <p className="p-8 text-red-500">Product not found.</p>

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
            <CardTitle>Edit Crop</CardTitle>
            <CardDescription>Update your product details.</CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2"><Label>Name*</Label><Input value={name} onChange={(e) => setName(e.target.value)} required /></div>

              <div className="space-y-2">
                <Label>Category*</Label>
                <Select value={category} onValueChange={(v: Category) => setCategory(v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent className="max-h-32 overflow-y-auto">
                    {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Price (₹)*</Label><Input type="number" min="0" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} required /></div>
                <div className="space-y-2"><Label>Quantity*</Label><Input type="number" min="0" value={quantity} onChange={(e) => setQuantity(e.target.value)} required /></div>
              </div>

              <div className="space-y-2"><Label>Unit*</Label><Input value={unit} onChange={(e) => setUnit(e.target.value)} placeholder="kg, piece, bunch …" required /></div>

              <div className="space-y-2"><Label>Description</Label><Textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} /></div>

              {/* image upload */}              
              <div className="space-y-2">
                <Label>Product Image*</Label>
                <div className="flex items-center gap-4">
                  <Button type="button" variant="outline" className="w-full h-32 border-dashed flex flex-col items-center justify-center" onClick={() => document.getElementById("image-input")?.click()}>
                    <ImagePlus className="h-8 w-8 mb-2 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Click to upload</span>
                  </Button>
                  <input id="image-input" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />

                  {previewUrl && (
                    <div className="relative h-32 w-32 rounded-md overflow-hidden">
                      <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" />
                      <Button type="button" variant="destructive" size="sm" className="absolute top-1 right-1 h-6 w-6 p-0" onClick={() => { setImageFile(null); setPreviewUrl(null) }}>×</Button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2"><Checkbox id="organic" checked={organic} onCheckedChange={val => setOrganic(val === true)} /><Label htmlFor="organic">Organic</Label></div>
              <div className="flex items-center space-x-2"><Checkbox id="instock" checked={inStock} onCheckedChange={val => setInStock(val === true)} /><Label htmlFor="instock">In Stock</Label></div>
            </CardContent>

            <CardFooter className="flex justify-between">
              <Button type="button" variant="ghost" onClick={() => router.back()} disabled={submitting}>Cancel</Button>
              <Button type="submit" disabled={submitting}>{submitting ? (<><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving</>) : "Save"}</Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
