import { supabase } from "@/lib/supabaseClient"

export async function uploadProductImage(imageFile: File): Promise<string> {
  const ext = imageFile.name.split(".").pop() || "png"
  const fileName = `${crypto.randomUUID()}.${ext}`
  const filePath = `products/${fileName}`

  const { error } = await supabase.storage
    .from("product-images")
    .upload(filePath, imageFile, {
      contentType: imageFile.type,
      upsert: false,
    })

  if (error) {
    console.error("Supabase Upload Error:", error)
    throw new Error("Image upload failed: " + error.message)
  }

  const { data } = supabase
    .storage
    .from("product-images")
    .getPublicUrl(filePath)

  if (!data?.publicUrl) throw new Error("Failed to get public image URL")

  return data.publicUrl
}
