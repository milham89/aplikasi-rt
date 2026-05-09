-- Add phone and occupation columns to residents table
ALTER TABLE residents ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE residents ADD COLUMN IF NOT EXISTS occupation TEXT;
