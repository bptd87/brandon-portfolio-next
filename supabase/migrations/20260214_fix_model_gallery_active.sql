-- Fix model_gallery active column
DO $$ BEGIN IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'model_gallery'
        AND column_name = 'active'
) THEN
ALTER TABLE public.model_gallery
ADD COLUMN active boolean DEFAULT true;
END IF;
END $$;
-- Fix experiential_gallery active column (just in case, though script said it was fine)
DO $$ BEGIN IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'experiential_gallery'
        AND column_name = 'active'
) THEN
ALTER TABLE public.experiential_gallery
ADD COLUMN active boolean DEFAULT true;
END IF;
END $$;