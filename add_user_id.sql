-- Add user_id column to residents table for Auth synchronization
ALTER TABLE residents ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);
