create extension if not exists "pgcrypto";

create type public.app_role as enum ('pwd', 'employer', 'admin');
create type public.account_status as enum ('pending', 'approved', 'rejected');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role public.app_role not null,
  status public.account_status not null default 'pending',
  full_name text not null,
  email text not null,
  phone text,
  state text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.employer_profiles (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  organization_name text not null,
  organization_type text not null,
  website text,
  organization_state text,
  recruiter_job_title text,
  accessibility_support text,
  verification_document_path text,
  updated_at timestamptz not null default now()
);

create table public.pwd_profiles (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  headline text not null,
  category text not null,
  skills text[] not null default '{}',
  disability text not null,
  accommodations text[] not null default '{}',
  work_mode text not null,
  experience_years integer not null default 0 check (experience_years >= 0),
  availability text not null,
  summary text not null,
  pwd_id text,
  cv_path text,
  updated_at timestamptz not null default now()
);

create table public.pwd_documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  document_type text not null check (document_type in ('cv', 'qualification')),
  file_name text not null,
  storage_path text not null unique,
  created_at timestamptz not null default now()
);

create table public.employer_interests (
  id uuid primary key default gen_random_uuid(),
  employer_id uuid not null references public.profiles(id) on delete cascade,
  pwd_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (employer_id, pwd_id)
);

create index pwd_profiles_category_idx on public.pwd_profiles(category);
create index pwd_profiles_disability_idx on public.pwd_profiles(disability);
create index pwd_profiles_work_mode_idx on public.pwd_profiles(work_mode);
create index employer_interests_employer_idx on public.employer_interests(employer_id);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin' and status = 'approved'
  );
$$;

create or replace view public.pwd_directory
with (security_invoker = false)
as
  select
    p.user_id,
    p.headline,
    p.category,
    p.skills,
    p.disability,
    p.accommodations,
    p.work_mode,
    p.experience_years,
    p.availability,
    p.summary,
    account.state
  from public.pwd_profiles p
  join public.profiles account on account.id = p.user_id
  where account.role = 'pwd' and account.status = 'approved';

grant select on public.pwd_directory to authenticated;

alter table public.profiles enable row level security;
alter table public.employer_profiles enable row level security;
alter table public.pwd_profiles enable row level security;
alter table public.pwd_documents enable row level security;
alter table public.employer_interests enable row level security;

create policy "Users can view their account"
  on public.profiles for select using (id = auth.uid() or public.is_admin());
create policy "Users can update their account"
  on public.profiles for update using (id = auth.uid() or public.is_admin());
create policy "Admins can review accounts"
  on public.profiles for all using (public.is_admin()) with check (public.is_admin());

create policy "Employers can manage their profile"
  on public.employer_profiles for all using (user_id = auth.uid() or public.is_admin())
  with check (user_id = auth.uid() or public.is_admin());

create policy "PWDs can manage their profile"
  on public.pwd_profiles for all using (user_id = auth.uid() or public.is_admin())
  with check (user_id = auth.uid() or public.is_admin());

create policy "PWDs can manage their documents"
  on public.pwd_documents for all using (user_id = auth.uid() or public.is_admin())
  with check (user_id = auth.uid() or public.is_admin());

create policy "Employers can create interests"
  on public.employer_interests for insert
  with check (employer_id = auth.uid());
create policy "Users can view related interests"
  on public.employer_interests for select
  using (employer_id = auth.uid() or pwd_id = auth.uid() or public.is_admin());

insert into storage.buckets (id, name, public)
values ('private-documents', 'private-documents', false)
on conflict (id) do nothing;

create policy "Users can manage their private documents"
  on storage.objects for all
  using (bucket_id = 'private-documents' and (auth.uid())::text = (storage.foldername(name))[1])
  with check (bucket_id = 'private-documents' and (auth.uid())::text = (storage.foldername(name))[1]);