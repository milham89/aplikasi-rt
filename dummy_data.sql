-- 1. Buat 2 Kartu Keluarga (KK)
INSERT INTO families (no_kk, address, block_number)
VALUES 
  ('3201234567890001', 'Jl. Merdeka Raya', 'Blok A No. 1'),
  ('3201234567890002', 'Jl. Merdeka Raya', 'Blok A No. 2');

-- 2. Buat 4 Anggota Keluarga untuk KK Pertama (Blok A No. 1)
-- (Gunakan subquery untuk mengambil ID dari KK yang baru dibuat)
INSERT INTO residents (family_id, nik, full_name, phone_number, role, status)
SELECT id, '3201011111111111', 'Budi Santoso', '081200000001', 'warga', 'Aktif'
FROM families WHERE no_kk = '3201234567890001';

INSERT INTO residents (family_id, nik, full_name, phone_number, role, status)
SELECT id, '3201011111111112', 'Siti Aminah', '081200000002', 'warga', 'Aktif'
FROM families WHERE no_kk = '3201234567890001';

INSERT INTO residents (family_id, nik, full_name, phone_number, role, status)
SELECT id, '3201011111111113', 'Arif Santoso', NULL, 'warga', 'Aktif'
FROM families WHERE no_kk = '3201234567890001';

INSERT INTO residents (family_id, nik, full_name, phone_number, role, status)
SELECT id, '3201011111111114', 'Rina Santoso', NULL, 'warga', 'Aktif'
FROM families WHERE no_kk = '3201234567890001';

-- 3. Buat 4 Anggota Keluarga untuk KK Kedua (Blok A No. 2)
INSERT INTO residents (family_id, nik, full_name, phone_number, role, status)
SELECT id, '3201022222222221', 'Agus Setiawan', '081300000001', 'warga', 'Aktif'
FROM families WHERE no_kk = '3201234567890002';

INSERT INTO residents (family_id, nik, full_name, phone_number, role, status)
SELECT id, '3201022222222222', 'Dewi Lestari', '081300000002', 'warga', 'Aktif'
FROM families WHERE no_kk = '3201234567890002';

INSERT INTO residents (family_id, nik, full_name, phone_number, role, status)
SELECT id, '3201022222222223', 'Bima Setiawan', NULL, 'warga', 'Aktif'
FROM families WHERE no_kk = '3201234567890002';

INSERT INTO residents (family_id, nik, full_name, phone_number, role, status)
SELECT id, '3201022222222224', 'Citra Setiawan', NULL, 'warga', 'Aktif'
FROM families WHERE no_kk = '3201234567890002';
