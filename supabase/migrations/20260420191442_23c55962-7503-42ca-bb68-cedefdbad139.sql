
-- Journeys (gallery destinations)
CREATE TABLE public.journeys (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  cover_image_url TEXT,
  description TEXT,
  date DATE,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.journeys ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view journeys" ON public.journeys FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert journeys" ON public.journeys FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update journeys" ON public.journeys FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete journeys" ON public.journeys FOR DELETE TO authenticated USING (true);

-- Journey Photos
CREATE TABLE public.journey_photos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  journey_id UUID NOT NULL REFERENCES public.journeys(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.journey_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view journey photos" ON public.journey_photos FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert journey photos" ON public.journey_photos FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update journey photos" ON public.journey_photos FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete journey photos" ON public.journey_photos FOR DELETE TO authenticated USING (true);

-- Blog Posts
CREATE TABLE public.blog_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT,
  excerpt TEXT,
  featured_image_url TEXT,
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published posts" ON public.blog_posts FOR SELECT USING (published = true OR (SELECT auth.uid()) IS NOT NULL);
CREATE POLICY "Authenticated users can insert posts" ON public.blog_posts FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update posts" ON public.blog_posts FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete posts" ON public.blog_posts FOR DELETE TO authenticated USING (true);

-- Books
CREATE TABLE public.books (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'English',
  cover_image_url TEXT,
  description TEXT,
  purchase_link TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view books" ON public.books FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert books" ON public.books FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update books" ON public.books FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete books" ON public.books FOR DELETE TO authenticated USING (true);

-- Frames for Sale
CREATE TABLE public.frames (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  image_url TEXT,
  size TEXT,
  price TEXT,
  available BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.frames ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view frames" ON public.frames FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert frames" ON public.frames FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update frames" ON public.frames FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete frames" ON public.frames FOR DELETE TO authenticated USING (true);

-- Events
CREATE TABLE public.events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  date DATE,
  location TEXT,
  description TEXT,
  registration_link TEXT,
  is_upcoming BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view events" ON public.events FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert events" ON public.events FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update events" ON public.events FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete events" ON public.events FOR DELETE TO authenticated USING (true);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers
CREATE TRIGGER update_journeys_updated_at BEFORE UPDATE ON public.journeys FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON public.blog_posts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_books_updated_at BEFORE UPDATE ON public.books FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_frames_updated_at BEFORE UPDATE ON public.frames FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON public.events FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('gallery', 'gallery', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('blog', 'blog', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('frames', 'frames', true);

-- Storage policies
CREATE POLICY "Public can view gallery" ON storage.objects FOR SELECT USING (bucket_id = 'gallery');
CREATE POLICY "Authenticated can upload gallery" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'gallery');
CREATE POLICY "Authenticated can update gallery" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'gallery');
CREATE POLICY "Authenticated can delete gallery" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'gallery');

CREATE POLICY "Public can view blog images" ON storage.objects FOR SELECT USING (bucket_id = 'blog');
CREATE POLICY "Authenticated can upload blog images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'blog');
CREATE POLICY "Authenticated can update blog images" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'blog');
CREATE POLICY "Authenticated can delete blog images" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'blog');

CREATE POLICY "Public can view frame images" ON storage.objects FOR SELECT USING (bucket_id = 'frames');
CREATE POLICY "Authenticated can upload frame images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'frames');
CREATE POLICY "Authenticated can update frame images" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'frames');
CREATE POLICY "Authenticated can delete frame images" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'frames');
