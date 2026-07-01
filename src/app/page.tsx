import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <div dir="rtl" className="min-h-screen bg-white">

      {/* ── Hero ── */}
      <section className="bg-gradient-to-br from-blue-700 via-blue-600 to-blue-500 text-white py-20 px-6 text-center">
        <Image
          src="/logo.png"
          alt="בינה בלב"
          width={110}
          height={110}
          className="object-contain mx-auto mb-6"
          priority
        />
        <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-snug">
          בינה בלב — מקום שבו AI פוגש קהילה
        </h1>
        <p className="text-blue-100 text-base leading-relaxed max-w-2xl mx-auto">
          {"פלטפורמת הניהול הפנים-ארגונית של בינה בלב — מועדון הג'וניורים, רשת הסיניורים, מסגרת פרויקטים, הדרכות וכו', במקום אחד"}
        </p>
      </section>

      {/* ── Modules ── */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <ModuleCard
            iconBg="bg-blue-50"
            iconColor="text-blue-600"
            icon={
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            }
            title="מסגרת פרויקטים"
            desc="פרויקטים טכנולוגיים אמיתיים בשיתוף ג'וניורים וסיניורים — מהרעיון ועד פרודקשן."
          />
          <ModuleCard
            iconBg="bg-purple-50"
            iconColor="text-purple-600"
            icon={
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-5-3.87M9 20H4v-2a4 4 0 015-3.87m6-4.13a4 4 0 10-8 0 4 4 0 008 0zm6 0a4 4 0 10-8 0 4 4 0 008 0z" />
              </svg>
            }
            title="רשת סיניורים"
            desc="מומחים מהתעשייה שמשתפים ידע, מנחים ומובילים את הדור הבא של אנשי הטק."
          />
          <ModuleCard
            iconBg="bg-green-50"
            iconColor="text-green-600"
            icon={
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            }
            title="מועדון ג'וניורים"
            desc="קהילה פעילה של מפתחים בתחילת דרכם — לומדים, מתחברים וצומחים יחד."
          />
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-blue-50 py-16 px-6 text-center">
        <h2 className="text-2xl font-bold text-blue-900 mb-2">הצטרפו לקהילה</h2>
        <p className="text-gray-500 text-sm mb-10">בחרו את הנתיב המתאים לכם</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-lg mx-auto">
          <Link
            href="/join/junior"
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors shadow-md text-sm text-center"
          >
            {"הגשת מועמדות כג'וניור/ית"}
          </Link>
          <Link
            href="/join/senior"
            className="w-full sm:w-auto bg-white hover:bg-gray-50 border-2 border-blue-600 text-blue-700 font-semibold px-8 py-3.5 rounded-xl transition-colors text-sm text-center"
          >
            הצטרפות כסיניור/ית
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-10 text-center border-t border-gray-100">
        <Link href="/login" className="text-xs text-gray-400 hover:text-gray-600 transition">
          כניסה לצוות
        </Link>
      </footer>

    </div>
  );
}

function ModuleCard({
  icon,
  iconBg,
  iconColor,
  title,
  desc,
}: {
  icon: ReactNode;
  iconBg: string;
  iconColor: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center hover:shadow-md transition-shadow">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 ${iconBg}`}>
        <span className={iconColor}>{icon}</span>
      </div>
      <h3 className="text-lg font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
    </div>
  );
}
