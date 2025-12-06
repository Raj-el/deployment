// import React from 'react';
// import { Link } from 'react-router-dom';
// import { ArrowLeft } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// const Terms = () => {
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
//             <h1 className="text-3xl font-bold text-gray-900">Terms of Service</h1>
//             <p className="text-gray-600 mt-2">DataAnalytics SetuCS Platform</p>
//           </div>
//         </div>

//         <Card className="shadow-lg">
//           <CardHeader>
//             <CardTitle>Terms of Service</CardTitle>
//           </CardHeader>
//           <CardContent className="prose max-w-none">
//             <section className="mb-8">
//               <h2 className="text-xl font-semibold mb-4">1. Introduction</h2>
//               <p className="mb-4">
//                 These Terms of Service ("Terms") govern your use of our SaaS platform ("Service"). By accessing or using the Service, you agree to be bound by these Terms. If you do not agree to these Terms, you may not use the Service.
//               </p>
//             </section>

//             <section className="mb-8">
//               <h2 className="text-xl font-semibold mb-4">2. Use of the Service</h2>
//               <p className="mb-4">
//                 You are granted a non-exclusive, non-transferable, limited license to access and use the Service in accordance with these Terms. You agree not to misuse the Service or use it in any manner that could damage, disable, overburden, or impair the Service.
//               </p>
//             </section>

//             <section className="mb-8">
//               <h2 className="text-xl font-semibold mb-4">3. User Accounts</h2>
//               <p className="mb-4">
//                 To access certain features of the Service, you may be required to create an account. You are responsible for maintaining the confidentiality of your account information and are fully responsible for all activities that occur under your account.
//               </p>
//             </section>

//             <section className="mb-8">
//               <h2 className="text-xl font-semibold mb-4">4. Data Privacy and Security</h2>
//               <p className="mb-4">
//                 Your use of the Service is subject to our Privacy Policy, which outlines how we collect, use, and protect your personal information. By using the Service, you consent to the collection and use of your information as described in our Privacy Policy.
//               </p>
//             </section>

//             <section className="mb-8">
//               <h2 className="text-xl font-semibold mb-4">5. Service Availability</h2>
//               <p className="mb-4">
//                 We strive to keep the Service available at all times. The service terms are subject to SLA agreement that we have with your organization.
//               </p>
//             </section>

//             <section className="mb-8">
//               <h2 className="text-xl font-semibold mb-4">6. Acceptable Use Policy</h2>
//               <p className="mb-4">
//                 You agree not to use the Service for any unlawful or prohibited activities. This includes, but is not limited to, distributing malware, engaging in phishing, or any activities that violate the intellectual property rights of others.
//               </p>
//             </section>

//             <section className="mb-8">
//               <h2 className="text-xl font-semibold mb-4">7. Intellectual Property</h2>
//               <p className="mb-4">
//                 All intellectual property rights in and to the Service, including but not limited to software, content, and trademarks, are owned by or licensed to SetuCS. The Intellectual property terms are further defined in the Software Agreement that we have with your organization.
//               </p>
//             </section>

//             <section className="mb-8">
//               <h2 className="text-xl font-semibold mb-4">8. Limitation of Liability</h2>
//               <p className="mb-4">
//                 To the maximum extent permitted by law, SetuCS shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from your use of the Service. The Limitation of Liability terms are further defined in the Software Agreement that we have with your organization.
//               </p>
//             </section>

//             <section className="mb-8">
//               <h2 className="text-xl font-semibold mb-4">9. Marketing and Communication</h2>
//               <p className="mb-4">
//                 By using the Service, you agree to receive communications from SetuCS, including marketing and service-related emails. You may opt-out of marketing emails at any time by following the unsubscribe instructions included in these emails. However, you will continue to receive service-related communications necessary for the operation of your account and the Service.
//               </p>
//             </section>

//             <section className="mb-8">
//               <h2 className="text-xl font-semibold mb-4">10. Contact Information</h2>
//               <p className="mb-4">
//                 If you have any questions about these Terms, please contact us at service@setucs.io.
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

// export default Terms;

// -----------------------------------------ORIOGINAL-----------------------------------------

import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Terms = () => {
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
                         bg-gradient-to-br from-indigo-600 to-cyan-500 shadow-[0_10px_30px_rgba(2,6,23,0.6)]"
            >
              <span className="text-white font-bold text-xl">A</span>
            </div>
            <h1
              className="text-3xl font-bold bg-clip-text text-transparent
                         bg-gradient-to-r from-indigo-200 to-cyan-200"
            >
              Terms of Service
            </h1>
            <p className="text-slate-300 mt-2">Accendo • SetuCS Platform</p>
          </div>
        </div>

        {/* Content */}
        <Card className="bg-slate-900/90 border border-slate-700 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-slate-100">Terms of Service</CardTitle>
          </CardHeader>

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
                These Terms of Service ("Terms") govern your use of our SaaS
                platform ("Service"). By accessing or using the Service, you
                agree to be bound by these Terms. If you do not agree to these
                Terms, you may not use the Service.
              </p>
            </section>

            <section className="mb-8">
              <h2>2. Use of the Service</h2>
              <p>
                You are granted a non-exclusive, non-transferable, limited
                license to access and use the Service in accordance with these
                Terms. You agree not to misuse the Service or use it in any
                manner that could damage, disable, overburden, or impair the
                Service.
              </p>
            </section>

            <section className="mb-8">
              <h2>3. User Accounts</h2>
              <p>
                To access certain features of the Service, you may be required
                to create an account. You are responsible for maintaining the
                confidentiality of your account information and are fully
                responsible for all activities that occur under your account.
              </p>
            </section>

            <section className="mb-8">
              <h2>4. Data Privacy and Security</h2>
              <p>
                Your use of the Service is subject to our Privacy Policy, which
                outlines how we collect, use, and protect your personal
                information. By using the Service, you consent to the collection
                and use of your information as described in our Privacy Policy.
              </p>
            </section>

            <section className="mb-8">
              <h2>5. Service Availability</h2>
              <p>
                We strive to keep the Service available at all times. The
                service terms are subject to SLA agreement that we have with
                your organization.
              </p>
            </section>

            <section className="mb-8">
              <h2>6. Acceptable Use Policy</h2>
              <p>
                You agree not to use the Service for any unlawful or prohibited
                activities. This includes, but is not limited to, distributing
                malware, engaging in phishing, or any activities that violate
                the intellectual property rights of others.
              </p>
            </section>

            <section className="mb-8">
              <h2>7. Intellectual Property</h2>
              <p>
                All intellectual property rights in and to the Service,
                including but not limited to software, content, and trademarks,
                are owned by or licensed to SetuCS. The Intellectual property
                terms are further defined in the Software Agreement that we have
                with your organization.
              </p>
            </section>

            <section className="mb-8">
              <h2>8. Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by law, SetuCS shall not be
                liable for any indirect, incidental, special, consequential, or
                punitive damages, or any loss of profits or revenues, whether
                incurred directly or indirectly, or any loss of data, use,
                goodwill, or other intangible losses resulting from your use of
                the Service. The Limitation of Liability terms are further
                defined in the Software Agreement that we have with your
                organization.
              </p>
            </section>

            <section className="mb-8">
              <h2>9. Marketing and Communication</h2>
              <p>
                By using the Service, you agree to receive communications from
                SetuCS, including marketing and service-related emails. You may
                opt-out of marketing emails at any time by following the
                unsubscribe instructions included in these emails. However, you
                will continue to receive service-related communications
                necessary for the operation of your account and the Service.
              </p>
            </section>

            <section className="mb-8">
              <h2>10. Contact Information</h2>
              <p>
                If you have any questions about these Terms, please contact us
                at service@setucs.io.
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

export default Terms;
