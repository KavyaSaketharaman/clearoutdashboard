import { useState, useTransition } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/userSlice";
import { GoogleReCaptchaProvider, useGoogleReCaptcha } from "react-google-recaptcha-v3";
import axios from "axios";
import { Eye, EyeOff, User, Lock, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
const API_BASE_URL       = import.meta.env.VITE_API_BASE_URL;

function LoginForm() {
  const navigate               = useNavigate();
  const dispatch               = useDispatch();
  const [showPass,  setShow]   = useState(false);
  const [error,     setError]  = useState(null);
  const [isPending, startTransition] = useTransition();
  const { executeRecaptcha }   = useGoogleReCaptcha();

  function handleSubmit(e) {
    e.preventDefault();
    e.stopPropagation();
    console.log("✅ handleSubmit called");

    const username = e.target.username.value;
    const password = e.target.password.value;

    console.log("username:", username);
    console.log("password:", password);

    setError(null);

    if (!username || !password) {
      setError("Please fill in all fields.");
      return;
    }

    startTransition(async () => {
      try {
        const captchaToken = executeRecaptcha
          ? await executeRecaptcha("login")
          : "test_token";

        console.log("captchaToken length:", captchaToken?.length, "token:", captchaToken);

        const { data } = await axios.post(`${API_BASE_URL}/user/login`, {
          username,
          password,
          captchaToken,
        });

        console.log("API response:", data);

        if (data.status === "failed" || data.status === "error" || !data.data) {
          const errMsg =
            (typeof data.error === "object" ? data.error?.message : data.error) ??
            data.message ??
            "Invalid credentials. Please try again.";
          setError(errMsg);
          return;
        }

        dispatch(setUser(data.data));
        navigate("/dashboard");

      } catch (err) {
        console.log("catch err:", err);
        const message =
          err.response?.data?.message ??
          err.response?.data?.error   ??
          err.message                 ??
          "Login failed. Please try again.";
        setError(message);
      }
    });
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
              { value: "99.5%", label: "Accuracy"        },
              { value: "7B+",   label: "Emails Verified"  },
              { value: "50ms",  label: "Avg Response"     },
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
        <div className="w-full max-w-sm space-y-6">

          <div className="flex items-center gap-2 lg:hidden">
            <div className="w-8 h-8 bg-orange-500 rounded-md flex items-center justify-center">
              <span className="text-white text-sm font-extrabold">C</span>
            </div>
            <span className="font-extrabold text-lg tracking-tight">
              clear<span className="text-orange-500">out</span>
            </span>
          </div>

          <Card className="border-0 shadow-none bg-transparent">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="text-2xl font-bold text-gray-900">Welcome back</CardTitle>
              <CardDescription>Sign in to your account to continue</CardDescription>
            </CardHeader>

            <CardContent className="px-0 space-y-4">

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">

                <div className="space-y-1.5">
                  <Label htmlFor="username">Username</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="username"
                      name="username"
                      type="text"
                      placeholder="Enter your username"
                      className="pl-10 focus-visible:ring-orange-500"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="password"
                      name="password"
                      type={showPass ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-10 pr-10 focus-visible:ring-orange-500"
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

                <Button
                  type="submit"
                  disabled={isPending}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold shadow-md shadow-orange-500/25"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Signing in…
                    </>
                  ) : (
                    <>
                      Sign in
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>

              </form>

              <p className="text-[11px] text-gray-400 text-center">
                Protected by reCAPTCHA.{" "}
                <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-600">Privacy</a>
                {" & "}
                <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-600">Terms</a>
              </p>

            </CardContent>
          </Card>

          <p className="text-center text-xs text-gray-400">
            Don't have an account?{" "}
            <a href="#" className="text-orange-500 font-medium hover:underline">Start free trial</a>
          </p>

        </div>
      </div>
    </div>
  );
}

export default function Login() {
  return (
    <GoogleReCaptchaProvider reCaptchaKey={RECAPTCHA_SITE_KEY}>
      <LoginForm />
    </GoogleReCaptchaProvider>
  );
}