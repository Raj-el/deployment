// import React from 'react';
// import { Link } from 'react-router-dom';
// import { ArrowLeft } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// const Privacy = () => {
//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="mb-6">
//           <Link to="/login">
//             <Button variant="ghost" className="mb-4">
//               <ArrowLeft className="w-4 h-4 mr-2" />
//               Back to Login
//             </Button>
//           </Link>

//           <div className="text-center mb-8">
//             <div className="w-16 h-16 bg-blue-600 rounded-lg mx-auto flex items-center justify-center mb-4">
//               <span className="text-white font-bold text-xl">DA</span>
//             </div>
//             <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
//             <p className="text-gray-600 mt-2">DataAnalytics SetuCS Platform</p>
//           </div>
//         </div>

//         <Card className="shadow-lg">
//           <CardHeader>
//             <CardTitle>Privacy Policy</CardTitle>
//           </CardHeader>
//           <CardContent className="prose max-w-none">
//             <section className="mb-8">
//               <h2 className="text-xl font-semibold mb-4">1. Introduction</h2>
//               <p className="mb-4">
//                 SetuCS ("we," "us," or "our") is committed to protecting the privacy of individuals who use our SaaS platform ("Service"). This Privacy Policy explains how we collect, use, disclose, and safeguard your personal information when you access and use the Service. By using the Service, you agree to the collection and use of information in accordance with this Privacy Policy.
//               </p>
//             </section>

//             <section className="mb-8">
//               <h2 className="text-xl font-semibold mb-4">2. Information We Collect</h2>

//               <h3 className="text-lg font-medium mb-2">a. Personal Information</h3>
//               <p className="mb-4">
//                 When you create an account or use our Service, we may collect certain personal information that can be used to identify you ("Personal Information"). This may include:
//               </p>
//               <ul className="list-disc pl-6 mb-4">
//                 <li>Name</li>
//                 <li>Email address</li>
//                 <li>Company name</li>
//                 <li>Job title</li>
//                 <li>Any other information you provide to us directly through the Service</li>
//               </ul>

//               <h3 className="text-lg font-medium mb-2">b. Usage Data</h3>
//               <p className="mb-4">
//                 We may collect information on how the Service is accessed and used ("Usage Data"). This may include:
//               </p>
//               <ul className="list-disc pl-6 mb-4">
//                 <li>Your IP address</li>
//                 <li>The pages you visit on our Service</li>
//                 <li>The queries performed on our Service</li>
//                 <li>The time and date of your visit</li>
//                 <li>The time spent on those pages</li>
//                 <li>Other diagnostic data</li>
//               </ul>
//             </section>

//             <section className="mb-8">
//               <h2 className="text-xl font-semibold mb-4">3. How We Use Your Information</h2>

//               <h3 className="text-lg font-medium mb-2">a. To Provide and Maintain the Service</h3>
//               <p className="mb-4">
//                 We use your information to operate and maintain the Service, process transactions, and manage your account.
//               </p>

//               <h3 className="text-lg font-medium mb-2">b. To Improve the Service</h3>
//               <p className="mb-4">
//                 We analyze Usage Data to understand how our Service is used and to make improvements.
//               </p>

//               <h3 className="text-lg font-medium mb-2">c. To Communicate with You</h3>
//               <p className="mb-4">
//                 We use your Personal Information to send you service-related communications, including product updates, security updates, and account notifications.
//               </p>

//               <h3 className="text-lg font-medium mb-2">d. Marketing and Promotional Communications</h3>
//               <p className="mb-4">
//                 With your consent, we may use your Personal Information to contact you with newsletters, marketing, or promotional materials. You can opt out of these communications at any time by following the unsubscribe link or instructions provided in any email we send.
//               </p>

//               <h3 className="text-lg font-medium mb-2">e. To Comply with Legal Obligations</h3>
//               <p className="mb-4">
//                 We may disclose your information if required to do so by law or in response to valid requests by public authorities.
//               </p>
//             </section>

//             <section className="mb-8">
//               <h2 className="text-xl font-semibold mb-4">4. How We Share Your Information</h2>

//               <h3 className="text-lg font-medium mb-2">a. Business Transfers</h3>
//               <p className="mb-4">
//                 If we are involved in a merger, acquisition, or asset sale, your information may be transferred. We will provide notice before your information is transferred and becomes subject to a different Privacy Policy.
//               </p>

//               <h3 className="text-lg font-medium mb-2">b. Legal Requirements</h3>
//               <p className="mb-4">
//                 We may disclose your Personal Information in the good faith belief that such action is necessary to:
//               </p>
//               <ul className="list-disc pl-6 mb-4">
//                 <li>Comply with a legal obligation</li>
//                 <li>Protect and defend our rights or property</li>
//                 <li>Prevent or investigate possible wrongdoing in connection with the Service</li>
//                 <li>Protect the personal safety of users of the Service or the public</li>
//                 <li>Protect against legal liability</li>
//               </ul>
//             </section>

//             <section className="mb-8">
//               <h2 className="text-xl font-semibold mb-4">5. Data Security</h2>
//               <p className="mb-4">
//                 We take the security of your information seriously and implement appropriate technical and organizational measures to protect your personal data. The Data Security terms are further defined in the Software Agreement that we have with your organization.
//               </p>
//             </section>

//             <section className="mb-8">
//               <h2 className="text-xl font-semibold mb-4">6. Data Retention</h2>
//               <p className="mb-4">
//                 We will retain your Personal Information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law.
//               </p>
//             </section>

//             <div className="border-t pt-6 mt-8">
//               <p className="text-sm text-gray-600">
//                 Last updated: {new Date().toLocaleDateString()}
//               </p>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default Privacy;
//============================================== ORIGNAL FILE ABOVE ==============================================

import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Privacy = () => {
  return (
    <div className="relative min-h-screen py-10 overflow-hidden">
      {/* Background gradient layer (fixed + behind everything) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            // navy base + indigo and cyan glows (same vibe as login)
            "radial-gradient(1200px 600px at 70% -10%, rgba(99,102,241,0.16), transparent 60%)," +
            "radial-gradient(900px 500px at -20% 110%, rgba(34,211,238,0.14), transparent 60%)," +
            "#0b0e13",
        }}
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back */}
        <div className="mb-6">
          <Link to="/login">
            <Button
              variant="outline"
              className="mb-4 rounded-xl border-slate-700/70 bg-slate-900/50 text-slate-100
                         hover:bg-slate-900/70 hover:border-slate-600"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Login
            </Button>
          </Link>

          {/* Header */}
          <div className="text-center mb-8">
            <div
              className="w-16 h-16 rounded-lg mx-auto flex items-center justify-center mb-4
                            bg-gradient-to-br from-indigo-500 to-cyan-500 shadow-[0_10px_30px_rgba(2,6,23,0.6)]"
            >
              <span className="text-white font-bold text-xl">A</span>
            </div>
            <h1
              className="text-3xl font-bold bg-clip-text text-transparent
                           bg-gradient-to-r from-indigo-200 to-cyan-200"
            >
              Privacy Policy
            </h1>
            <p className="text-slate-300 mt-2">Accendo • SetuCS Platform</p>
          </div>
        </div>

        {/* Content */}
        <Card className="bg-slate-900/90 border border-slate-700 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-slate-100">Privacy Policy</CardTitle>
          </CardHeader>

          {/* High-contrast typography on dark */}
          <CardContent
            className="
              prose prose-invert prose-slate max-w-none
              [&_p]:text-slate-200 [&_li]:text-slate-200
              [&_h2]:text-slate-100 [&_h3]:text-slate-100
              [&_a]:text-cyan-300 [&_a:hover]:text-cyan-200
              [&_strong]:text-slate-100
            "
          >
            <section className="mb-8">
              <h2>1. Introduction</h2>
              <p>
                SetuCS ("we," "us," or "our") is committed to protecting the
                privacy of individuals who use our SaaS platform ("Service").
                This Privacy Policy explains how we collect, use, disclose, and
                safeguard your personal information when you access and use the
                Service. By using the Service, you agree to the collection and
                use of information in accordance with this Privacy Policy.
              </p>
            </section>

            <section className="mb-8">
              <h2>2. Information We Collect</h2>

              <h3>a. Personal Information</h3>
              <p>
                When you create an account or use our Service, we may collect
                certain personal information that can be used to identify you
                ("Personal Information"). This may include:
              </p>
              <ul>
                <li>Name</li>
                <li>Email address</li>
                <li>Company name</li>
                <li>Job title</li>
                <li>
                  Any other information you provide to us directly through the
                  Service
                </li>
              </ul>

              <h3>b. Usage Data</h3>
              <p>
                We may collect information on how the Service is accessed and
                used ("Usage Data"). This may include:
              </p>
              <ul>
                <li>Your IP address</li>
                <li>The pages you visit on our Service</li>
                <li>The queries performed on our Service</li>
                <li>The time and date of your visit</li>
                <li>The time spent on those pages</li>
                <li>Other diagnostic data</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2>3. How We Use Your Information</h2>

              <h3>a. To Provide and Maintain the Service</h3>
              <p>
                We use your information to operate and maintain the Service,
                process transactions, and manage your account.
              </p>

              <h3>b. To Improve the Service</h3>
              <p>
                We analyze Usage Data to understand how our Service is used and
                to make improvements.
              </p>

              <h3>c. To Communicate with You</h3>
              <p>
                We use your Personal Information to send you service-related
                communications, including product updates, security updates, and
                account notifications.
              </p>

              <h3>d. Marketing and Promotional Communications</h3>
              <p>
                With your consent, we may use your Personal Information to
                contact you with newsletters, marketing, or promotional
                materials. You can opt out of these communications at any time
                by following the unsubscribe link or instructions provided in
                any email we send.
              </p>

              <h3>e. To Comply with Legal Obligations</h3>
              <p>
                We may disclose your information if required to do so by law or
                in response to valid requests by public authorities.
              </p>
            </section>

            <section className="mb-8">
              <h2>4. How We Share Your Information</h2>

              <h3>a. Business Transfers</h3>
              <p>
                If we are involved in a merger, acquisition, or asset sale, your
                information may be transferred. We will provide notice before
                your information is transferred and becomes subject to a
                different Privacy Policy.
              </p>

              <h3>b. Legal Requirements</h3>
              <p>
                We may disclose your Personal Information in the good faith
                belief that such action is necessary to:
              </p>
              <ul>
                <li>Comply with a legal obligation</li>
                <li>Protect and defend our rights or property</li>
                <li>
                  Prevent or investigate possible wrongdoing in connection with
                  the Service
                </li>
                <li>
                  Protect the personal safety of users of the Service or the
                  public
                </li>
                <li>Protect against legal liability</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2>5. Data Security</h2>
              <p>
                We take the security of your information seriously and implement
                appropriate technical and organizational measures to protect
                your personal data. The Data Security terms are further defined
                in the Software Agreement that we have with your organization.
              </p>
            </section>

            <section className="mb-8">
              <h2>6. Data Retention</h2>
              <p>
                We will retain your Personal Information only for as long as
                necessary to fulfill the purposes outlined in this Privacy
                Policy, unless a longer retention period is required or
                permitted by law.
              </p>
            </section>

            <div className="border-t border-slate-700 pt-6 mt-8">
              <p className="text-sm text-slate-300">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Privacy;
