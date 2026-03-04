// ── Email Finder types ────────────────────────────────────────────────────────

export type EmailFinderStatus = "found" | "not_found" | "pending";

export interface EmailFinderResult {
  email?: string;
  status: EmailFinderStatus;
  confidence?: string;
  first_name?: string;
  last_name?: string;
  domain?: string;
}

export interface EmailFinderJob {
  id: string;
  name: string;
  status: string;
  total: number;
  processed: number;
  created_on: string;
  stats?: {
    found: number;
    not_found: number;
  };
}