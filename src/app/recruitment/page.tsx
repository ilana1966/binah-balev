"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Candidate, StatusKey, STATUS_CONFIG, FILTERS } from "./types";
import CandidateDrawer from "./CandidateDrawer";

const availabilityLabel = (v: string) => (v === "full" ? "מלאה" : "חלקית");

export default function RecruitmentPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCandidates = async () => {
      const { data, error } = await supabase
        .from("candidates")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data) setCandidates(data);
      setLoading(false);
    };
    fetchCandidates();
  }, []);

  const handleStatusChange = (id: string, status: StatusKey) => {
    setCandidates((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status } : c))
    );
    setSelected((prev) => (prev?.id === id ? { ...prev, status } : prev));
  };

  const filtered = filter === "all" ? candidates : candidates.filter((c) => c.status === filter);

  const counts = FILTERS.slice(1).reduce<Record<string, number>>((acc, f) => {
    acc[f.value] = candidates.filter((c) => c.status === f.value).length;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">ניהול מועמדים</h1>
            <p className="text-sm text-gray-500 mt-0.5">{candidates.length} מועמדים בסך הכל</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mt-4">
          {FILTERS.map(({ value, label }) => {
            const active = filter === value;
            const count = value === "all" ? candidates.length : counts[value] ?? 0;
            return (
              <button
                key={value}
                onClick={() => setFilter(value)}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  active
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {label}
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${active ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-500"}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Table */}
      <div className="px-8 py-6">
        {loading ? (
          <div className="flex items-center justify-center h-64 text-gray-400 text-sm">טוען...</div>
        ) : filtered.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
            אין מועמדים {filter !== "all" && `בסטטוס "${FILTERS.find((f) => f.value === filter)?.label}"`}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  {["שם מלא", "מייל", "טלפון", "תחום תואר", "מוסד", "זמינות", "סטטוס"].map((h) => (
                    <th key={h} className="text-right text-xs font-semibold text-gray-500 px-4 py-3">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => {
                  const statusCfg = STATUS_CONFIG[c.status as StatusKey] ?? STATUS_CONFIG.pending;
                  return (
                    <tr
                      key={c.id}
                      onClick={() => setSelected(c)}
                      className="border-b border-gray-50 hover:bg-blue-50 cursor-pointer transition-colors last:border-0"
                    >
                      <td className="px-4 py-3 font-medium text-gray-800">
                        {c.first_name} {c.last_name}
                      </td>
                      <td className="px-4 py-3 text-gray-500" dir="ltr">{c.email}</td>
                      <td className="px-4 py-3 text-gray-500" dir="ltr">{c.phone ?? "—"}</td>
                      <td className="px-4 py-3 text-gray-600">{c.degree_field}</td>
                      <td className="px-4 py-3 text-gray-600">{c.institution}</td>
                      <td className="px-4 py-3 text-gray-600">{availabilityLabel(c.availability)}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${statusCfg.badge}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />
                          {statusCfg.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Drawer */}
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
