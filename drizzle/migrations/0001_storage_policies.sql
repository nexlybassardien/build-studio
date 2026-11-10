CREATE POLICY "Applicants upload vendor files" ON storage.objects FOR INSERT TO anon, authenticated
  WITH CHECK (bucket_id = 'vendor-uploads' AND (storage.foldername(name))[1] = 'applications');
CREATE POLICY "Admins read vendor files" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'vendor-uploads' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete vendor files" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'vendor-uploads' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins read media files" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'media' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins upload media files" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'media' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update media files" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'media' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete media files" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'media' AND public.has_role(auth.uid(), 'admin'));
