import React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DataSourcePanel } from "@/components/DataSourcePanel";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, MessageCircle, HelpCircle } from "lucide-react";

export function HelpCenter() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />

        <div className="flex-1 flex flex-col">
          {/* Top bar */}
          <header className="h-14 border-b bg-white flex items-center px-4">
            <SidebarTrigger />
            <div className="ml-4">
              <h1 className="text-lg font-semibold">Help & Support Center</h1>
            </div>
          </header>

          <div className="flex-1 flex">
            {/* CENTER */}
            <main className="flex-1 min-w-0 overflow-y-auto">
              <div className="mx-auto max-w-[1200px] px-6 py-8 font-['Poppins']">
                <h1 className="text-3xl font-bold text-slate-900">
                  Help & Support Center
                </h1>
                <p className="text-slate-600 mt-1">
                  Find answers to common questions and learn more about using
                  SetuCS AI.
                </p>

                {/* FAQ */}
                <section className="mt-6">
                  <Card className="rounded-2xl">
                    <CardHeader className="border-b bg-slate-50 rounded-t-2xl">
                      <CardTitle className="flex items-center gap-2 text-[18px]">
                        <HelpCircle className="h-5 w-5 text-indigo-600" />
                        Frequently Asked Questions
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <Accordion
                        type="single"
                        collapsible
                        className="[&>div]:border-b"
                      >
                        <AccordionItem value="q1" className="px-6">
                          <AccordionTrigger className="py-5 text-left">
                            What is SetuCS AI?
                          </AccordionTrigger>
                          <AccordionContent className="pb-5 text-sm text-slate-700">
                            SetuCS AI is a customer success operating system
                            that unifies data, detects risk, recommends actions,
                            and automates playbooks across your GTM stack.
                          </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="q2" className="px-6">
                          <AccordionTrigger className="py-5 text-left">
                            How does the Automated Risk Detection work?
                          </AccordionTrigger>
                          <AccordionContent className="pb-5 text-sm text-slate-700">
                            Our models analyze usage, tickets, sentiment, and
                            account signals to flag churn risks and trigger
                            get-well plans. Thresholds and rules are
                            configurable per segment.
                          </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="q3" className="px-6">
                          <AccordionTrigger className="py-5 text-left">
                            What data sources can I connect?
                          </AccordionTrigger>
                          <AccordionContent className="pb-5 text-sm text-slate-700">
                            CRMs (Salesforce/HubSpot), support tools
                            (Zendesk/Freshdesk/DevRev), product analytics,
                            billing, data warehouses, and more via native
                            connectors or API.
                          </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="q4" className="px-6">
                          <AccordionTrigger className="py-5 text-left">
                            How are Customer Health Scores calculated?
                          </AccordionTrigger>
                          <AccordionContent className="pb-5 text-sm text-slate-700">
                            We use a FUSE-style composite score (Feature usage,
                            Utilization, Support, Engagement) with adjustable
                            weights, benchmarked by tier and lifecycle stage.
                          </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="q5" className="px-6">
                          <AccordionTrigger className="py-5 text-left">
                            Can I customize the Smart Checklists?
                          </AccordionTrigger>
                          <AccordionContent className="pb-5 text-sm text-slate-700">
                            Yes. Admins can add tasks, attach playbooks, set
                            SLAs, owners, and segment-specific variants.
                            Checklists can auto-spawn from triggers (risk,
                            renewal, onboarding).
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </CardContent>
                  </Card>
                </section>

                {/* Contact Support */}
                <section className="mt-6">
                  <Card className="rounded-2xl">
                    <CardHeader className="bg-slate-50 rounded-t-2xl">
                      <CardTitle className="text-[18px]">
                        Contact Support
                      </CardTitle>
                      <p className="text-sm text-slate-600">
                        If you can’t find the answer you’re looking for, please
                        don’t hesitate to reach out to our support team.
                      </p>
                    </CardHeader>
                    <CardContent className="p-5">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Email */}
                        <div className="rounded-xl border p-4 bg-white">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-indigo-50 text-indigo-700 grid place-items-center">
                              <Mail className="h-5 w-5" />
                            </div>
                            <div>
                              <div className="font-medium">Email</div>
                              <div className="text-sm text-slate-600">
                                support@setucs.ai
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Phone */}
                        <div className="rounded-xl border p-4 bg-white">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-emerald-50 text-emerald-700 grid place-items-center">
                              <Phone className="h-5 w-5" />
                            </div>
                            <div>
                              <div className="font-medium">Phone</div>
                              <div className="text-sm text-slate-600">
                                +1 (800) 555-0199{" "}
                                <Badge variant="secondary" className="ml-1">
                                  Mon-Fri, 9am-5pm ET
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Live Chat */}
                        <div className="rounded-xl border p-4 bg-white">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-violet-50 text-violet-700 grid place-items-center">
                              <MessageCircle className="h-5 w-5" />
                            </div>
                            <div>
                              <div className="font-medium">Live Chat</div>
                              <div className="text-sm text-slate-600">
                                Available on our main website during business
                                hours
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </section>
              </div>
            </main>

            {/* RIGHT RAIL (optional insights panel to stay consistent with app shell) */}
            <DataSourcePanel />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}

/* --------------------------- BACKEND COMMENTS ---------------------------
1) FAQs
   - GET  /help/faqs?locale=en-US
       -> [{ id, question, answer, category, order, updated_at }]
   - Admin: POST/PUT for FAQ CRUD.
   - Optional: GET /help/faqs/search?q=... for search box (not shown in this UI).

2) Support Tickets
   - POST /support/tickets
       body: { subject, description, priority, attachments[], requester }
   - GET  /support/tickets?me=true  (for “track my requests” page)
   - S3 pre-signed URLs for attachments.

3) Live Chat
   - Widget loader or websocket endpoint; surface “online/offline” availability via
     GET /support/livechat/status -> { online: boolean, hours: "Mon-Fri 9-5 ET" }.

4) Phone/Hours
   - GET /support/meta -> { email, phone, hours, emergency_contact }
     so the UI stays config-driven.

5) Analytics
   - POST /help/faq/track
       body: { faq_id, event: "view" | "expand" | "collapse" , ts }
   - Optional thumbs-up/down rating:
       POST /help/faq/rate { faq_id, rating: 1|0, comment? }
------------------------------------------------------------------------- */
