-- News content system upgrades for richer page design and scalable editorial links

-- Core news fields for presentation control
ALTER TABLE public.news
  ADD COLUMN IF NOT EXISTS subtitle TEXT,
  ADD COLUMN IF NOT EXISTS layout_variant TEXT DEFAULT 'feature',
  ADD COLUMN IF NOT EXISTS cover_image_alt_text TEXT,
  ADD COLUMN IF NOT EXISTS cover_image_focal_point JSONB DEFAULT '{"x":50,"y":50}'::jsonb,
  ADD COLUMN IF NOT EXISTS external_link TEXT;

-- Enforce known layout variants
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'news_layout_variant_check'
  ) THEN
    ALTER TABLE public.news
      ADD CONSTRAINT news_layout_variant_check
      CHECK (layout_variant IN ('feature', 'journal', 'bulletin'));
  END IF;
END$$;

-- Structured related links table (scales better than a single URL field)
CREATE TABLE IF NOT EXISTS public.news_related_links (
  id BIGSERIAL PRIMARY KEY,
  news_id BIGINT NOT NULL REFERENCES public.news(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  url TEXT NOT NULL,
  link_type TEXT NOT NULL DEFAULT 'source'
    CHECK (link_type IN ('source', 'review', 'tickets', 'press', 'related')),
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_news_related_links_news_id
  ON public.news_related_links(news_id);

CREATE INDEX IF NOT EXISTS idx_news_related_links_sort
  ON public.news_related_links(news_id, sort_order ASC);

ALTER TABLE public.news_related_links ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'news_related_links'
      AND policyname = 'Public can view links for published news'
  ) THEN
    CREATE POLICY "Public can view links for published news"
      ON public.news_related_links
      FOR SELECT
      USING (
        EXISTS (
          SELECT 1
          FROM public.news
          WHERE news.id = news_related_links.news_id
            AND news.status = 'published'
        )
      );
  END IF;
END$$;
