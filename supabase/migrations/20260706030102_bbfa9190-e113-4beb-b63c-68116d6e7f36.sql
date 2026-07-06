
-- === Consolidate duplicate RLS policies on public tables ===
-- artists
DROP POLICY IF EXISTS "Anyone can view artists" ON public.artists;
DROP POLICY IF EXISTS "Permitir lectura de artistas para todos" ON public.artists;
DROP POLICY IF EXISTS "Artists can update their own profile" ON public.artists;
DROP POLICY IF EXISTS "Permitir actualización de artistas para el dueño" ON public.artists;

CREATE POLICY "artists_select_public" ON public.artists
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "artists_update_own" ON public.artists
  FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- events
DROP POLICY IF EXISTS "Anyone can view events" ON public.events;
DROP POLICY IF EXISTS "Permitir lectura de eventos para todos" ON public.events;
DROP POLICY IF EXISTS "Artists can create their own events" ON public.events;
DROP POLICY IF EXISTS "Permitir inserción de eventos para artistas autenticados" ON public.events;
DROP POLICY IF EXISTS "Artists can update their own events" ON public.events;
DROP POLICY IF EXISTS "Permitir actualización de eventos para el dueño" ON public.events;
DROP POLICY IF EXISTS "Artists can delete their own events" ON public.events;
DROP POLICY IF EXISTS "Permitir eliminación de eventos para el dueño" ON public.events;

CREATE POLICY "events_select_public" ON public.events
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "events_insert_own_artist" ON public.events
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = artist_id);
CREATE POLICY "events_update_own_artist" ON public.events
  FOR UPDATE TO authenticated USING (auth.uid() = artist_id) WITH CHECK (auth.uid() = artist_id);
CREATE POLICY "events_delete_own_artist" ON public.events
  FOR DELETE TO authenticated USING (auth.uid() = artist_id);

-- fans: restrict SELECT to authenticated users (was public/anon)
DROP POLICY IF EXISTS "Fans can view all fans profiles" ON public.fans;
DROP POLICY IF EXISTS "Permitir lectura de fans para todos" ON public.fans;
DROP POLICY IF EXISTS "Fans can update their own profile" ON public.fans;
DROP POLICY IF EXISTS "Permitir actualización de fans para el dueño" ON public.fans;

CREATE POLICY "fans_select_own" ON public.fans
  FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "fans_update_own" ON public.fans
  FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- follows: restrict SELECT to the fan or the artist involved
DROP POLICY IF EXISTS "Authenticated users can view follows" ON public.follows;
DROP POLICY IF EXISTS "Fans can create follows" ON public.follows;
DROP POLICY IF EXISTS "Permitir inserción de follows para usuarios autenticados" ON public.follows;
DROP POLICY IF EXISTS "Fans can delete their own follows" ON public.follows;
DROP POLICY IF EXISTS "Permitir eliminación de follows para el dueño" ON public.follows;

CREATE POLICY "follows_select_involved" ON public.follows
  FOR SELECT TO authenticated USING (auth.uid() = fan_id OR auth.uid() = artist_id);
CREATE POLICY "follows_insert_own_fan" ON public.follows
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = fan_id);
CREATE POLICY "follows_delete_own_fan" ON public.follows
  FOR DELETE TO authenticated USING (auth.uid() = fan_id);

-- === Storage policies: enforce ownership on INSERT/UPDATE, drop LIST-enabling SELECT ===
-- Drop broad SELECT policies that enable listing (files remain reachable via public CDN URL)
DROP POLICY IF EXISTS "Anyone can view event images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view profile images" ON storage.objects;
DROP POLICY IF EXISTS "Permitir acceso público a imágenes de eventos" ON storage.objects;
DROP POLICY IF EXISTS "Permitir acceso público a imágenes de perfil" ON storage.objects;

-- Drop weak INSERT policies (no ownership / no artist role check)
DROP POLICY IF EXISTS "Authenticated users can upload event images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload profile images" ON storage.objects;
DROP POLICY IF EXISTS "Permitir carga de imágenes de eventos para usuarios autenticad" ON storage.objects;
DROP POLICY IF EXISTS "Permitir carga de imágenes de perfil para usuarios autenticado" ON storage.objects;

-- Drop weak UPDATE policies (only checked bucket_id)
DROP POLICY IF EXISTS "Permitir actualización de imágenes de eventos para el dueño" ON storage.objects;
DROP POLICY IF EXISTS "Permitir actualización de imágenes de perfil para el dueño" ON storage.objects;

-- Existing strong policies retained:
--   "Artists can upload event images"  (INSERT, checks bucket + artist)
--   "Artists can update own event images" (UPDATE, owner = auth.uid())
--   "Artists can delete own event images" (DELETE, owner = auth.uid())
--   "Users can upload own profile image"  (INSERT, path folder = auth.uid())
--   "Users can update own profile image"  (UPDATE, path folder = auth.uid())
--   "Users can delete own profile image"  (DELETE, path folder = auth.uid())
