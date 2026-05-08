-- ========================================================
-- SETUP LENGKAP: JALANKAN INI DI SQL EDITOR SUPABASE ANDA
-- ========================================================

-- 1. AKTIFKAN EXTENSION
create extension if not exists "uuid-ossp";

-- 2. HAPUS TABEL JIKA SUDAH ADA (MEMBERSIHKAN AGAR TIDAK BENTROK)
drop table if exists guestbooks, announcements, complaints, letters, payments, dues, residents, families cascade;
drop type if exists gender_type, role_type, status_type, due_type, payment_status, letter_status, complaint_status, guest_status cascade;

-- 3. BUAT TABEL
create table families (
  id uuid primary key default uuid_generate_v4(),
  no_kk text unique not null,
  address text not null,
  block_number text not null,
  created_at timestamp with time zone default now()
);

create type gender_type as enum ('L', 'P');
create type role_type as enum ('admin_rt', 'warga');
create type status_type as enum ('Aktif', 'Pindah', 'Meninggal');

create table residents (
  id uuid primary key default uuid_generate_v4(),
  family_id uuid references families(id) on delete set null,
  nik text unique not null,
  full_name text not null,
  birth_place text,
  birth_date date,
  gender gender_type,
  religion text,
  occupation text,
  phone_number text,
  family_relation text,
  role role_type default 'warga',
  status status_type default 'Aktif',
  created_at timestamp with time zone default now()
);

create type due_type as enum ('routine', 'incidental');
create table dues (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  amount decimal not null,
  type due_type default 'routine',
  period_month integer,
  period_year integer,
  created_at timestamp with time zone default now()
);

create type payment_status as enum ('pending', 'verified', 'rejected');
create table payments (
  id uuid primary key default uuid_generate_v4(),
  due_id uuid references dues(id) on delete cascade,
  family_id uuid references families(id) on delete cascade,
  amount_paid decimal not null,
  payment_date timestamp with time zone default now(),
  proof_image_url text,
  status payment_status default 'pending',
  verified_by uuid references residents(id) on delete set null,
  created_at timestamp with time zone default now()
);

create type letter_status as enum ('requested', 'processed', 'ready_for_pickup', 'completed', 'rejected');
create table letters (
  id uuid primary key default uuid_generate_v4(),
  resident_id uuid references residents(id) on delete cascade,
  type text not null,
  purpose text,
  status letter_status default 'requested',
  document_url text,
  created_at timestamp with time zone default now()
);

create type complaint_status as enum ('open', 'in_progress', 'resolved');
create table complaints (
  id uuid primary key default uuid_generate_v4(),
  resident_id uuid references residents(id) on delete cascade,
  title text not null,
  description text not null,
  category text,
  image_url text,
  status complaint_status default 'open',
  created_at timestamp with time zone default now()
);

create table announcements (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  content text not null,
  author_id uuid references residents(id) on delete set null,
  is_pinned boolean default false,
  created_at timestamp with time zone default now()
);

create type guest_status as enum ('waiting', 'served', 'completed');
create table guestbooks (
  id uuid primary key default uuid_generate_v4(),
  visitor_name text not null,
  resident_id uuid references residents(id) on delete set null,
  purpose text not null,
  visit_date timestamp with time zone default now(),
  status guest_status default 'waiting',
  notes text,
  handled_by uuid references residents(id) on delete set null,
  created_at timestamp with time zone default now()
);

-- 4. AKTIFKAN RLS (SECURITY)
ALTER TABLE families ENABLE ROW LEVEL SECURITY;
ALTER TABLE residents ENABLE ROW LEVEL SECURITY;
ALTER TABLE dues ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE letters ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE guestbooks ENABLE ROW LEVEL SECURITY;

-- 5. BUAT POLICY (IZIN AKSES PUBLIC/ANON)
CREATE POLICY "Allow public read" ON families FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON families FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON families FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON families FOR DELETE USING (true);

CREATE POLICY "Allow public read" ON residents FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON residents FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON residents FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON residents FOR DELETE USING (true);

CREATE POLICY "Allow public read" ON dues FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON dues FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read" ON payments FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON payments FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read" ON letters FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON letters FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON letters FOR UPDATE USING (true);

CREATE POLICY "Allow public read" ON complaints FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON complaints FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON complaints FOR UPDATE USING (true);

CREATE POLICY "Allow public read" ON announcements FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON announcements FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read" ON guestbooks FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON guestbooks FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON guestbooks FOR UPDATE USING (true);
