// ── Prospect types ────────────────────────────────────────────────────────────

export interface ProspectContact {
  email?: string;
  first_name?: string;
  last_name?: string;
  company?: string;
  title?: string;
  linkedin_url?: string;
  phone?: string;
}

export interface ProspectJob {
  id: string;
  name: string;
  status: string;
  total: number;
  processed: number;
  created_on: string;
}

export interface ProspectFilter {
  industry?: string[];
  company_size?: string[];
  location?: string[];
  title?: string[];
}