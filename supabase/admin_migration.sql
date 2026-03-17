-- =====================================================
-- MADU BOUTIQUE - ADMIN PANEL MIGRATION
-- =====================================================
-- Run this SQL in your Supabase SQL Editor after the base schema
-- =====================================================

-- 1. Add role column to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'customer' 
CHECK (role IN ('customer', 'admin'));

-- Create index for role lookups
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- 2. Add tracking_number to orders table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS tracking_number TEXT;

-- 3. Create admin_logs audit table
CREATE TABLE IF NOT EXISTS admin_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID REFERENCES users(id) ON DELETE SET NULL,
  admin_email TEXT,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL, -- 'product', 'order', 'user'
  entity_id TEXT,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for admin_logs
CREATE INDEX IF NOT EXISTS idx_admin_logs_admin_id ON admin_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_logs_action ON admin_logs(action);
CREATE INDEX IF NOT EXISTS idx_admin_logs_created_at ON admin_logs(created_at DESC);

-- 4. Enable RLS on admin_logs
ALTER TABLE admin_logs ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies for admin_logs (admin only)
CREATE POLICY "Admins can view all logs" ON admin_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.email = auth.jwt()->>'email' 
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Admins can insert logs" ON admin_logs
  FOR INSERT WITH CHECK (true);

-- 6. Update products RLS for admin full access
CREATE POLICY "Admins can do anything with products" ON products
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.email = auth.jwt()->>'email' 
      AND users.role = 'admin'
    )
  );

-- 7. Update orders RLS for admin access
DROP POLICY IF EXISTS "Allow all order operations" ON orders;

CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT USING (
    delivery_email = auth.jwt()->>'email'
    OR EXISTS (
      SELECT 1 FROM users 
      WHERE users.email = auth.jwt()->>'email' 
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Admins can manage all orders" ON orders
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.email = auth.jwt()->>'email' 
      AND users.role = 'admin'
    )
  );

-- 8. Allow API to insert orders (for checkout flow)
CREATE POLICY "Allow order creation" ON orders
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow order_items creation" ON order_items
  FOR INSERT WITH CHECK (true);

-- =====================================================
-- IMPORTANT: After running this migration, set your admin user:
-- UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';
-- =====================================================
