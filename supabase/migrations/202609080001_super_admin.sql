-- Create or update a super-admin account manually after creating the auth user in Supabase Auth.
-- Replace the email below with the actual inbox you want to use for admin access.
-- Example:
-- 1. In Supabase Dashboard -> Authentication -> Users -> Add user
-- 2. Use email: admin@sora.com.ng
-- 3. Set the password and confirm the user
-- 4. Run this SQL and it will map the auth user to the admin profile.

WITH target_user AS (
  SELECT id
  FROM auth.users
  WHERE email = 'admin@sora.com.ng'
)
INSERT INTO public.profiles (id, role, status, full_name, email)
SELECT
  tu.id,
  'admin',
  'approved',
  'Sora Super Admin',
  'admin@sora.com.ng'
FROM target_user tu
ON CONFLICT (id) DO UPDATE
SET role = EXCLUDED.role,
    status = EXCLUDED.status,
    full_name = EXCLUDED.full_name,
    email = EXCLUDED.email;

-- If you want to log in as a different admin, change the email above to your desired admin address.
