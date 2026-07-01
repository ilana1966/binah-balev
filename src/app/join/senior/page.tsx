"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

const EXPERTISE_OPTIONS = [
  "פיתוח תוכנה",
  "AI / ML",
  "דאטה",
  "DevOps / Cloud",
  "אבטחת מידע",
  "מוצר / PM",
  "UX / עיצוב",
  "Mobile",
  "Web3",
  "Quantum",
  "אחר",
];

const INVOLVEMENT_OPTIONS = [
  "מנטורינג",
  "סדנאות",
  "הובלת פרויקט",
  "ליווי גיוס",
  "ביקורות קוד",
];

const MEMBERSHIP_TYPES = [
  { value: "personal",      label: "אישי בלבד" },
  { value: "organization",  label: "ארגון בלבד" },
  { value: "both",          label: "אישי + ארגון" },
];

const YEARS_EXPERIENCE = ["2–5 שנים", "5–10 שנים", "10–15 שנים", "15+ שנים"];
const MONTHLY_HOURS    = ["עד 2 שעות", "2–5 שעות", "5–10 שעות", "10–20 שעות", "20+ שעות"];
const REFERRAL_SOURCES = [
  "חבר/ה או מכר/ה",
  "LinkedIn",
  "אינסטגרם",
  "פייסבוק",
  "כנס / אירוע מקצועי",
  "גוגל",
  "אחר",
];

type SeniorForm = {
  fullName: string;
  phone: string;
  email: string;
  city: string;
  yearsExperience: string;
  currentRole: string;
  expertise: string[];
  technologies: string;
  monthlyHours: string;
  linkedin: string;
  involvementTypes: string[];
  membershipType: string;
  motivation: string;
  referralSource: string;
  privacyAccepted: boolean;
};

type StringFields = Exclude<keyof SeniorForm, "expertise" | "involvementTypes" | "privacyAccepted">;

const inputClass =
  "w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition placeholder:text-gray-300";
const labelClass = "block text-sm font-medium text-gray-700 mb-1.5";

export default function SeniorPage() {
  const [form, setForm] = useState<SeniorForm>({
    fullName: "",
    phone: "",
    email: "",
    city: "",
    yearsExperience: "",
    currentRole: "",
    expertise: [],
    technologies: "",
    monthlyHours: "",
    linkedin: "",
    involvementTypes: [],
    membershipType: "",
    motivation: "",
    referralSource: "",
    privacyAccepted: false,
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const set =
    (field: StringFields) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm(prev => ({ ...prev, [field]: e.target.value }));

  const toggle = (field: "expertise" | "involvementTypes", value: string) =>
    setForm(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(v => v !== value)
        : [...prev[field], value],
    }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.expertise.length === 0) {
      setErrorMsg("יש לבחור לפחות תחום מומחיות אחד");
      return;
    }
    if (!form.privacyAccepted) {
      setErrorMsg("יש לאשר את מדיניות הפרטיות כדי להמשיך");
      return;
    }
    setStatus("loading");
    setErrorMsg("");

    const { error } = await supabase.from("senior_members").insert({
      full_name: form.fullName,
      phone: form.phone || null,
      email: form.email,
      city: form.city || null,
      years_experience: form.yearsExperience || null,
      current_role: form.currentRole || null,
      expertise: form.expertise,
      technologies: form.technologies || null,
      monthly_hours: form.monthlyHours || null,
      linkedin_url: form.linkedin || null,
      involvement_types: form.involvementTypes,
      membership_type: form.membershipType || null,
      motivation: form.motivation || null,
      referral_source: form.referralSource || null,
      privacy_accepted: true,
    });

    if (error) {
      setErrorMsg("שגיאה בשליחת הטופס. נסי שוב.");
      setStatus("error");
    } else {
      setStatus("success");
    }
  };

  if (status === "success") {
    return (
      <div dir="rtl" className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-8 py-12 text-center max-w-md w-full">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">הצטרפות התקבלה!</h2>
          <p className="text-sm text-gray-500 mb-6">
            תודה על ההצטרפות לרשת הסיניורים של בינה בלב.<br />
            ניצור איתך קשר בקרוב.
          </p>
          <Link href="/" className="text-sm text-blue-600 hover:text-blue-800 transition">
            חזרה לדף הבית
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">

        <div className="flex flex-col items-center mb-8">
          <Image src="/logo.png" alt="בינה בלב" width={80} height={80} className="object-contain mb-3" priority />
          <h1 className="text-2xl font-bold text-blue-800">הצטרפות לרשת הסיניורים</h1>
          <p className="text-sm text-gray-400 mt-1">בינה בלב</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* פרטים אישיים */}
          <FormSection title="פרטים אישיים">
            <div>
              <label className={labelClass}>שם מלא <span className="text-red-500">*</span></label>
              <input type="text" value={form.fullName} onChange={set("fullName")} placeholder="ישראל ישראלי" required className={inputClass} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>אימייל <span className="text-red-500">*</span></label>
                <input type="email" value={form.email} onChange={set("email")} placeholder="your@email.com" dir="ltr" required className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>טלפון</label>
                <input type="tel" value={form.phone} onChange={set("phone")} placeholder="050-0000000" dir="ltr" className={inputClass} />
              </div>
            </div>
            <div>
              <label className={labelClass}>עיר</label>
              <input type="text" value={form.city} onChange={set("city")} placeholder="תל אביב" className={inputClass} />
            </div>
          </FormSection>

          {/* ניסיון מקצועי */}
          <FormSection title="ניסיון מקצועי">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>שנות ניסיון</label>
                <select value={form.yearsExperience} onChange={set("yearsExperience")} className={`${inputClass} bg-white`}>
                  <option value="" disabled>בחר/י...</option>
                  {YEARS_EXPERIENCE.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>תפקיד נוכחי</label>
                <input type="text" value={form.currentRole} onChange={set("currentRole")} placeholder="Senior Developer" dir="ltr" className={inputClass} />
              </div>
            </div>
            <div>
              <label className={labelClass}>טכנולוגיות</label>
              <input type="text" value={form.technologies} onChange={set("technologies")} placeholder="React, Python, AWS, ..." dir="ltr" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>LinkedIn</label>
              <input type="url" value={form.linkedin} onChange={set("linkedin")} placeholder="linkedin.com/in/..." dir="ltr" className={inputClass} />
            </div>
          </FormSection>

          {/* תחומי מומחיות */}
          <FormSection title="תחומי מומחיות">
            <p className="text-xs text-gray-400 -mt-1">ניתן לבחור יותר מאחד</p>
            <div className="flex flex-wrap gap-2">
              {EXPERTISE_OPTIONS.map(opt => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => toggle("expertise", opt)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                    form.expertise.includes(opt)
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-600 border-gray-300 hover:border-blue-400"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </FormSection>

          {/* מעורבות בקהילה */}
          <FormSection title="מעורבות בקהילה">
            <div>
              <label className={labelClass}>זמינות חודשית (שעות)</label>
              <select value={form.monthlyHours} onChange={set("monthlyHours")} className={`${inputClass} bg-white`}>
                <option value="" disabled>בחר/י...</option>
                {MONTHLY_HOURS.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>אופי המעורבות המבוקש</label>
              <p className="text-xs text-gray-400 mb-2">ניתן לבחור יותר מאחד</p>
              <div className="flex flex-wrap gap-2">
                {INVOLVEMENT_OPTIONS.map(opt => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => toggle("involvementTypes", opt)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                      form.involvementTypes.includes(opt)
                        ? "bg-purple-600 text-white border-purple-600"
                        : "bg-white text-gray-600 border-gray-300 hover:border-purple-400"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className={labelClass}>סוג הצטרפות</label>
              <div className="flex gap-6 flex-wrap mt-1">
                {MEMBERSHIP_TYPES.map(({ value, label }) => (
                  <label key={value} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="membershipType"
                      value={value}
                      checked={form.membershipType === value}
                      onChange={set("membershipType")}
                      className="accent-blue-600"
                    />
                    <span className="text-sm text-gray-700">{label}</span>
                  </label>
                ))}
              </div>
            </div>
          </FormSection>

          {/* קצת עלייך */}
          <FormSection title="קצת עלייך">
            <div>
              <label className={labelClass}>מה מביא אותך אלינו?</label>
              <textarea
                value={form.motivation}
                onChange={set("motivation")}
                placeholder="ספרו בקצרה מה מביא אתכם אלינו..."
                rows={3}
                className={`${inputClass} resize-none`}
              />
            </div>
            <div>
              <label className={labelClass}>איך שמעת עלינו?</label>
              <select value={form.referralSource} onChange={set("referralSource")} className={`${inputClass} bg-white`}>
                <option value="" disabled>בחר/י...</option>
                {REFERRAL_SOURCES.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          </FormSection>

          {/* מדיניות פרטיות */}
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="privacy"
              checked={form.privacyAccepted}
              onChange={e => setForm(prev => ({ ...prev, privacyAccepted: e.target.checked }))}
              className="mt-0.5 w-4 h-4 accent-blue-600 cursor-pointer"
            />
            <label htmlFor="privacy" className="text-sm text-gray-600 cursor-pointer leading-relaxed">
              אני מאשר/ת את{" "}
              <span className="text-blue-600 underline">מדיניות הפרטיות</span>
              {" "}ומסכים/ה לשמירת פרטיי לצורך ניהול הקהילה
            </label>
          </div>

          {errorMsg && <p className="text-red-500 text-sm text-center">{errorMsg}</p>}

          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 rounded-lg transition-colors duration-200 shadow-md text-sm"
          >
            {status === "loading" ? "שולח..." : "שלח/י בקשת הצטרפות"}
          </button>
        </form>

        <div className="text-center mt-6">
          <Link href="/" className="text-sm text-gray-400 hover:text-gray-600 transition">
            חזרה לדף הבית
          </Link>
        </div>
      </div>
    </div>
  );
}

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-6 space-y-4">
      <h2 className="text-base font-semibold text-gray-800 border-b border-gray-100 pb-3">{title}</h2>
      {children}
    </div>
  );
}
