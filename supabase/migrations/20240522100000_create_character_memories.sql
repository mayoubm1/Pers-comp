
-- Create the table for storing character memories
create table public.character_memories (
  id uuid primary key default gen_random_uuid(),
  character_id text not null, -- The identifier for the character (e.g., "life-coach")
  user_id uuid references auth.users(id) not null,
  memory_type text not null, -- e.g., "nickname", "emotional_pattern", "life_event"
  content text not null,
  metadata jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.character_memories enable row level security;

-- Create policies for access
-- Users can view their own memories
create policy "Allow user to read their own memories" on public.character_memories for select
using (auth.uid() = user_id);

-- Users can insert their own memories
create policy "Allow user to create their own memories" on public.character_memories for insert
with check (auth.uid() = user_id);

-- Users can update their own memories
create policy "Allow user to update their own memories" on public.character_memories for update
using (auth.uid() = user_id);

-- Users can delete their own memories
create policy "Allow user to delete their own memories" on public.character_memories for delete
using (auth.uid() = user_id);

