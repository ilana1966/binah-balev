-- ─── Junior Members ──────────────────────────────────────────
CREATE TABLE public.junior_members (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name       text        NOT NULL,
  phone           text,
  email           text        NOT NULL,
  city            text,
  current_status  text,
  interest_area   text,
  weekly_hours    text,
  linkedin_url    text,
  github_url      text,
  motivation      text,
  referral_source text,
  privacy_accepted boolean    NOT NULL DEFAULT false,
  created_at      timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.junior_members ENABLE ROW LEVEL SECURITY;

-- כל אחד יכול להגיש (ציבורי)
CREATE POLICY "public insert junior_members"
  ON public.junior_members FOR INSERT TO anon WITH CHECK (true);

-- רק צוות מחובר יכול לצפות
CREATE POLICY "authenticated select junior_members"
  ON public.junior_members FOR SELECT TO authenticated USING (true);


-- ─── Senior Members ──────────────────────────────────────────
CREATE TABLE public.senior_members (
  id                uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name         text        NOT NULL,
  phone             text,
  email             text        NOT NULL,
  city              text,
  years_experience  text,
  current_role      text,
  expertise         text[],
  technologies      text,
  monthly_hours     text,
  linkedin_url      text,
  involvement_types text[],
  membership_type   text,
  motivation        text,
  referral_source   text,
  privacy_accepted  boolean     NOT NULL DEFAULT false,
  created_at        timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.senior_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public insert senior_members"
  ON public.senior_members FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "authenticated select senior_members"
  ON public.senior_members FOR SELECT TO authenticated USING (true);
