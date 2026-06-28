"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";

export default function AdminUsersPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [loading, setLoading] = useState(false);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus("idle");

    const res = await fetch("/api/admin/invite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (res.ok) {
      setStatus("success");
      setEmail("");
    } else {
      setStatus("error");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="p-8 max-w-xl mx-auto">
        <h1 className="text-2xl font-bold text-blue-800 mb-2">ניהול משתמשים</h1>
        <p className="text-sm text-gray-500 mb-8">הוספת משתמש חדש תשלח לו מייל להגדרת סיסמה</p>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-8 py-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">הוספת משתמש חדש</h2>

          <form onSubmit={handleInvite} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                כתובת מייל
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                dir="ltr"
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition placeholder:text-gray-300"
              />
            </div>

            {status === "success" && (
              <p className="text-green-600 text-sm">המייל נשלח בהצלחה!</p>
            )}
            {status === "error" && (
              <p className="text-red-500 text-sm">שגיאה בשליחת ההזמנה. ייתכן שהמשתמש כבר קיים.</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-2.5 rounded-lg transition-colors duration-200 shadow-md text-sm"
            >
              {loading ? "שולח..." : "שלח הזמנה"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

