/*
  # Initial Schema Setup for Clothing Store

  1. Tables
    - users (handled by Supabase Auth)
    - products
    - cart_items
    - orders
    - order_items

  2. Security
    - Enable RLS on all tables
    - Add appropriate policies for each table
*/

-- Products table
CREATE TABLE products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price decimal(10,2) NOT NULL,
  category text NOT NULL,
  images text[] NOT NULL,
  sizes text[] NOT NULL,
  colors text[] NOT NULL,
  stock integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Cart items table
CREATE TABLE cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  product_id uuid REFERENCES products NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  size text NOT NULL,
  color text NOT NULL,
  jersey_name text,
  chest_number integer,
  created_at timestamptz DEFAULT now()
);

-- Orders table
CREATE TABLE orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  total decimal(10,2) NOT NULL,
  shipping_address jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Order items table
CREATE TABLE order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders NOT NULL,
  product_id uuid REFERENCES products NOT NULL,
  quantity integer NOT NULL,
  size text NOT NULL,
  color text NOT NULL,
  jersey_name text,
  chest_number integer,
  price_at_time decimal(10,2) NOT NULL
);

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Products: Everyone can read, only admins can modify
CREATE POLICY "Anyone can view products"
  ON products FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Only admins can modify products"
  ON products FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.role = 'admin'
    )
  );

-- Cart: Users can only access their own cart
CREATE POLICY "Users can manage their own cart"
  ON cart_items FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Orders: Users can only access their own orders
CREATE POLICY "Users can view their own orders"
  ON orders FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own orders"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Order items: Same access as orders
CREATE POLICY "Users can view their own order items"
  ON order_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create their own order items"
  ON order_items FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );