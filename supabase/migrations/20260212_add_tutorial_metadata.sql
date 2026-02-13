-- Add JSONB columns for rich tutorial metadata
ALTER TABLE tutorials
ADD COLUMN IF NOT EXISTS overview text,
ADD COLUMN IF NOT EXISTS learning_objectives jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS key_concepts jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS pro_tips jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS shortcuts jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS common_pitfalls jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS transcript jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS related_resources jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS related_tutorials jsonb DEFAULT '[]'::jsonb;
