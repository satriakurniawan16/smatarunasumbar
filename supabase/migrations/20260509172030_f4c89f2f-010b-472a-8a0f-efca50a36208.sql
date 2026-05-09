
-- Roles
create type public.app_role as enum ('admin', 'user');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create policy "Users can view their own roles" on public.user_roles
  for select to authenticated using (auth.uid() = user_id);

create policy "Admins can manage roles" on public.user_roles
  for all to authenticated using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- News
create table public.news (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  content text not null,
  image_url text,
  published boolean not null default true,
  author_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.news enable row level security;

create policy "Anyone can read published news" on public.news
  for select using (published = true);

create policy "Admins can read all news" on public.news
  for select to authenticated using (public.has_role(auth.uid(), 'admin'));

create policy "Admins can insert news" on public.news
  for insert to authenticated with check (public.has_role(auth.uid(), 'admin'));

create policy "Admins can update news" on public.news
  for update to authenticated using (public.has_role(auth.uid(), 'admin'));

create policy "Admins can delete news" on public.news
  for delete to authenticated using (public.has_role(auth.uid(), 'admin'));

create or replace function public.update_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

create trigger news_updated_at before update on public.news
  for each row execute function public.update_updated_at();

-- Site content (key-value JSON for homepage/contact)
create table public.site_content (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.site_content enable row level security;

create policy "Anyone can read site content" on public.site_content
  for select using (true);

create policy "Admins can manage site content" on public.site_content
  for all to authenticated using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

create trigger site_content_updated_at before update on public.site_content
  for each row execute function public.update_updated_at();

-- Storage bucket for news images
insert into storage.buckets (id, name, public) values ('news-images', 'news-images', true);

create policy "Public can view news images" on storage.objects
  for select using (bucket_id = 'news-images');

create policy "Admins can upload news images" on storage.objects
  for insert to authenticated with check (
    bucket_id = 'news-images' and public.has_role(auth.uid(), 'admin')
  );

create policy "Admins can update news images" on storage.objects
  for update to authenticated using (
    bucket_id = 'news-images' and public.has_role(auth.uid(), 'admin')
  );

create policy "Admins can delete news images" on storage.objects
  for delete to authenticated using (
    bucket_id = 'news-images' and public.has_role(auth.uid(), 'admin')
  );

-- Seed initial site content
insert into public.site_content (key, value) values
  ('hero', '{"title":"SMA Taruna Sumbar","subtitle":"Membentuk Generasi Pemimpin Berkarakter, Disiplin, dan Berprestasi","cta":"Daftar Sekarang"}'::jsonb),
  ('about', '{"title":"Tentang Sekolah","body":"SMA Taruna Sumbar adalah sekolah menengah atas berbasis semi-militer yang berkomitmen membentuk generasi muda Sumatera Barat menjadi pemimpin yang disiplin, berintegritas, dan unggul secara akademik."}'::jsonb),
  ('vision', '{"vision":"Menjadi sekolah unggulan yang menghasilkan lulusan berkarakter taruna, berakhlak mulia, dan kompetitif di tingkat nasional maupun internasional.","mission":["Menyelenggarakan pendidikan akademik bermutu tinggi","Membentuk karakter disiplin dan kepemimpinan","Mengembangkan potensi jasmani dan rohani siswa","Menanamkan nilai cinta tanah air dan bela negara"]}'::jsonb),
  ('stats', '{"students":850,"teachers":62,"achievements":120,"alumni":3500}'::jsonb),
  ('contact', '{"address":"Jl. Raya Padang-Bukittinggi KM 25, Sumatera Barat","phone":"+62 751 1234567","email":"info@smatarunasumbar.sch.id","whatsapp":"6281234567890","facebook":"https://facebook.com/smatarunasumbar","maps":"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d255275.0!2d100.3!3d-0.95!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMMKwNTcnMDAuMCJTIDEwMMKwMTgnMDAuMCJF!5e0!3m2!1sen!2sid!4v1700000000000"}'::jsonb);
