-- Skrip Lengkap Penambahan Kolom Residents
ALTER TABLE residents ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);
ALTER TABLE residents ADD COLUMN IF NOT EXISTS username TEXT;
ALTER TABLE residents ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE residents ADD COLUMN IF NOT EXISTS phone_number TEXT;
ALTER TABLE residents ADD COLUMN IF NOT EXISTS occupation TEXT;
