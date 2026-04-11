-- Job Submission Portal — Database Schema
-- Run this in the Supabase SQL Editor to recreate all tables

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- ============================================================
-- categories
-- ============================================================
create table if not exists categories (
  id            uuid primary key default uuid_generate_v4(),
  category_name text not null unique
);

-- ============================================================
-- job_entries
-- ============================================================
create table if not exists job_entries (
  id              uuid primary key default uuid_generate_v4(),
  title           text not null,
  description     text,
  category        text,
  expiration      timestamptz,
  job_posting_key text unique,
  created_at      timestamptz default now()
);

-- Auto-generate job_posting_key on insert if not provided
create or replace function generate_job_posting_key()
returns trigger as $$
begin
  if new.job_posting_key is null then
    new.job_posting_key := gen_random_uuid()::text;
  end if;
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_job_posting_key on job_entries;
create trigger set_job_posting_key
  before insert on job_entries
  for each row execute function generate_job_posting_key();

-- ============================================================
-- resume_users
-- ============================================================
create table if not exists resume_users (
  id          uuid primary key default uuid_generate_v4(),
  "firstName" text,
  "lastName"  text,
  email       text,
  phone       text,
  "linkedIn"  text,
  website     text,
  pdf_path    text,
  match_score float4,
  category    text,
  title       text,
  created_at  timestamptz default now()
);

-- ============================================================
-- Row Level Security (optional — disable if using service role key)
-- ============================================================
-- alter table categories    enable row level security;
-- alter table job_entries   enable row level security;
-- alter table resume_users  enable row level security;

-- Uncomment below if you want public read access on job_entries:
-- create policy "Public read job_entries"
--   on job_entries for select using (true);
