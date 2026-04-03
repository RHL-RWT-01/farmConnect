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
  rating?: number;
  reviewCount?: number;
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
  search?: string;
}

export interface CartItem {
  id: string
  product: Product
  quantity: number
  userId?: string  
}

export interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  total: number;
  product: Product;
}

export interface Order {
  id: string;
  userId: string;
  status: OrderStatus;
  total: number;
  subtotal: number;
  tax: number;
  shipping: number;
  paymentId?: string;
  paymentMethod?: string;
  shippingAddress?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  user?: {
    name: string;
    email: string;
  };
}

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export interface Review {
  id: string;
  userId: string;
  productId: string;
  rating: number;
  comment?: string;
  createdAt: string;
  user: {
    name: string;
    image?: string;
  };
}
