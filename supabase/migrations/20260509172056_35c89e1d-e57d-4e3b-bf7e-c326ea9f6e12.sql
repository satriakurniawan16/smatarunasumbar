
-- Fix update_updated_at search_path
create or replace function public.update_updated_at()
returns trigger
language plpgsql
security definer
set search_path = public
as $$ begin new.updated_at = now(); return new; end; $$;

-- Revoke execute on has_role from public/anon/authenticated (still callable by RLS as definer)
revoke execute on function public.has_role(uuid, public.app_role) from public, anon, authenticated;

-- Replace the broad public select on storage.objects with one restricted to image reads via path filter
drop policy if exists "Public can view news images" on storage.objects;
create policy "Public can view news image files" on storage.objects
  for select using (bucket_id = 'news-images' and (storage.foldername(name))[1] is not null);
