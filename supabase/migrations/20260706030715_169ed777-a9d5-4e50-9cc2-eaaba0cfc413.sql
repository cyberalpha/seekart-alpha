
-- Enforce path-scoped ownership on the events storage bucket.
-- New path convention: "<artist_id>/<filename>"

DROP POLICY IF EXISTS "Artists can upload event images" ON storage.objects;
DROP POLICY IF EXISTS "Artists can update own event images" ON storage.objects;
DROP POLICY IF EXISTS "Artists can delete own event images" ON storage.objects;

CREATE POLICY "events_insert_artist_own_folder" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'events'
    AND (storage.foldername(name))[1] = auth.uid()::text
    AND auth.uid() IN (SELECT id FROM public.artists)
  );

CREATE POLICY "events_update_artist_own_folder" ON storage.objects
  FOR UPDATE TO authenticated
  USING (
    bucket_id = 'events'
    AND (storage.foldername(name))[1] = auth.uid()::text
  )
  WITH CHECK (
    bucket_id = 'events'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "events_delete_artist_own_folder" ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'events'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
