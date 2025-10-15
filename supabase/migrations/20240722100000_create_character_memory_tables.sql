-- Create the table to store long-term memories for each character
CREATE TABLE character_memories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  character_id TEXT NOT NULL,
  memory_type TEXT NOT NULL, -- e.g., 'name_given', 'goal_shared', 'key_milestone'
  content JSONB NOT NULL,
  metadata JSONB,
  embedding VECTOR(1536), -- For semantic search on memories
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create the table to track emotional arcs and patterns
CREATE TABLE emotional_patterns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  character_id TEXT NOT NULL,
  session_id UUID,
  emotion TEXT NOT NULL, -- e.g., 'joy', 'sadness', 'curiosity'
  intensity FLOAT, -- 0.0 to 1.0
  trigger_event TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add comments to the tables and columns for clarity
COMMENT ON TABLE character_memories IS 'Stores the long-term, persistent memories for AI characters, allowing them to grow and recall past interactions.';
COMMENT ON COLUMN character_memories.content IS 'The core data of the memory, like the name "Hana".';
COMMENT ON COLUMN character_memories.embedding IS 'Vector representation of the memory content for semantic search.';

COMMENT ON TABLE emotional_patterns IS 'Tracks the emotional evolution of conversations to provide context and continuity.';
COMMENT ON COLUMN emotional_patterns.emotion IS 'The dominant emotion detected or expressed at a point in the conversation.';

-- Create a function to update the updated_at timestamp automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to use the function on the character_memories table
CREATE TRIGGER update_character_memories_updated_at
BEFORE UPDATE ON character_memories
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
