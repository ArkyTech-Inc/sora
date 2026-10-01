create table public.pwd_applications (
  id uuid primary key default gen_random_uuid(),
  pwd_id uuid not null references public.profiles(id) on delete cascade,
  employer_id uuid not null references public.profiles(id) on delete cascade,
  role text not null,
  status text not null default 'submitted' check (status in ('submitted', 'reviewing', 'closed')),
  created_at timestamptz not null default now(),
  unique (pwd_id, employer_id, role)
);

alter table public.pwd_applications enable row level security;

create policy "PWDs and employers can view their applications"
  on public.pwd_applications for select
  using (pwd_id = auth.uid() or employer_id = auth.uid() or public.is_admin());

create policy "PWDs can submit applications"
  on public.pwd_applications for insert
  with check (pwd_id = auth.uid());

create policy "Employers can update applications"
  on public.pwd_applications for update
  using (employer_id = auth.uid() or public.is_admin())
  with check (employer_id = auth.uid() or public.is_admin());