-- Run this once in Supabase SQL Editor if the existing profiles table
-- was created before the profile address field was added.
alter table public.profiles add column if not exists address text;
