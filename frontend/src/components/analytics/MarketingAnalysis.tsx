// src/components/analytics/MarketingAnalysis.tsx
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DataSourcePanel } from "@/components/DataSourcePanel";
import {
  Download,
  Sparkles,
  Target,
  LineChart,
  FileText,
  Building2,
  ArrowUpRight,
  Search,
} from "lucide-react";

/* ========================================================================
   MOCK TYPES & DATA
   (Replace via API in production – see BACKEND notes)
   ======================================================================== */

type QualifiedLead = {
  company: string;
  contact: string;
  title: string;
  potentialARR: number;
  confidence: "High" | "Medium" | "Low";
  reasoning: string;
};

type ChurnSegment = {
  title: string;
  indicators: string[];
  recommendation: string;
};

type MomentOfValue = {
  text: string;
  source: string;
  tags: string[];
};

type CaseStudy = {
  title: string;
  blurb: string;
  chips?: string[];
};

type StakeholderIntel = {
  header: string;
  summary: string;
  tags: string[];
  cta?: string;
};

type PressItem = {
  title: string;
  subtitle: string;
  chips?: string[];
};

const qualifiedLeads: QualifiedLead[] = [
  {
    company: "NextGen SaaS Inc.",
    contact: "Michael Chen",
    title: "VP of Sales",
    potentialARR: 75000,
    confidence: "High",
    reasoning:
      "Industry match with Innovate Solutions; timing aligns with sales reporting needs.",
  },
  {
    company: "Synergy Corp",
    contact: "Laura Rodriguez",
    title: "Director of Customer Operations",
    potentialARR: 50000,
    confidence: "Medium",
    reasoning:
      "Competitor interest; CS team size matches reference account; technically capable.",
  },
  {
    company: "DataWeavers Ltd.",
    contact: "Kevin Miller",
    title: "Chief Technology Officer",
    potentialARR: 120000,
    confidence: "High",
    reasoning:
      "Downloaded Advanced Analytics whitepaper; similar challenges to Global Tech.",
  },
  {
    company: "BrightFuture Health",
    contact: "Dr. Emily Carter",
    title: "Head of Patient Experience",
    potentialARR: 45000,
    confidence: "Medium",
    reasoning:
      "Engaged with retention content; aligns with healthcare success narrative.",
  },
];

const churnSegments: ChurnSegment[] = [
  {
    title: "Startups with No Dedicated IT resources",
    indicators: [
      "High reliance on self-service",
      "Limited budget for premium support",
      "Volatile user base",
    ],
    recommendation: "Deprioritize or offer self-service tier.",
  },
  {
    title: "Deep Legacy System Integrations",
    indicators: [
      "Multiple complex integration requests",
      "Incompatible existing tech stack",
      "Low perceived ROI",
    ],
    recommendation:
      "Qualify integration needs thoroughly; set high-risk implementation plan.",
  },
  {
    title: "Feature Set Mismatch",
    indicators: [
      "Low adoption of core features",
      "Frequent un-roadmapped requests",
      "Negative feedback on depth",
    ],
    recommendation: "Do not pursue; re-evaluate product fit.",
  },
];

const momentsOfValue: MomentOfValue[] = [
  {
    text: "Innovate Solutions achieved 25% faster onboarding in Q2 after implementing AI-driven conclusions.",
    source: "Social Media Analytics & GPT feedback",
    tags: ["Innovate", "Solutions"],
  },
  {
    text: "Global Tech reported a 15% reduction in CRTC support tickets after the latest product update.",
    source: "Usage Analytics",
    tags: ["Global", "Tech"],
  },
  {
    text: "Acme Corp users rated the new Advanced Reporting feature 4.6/5 in the latest in-app survey.",
    source: "In-App Survey Data",
    tags: ["Acme", "Corp"],
  },
];

const caseStudies: CaseStudy[] = [
  {
    title: "How Acme Corp Boosted ROI by 50% with SatuCS AI",
    blurb: "Beta Lab achieved 50% Customer Retention via Proactive Insights.",
    chips: ["New"],
  },
  {
    title: "Streamlining Onboarding: Gamma Inc’s Success Story",
    blurb: "Reduced time-to-value by 38% leveraging CS-driven playbooks.",
  },
];

const stakeholderIntel: StakeholderIntel[] = [
  {
    header: "Sarah Chen VP of Section Co Co",
    summary:
      "Highlighted data allocation challenges at the Future of SaaS webinar. Our unified platform addresses this directly.",
    tags: [
      "Data Solution",
      "Predictive Models",
      "Webinars",
      "Featured Analytics",
    ],
    cta: "We’re a strong fit for a discovery call.",
  },
  {
    header:
      "Zeta Group acquired a logistics firm – potential to expand beyond licensed seats.",
    summary: "Opportunity for supply chain analytics add-on to existing plan.",
    tags: ["Zeta Group", "Corporate Plans", "Potential"],
    cta: "Expansion prospect for Q3.",
  },
  {
    header:
      "Mark Lee (CSM Lead) at Innovate Solutions tweeted positively about early onboarding with a new analytics tool.",
    summary: "Potential public testimonial and customer story candidate.",
    tags: ["Mark", "Lee", "Innovate", "Social", "Customer"],
    cta: "Reference program candidate.",
  },
];

const pressReports: PressItem[] = [
  {
    title:
      'TechCrunch: "Innovate Solutions Leverages SatuCS AI for Record Growth"',
    subtitle: "July 15, 2025",
    chips: ["View"],
  },
  {
    title: 'Gartner: "SatuCS AI Named Leader in Proactive CS Platforms"',
    subtitle: "Q3 2025 Report",
    chips: ["View", "Recent", "Report"],
  },
  {
    title:
      'Customer Success Mag: "Acme Corp attributes 30% churn reduction to SatuCS AI predictive analytics"',
    subtitle: "August 2025 Issue",
    chips: ["Read", "Article"],
  },
];

/* ========================================================================
   SMALL HELPERS
   ======================================================================== */

const toUSD = (n: number) =>
  n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });

/* ========================================================================
   PAGE
   ======================================================================== */

export function MarketingAnalysis() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        {/* Left Nav */}
        <AppSidebar />

        {/* Main Column */}
        <div className="flex-1 flex flex-col">
          {/* Top bar */}
          <header className="h-14 border-b bg-white flex items-center px-4">
            <SidebarTrigger />
            <div className="ml-4">
              <h1 className="text-lg font-semibold">
                Sales & Marketing Analytics
              </h1>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <div className="hidden md:flex items-center gap-2">
                <Search className="w-4 h-4 text-slate-500" />
                <Input
                  className="w-[220px]"
                  placeholder="Search titles, companies…"
                />
              </div>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </header>

          {/* Content + Right Rail */}
          <div className="flex-1 flex">
            {/* Center */}
            <main className="flex-1 min-w-0 overflow-y-auto">
              <div className="mx-auto max-w-[1200px] px-6 py-6 font-['Poppins'] space-y-6">
                {/* Row: CS Qualified Leads */}
                <Card className="rounded-2xl">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5" />
                      CS Qualified Leads
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">
                        Lead score by CS patterns
                      </Badge>
                      <Badge variant="outline">MQL ➜ SQL ➜ Won tracking</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-slate-50 border-t border-b">
                          <tr className="text-slate-600">
                            <th className="text-left py-3 px-4">
                              Prospect Company
                            </th>
                            <th className="text-left py-3 px-4">Key Contact</th>
                            <th className="text-left py-3 px-4">
                              Potential ARR
                            </th>
                            <th className="text-left py-3 px-4">Confidence</th>
                            <th className="text-left py-3 px-4">
                              AI Reasoning
                            </th>
                            <th className="text-right py-3 px-4">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {qualifiedLeads.map((l) => (
                            <tr
                              key={l.company}
                              className="border-b hover:bg-slate-50/60"
                            >
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-2">
                                  <Building2 className="w-4 h-4 text-slate-500" />
                                  <span className="font-medium">
                                    {l.company}
                                  </span>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <div className="leading-tight">
                                  <div className="font-medium">{l.contact}</div>
                                  <div className="text-xs text-slate-500">
                                    {l.title}
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                {toUSD(l.potentialARR)}
                              </td>
                              <td className="py-3 px-4">
                                <Badge
                                  variant={
                                    l.confidence === "High"
                                      ? "default"
                                      : l.confidence === "Medium"
                                      ? "secondary"
                                      : "outline"
                                  }
                                >
                                  {l.confidence}
                                </Badge>
                              </td>
                              <td className="py-3 px-4 text-slate-700">
                                {l.reasoning}
                              </td>
                              <td className="py-3 px-4 text-right">
                                <Button
                                  size="sm"
                                  className="bg-blue-600 hover:bg-blue-700"
                                >
                                  Prospect
                                  <ArrowUpRight className="w-4 h-4 ml-1" />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* BACKEND: 
                      - GET /leads?qualified=cs&sort=score
                      - POST /leads/{id}/prospect  (creates CRM lead + associates CS rationale) 
                      - Lead score explanation: /leads/{id}/explain 
                    */}
                  </CardContent>
                </Card>

                {/* Row: Anti-ICP / Churn-Prone Segments */}
                <Card className="rounded-2xl">
                  <CardHeader className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5" />
                      Anti-ICP / Churn-Prone Segments
                    </CardTitle>
                    <Badge variant="outline">Sales-CS handoff quality</Badge>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {churnSegments.map((s) => (
                      <div
                        key={s.title}
                        className="rounded-xl border p-4 bg-white"
                      >
                        <div className="font-small mb-2">{s.title}</div>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {s.indicators.map((i) => (
                            <Badge key={i} variant="secondary">
                              {i}
                            </Badge>
                          ))}
                        </div>
                        <div className="text-sm text-slate-700">
                          <span className="">AI Recommendation: </span>
                          {s.recommendation}
                        </div>
                        {/* BACKEND:
                            - GET /segments/anti-icp  (indicators + rationale)
                            - POST /segments/{id}/dismiss or /prioritize
                          */}
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Grid: Moments of Value • Case Studies • Customer 360 */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Moments of Value */}
                  <Card className="rounded-2xl lg:col-span-1">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5" />
                        Moments of Value
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {momentsOfValue.map((m, idx) => (
                        <div
                          key={idx}
                          className="rounded-xl border bg-emerald-50/50 p-3"
                        >
                          <div className="text-[13.5px] text-emerald-900">
                            “{m.text}”
                          </div>
                          <div className="text-[12px] text-emerald-700 mt-1">
                            {m.source}
                          </div>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {m.tags.map((t) => (
                              <Badge key={t} variant="secondary">
                                {t}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ))}
                      {/* BACKEND:
                          - GET /advocacy/moments?window=90d
                          - Signals: social, tickets, NPS, product events
                        */}
                    </CardContent>
                  </Card>

                  {/* Case Studies */}
                  <Card className="rounded-2xl lg:col-span-1">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        Case Studies
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {caseStudies.map((c) => (
                        <div
                          key={c.title}
                          className="rounded-xl border p-3 hover:bg-slate-50/60"
                        >
                          <div className="font-medium text-[14px]">
                            {c.title}
                          </div>
                          <div className="text-[12.5px] text-slate-600 mt-1">
                            {c.blurb}
                          </div>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {(c.chips ?? []).map((chip) => (
                              <Badge key={chip} variant="secondary">
                                {chip}
                              </Badge>
                            ))}
                            <Button
                              size="sm"
                              variant="outline"
                              className="ml-auto"
                            >
                              View
                            </Button>
                          </div>
                        </div>
                      ))}
                      {/* BACKEND:
                          - GET /advocacy/case-studies
                          - Track performance impact on pipeline: /attribution/case-study/{id}
                        */}
                    </CardContent>
                  </Card>

                  {/* Customer 360 – Stakeholder & Market Intel */}
                  <Card className="rounded-2xl lg:col-span-1">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <LineChart className="w-8 h-8" />
                        Customer 360 – Stakeholder & Market Intel
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {stakeholderIntel.map((s) => (
                        <div
                          key={s.header}
                          className="rounded-xl border p-3 bg-indigo-50/50"
                        >
                          <div className="font-medium">{s.header}</div>
                          <div className="text-[12.5px] text-slate-700 mt-1">
                            {s.summary}
                          </div>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {s.tags.map((t) => (
                              <Badge key={t} variant="secondary">
                                {t}
                              </Badge>
                            ))}
                          </div>
                          {s.cta && (
                            <div className="text-[12px] text-indigo-700 mt-2">
                              {s.cta}
                            </div>
                          )}
                        </div>
                      ))}
                      {/* BACKEND:
                          - GET /intel/stakeholders?accounts=target
                          - Ingest sources: news, social, webinars; NER/tagging pipeline
                        */}
                    </CardContent>
                  </Card>
                </div>

                {/* Press & Analyst Reports */}
                <Card className="rounded-2xl">
                  <CardHeader className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Press Releases & Analyst Reports
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">Attribution ➜ pipeline</Badge>
                      <Badge variant="outline">Advocacy tracking</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {pressReports.map((p) => (
                      <div
                        key={p.title}
                        className="flex items-center justify-between rounded-xl border p-3 hover:bg-slate-50/60"
                      >
                        <div>
                          <div className="font-medium">{p.title}</div>
                          <div className="text-xs text-slate-600">
                            {p.subtitle}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {(p.chips ?? []).map((c) => (
                            <Badge key={c} variant="secondary">
                              {c}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                    {/* BACKEND:
                        - GET /earned-media?type=press,analyst
                        - POST /attribution/mark?source=press&id=...
                      */}
                  </CardContent>
                </Card>
              </div>
            </main>

            {/* Right rail */}
            <DataSourcePanel />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}

/* =========================================================================
   REQUIREMENTS COVERAGE (Docs → Features)
   - US-ANA-009 Sales Performance & Pipeline
     ✓ Lead qualification scoring surfacing CS-qualified leads
     ✓ Prospect action (hook to CRM) + rationale (BACKEND placeholders)
     ✓ Handoff quality via Anti-ICP segments + recommendations
     ✓ Expansion opportunity signals in Stakeholder Intel

   - US-ANA-010 Marketing Campaign Effectiveness
     ✓ Attribution targets via Press/Analyst section (chips + BACKEND notes)
     ✓ Content → adoption/advocacy correlation via Moments of Value
     ✓ Program performance hooks (advocacy, case studies)

   - US-ANA-011 Customer Advocacy & References
     ✓ Advocacy readiness signals: Moments of Value, Stakeholder Intel
     ✓ Case study listing with tracking hooks
     ✓ NPS/health-based signals (placeholders to wire in)
======================================================================== */
