import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const ADMIN_PATHS   = ["/admin"];
const HR_PATHS      = ["/dashboard", "/recruitment"];
const MANAGER_PATHS = ["/projects", "/training", "/incubator"];

function matchesAny(pathname: string, prefixes: string[]) {
  return prefixes.some(p => pathname === p || pathname.startsWith(p + "/"));
}

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({ request });
  const { pathname } = request.nextUrl;

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // שלב 1: אימות — האם המשתמש מחובר?
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // שלב 2: הרשאה — מה ה-role שלו?
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const role = profile?.role as string | undefined;

  if (matchesAny(pathname, ADMIN_PATHS) && role !== "admin") {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  if (matchesAny(pathname, HR_PATHS) && !["admin", "hr"].includes(role ?? "")) {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  if (matchesAny(pathname, MANAGER_PATHS) && !["admin", "manager"].includes(role ?? "")) {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/recruitment/:path*",
    "/projects/:path*",
    "/training/:path*",
    "/incubator/:path*",
    "/admin/:path*",
  ],
};
