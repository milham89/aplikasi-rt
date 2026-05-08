-- Create Letters Table
CREATE TABLE IF NOT EXISTS letters (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    type text NOT NULL CHECK (type IN ('Masuk', 'Keluar')),
    letter_number text NOT NULL,
    subject text NOT NULL,
    date date DEFAULT CURRENT_DATE,
    sender_receiver text NOT NULL, -- Pengirim (jika masuk) atau Penerima (jika keluar)
    description text,
    status text DEFAULT 'Arsip',
    attachment_url text,
    created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE letters ENABLE ROW LEVEL SECURITY;

-- Allow public access for development (same as other tables)
CREATE POLICY "Allow public read letters" ON letters FOR SELECT USING (true);
CREATE POLICY "Allow public insert letters" ON letters FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update letters" ON letters FOR UPDATE USING (true);
CREATE POLICY "Allow public delete letters" ON letters FOR DELETE USING (true);
