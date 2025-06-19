"use client"

import { useState, ChangeEvent, FormEvent } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { ProductCategory } from "@/types/product"

const categories: ProductCategory[] = [
  "vegetables",
  "fruits",
  "spices",
  "grains",
  "pulses",
  "dairy"
]

export default function AddCropForm() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: 0,
    unit: "kg",
    category: "vegetables" as ProductCategory,
    image: "",
    organic: false,
    inStock: true,
    quantity: 0,
  })

  const [preview, setPreview] = useState<string | null>(null)

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setForm({
      ...form,
      [name]:
        type === "checkbox" && "checked" in e.target
          ? (e.target as HTMLInputElement).checked
          : value
    })
  }

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setForm(prev => ({ ...prev, image: reader.result as string }))
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    console.log("Submitted Crop:", form)
    // Add actual submission logic here
  }

  return (
    <section className="w-full py-20 md:py-32 lg:py-40">
      <div className="container max-w-2xl px-4 space-y-6 bg-background p-6 rounded-xl shadow-lg border border-border">
        <h2 className="text-3xl font-bold text-center text-foreground">Add New Crop</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input name="name" value={form.name} onChange={handleChange} required />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea name="description" value={form.description} onChange={handleChange} required />
          </div>

          <div className="flex gap-4">
            <div className="flex-1 space-y-2">
              <Label>Price (INR)</Label>
              <Input type="number" name="price" value={form.price} onChange={handleChange} required />
            </div>
            <div className="flex-1 space-y-2">
              <Label>Unit</Label>
              <Input name="unit" value={form.unit} onChange={handleChange} required />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Category</Label>
            <select name="category" value={form.category} onChange={handleChange} className="w-full p-2 rounded-md border">
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label>Quantity</Label>
            <Input type="number" name="quantity" value={form.quantity} onChange={handleChange} required />
          </div>

          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2">
              <input type="checkbox" name="organic" checked={form.organic} onChange={handleChange} />
              <span>Organic</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" name="inStock" checked={form.inStock} onChange={handleChange} />
              <span>In Stock</span>
            </label>
          </div>

          <div className="space-y-2">
            <Label>Upload Image</Label>
            <Input type="file" accept="image/*" onChange={handleImageChange} />
            {preview && (
              <img src={preview} alt="Preview" className="mt-2 w-full max-h-64 object-cover rounded-md shadow-md" />
            )}
          </div>

          <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white">
            Add Crop
          </Button>
        </form>
      </div>
    </section>
  )
}
