-- Drop and recreate the trigger with fixes
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_domain TEXT;
  found_college_id UUID;
BEGIN
  user_domain := split_part(NEW.email, '@', 2);

  SELECT id INTO found_college_id
  FROM colleges
  WHERE domain = user_domain AND is_active = true
  LIMIT 1;

  INSERT INTO public.profiles (user_id, email, full_name, college_id, verification_status)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    COALESCE(found_college_id::text, user_domain),
    CASE WHEN found_college_id IS NOT NULL THEN 'verified' ELSE 'pending' END
  );
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE LOG 'handle_new_user error for %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
