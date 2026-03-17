-- Created constraint on products category
-- Note: Replace 'products_category_check' with proper constraint name if different.
-- SELECT conname FROM pg_constraint WHERE conrelid = 'products'::regclass;

CREATE TABLE IF NOT EXISTS public.categories (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access to categories"
    ON public.categories
    FOR SELECT
    TO public
    USING (true);

-- Allow authenticated (admin) write access
CREATE POLICY "Allow authenticated full access to categories"
    ON public.categories
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Seed initial basic categories
INSERT INTO public.categories (name, slug)
VALUES 
    ('Saree', 'saree'),
    ('Chudithar', 'chudithar')
ON CONFLICT (slug) DO NOTHING;

-- Drop hardcoded check constraint on products table category column.
-- Fallback command depending on what the constraint is actually named:
ALTER TABLE public.products DROP CONSTRAINT IF EXISTS products_category_check;
