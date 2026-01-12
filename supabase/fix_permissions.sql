-- ==============================================================================
-- RLS FIX SCRIPTS
-- Run these in your Supabase Dashboard SQL Editor to fix "Permission Denied" errors
-- ==============================================================================

-- 1. PRODUCTS TABLE
-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Allow Public Read (Catalog)
CREATE POLICY "Public Read Products"
ON products FOR SELECT
USING (true);

-- Allow Insert (Admin)
CREATE POLICY "Allow Product Insert"
ON products FOR INSERT
WITH CHECK (true);

-- Allow Update (Admin)
CREATE POLICY "Allow Product Update"
ON products FOR UPDATE
USING (true);

-- Allow Delete (Admin) - WAS MISSING
CREATE POLICY "Allow Product Delete"
ON products FOR DELETE
USING (true);


-- 2. USERS TABLE
-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Allow All Operations (Auth + Profile creation)
CREATE POLICY "Allow All User Ops"
ON users FOR ALL
USING (true);


-- 3. STORAGE (Product Images)
-- Enable RLS
-- ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY; -- Commented to avoid permission error

-- Allow Public Read
CREATE POLICY "Public Read Images"
ON storage.objects FOR SELECT
USING ( bucket_id = 'product-images' );

-- Allow Uploads
CREATE POLICY "Allow Image Uploads"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'product-images' );

-- Allow Updates/Deletes
CREATE POLICY "Allow Image Updates"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'product-images' );

CREATE POLICY "Allow Image Deletes"
ON storage.objects FOR DELETE
USING ( bucket_id = 'product-images' );
