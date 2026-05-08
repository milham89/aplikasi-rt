-- Script untuk menambah 10 data warga contoh
DO $$
DECLARE
    family_id_1 uuid;
    family_id_2 uuid;
    family_id_3 uuid;
    family_id_4 uuid;
    family_id_5 uuid;
    family_id_6 uuid;
    family_id_7 uuid;
    family_id_8 uuid;
    family_id_9 uuid;
    family_id_10 uuid;
BEGIN
    -- 1. Insert Families
    INSERT INTO families (no_kk, address, block_number) VALUES ('3201011205210001', 'Jl. Merdeka No. 1', 'A1') RETURNING id INTO family_id_1;
    INSERT INTO families (no_kk, address, block_number) VALUES ('3201011205210002', 'Jl. Merdeka No. 2', 'A2') RETURNING id INTO family_id_2;
    INSERT INTO families (no_kk, address, block_number) VALUES ('3201011205210003', 'Jl. Merdeka No. 3', 'A3') RETURNING id INTO family_id_3;
    INSERT INTO families (no_kk, address, block_number) VALUES ('3201011205210004', 'Jl. Merdeka No. 4', 'A4') RETURNING id INTO family_id_4;
    INSERT INTO families (no_kk, address, block_number) VALUES ('3201011205210005', 'Jl. Merdeka No. 5', 'A5') RETURNING id INTO family_id_5;
    INSERT INTO families (no_kk, address, block_number) VALUES ('3201011205210006', 'Jl. Kenanga No. 10', 'B1') RETURNING id INTO family_id_6;
    INSERT INTO families (no_kk, address, block_number) VALUES ('3201011205210007', 'Jl. Kenanga No. 11', 'B2') RETURNING id INTO family_id_7;
    INSERT INTO families (no_kk, address, block_number) VALUES ('3201011205210008', 'Jl. Kenanga No. 12', 'B3') RETURNING id INTO family_id_8;
    INSERT INTO families (no_kk, address, block_number) VALUES ('3201011205210009', 'Jl. Mawar No. 5', 'C1') RETURNING id INTO family_id_9;
    INSERT INTO families (no_kk, address, block_number) VALUES ('3201011205210010', 'Jl. Mawar No. 6', 'C2') RETURNING id INTO family_id_10;

    -- 2. Insert Residents (Kepala Keluarga)
    INSERT INTO residents (family_id, nik, full_name, gender, family_relation, role, status)
    VALUES (family_id_1, '3201011010800001', 'Ahmad Subagja', 'Laki-laki', 'Kepala Keluarga', 'warga', 'Aktif');
    
    INSERT INTO residents (family_id, nik, full_name, gender, family_relation, role, status)
    VALUES (family_id_2, '3201011010800002', 'Budi Santoso', 'Laki-laki', 'Kepala Keluarga', 'warga', 'Aktif');
    
    INSERT INTO residents (family_id, nik, full_name, gender, family_relation, role, status)
    VALUES (family_id_3, '3201011010800003', 'Candra Wijaya', 'Laki-laki', 'Kepala Keluarga', 'warga', 'Aktif');
    
    INSERT INTO residents (family_id, nik, full_name, gender, family_relation, role, status)
    VALUES (family_id_4, '3201011010800004', 'Dedi Kusnadi', 'Laki-laki', 'Kepala Keluarga', 'warga', 'Aktif');
    
    INSERT INTO residents (family_id, nik, full_name, gender, family_relation, role, status)
    VALUES (family_id_5, '3201011010800005', 'Eko Prasetyo', 'Laki-laki', 'Kepala Keluarga', 'warga', 'Aktif');
    
    INSERT INTO residents (family_id, nik, full_name, gender, family_relation, role, status)
    VALUES (family_id_6, '3201011010800006', 'Fajar Ramadhan', 'Laki-laki', 'Kepala Keluarga', 'warga', 'Aktif');
    
    INSERT INTO residents (family_id, nik, full_name, gender, family_relation, role, status)
    VALUES (family_id_7, '3201011010800007', 'Gani Abdurrahman', 'Laki-laki', 'Kepala Keluarga', 'warga', 'Aktif');
    
    INSERT INTO residents (family_id, nik, full_name, gender, family_relation, role, status)
    VALUES (family_id_8, '3201011010800008', 'Hadi Sucipto', 'Laki-laki', 'Kepala Keluarga', 'warga', 'Aktif');
    
    INSERT INTO residents (family_id, nik, full_name, gender, family_relation, role, status)
    VALUES (family_id_9, '3201011010800009', 'Indra Gunawan', 'Laki-laki', 'Kepala Keluarga', 'warga', 'Aktif');
    
    INSERT INTO residents (family_id, nik, full_name, gender, family_relation, role, status)
    VALUES (family_id_10, '3201011010800010', 'Joko Susilo', 'Laki-laki', 'Kepala Keluarga', 'warga', 'Aktif');
END $$;
