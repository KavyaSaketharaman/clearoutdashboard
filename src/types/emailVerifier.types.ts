// ── Email Verifier types ──────────────────────────────────────────────────────

export type VerificationStatus =
  | "valid"
  | "invalid"
  | "catch_all"
  | "unknown"
  | "disposable"
  | "spamtrap";

export interface EmailVerifierResult {
  email: string;
  status: VerificationStatus;
  sub_status?: string;
  free?: boolean;
  disposable?: boolean;
  role?: boolean;
  mx_found?: boolean;
  mx_record?: string;
}

export interface EmailVerifierJob {
  id: string;
  name: string;
  status: string;
  total: number;
  processed: number;
  created_on: string;
  stats?: {
    valid: number;
    invalid: number;
    catch_all: number;
    unknown: number;
    disposable: number;
  };
}