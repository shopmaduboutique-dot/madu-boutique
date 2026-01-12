-- =====================================================
-- MADU BOUTIQUE - SUPABASE DATABASE SCHEMA
-- =====================================================
-- Run this SQL in your Supabase SQL Editor:
-- https://audphvfhuppwbdakvjtv.supabase.co/project/audphvfhuppwbdakvjtv/sql
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. USERS TABLE (Customer Info from Billing)
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  email TEXT UNIQUE,
  phone TEXT NOT NULL,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);

-- =====================================================
-- 2. PRODUCTS TABLE (Store Inventory)
-- =====================================================
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  image TEXT,
  images TEXT[],
  sizes TEXT[],
  description TEXT,
  details TEXT,
  material TEXT,
  care TEXT,
  category TEXT NOT NULL CHECK (category IN ('saree', 'chudithar')),
  is_new BOOLEAN DEFAULT FALSE,
  in_stock BOOLEAN DEFAULT TRUE,
  stock_quantity INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on category for filtering
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);

-- =====================================================
-- 3. ORDERS TABLE (Customer Orders with Delivery Details)
-- =====================================================
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
  subtotal DECIMAL(10,2) NOT NULL,
  shipping_cost DECIMAL(10,2) DEFAULT 99,
  total DECIMAL(10,2) NOT NULL,
  -- Delivery Details (stored separately in case user updates their profile)
  delivery_name TEXT NOT NULL,
  delivery_phone TEXT NOT NULL,
  delivery_email TEXT,
  delivery_address TEXT NOT NULL,
  delivery_city TEXT NOT NULL,
  delivery_state TEXT,
  delivery_zip TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

-- =====================================================
-- 4. ORDER_ITEMS TABLE (Products in Each Order)
-- =====================================================
CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  product_price DECIMAL(10,2) NOT NULL,
  size TEXT,
  quantity INTEGER NOT NULL DEFAULT 1,
  line_total DECIMAL(10,2) NOT NULL
);

-- Create index for order lookups
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

-- =====================================================
-- 5. ENABLE ROW LEVEL SECURITY (RLS)
-- =====================================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 6. RLS POLICIES
-- =====================================================

-- Products: Anyone can read (public catalog)
CREATE POLICY "Products are viewable by everyone" ON products
  FOR SELECT USING (true);

-- Orders: Users can only see their own orders (when auth is implemented)
-- For now, allow all operations from API
CREATE POLICY "Allow all order operations" ON orders
  FOR ALL USING (true);

CREATE POLICY "Allow all order_items operations" ON order_items
  FOR ALL USING (true);

CREATE POLICY "Allow all user operations" ON users
  FOR ALL USING (true);

CREATE POLICY "Allow product inserts" ON products
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow product updates" ON products
  FOR UPDATE USING (true);

-- =====================================================
-- 7. SEED PRODUCTS DATA
-- =====================================================
INSERT INTO products (name, price, original_price, image, images, sizes, description, details, material, care, category, is_new, in_stock, stock_quantity) VALUES
-- SAREES
('Royal Silk Saree', 4999, 6999, '/elegant-purple-silk-saree-with-gold-embroidery.jpg', 
 ARRAY['/elegant-purple-silk-saree-with-gold-embroidery.jpg', '/beautiful-blue-cotton-saree-traditional-design.jpg', '/luxurious-green-silk-saree-with-beaded-work.jpg'],
 ARRAY['Free Size'], 'Premium silk with intricate gold work', 
 'This luxurious royal silk saree features exquisite hand-embroidered gold work on premium quality silk. Perfect for weddings, festivals, and special occasions.',
 '100% Pure Silk', 'Dry clean only. Handle with care.', 'saree', TRUE, TRUE, 10),

('Azure Dreamer', 3899, 5499, '/beautiful-blue-cotton-saree-traditional-design.jpg',
 ARRAY['/beautiful-blue-cotton-saree-traditional-design.jpg', '/luxurious-green-silk-saree-with-beaded-work.jpg'],
 ARRAY['Free Size'], 'Breathable cotton with traditional patterns',
 'Beautiful azure blue cotton saree with traditional woven patterns. Lightweight and comfortable for daily wear.',
 '100% Pure Cotton', 'Machine wash cold. Dry in shade.', 'saree', TRUE, TRUE, 15),

('Emerald Grace', 5299, 7499, '/luxurious-green-silk-saree-with-beaded-work.jpg',
 ARRAY['/luxurious-green-silk-saree-with-beaded-work.jpg', '/rich-red-saree-with-traditional-zari-border.jpg'],
 ARRAY['Free Size'], 'Luxurious silk with beaded detailing',
 'An elegant emerald green silk saree adorned with exquisite beaded work and stone embellishments.',
 'Premium Silk with Beadwork', 'Dry clean only. Store in a cool, dry place.', 'saree', TRUE, TRUE, 8),

('Crimson Elegance', 4499, 6299, '/rich-red-saree-with-traditional-zari-border.jpg',
 ARRAY['/rich-red-saree-with-traditional-zari-border.jpg', '/stunning-gold-embellished-traditional-saree.jpg'],
 ARRAY['Free Size'], 'Rich fabric with traditional zari border',
 'A stunning crimson red saree with a rich traditional zari border. Perfect for weddings and festive occasions.',
 'Silk with Zari Border', 'Dry clean only.', 'saree', FALSE, TRUE, 12),

('Golden Twilight', 5799, 7999, '/stunning-gold-embellished-traditional-saree.jpg',
 ARRAY['/stunning-gold-embellished-traditional-saree.jpg', '/elegant-purple-silk-saree-with-gold-embroidery.jpg'],
 ARRAY['Free Size'], 'Stunning with exquisite gold work',
 'A breathtaking gold-embellished saree with intricate traditional work throughout.',
 'Premium Silk with Gold Embroidery', 'Dry clean only.', 'saree', TRUE, TRUE, 6),

-- CHUDITHARS
('Floral Charm', 2499, 3499, '/beautiful-floral-printed-chudithar-suit.jpg',
 ARRAY['/beautiful-floral-printed-chudithar-suit.jpg', '/soft-pastel-pink-chudithar-with-embroidery.jpg'],
 ARRAY['XS', 'S', 'M', 'L', 'XL'], 'Colorful floral print on soft cotton',
 'A vibrant floral printed chudithar suit perfect for everyday wear.',
 '100% Cotton', 'Machine wash. Dry in shade.', 'chudithar', TRUE, TRUE, 20),

('Pastel Dreams', 2199, 2999, '/soft-pastel-pink-chudithar-with-embroidery.jpg',
 ARRAY['/soft-pastel-pink-chudithar-with-embroidery.jpg', '/elegant-dark-blue-chudithar-with-pearl-embellishme.jpg'],
 ARRAY['S', 'M', 'L', 'XL'], 'Soft pastel with delicate embroidery',
 'A soft pastel pink chudithar suit featuring delicate embroidery work.',
 'Cotton with Embroidery', 'Hand wash recommended. Dry in shade.', 'chudithar', FALSE, TRUE, 18),

('Midnight Pearl', 3199, 4299, '/elegant-dark-blue-chudithar-with-pearl-embellishme.jpg',
 ARRAY['/elegant-dark-blue-chudithar-with-pearl-embellishme.jpg', '/bright-sunny-yellow-traditional-chudithar.jpg'],
 ARRAY['XS', 'S', 'M', 'L', 'XL', 'XXL'], 'Elegant with subtle pearl embellishments',
 'An elegant dark blue chudithar suit adorned with subtle pearl embellishments.',
 'Cotton with Pearl Work', 'Dry clean for best results.', 'chudithar', TRUE, TRUE, 14),

('Sunshine Yellow', 2899, 3999, '/bright-sunny-yellow-traditional-chudithar.jpg',
 ARRAY['/bright-sunny-yellow-traditional-chudithar.jpg', '/peaceful-mauve-purple-chudithar-suit-traditional.jpg'],
 ARRAY['S', 'M', 'L', 'XL'], 'Bright and cheerful with traditional motifs',
 'A bright and cheerful sunshine yellow chudithar suit with traditional motifs.',
 'Cotton', 'Machine wash. Iron on medium heat.', 'chudithar', FALSE, TRUE, 16),

('Mauve Serenity', 2699, 3799, '/peaceful-mauve-purple-chudithar-suit-traditional.jpg',
 ARRAY['/peaceful-mauve-purple-chudithar-suit-traditional.jpg', '/beautiful-floral-printed-chudithar-suit.jpg'],
 ARRAY['S', 'M', 'L', 'XL', 'XXL'], 'Serene mauve with classic patterns',
 'A serene mauve colored chudithar suit with classic traditional patterns.',
 'Cotton', 'Machine wash cold. Dry in shade.', 'chudithar', TRUE, TRUE, 22);

-- =====================================================
-- 8. HELPER FUNCTION FOR ORDER NUMBERS
-- =====================================================
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
BEGIN
  RETURN 'ORD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || UPPER(SUBSTR(MD5(RANDOM()::TEXT), 1, 6));
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 9. STORAGE BUCKET & POLICIES
-- =====================================================
-- Setup the storage bucket for product images
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS (Usually enabled by default. Commenting out to avoid permission errors)
-- ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- ALLOW PUBLIC READ (View images)
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'product-images' );

-- ALLOW UPLOADS (Authenticated & Anon for now to prevent RLS blocking)
CREATE POLICY "Allow Uploads"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'product-images' );

-- ALLOW UPDATES/DELETES
CREATE POLICY "Allow Updates"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'product-images' );

CREATE POLICY "Allow Deletes"
ON storage.objects FOR DELETE
USING ( bucket_id = 'product-images' );
