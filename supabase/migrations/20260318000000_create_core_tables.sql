-- Characters table
CREATE TABLE IF NOT EXISTS public.characters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT,
  description TEXT,
  avatar_url TEXT,
  gender TEXT,
  specialties TEXT[],
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.characters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own and default characters" ON public.characters
  FOR SELECT USING (auth.uid() = user_id OR is_default = TRUE);

CREATE POLICY "Users can insert their own characters" ON public.characters
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own characters" ON public.characters
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own characters" ON public.characters
  FOR DELETE USING (auth.uid() = user_id);

-- Users table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Messages table
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  character_id TEXT,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own messages" ON public.messages
  FOR ALL USING (auth.uid() = user_id);

-- Global chats table
CREATE TABLE IF NOT EXISTS public.global_chats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  character_id TEXT,
  title TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.global_chats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own chats" ON public.global_chats
  FOR ALL USING (auth.uid() = user_id);

-- Projects table
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own projects" ON public.projects
  FOR ALL USING (auth.uid() = user_id);

-- Platform table
CREATE TABLE IF NOT EXISTS public.platform (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed the 7 built-in AI characters (default, not tied to any user)
INSERT INTO public.characters (id, user_id, name, role, description, specialties, is_default)
VALUES
  (gen_random_uuid(), NULL, 'Hana', 'Primary Wellness Companion', 'Empathetic, intuitive, culturally aware wellness companion focused on holistic guidance and emotional support.', ARRAY['holistic wellness', 'emotional support', 'life guidance'], TRUE),
  (gen_random_uuid(), NULL, 'Ibn Sina', 'Medical Wisdom Advisor', 'Wise and scholarly advisor drawing from traditional and integrative medicine with deep mind-body knowledge.', ARRAY['traditional medicine', 'holistic health', 'mind-body connection'], TRUE),
  (gen_random_uuid(), NULL, 'Dr. Maya', 'Wellness Coach', 'Motivational and scientific wellness coach specializing in mental health, stress management and lifestyle.', ARRAY['mental health', 'stress management', 'lifestyle'], TRUE),
  (gen_random_uuid(), NULL, 'Chef Nour', 'Nutritionist', 'Practical and culturally sensitive nutritionist with expertise in Middle Eastern cuisine and dietary wellness.', ARRAY['nutrition', 'Middle Eastern cuisine', 'dietary wellness'], TRUE),
  (gen_random_uuid(), NULL, 'Coach Amr', 'Fitness Trainer', 'Energetic and adaptive fitness trainer focused on exercise, physical therapy and movement.', ARRAY['exercise', 'physical therapy', 'movement'], TRUE),
  (gen_random_uuid(), NULL, 'Prof. Yasmin', 'Academic Mentor', 'Patient and inspiring academic mentor with expertise in life sciences, study techniques and research guidance.', ARRAY['life sciences', 'study techniques', 'research guidance'], TRUE),
  (gen_random_uuid(), NULL, 'Amenhotep', 'Ancient Master of Life Science', 'Wise and mystical ancient master drawing from Egyptian healing arts, sacred geometry and the origins of life science.', ARRAY['ancient medicine', 'life science origins', 'Egyptian healing arts', 'sacred geometry'], TRUE)
ON CONFLICT DO NOTHING;
