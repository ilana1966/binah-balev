import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-6">
      <h1 className="text-4xl font-bold text-blue-800 tracking-tight">בינה בלב</h1>
      <div className="flex gap-4 mt-2">
        <Link
          href="/apply"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg text-sm"
        >
          הגש מועמדות
        </Link>
        <Link
          href="/login"
          className="border border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold px-8 py-3 rounded-lg transition-colors duration-200 text-sm"
        >
          כניסה לצוות
        </Link>
      </div>
    </div>
  );
}
