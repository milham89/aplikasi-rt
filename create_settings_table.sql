-- Create Settings Table
CREATE TABLE IF NOT EXISTS app_settings (
    id integer PRIMARY KEY DEFAULT 1,
    rt_number text DEFAULT '01',
    rw_number text DEFAULT '05',
    kelurahan text DEFAULT 'Sukamaju',
    monthly_fee numeric DEFAULT 50000,
    admin_name text DEFAULT 'Bpk. Ketua RT',
    admin_phone text DEFAULT '081234567890',
    CONSTRAINT one_row CHECK (id = 1)
);

-- Initial Data
INSERT INTO app_settings (id, rt_number, rw_number, kelurahan, monthly_fee, admin_name, admin_phone)
VALUES (1, '01', '05', 'Sukamaju', 50000, 'Bpk. Ketua RT', '081234567890')
ON CONFLICT (id) DO NOTHING;

-- Enable RLS
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read settings" ON app_settings FOR SELECT USING (true);
CREATE POLICY "Allow public update settings" ON app_settings FOR UPDATE USING (true);
