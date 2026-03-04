// ── User / auth / credits types ───────────────────────────────────────────────

export interface Credits {
  available: number;
  subs: number;
  recur: number | null;
  available_daily_limit: number | null;
  reset_daily_limit_date: string | null;
  total: number;
}

export interface WelcomeData {
  user_id: string;
  org_id: string;
  name: string;
  email: string;
  email_verified: boolean;
  credits: Credits;
  status: string;
  account_status: string;
  recur?: {
    name: string;
    type: string;
    expiry: string | null;
    credits: number | null;
    recur_credit_reset_date?: string | null;
  };
  subscription?: Array<{ product_name: string }>;
  org_details?: {
    name: string;
    usedMemberSeat: number;
    totalMemberSeat: number;
  };
  address?: {
    company_name?: string;
    line1?: string;
    line2?: string;
    postal_code?: string;
    country?: Record<string, unknown>;
    state?: string;
  };
}