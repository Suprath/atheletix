export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  role: 'user' | 'admin';
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  sizes: string[];
  colors: string[];
  stock: number;
  created_at: string;
}

export interface CartItem {
  id: string;
  product_id: string;
  user_id: string;
  quantity: number;
  size: string;
  color: string;
  jersey_name?: string;
  chest_number?: number;
}

export interface Order {
  id: string;
  user_id: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  total: number;
  shipping_address: ShippingAddress;
  items: OrderItem[];
  created_at: string;
}

export interface OrderItem {
  product_id: string;
  quantity: number;
  size: string;
  color: string;
  jersey_name?: string;
  chest_number?: number;
}

export interface ShippingAddress {
  full_name: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone: string;
}