import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  // שלב 1: זהה את המשתמש הקורא מתוך ה-cookie
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: () => {},
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "לא מורשה" }, { status: 401 });
  }

  // שלב 2: וודא שה-role הוא admin
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "נדרשות הרשאות מנהל" }, { status: 403 });
  }

  // שלב 3: בצע את ההזמנה עם client המנהל
  const { email } = await request.json();

  if (!email) {
    return NextResponse.json({ error: "נדרשת כתובת מייל" }, { status: 400 });
  }

  const { error } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
