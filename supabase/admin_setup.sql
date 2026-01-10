-- Add is_admin column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;

-- Update RLS policies to allow admins to view all data (optional, depends on strictness)
-- For now, we rely on the application logic for admin checks, but RLS should be updated for security.
-- Creating a policy for admins to view everything involves checking the is_admin flag.

CREATE POLICY "Admins can view all users" ON users
    FOR SELECT USING (auth.uid() IN (SELECT id FROM users WHERE is_admin = TRUE));
