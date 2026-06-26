-- Add UNIQUE constraint on candidates.email to prevent duplicate applications
ALTER TABLE public.candidates
  ADD CONSTRAINT candidates_email_unique UNIQUE (email);
