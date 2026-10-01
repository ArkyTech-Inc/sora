    revoke all on public.pwd_directory from public, anon, authenticated;

    create or replace function public.is_approved_employer(account_id uuid)
    returns boolean
    language sql
    stable
    security definer
    set search_path = public
    as $$
    select exists (
        select 1 from public.profiles
        where id = account_id and role = 'employer' and status = 'approved'
    );
    $$;

    create or replace function public.is_verified_pwd(account_id uuid)
    returns boolean
    language sql
    stable
    security definer
    set search_path = public
    as $$
    select exists (
        select 1 from public.profiles
        where id = account_id and role = 'pwd' and status = 'approved'
    );
    $$;

    revoke all on function public.is_approved_employer(uuid) from public, anon;
    revoke all on function public.is_verified_pwd(uuid) from public, anon;
    grant execute on function public.is_approved_employer(uuid) to authenticated;
    grant execute on function public.is_verified_pwd(uuid) to authenticated;

    create or replace function public.get_verified_pwd_directory()
    returns table (
    user_id uuid,
    headline text,
    category text,
    skills text[],
    disability text,
    accommodations text[],
    work_mode text,
    experience_years integer,
    availability text,
    summary text,
    state text
    )
    language sql
    stable
    security definer
    set search_path = public
    as $$
    select
        pwd.user_id,
        pwd.headline,
        pwd.category,
        pwd.skills,
        pwd.disability,
        pwd.accommodations,
        pwd.work_mode,
        pwd.experience_years,
        pwd.availability,
        pwd.summary,
        account.state
    from public.pwd_profiles as pwd
    join public.profiles as account on account.id = pwd.user_id
    where account.role = 'pwd'
        and account.status = 'approved'
        and public.is_approved_employer(auth.uid());
    $$;

    revoke all on function public.get_verified_pwd_directory() from public, anon;
    grant execute on function public.get_verified_pwd_directory() to authenticated;

    drop policy if exists "Employers can update applications" on public.pwd_applications;

    drop policy if exists "Users can update their account" on public.profiles;

    drop policy if exists "Employers can create interests" on public.employer_interests;
    create policy "Approved employers can create interests in verified profiles"
    on public.employer_interests for insert
    with check (
        employer_id = auth.uid()
        and public.is_approved_employer(auth.uid())
        and public.is_verified_pwd(pwd_id)
    );

    drop policy if exists "PWDs can submit applications" on public.pwd_applications;
    create policy "Verified PWDs can submit applications"
    on public.pwd_applications for insert
    with check (
        pwd_id = auth.uid()
        and public.is_verified_pwd(auth.uid())
        and public.is_approved_employer(employer_id)
    );

    update public.profiles
    set status = 'pending', updated_at = now()
    where role = 'pwd' and status = 'approved';