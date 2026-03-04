// ── API request / response types ─────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  status: "success" | "failed" | "error";
  message?: string;
  data?: T;
}

export interface ApiError {
  message?: string;
  error?: string;
}