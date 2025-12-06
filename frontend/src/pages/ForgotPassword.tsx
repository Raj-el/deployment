// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import { ArrowLeft, Mail } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Label } from "@/components/ui/label";
// import { useToast } from "@/hooks/use-toast";

// const ForgotPassword = () => {
//   const [email, setEmail] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [isSubmitted, setIsSubmitted] = useState(false);
//   const { toast } = useToast();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);

//     // Mock password reset flow
//     setTimeout(() => {
//       setIsSubmitted(true);
//       toast({
//         title: "Reset Email Sent",
//         description: "Check your email for password reset instructions.",
//       });
//       setIsLoading(false);
//     }, 1500);
//   };

//   if (isSubmitted) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
//         <div className="w-full max-w-md space-y-6">
//           <div className="text-center space-y-4">
//             <div className="w-16 h-16 bg-green-500 rounded-full mx-auto flex items-center justify-center">
//               <Mail className="w-8 h-8 text-white" />
//             </div>
//             <div>
//               <h1 className="text-2xl font-bold text-gray-900">
//                 Check your email
//               </h1>
//               <p className="text-gray-600 mt-2">
//                 We've sent a password reset link to {email}
//               </p>
//             </div>
//           </div>

//           <Card className="shadow-xl border-0">
//             <CardContent className="p-6 space-y-4">
//               <p className="text-sm text-gray-600 text-center">
//                 Didn't receive the email? Check your spam folder or{" "}
//                 <button
//                   onClick={() => setIsSubmitted(false)}
//                   className="text-blue-600 hover:text-blue-500"
//                 >
//                   try again
//                 </button>
//               </p>

//               <Link to="/login">
//                 <Button variant="outline" className="w-full">
//                   <ArrowLeft className="w-4 h-4 mr-2" />
//                   Back to login
//                 </Button>
//               </Link>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
//       <div className="w-full max-w-md space-y-6">
//         <div className="text-center space-y-4">
//           <div className="w-16 h-16 bg-blue-600 rounded-lg mx-auto flex items-center justify-center">
//             <span className="text-white font-bold text-xl">DA</span>
//           </div>
//           <div>
//             <h1 className="text-2xl font-bold text-gray-900">
//               Reset your password
//             </h1>
//             <p className="text-gray-600 mt-2">
//               Enter your email address and we'll send you a link to reset your
//               password
//             </p>
//           </div>
//         </div>

//         <Card className="shadow-xl border-0">
//           <CardHeader>
//             <CardTitle className="text-xl text-center">
//               Forgot Password
//             </CardTitle>
//             <CardDescription className="text-center">
//               We'll send you a secure reset link
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div className="space-y-2">
//                 <Label htmlFor="reset-email">Email address</Label>
//                 <Input
//                   id="reset-email"
//                   type="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   placeholder="Enter your email address"
//                   required
//                 />
//               </div>

//               <Button type="submit" className="w-full" disabled={isLoading}>
//                 {isLoading ? "Sending..." : "Send reset link"}
//               </Button>
//             </form>
//           </CardContent>
//         </Card>

//         <div className="text-center">
//           <Link
//             to="/login"
//             className="text-sm text-blue-600 hover:text-blue-500 flex items-center justify-center"
//           >
//             <ArrowLeft className="w-4 h-4 mr-1" />
//             Back to login
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ForgotPassword;

//====================================ORIGNL========================

//-----------------------------------------1st DRAFT-----------------------------------------

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail, Sparkles } from "lucide-react";
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
import { useToast } from "@/hooks/use-toast";

/* ---------- shared bits from the login look ---------- */
function GlowBlob({ className = "" }: { className?: string }) {
  return (
    <div className={"absolute rounded-full blur-3xl opacity-30 " + className} />
  );
}

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Mock password reset flow
    setTimeout(() => {
      setIsSubmitted(true);
      toast({
        title: "Reset Email Sent",
        description: "Check your email for password reset instructions.",
      });
      setIsLoading(false);
    }, 1500);
  };

  /* ---------- Submitted (confirmation) view ---------- */
  if (isSubmitted) {
    return (
      <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
        {/* LEFT animated vignette (matches Login) */}
        <div className="relative hidden lg:flex items-center justify-center bg-[#12192f] overflow-hidden">
          <GlowBlob className="w-72 h-72 bg-cyan-500 top-12 -left-10 animate-[float_9s_ease-in-out_infinite]" />
          <GlowBlob className="w-96 h-96 bg-indigo-500 -bottom-20 -right-10 animate-[float_11s_ease-in-out_infinite]" />
          <GlowBlob className="w-80 h-80 bg-blue-500 bottom-20 left-1/4 animate-[float_13s_ease-in-out_infinite]" />

          <div className="absolute left-8 top-8 flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white font-semibold">
              A
            </div>
            <div className="text-slate-100 font-semibold text-lg">Accendo</div>
          </div>

          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(0,0,0,0)_0%,_rgba(0,0,0,0.25)_70%)]" />
        </div>

        {/* RIGHT panel */}
        <div className="relative flex items-center justify-center bg-[#0B0E13] text-slate-100">
          <div className="w-full max-w-md px-6">
            <div className="mb-8 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white font-semibold">
                A
              </div>
              <div>
                <div className="text-xl font-semibold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-cyan-300">
                  Accendo
                </div>
                <div className="text-xs text-slate-400">
                  Unified knowledge & search
                </div>
              </div>
            </div>

            <Card className="border-slate-800/80 bg-[#0E1219] shadow-[0_8px_40px_rgba(2,6,23,0.6)]">
              <CardHeader className="space-y-1">
                <CardTitle className="text-xl font-semibold text-slate-100">
                  Check your email
                </CardTitle>
                <CardDescription className="text-slate-400">
                  We’ve sent a secure reset link to{" "}
                  <span className="text-slate-200">{email}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-5">
                <div className="flex items-center justify-center">
                  <div className="h-12 w-12 rounded-full bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-400/30 flex items-center justify-center">
                    <Mail className="h-6 w-6" />
                  </div>
                </div>

                <p className="text-sm text-slate-400 text-center">
                  Didn’t receive the email? Check your spam folder or{" "}
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="text-cyan-300 hover:text-cyan-200 underline-offset-2 hover:underline"
                  >
                    try again
                  </button>
                  .
                </p>

                <Link to="/login">
                  <Button
                    variant="outline"
                    className="w-full rounded-xl border-slate-700/60 bg-slate-900/40 text-slate-100 hover:bg-slate-900/60 hover:border-slate-600"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to login
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          <div className="absolute top-8 right-8 text-sm text-slate-400">
            <Sparkles className="inline h-4 w-4 mr-1 text-cyan-300" />
            Powered by <span className="text-slate-200">SetuCS</span>
          </div>
        </div>

        <style>{`
          @keyframes float {
            0%   { transform: translateY(0px) translateX(0px) scale(1); }
            50%  { transform: translateY(-16px) translateX(6px) scale(1.03); }
            100% { transform: translateY(0px) translateX(0px) scale(1); }
          }
        `}</style>
      </div>
    );
  }

  /* ---------- Default (request link) view ---------- */
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* LEFT animated vignette (matches Login) */}
      <div className="relative hidden lg:flex items-center justify-center bg-[#12192f] overflow-hidden">
        <GlowBlob className="w-72 h-72 bg-cyan-500 top-12 -left-10 animate-[float_9s_ease-in-out_infinite]" />
        <GlowBlob className="w-96 h-96 bg-indigo-500 -bottom-20 -right-10 animate-[float_11s_ease-in-out_infinite]" />
        <GlowBlob className="w-80 h-80 bg-blue-500 bottom-20 left-1/4 animate-[float_13s_ease-in-out_infinite]" />

        <div className="absolute left-8 top-8 flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white font-semibold">
            A
          </div>
          <div className="text-slate-100 font-semibold text-lg">Accendo</div>
        </div>

        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(0,0,0,0)_0%,_rgba(0,0,0,0.25)_70%)]" />
      </div>

      {/* RIGHT panel */}
      <div className="relative flex items-center justify-center bg-[#0B0E13] text-slate-100">
        <div className="w-full max-w-md px-6">
          <div className="mb-8 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white font-semibold">
              A
            </div>
            <div>
              <div className="text-xl font-semibold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-cyan-300">
                Accendo
              </div>
              <div className="text-xs text-slate-400">
                Unified knowledge & search
              </div>
            </div>
          </div>

          <Card className="border-slate-800/80 bg-[#0E1219] shadow-[0_8px_40px_rgba(2,6,23,0.6)]">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-slate-100 text-left">
                Reset your password
              </CardTitle>
              <CardDescription className="text-slate-400">
                Enter your email—we’ll send a secure reset link
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reset-email" className="text-slate-300">
                    Email address
                  </Label>
                  <Input
                    id="reset-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    required
                    className="bg-slate-900/40 border-slate-700/60 text-slate-100 placeholder:text-slate-500 focus:border-cyan-500"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Send reset link"}
                </Button>
              </form>

              <div className="mt-4 text-center">
                <Link
                  to="/login"
                  className="text-sm text-cyan-300 hover:text-cyan-200 inline-flex items-center"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Back to login
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="absolute top-8 right-8 text-sm text-slate-400">
          <Sparkles className="inline h-4 w-4 mr-1 text-cyan-300" />
          Powered by <span className="text-slate-200">SetuCS</span>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%   { transform: translateY(0px) translateX(0px) scale(1); }
          50%  { transform: translateY(-16px) translateX(6px) scale(1.03); }
          100% { transform: translateY(0px) translateX(0px) scale(1); }
        }
      `}</style>
    </div>
  );
};

export default ForgotPassword;
//-----------------------------------------1st DRAFT-----------------------------------------
