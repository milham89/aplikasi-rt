-- Add rejection_reason column to letters table
ALTER TABLE letters ADD COLUMN IF NOT EXISTS rejection_reason text;

-- Update letter_status enum to include 'rejected' if not already present
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_type t JOIN pg_enum e ON t.oid = e.enumtypid WHERE t.typname = 'letter_status' AND e.enumlabel = 'rejected') THEN
        ALTER TYPE letter_status ADD VALUE 'rejected';
    END IF;
EXCEPTION
    WHEN undefined_object THEN
        -- If type doesn't exist, it will be created by SETUP_LENGKAP.sql or similar
        NULL;
END $$;
