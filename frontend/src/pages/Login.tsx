//=============================1st EDIT=============================
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import authService from "@/services/authService";

/** -----------------------------------------------------------
 *  Background glow blobs (same vibe/colors as previous left side)
 *  ---------------------------------------------------------*/
function GlowBlob({ className = "" }: { className?: string }) {
  return (
    <div className={"absolute rounded-full blur-3xl opacity-30 " + className} />
  );
}

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Call the backend API
      const response = await authService.login({ email, password });

      // Optional: Store remember me preference
      if (rememberMe) {
        localStorage.setItem("remember", "true");
      }

      // Show success message
      toast({
        title: "Login Successful",
        description: response.message || "Welcome to Accendo (SetuCS) Platform",
      });

      // Navigate to dashboard
      navigate("/dashboard", { replace: true });
    } catch (error: any) {
      // Handle different error types
      let errorMessage = "An error occurred. Please try again.";

      if (error.response) {
        // Server responded with error
        switch (error.response.status) {
          case 400:
            errorMessage =
              error.response.data.error || "Email and password are required";
            break;
          case 401:
            errorMessage = "Invalid email or password";
            break;
          case 403:
            errorMessage =
              error.response.data.error || "Account is deactivated";
            break;
          case 423:
            errorMessage = error.response.data.error || "Account is locked";
            break;
          case 500:
            errorMessage = "Server error. Please try again later.";
            break;
          default:
            errorMessage = error.response.data.error || "Login failed";
        }
      } else if (error.request) {
        // Request made but no response
        errorMessage =
          "Cannot connect to server. Please check your connection.";
      }

      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSSOLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      toast({
        title: "SSO Login",
        description: "Redirecting to Microsoft SSO...",
      });
      setTimeout(() => {
        localStorage.setItem("auth", "true");
        navigate("/dashboard", { replace: true });
        setIsLoading(false);
      }, 1400);
    }, 600);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-[#12192f] overflow-hidden">
      {/* Moving gradient blobs (kept from your left side) */}
      <GlowBlob className="w-72 h-72 bg-cyan-500 top-12 -left-10 animate-[float_9s_ease-in-out_infinite]" />
      <GlowBlob className="w-96 h-96 bg-indigo-500 -bottom-20 -right-10 animate-[float_11s_ease-in-out_infinite]" />
      <GlowBlob className="w-80 h-80 bg-blue-500 bottom-20 left-1/4 animate-[float_13s_ease-in-out_infinite]" />

      {/* Decorative radial highlight */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute -top-24 left-1/3 h-96 w-96 rounded-full from-cyan-400/20 to-transparent bg-radial" />
      </div>

      {/* Brand (top-left) */}
      <div className="absolute left-6 top-6 flex items-center gap-3">
        <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white font-semibold">
          A
        </div>
        <div className="text-slate-100 font-semibold text-lg">Accendo</div>
      </div>

      {/* Powered by (top-right) */}
      <div className="absolute top-6 right-6 text-sm text-slate-300">
        Powered by <span className="text-slate-100">SetuCS</span>
      </div>

      {/* Centered login card */}
      <div className="w-full max-w-md px-6">
        <div className="mb-8 flex items-center gap-3 justify-center">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white font-semibold">
            A
          </div>
          <div>
            <div className="text-xl font-semibold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-cyan-300">
              Accendo
            </div>
            <div className="text-xs text-slate-300/80 text-center sm:text-left">
              Unified knowledge & search
            </div>
          </div>
        </div>

        <Card className="border-slate-800/80 bg-[#0E1219] text-slate-100 shadow-[0_8px_40px_rgba(2,6,23,0.6)]">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl font-semibold text-slate-100">
              Log in
            </CardTitle>
            <CardDescription className="text-slate-400">
              Use your work account to continue
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={handleSSOLogin}
              variant="outline"
              className="w-full rounded-xl border border-cyan-500/40 bg-slate-900/60 text-slate-100
              hover:bg-slate-900/80 hover:border-cyan-400/70
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/60
              shadow-[0_0_0_1px_rgba(34,211,238,0.15)]"
              disabled={isLoading}
            >
              <Building2 className="w-4 h-4 mr-2" />
              Login with Microsoft SSO
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-800" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#0E1219] px-2 text-slate-500">
                  Or continue with
                </span>
              </div>
            </div>

            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-300">
                  Email address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  required
                  className="bg-slate-900/40 border-slate-700/60 text-slate-100 placeholder:text-slate-500 focus:border-cyan-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-300">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="bg-slate-900/40 border-slate-700/60 text-slate-100 placeholder:text-slate-500 focus:border-cyan-500"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 text-slate-400 hover:text-slate-200"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) =>
                      setRememberMe(checked === true)
                    }
                  />
                  <Label htmlFor="remember" className="text-sm text-slate-300">
                    Remember me
                  </Label>
                </div>
                <Link
                  to="/forgot-password"
                  className="text-sm text-cyan-300 hover:text-cyan-200"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-white"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </form>

            {/* Demo creds */}
            <div className="bg-slate-900/50 p-3 rounded-lg text-sm ring-1 ring-white/10">
              <p className="font-medium text-slate-200 mb-1">
                Demo Credentials
              </p>
              <p className="text-slate-400">Email: demo@dataanalytics.com</p>
              <p className="text-slate-400">Password: password123</p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center text-xs text-slate-300/80">
          By signing in, you agree to our{" "}
          <Link to="/terms" className="text-cyan-300 hover:text-cyan-200">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link to="/privacy" className="text-cyan-300 hover:text-cyan-200">
            Privacy Policy
          </Link>
        </div>
      </div>

      {/* Inline keyframes & radial bg utility (same as before) */}
      <style>{`
        @keyframes float {
          0%   { transform: translateY(0px) translateX(0px) scale(1); }
          50%  { transform: translateY(-16px) translateX(6px) scale(1.03); }
          100% { transform: translateY(0px) translateX(0px) scale(1); }
        }
        .bg-radial {
          background: radial-gradient(ellipse at center, rgba(56,189,248,0.16), transparent 60%);
        }
      `}</style>
    </div>
  );
};

export default Login;
