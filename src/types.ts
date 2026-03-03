// ── Dashboard API response types ──────────────────────────────────────────────

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
  recur?: { name: string; type: string; expiry: string | null; credits: number | null };
  subscription?: Array<{ product_name: string }>;
  org_details?: {
    name: string;
    usedMemberSeat: number;
    totalMemberSeat: number;
  };
  address?: {
    company_name?: string;
  };
}

export interface QuickLink {
  title: string;
  body: string;
  font_awesome: string;
}

export interface Recommendation {
  title: string;
  body: string;
  icon_url: string;
}

export interface InProgressItem {
  name?: string;
  id?: string;
}

export interface InProgressService {
  filters: { status: string; limit: number };
  data: InProgressItem[];
}

export interface InProgress {
  email_verifier?: InProgressService;
  email_finder?: InProgressService;
  prospect?: InProgressService;
  reverse_lookup?: InProgressService;
}

export interface ActivityStats {
  valid?: number;
  invalid?: number;
  catch_all?: number;
  unknown?: number;
}

export interface Activity {
  name: string;
  service_type: string;
  request_status: string;
  created_on: string;
  member_name: string;
  stats?: ActivityStats;
}

export interface DidYouKnowTip {
  title: string;
  body: string;
  url: string;
}

export interface StatEntry {
  date: string;
  ev_billable: number;
  ef_billable: number;
  prospect_billable: number;
  js_widget_billable: number;
}

export interface DashboardData {
  welcome?: WelcomeData;
  overall?: { user_stats?: Array<{ stats: StatEntry[] }> };
  quicklinks?: QuickLink[];
  recommendation?: Recommendation[];
  inprogress?: InProgress;
  recentactivities?: Activity[];
  didyouknow?: DidYouKnowTip[];
}