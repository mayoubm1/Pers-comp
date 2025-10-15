
-- Create a table for public user profiles
create table profiles (
  id uuid references auth.users not null primary key,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  avatar_url text,
  website text,

  constraint username_length check (char_length(username) >= 3)
);

alter table profiles
  enable row level security;

create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

-- Create a table for AI characters
create table characters (
  id uuid not null primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  role text,
  description text,
  avatar_url text,
  gender text,
  specialties text[]
);

alter table characters
  enable row level security;

create policy "Characters are viewable by their owner." on characters
  for select using (auth.uid() = user_id);

create policy "Users can create characters." on characters
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own characters." on characters
  for update using (auth.uid() = user_id);2

create policy "Users can delete their own characters." on characters
  for delete using (auth.uid() = user_id);
