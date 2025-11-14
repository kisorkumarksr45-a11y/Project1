/*
  # Jersey Store Database Schema

  1. New Tables
    - `categories`
      - `id` (uuid, primary key)
      - `name` (text) - Category name (e.g., "Football", "Basketball")
      - `slug` (text, unique) - URL-friendly version
      - `created_at` (timestamptz)
    
    - `jerseys`
      - `id` (uuid, primary key)
      - `name` (text) - Jersey name
      - `description` (text) - Product description
      - `price` (numeric) - Price in dollars
      - `category_id` (uuid) - Foreign key to categories
      - `team` (text) - Team name
      - `player_name` (text) - Player name on jersey
      - `player_number` (text) - Player number
      - `image_url` (text) - Product image URL
      - `stock` (integer) - Available quantity
      - `sizes` (text array) - Available sizes
      - `featured` (boolean) - Whether to feature on homepage
      - `created_at` (timestamptz)
    
    - `orders`
      - `id` (uuid, primary key)
      - `customer_name` (text) - Customer full name
      - `customer_email` (text) - Customer email
      - `customer_phone` (text) - Customer phone
      - `shipping_address` (text) - Full shipping address
      - `total_amount` (numeric) - Total order amount
      - `status` (text) - Order status
      - `created_at` (timestamptz)
    
    - `order_items`
      - `id` (uuid, primary key)
      - `order_id` (uuid) - Foreign key to orders
      - `jersey_id` (uuid) - Foreign key to jerseys
      - `quantity` (integer) - Quantity ordered
      - `size` (text) - Selected size
      - `price` (numeric) - Price at time of order
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Public read access for categories and jerseys
    - Authenticated/admin only for orders management
    - Anyone can create orders (for checkout)

  3. Important Notes
    - All prices stored as numeric for precision
    - Stock management included for inventory tracking
    - Order history preserved with price snapshots
*/

CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS jerseys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  price numeric NOT NULL CHECK (price >= 0),
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  team text NOT NULL,
  player_name text DEFAULT '',
  player_number text DEFAULT '',
  image_url text DEFAULT '',
  stock integer DEFAULT 0 CHECK (stock >= 0),
  sizes text[] DEFAULT ARRAY['S', 'M', 'L', 'XL', 'XXL'],
  featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text DEFAULT '',
  shipping_address text NOT NULL,
  total_amount numeric NOT NULL CHECK (total_amount >= 0),
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  jersey_id uuid REFERENCES jerseys(id) ON DELETE SET NULL,
  quantity integer NOT NULL CHECK (quantity > 0),
  size text NOT NULL,
  price numeric NOT NULL CHECK (price >= 0),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE jerseys ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view categories"
  ON categories FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view jerseys"
  ON jerseys FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create orders"
  ON orders FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can create order items"
  ON order_items FOR INSERT
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_jerseys_category ON jerseys(category_id);
CREATE INDEX IF NOT EXISTS idx_jerseys_featured ON jerseys(featured);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_jersey ON order_items(jersey_id);

INSERT INTO categories (name, slug) VALUES
  ('Football', 'football'),
  ('Basketball', 'basketball'),
  ('Baseball', 'baseball'),
  ('Hockey', 'hockey'),
  ('Soccer', 'soccer');

INSERT INTO jerseys (name, description, price, category_id, team, player_name, player_number, image_url, stock, featured) VALUES
  (
    'Classic Football Jersey',
    'Premium quality football jersey with breathable fabric and authentic team colors. Perfect for game day or casual wear.',
    89.99,
    (SELECT id FROM categories WHERE slug = 'football'),
    'Champions FC',
    'Rodriguez',
    '10',
    'https://images.pexels.com/photos/3657154/pexels-photo-3657154.jpeg?auto=compress&cs=tinysrgb&w=800',
    50,
    true
  ),
  (
    'Elite Basketball Jersey',
    'Lightweight basketball jersey designed for maximum performance. Features moisture-wicking technology.',
    79.99,
    (SELECT id FROM categories WHERE slug = 'basketball'),
    'Thunder Squad',
    'Johnson',
    '23',
    'https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?auto=compress&cs=tinysrgb&w=800',
    45,
    true
  ),
  (
    'Pro Baseball Jersey',
    'Authentic baseball jersey with button-down front. Made from durable, comfortable fabric.',
    74.99,
    (SELECT id FROM categories WHERE slug = 'baseball'),
    'Storm Riders',
    'Martinez',
    '7',
    'https://images.pexels.com/photos/1661950/pexels-photo-1661950.jpeg?auto=compress&cs=tinysrgb&w=800',
    60,
    true
  ),
  (
    'Ice Hockey Jersey',
    'Heavy-duty hockey jersey with reinforced stitching. Built to withstand the toughest games.',
    94.99,
    (SELECT id FROM categories WHERE slug = 'hockey'),
    'Ice Warriors',
    'Petrov',
    '91',
    'https://images.pexels.com/photos/9159047/pexels-photo-9159047.jpeg?auto=compress&cs=tinysrgb&w=800',
    35,
    false
  ),
  (
    'Soccer Jersey Home',
    'Official home jersey with club crest and sponsor logos. Slim fit design.',
    69.99,
    (SELECT id FROM categories WHERE slug = 'soccer'),
    'United FC',
    'Silva',
    '11',
    'https://images.pexels.com/photos/1618200/pexels-photo-1618200.jpeg?auto=compress&cs=tinysrgb&w=800',
    55,
    true
  ),
  (
    'Retro Football Jersey',
    'Vintage-inspired football jersey celebrating classic design. Limited edition.',
    99.99,
    (SELECT id FROM categories WHERE slug = 'football'),
    'Legends United',
    'Thompson',
    '8',
    'https://images.pexels.com/photos/1661950/pexels-photo-1661950.jpeg?auto=compress&cs=tinysrgb&w=800',
    25,
    false
  ),
  (
    'Basketball Away Jersey',
    'Away colors basketball jersey with player customization available.',
    79.99,
    (SELECT id FROM categories WHERE slug = 'basketball'),
    'Thunder Squad',
    'Williams',
    '3',
    'https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?auto=compress&cs=tinysrgb&w=800',
    40,
    false
  ),
  (
    'Soccer Jersey Away',
    'Official away jersey in striking colors. Made with eco-friendly materials.',
    69.99,
    (SELECT id FROM categories WHERE slug = 'soccer'),
    'United FC',
    'Costa',
    '9',
    'https://images.pexels.com/photos/1618200/pexels-photo-1618200.jpeg?auto=compress&cs=tinysrgb&w=800',
    50,
    false
  );