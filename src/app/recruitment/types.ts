export type Candidate = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  degree_field_id: number;
  institution_id: number;
  degree_fields: { name: string };
  institutions: { name: string };
  availability: string;
  ai_experience: string | null;
  volunteering: boolean;
  cv_url: string;
  transcript_url: string | null;
  status: string;
  created_at: string;
};

export type StatusKey = "pending" | "reviewing" | "approved" | "rejected";

export const STATUS_CONFIG: Record<StatusKey, { label: string; badge: string; dot: string }> = {
  pending:   { label: "חדש",     badge: "bg-blue-100 text-blue-700",    dot: "bg-blue-500" },
  reviewing: { label: "בבדיקה", badge: "bg-orange-100 text-orange-700", dot: "bg-orange-500" },
  approved:  { label: "מאושר",  badge: "bg-green-100 text-green-700",   dot: "bg-green-500" },
  rejected:  { label: "נדחה",   badge: "bg-red-100 text-red-700",       dot: "bg-red-500" },
};

export const FILTERS: { value: string; label: string }[] = [
  { value: "all",       label: "הכל" },
  { value: "pending",   label: "חדש" },
  { value: "reviewing", label: "בבדיקה" },
  { value: "approved",  label: "מאושר" },
  { value: "rejected",  label: "נדחה" },
];
