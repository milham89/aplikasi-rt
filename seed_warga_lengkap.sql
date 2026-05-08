-- Script untuk menambah data keluarga lengkap (Kepala Keluarga, Istri, Anak)
DO $$
DECLARE
    family_id_1 uuid;
    family_id_2 uuid;
BEGIN
    -- Hapus data lama agar bersih
    DELETE FROM residents WHERE nik LIKE '320101%';
    DELETE FROM families WHERE no_kk LIKE '320101%';

    -- Keluarga 1: Bpk. Ahmad (Keluarga Lengkap)
    INSERT INTO families (no_kk, address, block_number) 
    VALUES ('3201011205210001', 'Jl. Merdeka No. 1', 'Blok A No. 01') 
    RETURNING id INTO family_id_1;

    INSERT INTO residents (family_id, nik, full_name, gender, family_relation, role, status) VALUES 
    (family_id_1, '3201011205210001', 'Ahmad Subagja', 'Laki-laki', 'Kepala Keluarga', 'warga', 'Aktif'),
    (family_id_1, '3201015205210001', 'Siti Aminah', 'Perempuan', 'Istri', 'warga', 'Aktif'),
    (family_id_1, '3201011205210002', 'Rizky Pratama', 'Laki-laki', 'Anak', 'warga', 'Aktif');

    -- Keluarga 2: Bpk. Budi (Keluarga Lengkap)
    INSERT INTO families (no_kk, address, block_number) 
    VALUES ('3201011205210002', 'Jl. Merdeka No. 2', 'Blok A No. 02') 
    RETURNING id INTO family_id_2;

    INSERT INTO residents (family_id, nik, full_name, gender, family_relation, role, status) VALUES 
    (family_id_2, '3201011205210003', 'Budi Santoso', 'Laki-laki', 'Kepala Keluarga', 'warga', 'Aktif'),
    (family_id_2, '3201015205210004', 'Ratna Sari', 'Perempuan', 'Istri', 'warga', 'Aktif'),
    (family_id_2, '3201015205210005', 'Putri Lestari', 'Perempuan', 'Anak', 'warga', 'Aktif');

    -- Tambah 8 Kepala Keluarga lainnya agar total 10 KK
    INSERT INTO families (no_kk, address, block_number) VALUES ('3201011205210003', 'Jl. Merdeka No. 3', 'Blok A No. 03') RETURNING id INTO family_id_1;
    INSERT INTO residents (family_id, nik, full_name, gender, family_relation, role, status) VALUES (family_id_1, '3201011205210006', 'Candra Wijaya', 'Laki-laki', 'Kepala Keluarga', 'warga', 'Aktif');

    INSERT INTO families (no_kk, address, block_number) VALUES ('3201011205210004', 'Jl. Merdeka No. 4', 'Blok A No. 04') RETURNING id INTO family_id_1;
    INSERT INTO residents (family_id, nik, full_name, gender, family_relation, role, status) VALUES (family_id_1, '3201011205210007', 'Dedi Kusnadi', 'Laki-laki', 'Kepala Keluarga', 'warga', 'Aktif');

    INSERT INTO families (no_kk, address, block_number) VALUES ('3201011205210005', 'Jl. Merdeka No. 5', 'Blok A No. 05') RETURNING id INTO family_id_1;
    INSERT INTO residents (family_id, nik, full_name, gender, family_relation, role, status) VALUES (family_id_1, '3201011205210008', 'Eko Prasetyo', 'Laki-laki', 'Kepala Keluarga', 'warga', 'Aktif');

    INSERT INTO families (no_kk, address, block_number) VALUES ('3201011205210006', 'Jl. Kenanga No. 10', 'Blok B No. 10') RETURNING id INTO family_id_1;
    INSERT INTO residents (family_id, nik, full_name, gender, family_relation, role, status) VALUES (family_id_1, '3201011205210009', 'Fajar Ramadhan', 'Laki-laki', 'Kepala Keluarga', 'warga', 'Aktif');

    INSERT INTO families (no_kk, address, block_number) VALUES ('3201011205210007', 'Jl. Kenanga No. 11', 'Blok B No. 11') RETURNING id INTO family_id_1;
    INSERT INTO residents (family_id, nik, full_name, gender, family_relation, role, status) VALUES (family_id_1, '3201011205210010', 'Gani Abdurrahman', 'Laki-laki', 'Kepala Keluarga', 'warga', 'Aktif');

    INSERT INTO families (no_kk, address, block_number) VALUES ('3201011205210008', 'Jl. Kenanga No. 12', 'Blok B No. 12') RETURNING id INTO family_id_1;
    INSERT INTO residents (family_id, nik, full_name, gender, family_relation, role, status) VALUES (family_id_1, '3201011205210011', 'Hadi Sucipto', 'Laki-laki', 'Kepala Keluarga', 'warga', 'Aktif');

    INSERT INTO families (no_kk, address, block_number) VALUES ('3201011205210009', 'Jl. Mawar No. 5', 'Blok C No. 05') RETURNING id INTO family_id_1;
    INSERT INTO residents (family_id, nik, full_name, gender, family_relation, role, status) VALUES (family_id_1, '3201011205210012', 'Indra Gunawan', 'Laki-laki', 'Kepala Keluarga', 'warga', 'Aktif');

    INSERT INTO families (no_kk, address, block_number) VALUES ('3201011205210010', 'Jl. Mawar No. 6', 'Blok C No. 06') RETURNING id INTO family_id_1;
    INSERT INTO residents (family_id, nik, full_name, gender, family_relation, role, status) VALUES (family_id_1, '3201011205210013', 'Joko Susilo', 'Laki-laki', 'Kepala Keluarga', 'warga', 'Aktif');

END $$;
