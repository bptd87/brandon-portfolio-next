create extension if not exists "pgcrypto";

create table if not exists contact_submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  ip_address text,
  user_agent text,
  source text,
  status text default 'new'
);

create index if not exists contact_submissions_created_at_idx
  on contact_submissions (created_at desc);
