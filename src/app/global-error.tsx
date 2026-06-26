"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="he" dir="rtl">
      <body className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <h2 className="text-xl font-semibold text-gray-800">אירעה שגיאה כללית</h2>
        <button
          onClick={reset}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors"
        >
          נסה שוב
        </button>
      </body>
    </html>
  );
}
