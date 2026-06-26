-- יצירת טבלת מועמדים
create table public.candidates (
  id              uuid        primary key default gen_random_uuid(),
  first_name      text        not null,
  last_name       text        not null,
  email           text        not null,
  phone           text,
  degree_field    text        not null,
  institution     text        not null,
  availability    text        not null,
  ai_experience   text,
  volunteering    boolean     not null default false,
  cv_url          text        not null,
  transcript_url  text,
  status          text        not null default 'pending',
  created_at      timestamptz not null default now()
);

-- הפעלת Row Level Security
alter table public.candidates enable row level security;

-- כל אחד יכול להגיש מועמדות (גם ללא חשבון)
create policy "allow public insert"
  on public.candidates
  for insert
  to anon
  with check (true);

-- רק משתמשים מחוברים (צוות) יכולים לצפות
create policy "allow authenticated select"
  on public.candidates
  for select
  to authenticated
  using (true);

-- רק משתמשים מחוברים יכולים לעדכן סטטוס
create policy "allow authenticated update"
  on public.candidates
  for update
  to authenticated
  using (true);
