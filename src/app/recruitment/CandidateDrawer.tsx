"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Candidate, StatusKey, STATUS_CONFIG } from "./types";

type Props = {
  candidate: Candidate;
  onClose: () => void;
  onStatusChange: (id: string, status: StatusKey) => void;
};

const availabilityLabel = (v: string) => (v === "full" ? "משרה מלאה" : "משרה חלקית");

export default function CandidateDrawer({ candidate, onClose, onStatusChange }: Props) {
  const [loading, setLoading] = useState<string | null>(null);

  const updateStatus = async (status: StatusKey) => {
    setLoading(status);
    const { error } = await supabase
      .from("candidates")
      .update({ status })
      .eq("id", candidate.id);
    if (!error) onStatusChange(candidate.id, status);
    setLoading(null);
  };

  const statusCfg = STATUS_CONFIG[candidate.status as StatusKey] ?? STATUS_CONFIG.pending;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Overlay */}
      <div className="flex-1 bg-black/40" onClick={onClose} />

      {/* Panel — slides in from left (end in RTL) */}
      <div className="w-full max-w-md bg-white shadow-2xl flex flex-col overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-800">
              {candidate.first_name} {candidate.last_name}
            </h2>
            <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-0.5 rounded-full mt-1 ${statusCfg.badge}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />
              {statusCfg.label}
            </span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition p-1">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 px-6 py-5 space-y-5">
          <Section title="פרטים אישיים">
            <Row label="מייל" value={candidate.email} ltr />
            <Row label="טלפון" value={candidate.phone ?? "—"} ltr />
          </Section>

          <Section title="פרטים אקדמיים">
            <Row label="תחום תואר" value={candidate.degree_fields.name} />
            <Row label="מוסד לימודים" value={candidate.institutions.name} />
          </Section>

          <Section title="זמינות וניסיון">
            <Row label="היקף משרה" value={availabilityLabel(candidate.availability)} />
            <Row label="התנדבות" value={candidate.volunteering ? "כן" : "לא"} />
            {candidate.ai_experience && (
              <div>
                <span className="text-xs font-medium text-gray-500 block mb-1">ניסיון ב-AI</span>
                <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3 leading-relaxed">
                  {candidate.ai_experience}
                </p>
              </div>
            )}
          </Section>

          <Section title="מסמכים">
            <a href={candidate.cv_url} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 transition font-medium">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              </svg>
              קורות חיים
            </a>
            {candidate.transcript_url && (
              <a href={candidate.transcript_url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 transition font-medium">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                </svg>
                גיליון ציונים
              </a>
            )}
          </Section>

          <div className="text-xs text-gray-400">
            הוגש ב-{new Date(candidate.created_at).toLocaleDateString("he-IL")}
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 py-4 border-t border-gray-100 grid grid-cols-3 gap-2">
          <ActionBtn
            label="אשר"
            onClick={() => updateStatus("approved")}
            loading={loading === "approved"}
            color="bg-green-600 hover:bg-green-700"
            disabled={candidate.status === "approved"}
          />
          <ActionBtn
            label="זמן ראיון"
            onClick={() => updateStatus("reviewing")}
            loading={loading === "reviewing"}
            color="bg-orange-500 hover:bg-orange-600"
            disabled={candidate.status === "reviewing"}
          />
          <ActionBtn
            label="דחה"
            onClick={() => updateStatus("rejected")}
            loading={loading === "rejected"}
            color="bg-red-500 hover:bg-red-600"
            disabled={candidate.status === "rejected"}
          />
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{title}</h3>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function Row({ label, value, ltr }: { label: string; value: string; ltr?: boolean }) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-gray-500">{label}</span>
      <span className={`font-medium text-gray-800 ${ltr ? "dir-ltr" : ""}`} dir={ltr ? "ltr" : undefined}>{value}</span>
    </div>
  );
}

function ActionBtn({ label, onClick, loading, color, disabled }: {
  label: string; onClick: () => void; loading: boolean; color: string; disabled: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`${color} disabled:opacity-40 text-white text-xs font-semibold py-2 rounded-lg transition-colors duration-200`}
    >
      {loading ? "..." : label}
    </button>
  );
}
