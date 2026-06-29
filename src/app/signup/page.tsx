"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

const ALLOWED_DOMAIN = "@binahbalev.org";

const inputClass =
  "w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition";
const btnClass =
  "w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-2.5 rounded-lg transition-colors duration-200 shadow-md text-sm";

export default function SignupPage() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm]   = useState("");
  const [error, setError]       = useState<string | null>(null);
  const [loading, setLoading]   = useState(false);
  const [done, setDone]         = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.toLowerCase().endsWith(ALLOWED_DOMAIN)) {
      setError(`ההרשמה מוגבלת לכתובות ${ALLOWED_DOMAIN} בלבד`);
      return;
    }
    if (password.length < 8) {
      setError("הסיסמה חייבת להכיל לפחות 8 תווים");
      return;
    }
    if (password !== confirm) {
      setError("הסיסמאות אינן תואמות");
      return;
    }

    setLoading(true);
    const redirectTo = `${window.location.origin}/auth/callback?next=/dashboard`;
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: redirectTo },
    });

    if (signUpError) {
      const msg = signUpError.message.toLowerCase();
      if (msg.includes("already registered") || msg.includes("user already registered")) {
        setError("כתובת מייל זו כבר רשומה במערכת. התחברי דרך דף הכניסה.");
      } else {
        // Covers DB trigger rejection and other errors
        setError(`ההרשמה נכשלה. ודאי שכתובת המייל היא ${ALLOWED_DOMAIN} ונסי שוב.`);
      }
      setLoading(false);
    } else {
      setDone(true);
    }
  };

  if (done) {
    return (
      <div
        dir="rtl"
        style={{ minHeight: "100vh", background: "linear-gradient(135deg, #1d4ed8 0%, #2563eb 50%, #3b82f6 100%)" }}
        className="flex items-center justify-center p-4"
      >
        <div className="w-full" style={{ maxWidth: 420 }}>
          <div className="bg-white rounded-2xl shadow-2xl px-8 py-10 text-center">
            <Image src="/logo.png" alt="בינה בלב" width={80} height={80} className="object-contain mx-auto mb-6" priority />
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">אימות המייל נשלח!</h2>
            <p className="text-sm text-gray-500 leading-relaxed mb-6">
              שלחנו קישור אימות לכתובת<br />
              <span className="font-medium text-gray-700" dir="ltr">{email}</span><br />
              לחצי על הקישור כדי להפעיל את החשבון שלך.
            </p>
            <Link href="/login" className="text-sm text-blue-600 hover:text-blue-800 transition font-medium">
              חזרה לדף הכניסה
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      dir="rtl"
      style={{ minHeight: "100vh", background: "linear-gradient(135deg, #1d4ed8 0%, #2563eb 50%, #3b82f6 100%)" }}
      className="flex items-center justify-center p-4"
    >
      <div className="w-full" style={{ maxWidth: 420 }}>
        <div className="bg-white rounded-2xl shadow-2xl px-8 py-10">

          <div className="flex flex-col items-center mb-8">
            <Image src="/logo.png" alt="בינה בלב" width={120} height={120} className="mb-4 object-contain" priority />
            <p className="text-sm text-gray-400 mt-1">הרשמה למערכת</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">כתובת מייל</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@binahbalev.org"
                dir="ltr"
                required
                autoFocus
                className={inputClass}
              />
              <p className="text-xs text-gray-400 mt-1">ההרשמה מוגבלת לכתובות @binahbalev.org</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">סיסמה</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="לפחות 8 תווים"
                dir="ltr"
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">אימות סיסמה</label>
              <input
                type="password"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                placeholder="הכניסי את הסיסמה שוב"
                dir="ltr"
                required
                className={inputClass}
              />
            </div>

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <button type="submit" disabled={loading} className={btnClass}>
              {loading ? "נרשם..." : "הירשמי למערכת"}
            </button>
          </form>

          <div className="text-center mt-5">
            <p className="text-sm text-gray-400">
              כבר יש לך חשבון?{" "}
              <Link href="/login" className="text-blue-600 hover:text-blue-800 transition font-medium">
                כניסה למערכת
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-blue-100 text-xs mt-6 opacity-70">
          © 2026 בינה בלב. כל הזכויות שמורות.
        </p>
      </div>
    </div>
  );
}
