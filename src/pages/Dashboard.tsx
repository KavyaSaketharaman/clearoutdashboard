import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useAppSelector } from "@/redux/hooks";
import { RefreshCw } from "lucide-react";
import type { DashboardData } from "@/types";

import UserInfoCard       from "@/components/dashboard/UserInfoCard";
import CreditUsageChart   from "@/components/dashboard/CreditUsageChart";
import GettingStarted     from "@/components/dashboard/GettingStarted";
import RecommendedForYou  from "@/components/dashboard/RecommendedForYou";
import ActionInProgress   from "@/components/dashboard/ActionInProgress";
import RecentActivities   from "@/components/dashboard/RecentActivities";
import DidYouKnow         from "@/components/dashboard/DidYouKnow";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

export default function Dashboard() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState<string | null>(null);

  const token = useAppSelector((state) => state.user.userInfo?.token);

  const fetchData = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    setError(null);

    try {
      const { data } = await axios.get<{
        status?: string;
        message?: string;
        data?: DashboardData;
      }>(`${API_BASE_URL}/dashboard`, {
        params: {
          show_widgets: "all",
          date_range:   "ps_last_7_days_including_today",
        },
        headers: {
          Authorization:      `Bearer ${token}`,
          "X-Co-App-Version": "32.2.11",
        },
      });

      if (data?.status === "failed" || data?.status === "error") {
        setError(data.message ?? "Failed to load dashboard.");
        return;
      }

      setDashboard((data.data ?? data) as DashboardData);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string; error?: string } }; message?: string };
      setError(
        e.response?.data?.message ??
        e.response?.data?.error   ??
        e.message                 ??
        "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  const welcome         = dashboard?.welcome;
  const stats           = dashboard?.overall;
  const quicklinks      = dashboard?.quicklinks      ?? [];
  const recommendations = dashboard?.recommendation  ?? [];
  const inprogress      = dashboard?.inprogress      ?? {};
  const activities      = dashboard?.recentactivities ?? [];
  const didYouKnow      = dashboard?.didyouknow      ?? [];

  if (loading) return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-400 font-medium">Loading dashboard…</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-center">
        <p className="text-red-500 font-semibold">Failed to load dashboard</p>
        <p className="text-sm text-gray-400">{error}</p>
        <button
          onClick={() => void fetchData()}
          className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-md"
        >
          <RefreshCw className="w-4 h-4" /> Retry
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="max-w-[1400px] mx-auto px-6 py-6 space-y-4">
        <div className="grid grid-cols-12 gap-4">
          <UserInfoCard      welcome={welcome} />
          <CreditUsageChart  stats={stats} />
          <GettingStarted    quicklinks={quicklinks} />
        </div>
        <div className="grid grid-cols-12 gap-4">
          <RecommendedForYou recommendations={recommendations} />
          <ActionInProgress  inprogress={inprogress} />
          <RecentActivities  activities={activities} />
          <DidYouKnow        tips={didYouKnow} />
        </div>
      </main>
    </div>
  );
}