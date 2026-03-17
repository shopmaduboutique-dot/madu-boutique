-- Migration: Add Razorpay columns to orders table
-- Run this in Supabase SQL Editor

ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS razorpay_order_id TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS razorpay_payment_id TEXT,
ADD COLUMN IF NOT EXISTS razorpay_signature TEXT;

-- Create index for faster lookups during verification
CREATE INDEX IF NOT EXISTS idx_orders_razorpay_order_id ON orders(razorpay_order_id);
