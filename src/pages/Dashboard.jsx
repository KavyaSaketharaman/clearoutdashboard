import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { RefreshCw } from "lucide-react";

import UserInfoCard from "@/components/dashboard/UserInfoCard";
import CreditUsageChart from "@/components/dashboard/CreditUsageChart";
import GettingStarted from "@/components/dashboard/GettingStarted";
import RecommendedForYou from "@/components/dashboard/RecommendedForYou";
import ActionInProgress from "@/components/dashboard/ActionInProgress";
import RecentActivities from "@/components/dashboard/RecentActivities";
import DidYouKnow from "@/components/dashboard/DidYouKnow";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);

  // ── Get token from Redux (set after login) ─────────────────────────────────
  const token = useSelector((state) => state.user.userInfo?.token);

  function fetchData() {
    setLoading(true);
    setError(null);
    axios.get(`${API_BASE_URL}/dashboard`, {
      params: {
        show_widgets: "all",
        date_range:   "ps_last_7_days_including_today",
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
     .then(({ data }) => {
    console.log("DASHBOARD RESPONSE:", JSON.stringify(data));  // 👈 add this line
    if (data?.code && data?.message) {
      setError(data.message);
      return;
    }
    setDashboard(data);
  })
      .catch((err) => {
        const message =
          err.response?.data?.message ??
          err.response?.data?.error   ??
          err.message                 ??
          "Something went wrong.";
        setError(message);
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => { fetchData(); }, []);

  // ── Destructure sections ───────────────────────────────────────────────────
  const welcome         = dashboard?.welcome;
  const stats           = dashboard?.overall;
  const quicklinks      = dashboard?.quicklinks      ?? [];
  const recommendations = dashboard?.recommendation  ?? [];
  const inprogress      = dashboard?.inprogress      ?? {};
  const activities      = dashboard?.recentactivities ?? [];
  const didYouKnow      = dashboard?.didyouknow      ?? [];

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-400 font-medium">Loading dashboard…</p>
      </div>
    </div>
  );

  // ── Error ──────────────────────────────────────────────────────────────────
  if (error) return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-center">
        <p className="text-red-500 font-semibold">Failed to load dashboard</p>
        <p className="text-sm text-gray-400">{error}</p>
        <button
          onClick={fetchData}
          className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-md"
        >
          <RefreshCw className="w-4 h-4" /> Retry
        </button>
      </div>
    </div>
  );

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-100">
      <main className="max-w-[1400px] mx-auto px-6 py-6 space-y-4">

        {/* Top Row */}
        <div className="grid grid-cols-12 gap-4">
          <UserInfoCard welcome={welcome} />
          <CreditUsageChart stats={stats} />
          <GettingStarted quicklinks={quicklinks} />
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-12 gap-4">
          <RecommendedForYou recommendations={recommendations} />
          <ActionInProgress inprogress={inprogress} />
          <RecentActivities activities={activities} />
          <DidYouKnow tips={didYouKnow} />
        </div>

      </main>
    </div>
  );
}