-- EKSEKUSI SKRIP INI DI SQL EDITOR SUPABASE ANDA
-- Untuk memperbaiki masalah sinkronisasi dan izin (CRUD)

-- 1. Pastikan RLS diaktifkan
ALTER TABLE families ENABLE ROW LEVEL SECURITY;
ALTER TABLE residents ENABLE ROW LEVEL SECURITY;
ALTER TABLE dues ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE letters ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE guestbooks ENABLE ROW LEVEL SECURITY;

-- 2. Berikan akses SELECT (Baca) untuk semua orang (anon)
CREATE POLICY "Allow public read" ON families FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON residents FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON dues FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON payments FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON letters FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON complaints FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON announcements FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON guestbooks FOR SELECT USING (true);

-- 3. Berikan akses INSERT (Tambah Data) untuk semua orang (anon) - Untuk pengembangan
CREATE POLICY "Allow public insert" ON families FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert" ON residents FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert" ON dues FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert" ON payments FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert" ON letters FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert" ON complaints FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert" ON announcements FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert" ON guestbooks FOR INSERT WITH CHECK (true);

-- 4. Berikan akses UPDATE (Ubah Data) untuk semua orang (anon)
CREATE POLICY "Allow public update" ON families FOR UPDATE USING (true);
CREATE POLICY "Allow public update" ON residents FOR UPDATE USING (true);
CREATE POLICY "Allow public update" ON dues FOR UPDATE USING (true);
CREATE POLICY "Allow public update" ON payments FOR UPDATE USING (true);
CREATE POLICY "Allow public update" ON letters FOR UPDATE USING (true);
CREATE POLICY "Allow public update" ON complaints FOR UPDATE USING (true);
CREATE POLICY "Allow public update" ON announcements FOR UPDATE USING (true);
CREATE POLICY "Allow public update" ON guestbooks FOR UPDATE USING (true);

-- 5. Berikan akses DELETE (Hapus Data) untuk semua orang (anon)
CREATE POLICY "Allow public delete" ON families FOR DELETE USING (true);
CREATE POLICY "Allow public delete" ON residents FOR DELETE USING (true);
CREATE POLICY "Allow public delete" ON dues FOR DELETE USING (true);
CREATE POLICY "Allow public delete" ON payments FOR DELETE USING (true);
CREATE POLICY "Allow public delete" ON letters FOR DELETE USING (true);
CREATE POLICY "Allow public delete" ON complaints FOR DELETE USING (true);
CREATE POLICY "Allow public delete" ON announcements FOR DELETE USING (true);
CREATE POLICY "Allow public delete" ON guestbooks FOR DELETE USING (true);
