
-- Enable realtime for site_content and news
ALTER TABLE public.site_content REPLICA IDENTITY FULL;
ALTER TABLE public.news REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.site_content;
ALTER PUBLICATION supabase_realtime ADD TABLE public.news;

-- Create site-assets bucket for logo/hero/etc
INSERT INTO storage.buckets (id, name, public)
VALUES ('site-assets', 'site-assets', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public can read site assets"
ON storage.objects FOR SELECT
USING (bucket_id = 'site-assets');

CREATE POLICY "Admins can upload site assets"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'site-assets' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update site assets"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'site-assets' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete site assets"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'site-assets' AND public.has_role(auth.uid(), 'admin'));

-- Auto-grant admin role to designated bootstrap email on signup
CREATE OR REPLACE FUNCTION public.handle_new_user_admin_bootstrap()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.email = 'rahmadsatria16@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin'::app_role)
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created_admin_bootstrap ON auth.users;
CREATE TRIGGER on_auth_user_created_admin_bootstrap
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_admin_bootstrap();

-- Seed default content keys if missing
INSERT INTO public.site_content (key, value) VALUES
  ('branding', '{"logo_url": "", "hero_image_url": ""}'::jsonb),
  ('register', '{"title": "Bergabung dengan Taruna", "subtitle": "Tahun Ajaran 2026/2027 telah dibuka. Jadilah bagian dari generasi pemimpin masa depan.", "steps": [{"title":"Pendaftaran Online","desc":"Isi formulir dan unggah dokumen persyaratan."},{"title":"Tes Seleksi","desc":"Tes akademik, kesehatan, dan wawancara."},{"title":"Pengumuman","desc":"Hasil diumumkan melalui website resmi."}]}'::jsonb)
ON CONFLICT (key) DO NOTHING;
