"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";

/* ─── Types ─────────────────────────────────────────────── */
type Candidate = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  degree_field: string;
  institution: string;
  availability: string;
  ai_experience: string | null;
  volunteering: boolean;
  cv_url: string;
  transcript_url: string | null;
  status: string;
  created_at: string;
};

/* ─── Constants ──────────────────────────────────────────── */
const STATUS_MAP: Record<string, { label: string; badge: string; dot: string }> = {
  new:       { label: "חדש",     badge: "bg-blue-100 text-blue-700",    dot: "bg-blue-500" },
  in_review: { label: "בבדיקה", badge: "bg-orange-100 text-orange-700", dot: "bg-orange-500" },
  approved:  { label: "מאושר",  badge: "bg-green-100 text-green-700",   dot: "bg-green-500" },
  rejected:  { label: "נדחה",   badge: "bg-red-100 text-red-700",       dot: "bg-red-500" },
};

const FILTERS = [
  { value: "all",       label: "הכל" },
  { value: "new",       label: "חדש" },
  { value: "in_review", label: "בבדיקה" },
  { value: "approved",  label: "מאושר" },
  { value: "rejected",  label: "נדחה" },
];

const availLabel = (v: string) => v === "full" ? "מלאה" : "חלקית";

/* ─── Main Page ──────────────────────────────────────────── */
export default function DashboardPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading]       = useState(true);
  const [filter, setFilter]         = useState("all");
  const [selected, setSelected]     = useState<Candidate | null>(null);

  useEffect(() => {
    supabase
      .from("candidates")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data) setCandidates(data);
        setLoading(false);
      });
  }, []);

  const handleStatusChange = (id: string, status: string) => {
    setCandidates(prev => prev.map(c => c.id === id ? { ...c, status } : c));
    setSelected(prev => prev?.id === id ? { ...prev, status } : prev);
  };

  const filtered = filter === "all" ? candidates : candidates.filter(c => c.status === filter);

  const kpis = [
    {
      label: "סה״כ מועמדים",
      value: candidates.length,
      color: "bg-blue-50 border-blue-200",
      text: "text-blue-700",
      icon: (
        <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-5-3.87M9 20H4v-2a4 4 0 015-3.87m6-4.13a4 4 0 10-8 0 4 4 0 008 0zm6 0a4 4 0 10-8 0 4 4 0 008 0z" />
        </svg>
      ),
    },
    {
      label: "ממתינים לטיפול",
      value: candidates.filter(c => c.status === "new").length,
      color: "bg-amber-50 border-amber-200",
      text: "text-amber-700",
      icon: (
        <svg className="w-6 h-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: "בתהליך ראיון",
      value: candidates.filter(c => c.status === "in_review").length,
      color: "bg-orange-50 border-orange-200",
      text: "text-orange-700",
      icon: (
        <svg className="w-6 h-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
    },
    {
      label: "התקבלו",
      value: candidates.filter(c => c.status === "approved").length,
      color: "bg-green-50 border-green-200",
      text: "text-green-700",
      icon: (
        <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">

      <Navbar />

      <div className="px-8 py-8 max-w-7xl mx-auto">

        {/* ── Header ── */}
        <h1 className="text-2xl font-bold text-gray-900 mb-6">דשבורד HR</h1>

        {/* ── KPI Cards ── */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {kpis.map(({ label, value, color, text, icon }) => (
            <div key={label} className={`rounded-2xl border p-5 flex items-center justify-between ${color}`}>
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">{label}</p>
                <p className={`text-3xl font-bold ${text}`}>
                  {loading ? "—" : value}
                </p>
              </div>
              <div className="opacity-80">{icon}</div>
            </div>
          ))}
        </div>

        {/* ── Filter Tabs ── */}
        <div className="flex gap-2 mb-4">
          {FILTERS.map(({ value, label }) => {
            const count = value === "all"
              ? candidates.length
              : candidates.filter(c => c.status === value).length;
            const active = filter === value;
            return (
              <button key={value} onClick={() => setFilter(value)}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  active ? "bg-blue-600 text-white" : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                }`}>
                {label}
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                  active ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-500"
                }`}>{count}</span>
              </button>
            );
          })}
        </div>

        {/* ── Table ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-48 text-gray-400 text-sm">טוען...</div>
          ) : filtered.length === 0 ? (
            <div className="flex items-center justify-center h-48 text-gray-400 text-sm">אין מועמדים</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {["שם מלא", "מייל", "תחום תואר", "מוסד", "זמינות", "סטטוס", "פעולות"].map(h => (
                    <th key={h} className="text-right text-xs font-semibold text-gray-500 px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(c => {
                  const s = STATUS_MAP[c.status] ?? STATUS_MAP.new;
                  return (
                    <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors last:border-0">
                      <td className="px-4 py-3 font-medium text-gray-800">{c.first_name} {c.last_name}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs" dir="ltr">{c.email}</td>
                      <td className="px-4 py-3 text-gray-600">{c.degree_field}</td>
                      <td className="px-4 py-3 text-gray-600 text-xs">{c.institution}</td>
                      <td className="px-4 py-3 text-gray-600">{availLabel(c.availability)}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${s.badge}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                          {s.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => setSelected(c)}
                          className="text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors">
                          צפה בפרטים
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* ── Candidate Drawer ── */}
      {selected && (
        <CandidateDrawer
          candidate={selected}
          onClose={() => setSelected(null)}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
}

/* ─── Drawer ─────────────────────────────────────────────── */
function CandidateDrawer({ candidate, onClose, onStatusChange }: {
  candidate: Candidate;
  onClose: () => void;
  onStatusChange: (id: string, status: string) => void;
}) {
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const s = STATUS_MAP[candidate.status] ?? STATUS_MAP.pending;

  const updateStatus = async (status: string) => {
    setActionLoading(status);
    const { error } = await supabase.from("candidates").update({ status }).eq("id", candidate.id);
    if (!error) onStatusChange(candidate.id, status);
    setActionLoading(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/40" onClick={onClose} />
      <div className="w-full max-w-md bg-white shadow-2xl flex flex-col overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-800">{candidate.first_name} {candidate.last_name}</h2>
            <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-0.5 rounded-full mt-1 ${s.badge}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
              {s.label}
            </span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition p-1">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 px-6 py-5 space-y-5 text-sm">
          <DrawerSection title="פרטים אישיים">
            <DrawerRow label="מייל" value={candidate.email} ltr />
            <DrawerRow label="טלפון" value={candidate.phone ?? "—"} ltr />
          </DrawerSection>
          <DrawerSection title="פרטים אקדמיים">
            <DrawerRow label="תחום תואר" value={candidate.degree_field} />
            <DrawerRow label="מוסד לימודים" value={candidate.institution} />
          </DrawerSection>
          <DrawerSection title="זמינות וניסיון">
            <DrawerRow label="היקף משרה" value={candidate.availability === "full" ? "משרה מלאה" : "משרה חלקית"} />
            <DrawerRow label="התנדבות" value={candidate.volunteering ? "כן" : "לא"} />
            {candidate.ai_experience && (
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">ניסיון ב-AI</p>
                <p className="text-gray-700 bg-gray-50 rounded-lg p-3 leading-relaxed">{candidate.ai_experience}</p>
              </div>
            )}
          </DrawerSection>
          <DrawerSection title="מסמכים">
            <a href={candidate.cv_url} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              קורות חיים
            </a>
            {candidate.transcript_url && (
              <a href={candidate.transcript_url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                גיליון ציונים
              </a>
            )}
          </DrawerSection>
          <p className="text-xs text-gray-400">הוגש ב-{new Date(candidate.created_at).toLocaleDateString("he-IL")}</p>
        </div>

        {/* Actions */}
        <div className="px-6 py-4 border-t border-gray-100 grid grid-cols-3 gap-2">
          {[
            { status: "approved",  label: "אשר",       color: "bg-green-600 hover:bg-green-700" },
            { status: "in_review", label: "זמן ראיון", color: "bg-orange-500 hover:bg-orange-600" },
            { status: "rejected",  label: "דחה",       color: "bg-red-500 hover:bg-red-600" },
          ].map(({ status, label, color }) => (
            <button key={status} onClick={() => updateStatus(status)}
              disabled={candidate.status === status || !!actionLoading}
              className={`${color} disabled:opacity-40 text-white text-xs font-semibold py-2 rounded-lg transition-colors`}>
              {actionLoading === status ? "..." : label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function DrawerSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{title}</h3>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function DrawerRow({ label, value, ltr }: { label: string; value: string; ltr?: boolean }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium text-gray-800" dir={ltr ? "ltr" : undefined}>{value}</span>
    </div>
  );
}
