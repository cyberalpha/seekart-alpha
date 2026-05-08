
-- 0. Cleanup: normalize malformed URLs to NULL so constraints can be added
UPDATE public.artists SET facebook_url = NULL WHERE facebook_url IS NOT NULL AND facebook_url !~* '^https?://';
UPDATE public.artists SET instagram_url = NULL WHERE instagram_url IS NOT NULL AND instagram_url !~* '^https?://';
UPDATE public.artists SET linktree_url = NULL WHERE linktree_url IS NOT NULL AND linktree_url !~* '^https?://';
UPDATE public.events SET ticket_url = NULL WHERE ticket_url IS NOT NULL AND ticket_url !~* '^https?://';
UPDATE public.events SET video_url = NULL WHERE video_url IS NOT NULL AND video_url !~* '^https?://';

-- Truncate any oversized text fields to fit constraints
UPDATE public.artists SET name = LEFT(name, 100) WHERE char_length(name) > 100;
UPDATE public.artists SET last_name = LEFT(last_name, 100) WHERE last_name IS NOT NULL AND char_length(last_name) > 100;
UPDATE public.artists SET description = LEFT(description, 2000) WHERE description IS NOT NULL AND char_length(description) > 2000;
UPDATE public.events SET title = LEFT(title, 200) WHERE char_length(title) > 200;
UPDATE public.events SET description = LEFT(description, 5000) WHERE description IS NOT NULL AND char_length(description) > 5000;
UPDATE public.fans SET name = LEFT(name, 100) WHERE char_length(name) > 100;
UPDATE public.fans SET last_name = LEFT(last_name, 100) WHERE last_name IS NOT NULL AND char_length(last_name) > 100;

-- 1. Restrict follows table to authenticated users
DROP POLICY IF EXISTS "Anyone can view follows" ON public.follows;
DROP POLICY IF EXISTS "Permitir lectura de follows para todos" ON public.follows;

CREATE POLICY "Authenticated users can view follows"
ON public.follows FOR SELECT
TO authenticated
USING (true);

-- 2. Server-side data integrity constraints
ALTER TABLE public.artists
  ADD CONSTRAINT artist_name_length CHECK (char_length(name) <= 100),
  ADD CONSTRAINT artist_last_name_length CHECK (last_name IS NULL OR char_length(last_name) <= 100),
  ADD CONSTRAINT artist_description_length CHECK (description IS NULL OR char_length(description) <= 2000),
  ADD CONSTRAINT artist_facebook_url_format CHECK (facebook_url IS NULL OR facebook_url ~* '^https?://'),
  ADD CONSTRAINT artist_instagram_url_format CHECK (instagram_url IS NULL OR instagram_url ~* '^https?://'),
  ADD CONSTRAINT artist_linktree_url_format CHECK (linktree_url IS NULL OR linktree_url ~* '^https?://');

ALTER TABLE public.events
  ADD CONSTRAINT event_title_length CHECK (char_length(title) <= 200),
  ADD CONSTRAINT event_description_length CHECK (description IS NULL OR char_length(description) <= 5000),
  ADD CONSTRAINT event_coordinates CHECK (latitude BETWEEN -90 AND 90 AND longitude BETWEEN -180 AND 180),
  ADD CONSTRAINT event_ticket_url_format CHECK (ticket_url IS NULL OR ticket_url ~* '^https?://'),
  ADD CONSTRAINT event_video_url_format CHECK (video_url IS NULL OR video_url ~* '^https?://');

ALTER TABLE public.fans
  ADD CONSTRAINT fan_name_length CHECK (char_length(name) <= 100),
  ADD CONSTRAINT fan_last_name_length CHECK (last_name IS NULL OR char_length(last_name) <= 100);

-- 3. Storage policies — replace permissive ones with ownership-checked versions
DROP POLICY IF EXISTS "Permitir actualización para el dueño en profiles" ON storage.objects;
DROP POLICY IF EXISTS "Permitir actualización para el dueño en events" ON storage.objects;
DROP POLICY IF EXISTS "Permitir inserción para usuarios autenticados en profiles" ON storage.objects;
DROP POLICY IF EXISTS "Permitir inserción para usuarios autenticados en events" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload to profiles" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload to events" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update profiles" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update events" ON storage.objects;

CREATE POLICY "Users can upload own profile image"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'profiles' AND (storage.foldername(name))[2] = auth.uid()::text);

CREATE POLICY "Users can update own profile image"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'profiles' AND (storage.foldername(name))[2] = auth.uid()::text);

CREATE POLICY "Users can delete own profile image"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'profiles' AND (storage.foldername(name))[2] = auth.uid()::text);

CREATE POLICY "Artists can upload event images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'events' AND auth.uid() IN (SELECT id FROM public.artists));

CREATE POLICY "Artists can update own event images"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'events' AND owner = auth.uid());

CREATE POLICY "Artists can delete own event images"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'events' AND owner = auth.uid());

-- 4. Revoke EXECUTE on SECURITY DEFINER trigger functions
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_updated_at() FROM PUBLIC, anon, authenticated;
