-- Create a secure schema for users
create schema if not exists auth;

-- Drop existing table if exists
drop table if exists public.profiles;

-- Create a table for public profiles
create table public.profiles (
  id uuid not null primary key,
  email text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  wallet_address text,
  constraint fk_user
    foreign key (id)
    references auth.users (id)
    on delete cascade
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Clear existing policies
drop policy if exists "Profiles are viewable by users who created them." on profiles;
drop policy if exists "Users can insert their own profile." on profiles;
drop policy if exists "Users can update their own profile." on profiles;

-- Create policies
create policy "Profiles are viewable by users who created them."
  on profiles for select
  using (
    auth.uid() = id
  );

create policy "Users can insert their own profile."
  on profiles for insert
  with check (
    -- Allow insert during signup
    (auth.uid() IS NULL AND auth.role() = 'anon') OR
    auth.uid() = id
  );

create policy "Users can update their own profile."
  on profiles for update
  using (
    auth.uid() = id
  );

-- Set up auto-updating of updated_at timestamp
create or replace function handle_updated_at()
returns trigger
language plpgsql
security definer
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Drop existing trigger if exists
drop trigger if exists on_profile_updated on profiles;

-- Create trigger for updated_at
create trigger on_profile_updated
  before update on profiles
  for each row
  execute procedure handle_updated_at();

-- Grant permissions
grant usage on schema public to authenticated, anon;
grant all on profiles to authenticated, anon;
