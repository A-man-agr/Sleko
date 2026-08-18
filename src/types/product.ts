export interface Product {
  id: string;
  name: string;
  slug: string;
  brand: string; // 'Slekco Luxe' | 'Slekco Tech' | 'Slekco Living' | 'Slekco Glow'
  category: string; // 'Fashion' | 'Electronics' | 'Home' | 'Beauty' | 'Accessories'
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stockCount: number;
  isNew?: boolean;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  description: string;
  features: string[];
  specifications: Record<string, string>;
  images: string[];
  colors?: string[];
  sizes?: string[];
  tags: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface FilterState {
  searchQuery: string;
  category: string;
  brand: string;
  minPrice: number;
  maxPrice: number;
  inStockOnly: boolean;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest';
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  itemCount: number;
  image: string;
  iconName: string;
}

export interface OrderItemInput {
  productId: string;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface CheckoutFormData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  paymentMethod: 'card' | 'paypal' | 'cod';
}

export interface OrderConfirmation {
  orderId: string;
  createdAt: string;
  customer: CheckoutFormData;
  items: CartItem[];
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  total: number;
  status: 'Processing' | 'Confirmed' | 'Shipped';
  estimatedDelivery: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}
