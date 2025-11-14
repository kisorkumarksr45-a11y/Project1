export interface Jersey {
  id: string;
  name: string;
  description: string;
  price: number;
  category_id: string | null;
  team: string;
  player_name: string;
  player_number: string;
  image_url: string;
  stock: number;
  sizes: string[];
  featured: boolean;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface CartItem {
  jersey: Jersey;
  quantity: number;
  size: string;
}

export interface OrderData {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
}
