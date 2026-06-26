"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState<string | null>(null);
  const [loading, setLoading]   = useState(false);
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

  return (
    <div
      dir="rtl"
      style={{ minHeight: "100vh", background: "linear-gradient(135deg, #1d4ed8 0%, #2563eb 50%, #3b82f6 100%)" }}
      className="flex items-center justify-center p-4"
    >
      <div className="w-full" style={{ maxWidth: 420 }}>

        {/* כרטיס */}
        <div className="bg-white rounded-2xl shadow-2xl px-8 py-10">

          {/* לוגו */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg mb-4">
              <svg viewBox="0 0 40 40" className="w-9 h-9" fill="white">
                <circle cx="20" cy="14" r="7" />
                <path d="M6 34c0-7.732 6.268-14 14-14s14 6.268 14 14H6z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-blue-800">בינה בלב</h1>
            <p className="text-sm text-gray-400 mt-1">מערכת ניהול פנים-ארגונית</p>
          </div>

          {/* טופס */}
          <form onSubmit={handleSubmit}>

            {/* מייל */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                כתובת מייל
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                dir="ltr"
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            {/* סיסמה */}
            <div className="mb-5">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <label className="text-sm font-medium text-gray-700">סיסמה</label>
                <button type="button" className="text-xs text-blue-500 hover:text-blue-700 transition">
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
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            {/* שגיאה */}
            {error && (
              <p className="text-red-500 text-sm text-center mb-4">{error}</p>
            )}

            {/* כפתור */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-2.5 rounded-lg transition-colors duration-200 shadow-md text-sm"
            >
              {loading ? "מתחבר..." : "כניסה למערכת"}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-blue-100 text-xs mt-6 opacity-70">
          © 2026 בינה בלב. כל הזכויות שמורות.
        </p>
      </div>
    </div>
  );
}
