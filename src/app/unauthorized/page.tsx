import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4" dir="rtl">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-8 py-12 text-center max-w-md w-full">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-3">אין הרשאה</h2>
        <p className="text-sm text-gray-500 leading-relaxed mb-6">
          אין לך הרשאה לגשת לדף זה.<br />
          פנה למנהל המערכת אם אתה חושב שמדובר בטעות.
        </p>
        <Link href="/dashboard" className="text-sm text-blue-600 hover:text-blue-800 transition">
          חזרה לדשבורד
        </Link>
      </div>
    </div>
  );
}
