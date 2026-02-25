import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/userSlice";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";

export default function Login() {
  const navigate              = useNavigate();
  const dispatch              = useDispatch();
  const [email,    setEmail]  = useState("");
  const [password, setPass]   = useState("");
  const [showPass, setShow]   = useState(false);
  const [loading,  setLoad]   = useState(false);
  const [error,    setError]  = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoad(true);

    // ── API call goes here later ──────────────────────────
    // const res = await axios.post("/api/auth/login", { email, password });
    // dispatch(setUser(res.data.user));
    // ─────────────────────────────────────────────────────

    // Simulated login for now
    setTimeout(() => {
      dispatch(setUser({ email }));
      setLoad(false);
      navigate("/dashboard");
    }, 1200);
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* ── Left branding panel ── */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#1a1a1a] relative overflow-hidden flex-col justify-between p-12">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `linear-gradient(#f97316 1px, transparent 1px),
                              linear-gradient(90deg, #f97316 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-orange-500 rounded-full opacity-10 blur-3xl" />

        <div className="relative flex items-center gap-2">
          <div className="w-9 h-9 bg-orange-500 rounded-lg flex items-center justify-center shadow-lg shadow-orange-500/30">
            <span className="text-white text-base font-extrabold">C</span>
          </div>
          <span className="text-white font-extrabold text-xl tracking-tight">
            clear<span className="text-orange-400">out</span>
          </span>
        </div>

        <div className="relative space-y-6">
          <div className="space-y-2">
            <p className="text-orange-400 text-sm font-semibold tracking-widest uppercase">
              Email Intelligence Platform
            </p>
            <h1 className="text-white text-4xl font-bold leading-tight">
              Verify smarter.<br />
              Send with<br />
              <span className="text-orange-400">confidence.</span>
            </h1>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
            Join thousands of teams who trust Clearout to keep their email lists
            clean and their deliverability high.
          </p>
          <div className="flex gap-8 pt-4">
            {[
              { value: "99.5%", label: "Accuracy" },
              { value: "7B+",   label: "Emails Verified" },
              { value: "50ms",  label: "Avg Response" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-white text-xl font-bold">{s.value}</p>
                <p className="text-gray-500 text-xs">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-gray-600 text-xs">© 2026 Clearout. All rights reserved.</p>
      </div>

      {/* ── Right form panel ── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm space-y-8">

          <div className="flex items-center gap-2 lg:hidden">
            <div className="w-8 h-8 bg-orange-500 rounded-md flex items-center justify-center">
              <span className="text-white text-sm font-extrabold">C</span>
            </div>
            <span className="font-extrabold text-lg tracking-tight">
              clear<span className="text-orange-500">out</span>
            </span>
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-gray-900">Welcome back</h2>
            <p className="text-sm text-gray-500">Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg bg-white
                             focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500
                             transition-all placeholder:text-gray-300"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPass(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 text-sm border border-gray-200 rounded-lg bg-white
                             focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500
                             transition-all placeholder:text-gray-300"
                />
                <button
                  type="button"
                  onClick={() => setShow(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600
                         disabled:opacity-60 disabled:cursor-not-allowed
                         text-white text-sm font-semibold py-2.5 rounded-lg mt-2
                         transition-all shadow-md shadow-orange-500/25"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in…
                </>
              ) : (
                <>Sign in <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-gray-50 px-3 text-xs text-gray-400">Protected by Clearout Security</span>
            </div>
          </div>

          <p className="text-center text-xs text-gray-400">
            Don't have an account?{" "}
            <a href="#" className="text-orange-500 font-medium hover:underline">Start free trial</a>
          </p>
        </div>
      </div>
    </div>
  );
}