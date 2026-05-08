-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Tabel Kartu Keluarga (families)
create table families (
  id uuid primary key default uuid_generate_v4(),
  no_kk text unique not null,
  address text not null,
  block_number text not null,
  created_at timestamp with time zone default now()
);

-- 2. Tabel Warga (residents)
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

-- 3. Tabel Tagihan Iuran (dues)
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

-- 4. Tabel Pembayaran (payments)
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

-- 5. Tabel Surat Pengantar (letters)
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

-- 6. Tabel Laporan/Aduan (complaints)
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

-- 7. Tabel Pengumuman (announcements)
create table announcements (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  content text not null,
  author_id uuid references residents(id) on delete set null,
  is_pinned boolean default false,
  created_at timestamp with time zone default now()
);

-- 8. Tabel Buku Tamu (guestbooks)
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
