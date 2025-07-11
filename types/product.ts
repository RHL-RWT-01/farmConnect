export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  unit: string;
  image: string;
  category: ProductCategory;
  organic: boolean;
  inStock: boolean;
  quantity: number;
  farmer: {
    id: string;
    name: string;
    location: string;
    image: string;
  };
}

export type ProductCategory =
  | "vegetables"
  | "fruits"
  | "spices"
  | "grains"
  | "pulses"
  | "dairy";

export interface ProductFilterOptions {
  categories?: ProductCategory[];
  organic?: boolean;
  inStock?: boolean;
  priceRange?: {
    min: number;
    max: number;
  };
  sortBy?: "price-asc" | "price-desc" | "name-asc" | "name-desc";
}

export interface CartItem {
  id: string
  product: Product
  quantity: number
  userId?: string  
}


