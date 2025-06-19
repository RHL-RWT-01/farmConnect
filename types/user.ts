
export type UserRole = "FARMER" | "BUYER"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  image?: string 
}
