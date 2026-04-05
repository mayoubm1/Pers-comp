-- ============================================================
-- MINIMAL MIGRATION — Only tables missing from shared DB
-- Run in: https://supabase.com/dashboard/project/vrfyjirddfdnwuffzqhb/sql/new
-- ============================================================

-- 1. CHARACTERS TABLE (wellness companion AI characters)
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

CREATE POLICY "View own and default characters" ON public.characters
  FOR SELECT USING (auth.uid() = user_id OR is_default = TRUE);

CREATE POLICY "Insert own characters" ON public.characters
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Update own characters" ON public.characters
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Delete own characters" ON public.characters
  FOR DELETE USING (auth.uid() = user_id);

-- 2. CHARACTER MEMORIES TABLE
CREATE TABLE IF NOT EXISTS public.character_memories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  character_id TEXT NOT NULL,
  memory_type TEXT NOT NULL,
  content JSONB NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.character_memories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own memories" ON public.character_memories
  FOR ALL USING (auth.uid() = user_id);

-- 3. SEED 7 BUILT-IN CHARACTERS
INSERT INTO public.characters (user_id, name, role, description, specialties, is_default) VALUES
  (NULL, 'Hana', 'Primary Wellness Companion', 'Empathetic, intuitive, culturally aware wellness companion.', ARRAY['holistic wellness', 'emotional support', 'life guidance'], TRUE),
  (NULL, 'Ibn Sina', 'Medical Wisdom Advisor', 'Wise advisor drawing from traditional and integrative medicine.', ARRAY['traditional medicine', 'holistic health', 'mind-body connection'], TRUE),
  (NULL, 'Dr. Maya', 'Wellness Coach', 'Motivational coach specializing in mental health and lifestyle.', ARRAY['mental health', 'stress management', 'lifestyle'], TRUE),
  (NULL, 'Chef Nour', 'Nutritionist', 'Culturally sensitive nutritionist with Middle Eastern cuisine expertise.', ARRAY['nutrition', 'Middle Eastern cuisine', 'dietary wellness'], TRUE),
  (NULL, 'Coach Amr', 'Fitness Trainer', 'Adaptive fitness trainer focused on exercise and movement.', ARRAY['exercise', 'physical therapy', 'movement'], TRUE),
  (NULL, 'Prof. Yasmin', 'Academic Mentor', 'Inspiring mentor with expertise in life sciences and research.', ARRAY['life sciences', 'study techniques', 'research guidance'], TRUE),
  (NULL, 'Amenhotep', 'Ancient Master of Life Science', 'Mystical master drawing from Egyptian healing arts and sacred geometry.', ARRAY['ancient medicine', 'life science origins', 'Egyptian healing arts', 'sacred geometry'], TRUE)
ON CONFLICT DO NOTHING;
