import { supabase } from "./supabaseClient"

export async function uploadProductImage(imageFile: File): Promise<string> {
  const fileExt = imageFile.name.split(".").pop()
  const fileName = `${Date.now()}.${fileExt}`
  const filePath = `products/${fileName}`

  const { error } = await supabase.storage
    .from("product-images")
    .upload(filePath, imageFile)

  if (error) throw new Error("Image upload failed: " + error.message)

  const { data: { publicUrl } } = supabase.storage
    .from("product-images")
    .getPublicUrl(filePath)

  if (!publicUrl) throw new Error("Failed to get public image URL")

  return publicUrl
}