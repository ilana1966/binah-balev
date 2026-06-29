-- Enforce @binahbalev.org domain at the DB level.
-- This trigger fires BEFORE any auth.users INSERT, so it cannot be bypassed
-- via direct Supabase API calls or any client-side workaround.

CREATE OR REPLACE FUNCTION auth.enforce_email_domain()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF lower(NEW.email) NOT LIKE '%@binahbalev.org' THEN
    RAISE EXCEPTION 'Registration is restricted to @binahbalev.org email addresses';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS enforce_email_domain_trigger ON auth.users;
CREATE TRIGGER enforce_email_domain_trigger
  BEFORE INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION auth.enforce_email_domain();
