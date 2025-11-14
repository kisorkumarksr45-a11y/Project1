export type Database = {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          created_at?: string;
        };
      };
      jerseys: {
        Row: {
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
        };
        Insert: {
          id?: string;
          name: string;
          description?: string;
          price: number;
          category_id?: string | null;
          team: string;
          player_name?: string;
          player_number?: string;
          image_url?: string;
          stock?: number;
          sizes?: string[];
          featured?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          price?: number;
          category_id?: string | null;
          team?: string;
          player_name?: string;
          player_number?: string;
          image_url?: string;
          stock?: number;
          sizes?: string[];
          featured?: boolean;
          created_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          customer_name: string;
          customer_email: string;
          customer_phone: string;
          shipping_address: string;
          total_amount: number;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          customer_name: string;
          customer_email: string;
          customer_phone?: string;
          shipping_address: string;
          total_amount: number;
          status?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          customer_name?: string;
          customer_email?: string;
          customer_phone?: string;
          shipping_address?: string;
          total_amount?: number;
          status?: string;
          created_at?: string;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          jersey_id: string | null;
          quantity: number;
          size: string;
          price: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          jersey_id?: string | null;
          quantity: number;
          size: string;
          price: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          jersey_id?: string | null;
          quantity?: number;
          size?: string;
          price?: number;
          created_at?: string;
        };
      };
    };
  };
};
