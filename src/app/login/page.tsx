"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const inputClass =
  "w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition";
const btnClass =
  "w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-2.5 rounded-lg transition-colors duration-200 shadow-md text-sm";

export default function LoginPage() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState<string | null>(null);
  const [loading, setLoading]   = useState(false);

  const [forgotMode, setForgotMode]   = useState(false);
  const [resetEmail, setResetEmail]   = useState("");
  const [resetStatus, setResetStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError("כתובת המייל או הסיסמה שגויים");
        setLoading(false);
      } else {
        router.push("/dashboard");
      }
    } catch {
      setError("שגיאת תקשורת. נסי שוב.");
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetStatus("loading");
    const redirectTo = `${window.location.origin}/auth/callback?next=/auth/update-password`;
    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, { redirectTo });
    setResetStatus(error ? "error" : "sent");
  };

  const enterForgot = () => { setForgotMode(true); setResetStatus("idle"); setResetEmail(""); };
  const exitForgot  = () => { setForgotMode(false); setResetStatus("idle"); };

  return (
    <div
      dir="rtl"
      style={{ minHeight: "100vh", background: "linear-gradient(135deg, #1d4ed8 0%, #2563eb 50%, #3b82f6 100%)" }}
      className="flex items-center justify-center p-4"
    >
      <div className="w-full" style={{ maxWidth: 420 }}>
        <div className="bg-white rounded-2xl shadow-2xl px-8 py-10">

          {/* לוגו */}
          <div className="flex flex-col items-center mb-8">
            <Image src="/logo.png" alt="בינה בלב" width={120} height={120} className="mb-4 object-contain" priority />
            <p className="text-sm text-gray-400 mt-1">מערכת ניהול פנים-ארגונית</p>
          </div>

          {forgotMode ? (
            /* ── מצב איפוס סיסמה ── */
            resetStatus === "sent" ? (
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-gray-800 mb-1">המייל נשלח!</p>
                <p className="text-sm text-gray-500 mb-6">
                  בדוק את תיבת הדואר שלך ולחץ על הקישור לאיפוס הסיסמה.
                </p>
                <button type="button" onClick={exitForgot} className="text-sm text-blue-600 hover:text-blue-800 transition font-medium">
                  חזרה לכניסה
                </button>
              </div>
            ) : (
              <form onSubmit={handleResetPassword}>
                <h2 className="text-base font-semibold text-gray-800 mb-1">איפוס סיסמה</h2>
                <p className="text-sm text-gray-500 mb-5">
                  הכניסי את כתובת המייל שלך ונשלח לך קישור לאיפוס.
                </p>
                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">כתובת מייל</label>
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={e => setResetEmail(e.target.value)}
                    placeholder="your@email.com"
                    dir="ltr"
                    required
                    autoFocus
                    className={inputClass}
                  />
                </div>
                {resetStatus === "error" && (
                  <p className="text-red-500 text-sm text-center mb-4">שגיאה בשליחת המייל. נסי שוב.</p>
                )}
                <button type="submit" disabled={resetStatus === "loading"} className={btnClass}>
                  {resetStatus === "loading" ? "שולח..." : "שלח קישור לאיפוס"}
                </button>
                <div className="text-center mt-4">
                  <button type="button" onClick={exitForgot} className="text-sm text-gray-400 hover:text-gray-600 transition">
                    חזרה לכניסה
                  </button>
                </div>
              </form>
            )
          ) : (
            /* ── טופס כניסה רגיל ── */
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">כתובת מייל</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  dir="ltr"
                  required
                  className={inputClass}
                />
              </div>
              <div className="mb-5">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <label className="text-sm font-medium text-gray-700">סיסמה</label>
                  <button type="button" onClick={enterForgot} className="text-xs text-blue-500 hover:text-blue-700 transition">
                    שכחתי סיסמה
                  </button>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  dir="ltr"
                  required
                  className={inputClass}
                />
              </div>
              {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
              <button type="submit" disabled={loading} className={btnClass}>
                {loading ? "מתחבר..." : "כניסה למערכת"}
              </button>
            </form>
          )}

          {!forgotMode && (
            <div className="text-center mt-5">
              <p className="text-sm text-gray-400">
                עדיין אין לך חשבון?{" "}
                <Link href="/signup" className="text-blue-600 hover:text-blue-800 transition font-medium">
                  הירשמי
                </Link>
              </p>
            </div>
          )}
        </div>

        <p className="text-center text-blue-100 text-xs mt-6 opacity-70">
          © 2026 בינה בלב. כל הזכויות שמורות.
        </p>
      </div>
    </div>
  );
}
