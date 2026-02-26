import { useActionState, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/userSlice";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function Login() {
  const navigate     = useNavigate();
  const dispatch     = useDispatch();
  const [showPass, setShow] = useState(false);

  // ── useActionState replaces all useState for form handling ────────────────
  async function loginAction(prevState, formData) {
    const email    = formData.get("email");
    const password = formData.get("password");

    if (!email || !password) {
      return { error: "Please fill in all fields." };
    }

    // Simulate async API call — replace with real call later
    // const res = await axios.post("/api/auth/login", { email, password });
    // dispatch(setUser(res.data.user));
    await new Promise((r) => setTimeout(r, 1200));

    dispatch(setUser({ email }));
    navigate("/dashboard");
    return { error: null };
  }

  const [state, formAction, isPending] = useActionState(loginAction, { error: null });

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

        {/* Logo */}
        <div className="relative flex items-center gap-2">
          <div className="w-9 h-9 bg-orange-500 rounded-lg flex items-center justify-center shadow-lg shadow-orange-500/30">
            <span className="text-white text-base font-extrabold">C</span>
          </div>
          <span className="text-white font-extrabold text-xl tracking-tight">
            clear<span className="text-orange-400">out</span>
          </span>
        </div>

        

        
      </div>

      {/* ── Right form panel ── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm space-y-6">

          {/* Mobile logo */}
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

              {/* Error alert */}
              {state.error && (
                <Alert variant="destructive">
                  <AlertDescription>{state.error}</AlertDescription>
                </Alert>
              )}

              <form action={formAction} className="space-y-4">

                {/* Email */}
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      className="pl-10 focus-visible:ring-orange-500"
                    />
                  </div>
                </div>

                {/* Password */}
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

                {/* Submit */}
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
            </CardContent>
          </Card>

          

        </div>
      </div>
    </div>
  );
}