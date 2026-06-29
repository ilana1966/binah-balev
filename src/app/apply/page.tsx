"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type LookupItem = { id: number; name: string };

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  degreeFieldId: string;
  institutionId: string;
  workScope: string;
  aiExperience: string;
  volunteeredBefore: string;
  cv: File | null;
  transcript: File | null;
};

async function uploadFile(file: File, folder: string): Promise<string> {
  const ext = file.name.split(".").pop();
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabase.storage.from("candidates").upload(path, file);
  if (error) throw new Error(error.message);
  const { data } = supabase.storage.from("candidates").getPublicUrl(path);
  return data.publicUrl;
}

const inputClass =
  "w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition placeholder:text-gray-300";
const labelClass = "block text-sm font-medium text-gray-700 mb-1.5";

export default function ApplyPage() {
  const [form, setForm] = useState<FormState>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    degreeFieldId: "",
    institutionId: "",
    workScope: "",
    aiExperience: "",
    volunteeredBefore: "",
    cv: null,
    transcript: null,
  });
  const [degreeFields, setDegreeFields] = useState<LookupItem[]>([]);
  const [institutions, setInstitutions] = useState<LookupItem[]>([]);
  const [lookupsLoading, setLookupsLoading] = useState(true);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error" | "duplicate">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    Promise.all([
      supabase.from("degree_fields").select("id, name").order("name"),
      supabase.from("institutions").select("id, name").order("name"),
    ]).then(([df, inst]) => {
      if (df.data) setDegreeFields(df.data);
      if (inst.data) setInstitutions(inst.data);
      setLookupsLoading(false);
    });
  }, []);

  const set =
    (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const setFile =
    (field: "cv" | "transcript") => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.files?.[0] ?? null }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.cv) return;
    setStatus("loading");
    setErrorMsg("");

    try {
      // בדיקת כפילות לפני העלאת קבצים
      const { data: existing } = await supabase
        .from("candidates")
        .select("id")
        .eq("email", form.email)
        .maybeSingle();

      if (existing) {
        setStatus("duplicate");
        return;
      }

      const cvUrl = await uploadFile(form.cv, "cv");
      const transcriptUrl = form.transcript
        ? await uploadFile(form.transcript, "transcript")
        : null;

      const { error } = await supabase.from("candidates").insert({
        first_name: form.firstName,
        last_name: form.lastName,
        email: form.email,
        phone: form.phone || null,
        degree_field_id: parseInt(form.degreeFieldId),
        institution_id: parseInt(form.institutionId),
        availability: form.workScope,
        ai_experience: form.aiExperience || null,
        volunteering: form.volunteeredBefore === "yes",
        cv_url: cvUrl,
        transcript_url: transcriptUrl,
      });

      if (error) {
        if (error.code === "23505") {
          setStatus("duplicate");
        } else {
          throw new Error(error.message);
        }
      } else {
        setStatus("success");
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "שגיאה בשליחת הטופס");
      setStatus("error");
    }
  };

  if (status === "duplicate") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-8 py-12 text-center max-w-md w-full">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-3">המועמדות כבר הוגשה</h2>
          <p className="text-sm text-gray-500 leading-relaxed mb-6">
            מועמדות כבר הוגשה עם כתובת מייל זו.<br />
            לפניות נוספות צור קשר עם צוות בינה בלב.
          </p>
          <Link href="/" className="text-sm text-blue-600 hover:text-blue-800 transition">
            חזרה לדף הבית
          </Link>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-8 py-12 text-center max-w-md w-full">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">המועמדות התקבלה!</h2>
          <p className="text-sm text-gray-500 mb-6">נבדוק את פרטייך ונחזור אליך בהקדם.</p>
          <Link href="/" className="text-sm text-blue-600 hover:text-blue-800 transition">
            חזרה לדף הבית
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex flex-col items-center mb-8">
          <Image src="/logo.png" alt="בינה בלב" width={90} height={90} className="object-contain mb-2" priority />
          <h1 className="text-2xl font-bold text-blue-800">הגשת מועמדות</h1>
          <p className="text-sm text-gray-400 mt-1">בינה בלב</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* פרטים אישיים */}
          <Section title="פרטים אישיים">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>שם פרטי</label>
                <input type="text" value={form.firstName} onChange={set("firstName")} placeholder="ישראל" required className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>שם משפחה</label>
                <input type="text" value={form.lastName} onChange={set("lastName")} placeholder="ישראלי" required className={inputClass} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>מייל</label>
                <input type="email" value={form.email} onChange={set("email")} placeholder="your@email.com" dir="ltr" required className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>טלפון</label>
                <input type="tel" value={form.phone} onChange={set("phone")} placeholder="050-0000000" dir="ltr" className={inputClass} />
              </div>
            </div>
          </Section>

          {/* פרטים אקדמיים */}
          <Section title="פרטים אקדמיים">
            <div>
              <label className={labelClass}>תחום תואר</label>
              <select value={form.degreeFieldId} onChange={set("degreeFieldId")} required disabled={lookupsLoading} className={`${inputClass} bg-white`}>
                <option value="" disabled>{lookupsLoading ? "טוען..." : "בחר תחום..."}</option>
                {degreeFields.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>מוסד לימודים</label>
              <select value={form.institutionId} onChange={set("institutionId")} required disabled={lookupsLoading} className={`${inputClass} bg-white`}>
                <option value="" disabled>{lookupsLoading ? "טוען..." : "בחר מוסד..."}</option>
                {institutions.map((i) => <option key={i.id} value={i.id}>{i.name}</option>)}
              </select>
            </div>
          </Section>

          {/* זמינות וניסיון */}
          <Section title="זמינות וניסיון">
            <div>
              <label className={labelClass}>היקף משרה זמין</label>
              <div className="flex gap-4">
                {[{ value: "full", label: "משרה מלאה" }, { value: "partial", label: "משרה חלקית" }].map(({ value, label }) => (
                  <label key={value} className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="workScope" value={value} checked={form.workScope === value} onChange={set("workScope")} required className="accent-blue-600" />
                    <span className="text-sm text-gray-700">{label}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className={labelClass}>ניסיון ב-AI</label>
              <textarea value={form.aiExperience} onChange={set("aiExperience")} placeholder="תאר את ניסיונך בתחום הבינה המלאכותית..." rows={3} className={`${inputClass} resize-none`} />
            </div>
            <div>
              <label className={labelClass}>התנדבות בעבר</label>
              <div className="flex gap-4">
                {[{ value: "yes", label: "כן" }, { value: "no", label: "לא" }].map(({ value, label }) => (
                  <label key={value} className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="volunteeredBefore" value={value} checked={form.volunteeredBefore === value} onChange={set("volunteeredBefore")} required className="accent-blue-600" />
                    <span className="text-sm text-gray-700">{label}</span>
                  </label>
                ))}
              </div>
            </div>
          </Section>

          {/* מסמכים */}
          <Section title="מסמכים">
            <div>
              <label className={labelClass}>
                קורות חיים <span className="text-red-500">*</span>
              </label>
              <input type="file" accept=".pdf,.doc,.docx" onChange={setFile("cv")} required className="w-full text-sm text-gray-600 file:ml-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition" />
            </div>
            <div>
              <label className={labelClass}>
                גיליון ציונים <span className="text-gray-400 font-normal">(אופציונלי)</span>
              </label>
              <input type="file" accept=".pdf,.doc,.docx,.jpg,.png" onChange={setFile("transcript")} className="w-full text-sm text-gray-600 file:ml-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gray-50 file:text-gray-600 hover:file:bg-gray-100 transition" />
            </div>
          </Section>

          {errorMsg && (
            <p className="text-red-500 text-sm text-center">{errorMsg}</p>
          )}

          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg text-sm"
          >
            {status === "loading" ? "שולח..." : "שלח מועמדות"}
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

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-6 space-y-4">
      <h2 className="text-base font-semibold text-gray-800 border-b border-gray-100 pb-3">{title}</h2>
      {children}
    </div>
  );
}
