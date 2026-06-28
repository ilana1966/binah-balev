-- יצירת טבלת profiles לניהול תפקידים
create table public.profiles (
  id         uuid        primary key references auth.users(id) on delete cascade,
  role       text        not null default 'hr'
                         check (role in ('admin', 'manager', 'hr')),
  created_at timestamptz not null default now()
);

-- הפעלת Row Level Security
alter table public.profiles enable row level security;

-- פונקציית עזר: מחזירה את ה-role של המשתמש הנוכחי
-- SECURITY DEFINER = רצה כ-postgres, עוקפת RLS — פותרת רקורסיה בפוליסות
create or replace function public.get_my_role()
  returns text
  language sql
  stable
  security definer
  set search_path = public
as $$
  select role from public.profiles where id = auth.uid()
$$;

-- כל משתמש מחובר יכול לקרוא את הפרופיל שלו בלבד
create policy "read own profile"
  on public.profiles
  for select
  to authenticated
  using (auth.uid() = id);

-- admin יכול לקרוא את כל הפרופילים (לדף ניהול משתמשים)
create policy "admin reads all profiles"
  on public.profiles
  for select
  to authenticated
  using (public.get_my_role() = 'admin');

-- admin יכול לעדכן את ה-role של כל משתמש
create policy "admin updates profiles"
  on public.profiles
  for update
  to authenticated
  using (public.get_my_role() = 'admin')
  with check (public.get_my_role() = 'admin');

-- יצירת profile אוטומטית כשנרשם משתמש חדש (ברירת מחדל: 'hr')
create or replace function public.handle_new_user()
  returns trigger
  language plpgsql
  security definer
  set search_path = public
as $$
begin
  insert into public.profiles (id, role)
  values (new.id, 'hr');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute procedure public.handle_new_user();
