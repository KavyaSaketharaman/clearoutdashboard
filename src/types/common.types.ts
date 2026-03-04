// ── Common/shared types used across multiple pages ────────────────────────────

export type RequestStatus = "pending" | "processing" | "completed" | "failed";

export type ServiceType =
  | "email_verifier"
  | "email_finder"
  | "prospect"
  | "reverse_lookup";

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
}

export interface SelectOption {
  label: string;
  value: string;
}