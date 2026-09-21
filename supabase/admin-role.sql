-- Admin role + moderation policies
-- Run this in Supabase SQL Editor AFTER schema.sql

-- 1. Admin flag on profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT false;

-- 2. Helper: true when the current user is an admin.
-- SECURITY DEFINER avoids infinite recursion with profiles RLS.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid() AND is_admin = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- 3. Admin moderation policies (SELECT everything + UPDATE status fields)
CREATE POLICY "Admins can view all listings" ON listings
  FOR SELECT USING (public.is_admin());
CREATE POLICY "Admins can update listings" ON listings
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "Admins can update profiles" ON profiles
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "Admins can update tutor profiles" ON tutor_profiles
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "Admins can view all orders" ON orders
  FOR SELECT USING (public.is_admin());
CREATE POLICY "Admins can view all bookings" ON bookings
  FOR SELECT USING (public.is_admin());
CREATE POLICY "Admins can view all reviews" ON reviews
  FOR SELECT USING (public.is_admin());
CREATE POLICY "Admins can view all reports" ON user_reports
  FOR SELECT USING (public.is_admin());
CREATE POLICY "Admins can view all payouts" ON payouts
  FOR SELECT USING (public.is_admin());
CREATE POLICY "Admins can view all conversations" ON conversations
  FOR SELECT USING (public.is_admin());
CREATE POLICY "Admins can view all notifications" ON notifications
  FOR SELECT USING (public.is_admin());

-- 4. Make yourself admin (replace with your login email):
-- UPDATE profiles SET is_admin = true WHERE email = 'you@vpt.edu.in';
