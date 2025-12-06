//====================5th DRAFT==============================
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Mic2,
  PhoneCall,
  Mail,
  MessageSquare,
  PlayCircle,
  FileText,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Brain,
  Activity,
  CheckCircle2,
  Users,
  Target,
  Landmark,
} from "lucide-react";
import authService from "@/services/authService";

/* ----------------------- Small helpers ----------------------- */

type CIItem = {
  id: string;
  icon: "call" | "mail" | "msg";
  title: string;
  time: string;
  duration?: string;
  topics: string;
  actions: string[];
  sentiment: "positive" | "neutral" | "negative";
  signal: "high" | "medium" | "risk";
};

const ciItems: CIItem[] = [
  {
    id: "1",
    icon: "call",
    title: "Analytics Pro Inc.",
    time: "2 hours ago",
    duration: "45 min",
    topics: "ML Features Expansion, Enterprise Upgrade, Data Connector Setup",
    actions: [
      "Send ML documentation",
      "Schedule enterprise demo",
      "Prepare $120K expansion proposal",
    ],
    sentiment: "positive",
    signal: "high",
  },
  {
    id: "2",
    icon: "mail",
    title: "DataVision Corp",
    time: "4 hours ago",
    topics: "Real-time Dashboard Performance, SLA Concerns, API Latency",
    actions: [
      "Escalate to engineering team",
      "Schedule emergency call with CTO",
    ],
    sentiment: "negative",
    signal: "risk",
  },
  {
    id: "3",
    icon: "msg",
    title: "MidMarket Analytics Co.",
    time: "1 day ago",
    duration: "30 min",
    topics:
      "Quarterly Business Review, Advanced Reporting Features, Team Training",
    actions: ["Follow up on roadmap timeline", "Share ROI success metrics"],
    sentiment: "neutral",
    signal: "medium",
  },
];

const SentimentBadge = ({ s }: { s: CIItem["sentiment"] }) => {
  const map = {
    positive: "bg-green-100 text-green-700",
    neutral: "bg-gray-100 text-gray-700",
    negative: "bg-red-100 text-red-700",
  } as const;
  return (
    <span className={`text-xs rounded-full px-2.5 py-1 ${map[s]}`}>{s}</span>
  );
};

const SignalBadge = ({ level }: { level: CIItem["signal"] }) => {
  const label = level === "risk" ? "risk signal" : `${level} signal`;
  const map = {
    high: "bg-emerald-100 text-emerald-700",
    medium: "bg-yellow-100 text-yellow-800",
    risk: "bg-red-100 text-red-700",
  } as const;
  return (
    <span className={`text-xs rounded-full px-2.5 py-1 ${map[level]}`}>
      {label}
    </span>
  );
};

const ItemIcon = ({ t }: { t: CIItem["icon"] }) => {
  const base =
    "h-5 w-5 text-violet-600 bg-violet-50 border border-violet-100 rounded-md p-1";
  if (t === "call") return <PhoneCall className={base} />;
  if (t === "mail") return <Mail className={base} />;
  return <MessageSquare className={base} />;
};

/* -------------------- Hex Launcher + Panel (unchanged) -------------------- */

function HexLauncher() {
  const navigate = useNavigate();

  type HexItem = {
    key: string;
    title: string;
    subtitle: string;
    icon: React.ElementType;
    x: number;
    y: number;
    w?: number;
    h?: number;
    center?: boolean;
  };

  const handleHexClick = (key: string) => {
    const routes: Record<string, string> = {
      "cs-query": "/cs-query",
      "customer-health": "/health-scores",
      "get-well": "/get-well-plans",
      "value-expansion": "/gem-stone/value-expansion",
      "feedback-loop": "/gem-stone/product-feedback-loop",
      expert: "/gem-stone/expert-in-the-loop",
      "revenue-architecture": "/gem-stone/revenue-architecture",
    };
    const path = routes[key];
    if (path) navigate(path);
  };

  const W = 236;
  const H = 198;

  const items: HexItem[] = [
    {
      key: "cs-query",
      title: "CS Query",
      subtitle: "Ask questions and get AI-powered answers.",
      icon: Brain,
      x: 320,
      y: 12,
    },
    {
      key: "value-expansion",
      title: "Value Expansion",
      subtitle:
        "CSQL tracking and expansion opportunity management with insights.",
      icon: Target,
      x: 140,
      y: 100,
    },
    {
      key: "customer-health",
      title: "Customer Health",
      subtitle: "Predictive health scores and at-risk detection.",
      icon: Activity,
      x: 500,
      y: 100,
    },
    {
      key: "feedback-loop",
      title: "Product Feedback Loop",
      subtitle: "Capture & prioritize customer feedback (VoC).",
      icon: MessageSquare,
      x: 140,
      y: 276,
    },
    {
      key: "get-well",
      title: "Get-Well Plans",
      subtitle: "AI-suggested recovery & growth plans.",
      icon: CheckCircle2,
      x: 500,
      y: 275,
    },
    {
      key: "expert",
      title: "Expert in the Loop",
      subtitle:
        "Manage QBRs, de-escalations and relationship-building activities.",
      icon: Users,
      x: 320,
      y: 362,
    },
    {
      key: "revenue-architecture",
      title: "Revenue Architecture",
      subtitle: "Adaptive bowtie model for planning & board reporting.",
      icon: Landmark,
      x: 320,
      y: 187,
    },
  ];

  const HexButton = ({
    title,
    subtitle,
    icon: Icon,
    w = W,
    h = H,
    onClick,
    center = false,
  }: {
    title: string;
    subtitle: string;
    icon: React.ElementType;
    w?: number;
    h?: number;
    onClick: () => void;
    center?: boolean;
  }) => (
    <button
      onClick={onClick}
      className="group relative text-left transition-transform duration-200 hover:-translate-y-1 focus:outline-none"
      style={{
        width: w,
        height: h,
        clipPath:
          "polygon(25% 6.7%, 75% 6.7%, 100% 50%, 75% 93.3%, 25% 93.3%, 0% 50%)",
        background: "linear-gradient(135deg, #0ea5e9 0%, #1d4ed8 100%)",
        boxShadow:
          "0 6px 16px rgba(2,132,199,0.18), inset 0 0 0 1px rgba(255,255,255,0.18)",
      }}
      aria-label={title}
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity bg-white" />
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-white">
        <Icon className="h-7 w-7 mb-2 opacity-95" />
        <div
          className={`text-center font-semibold leading-tight ${
            center ? "text-[15px]" : "text-[17px]"
          }`}
        >
          {title}
        </div>
        <div
          className={`mt-2 text-center text-[12px] leading-snug opacity-95 ${
            center ? "max-w-[180px]" : "max-w-[220px]"
          } line-clamp-4`}
        >
          {subtitle}
        </div>
      </div>
    </button>
  );

  return (
    <div className="relative group">
      <button
        aria-label="Open Gem Stone"
        className="relative h-9 w-9"
        style={{
          clipPath:
            "polygon(25% 6.7%, 75% 6.7%, 100% 50%, 75% 93.3%, 25% 93.3%, 0% 50%)",
          background: "#0ea5e9",
          boxShadow:
            "inset 0 0 0 1px rgba(255,255,255,0.35), 0 4px 12px rgba(2,132,199,0.28)",
        }}
      >
        <span className="absolute inset-0 grid place-items-center">
          <span className="h-1.5 w-1.5 rounded-full bg-white/90 animate-pulse" />
        </span>
      </button>

      <div className="pointer-events-none group-hover:pointer-events-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200 fixed inset-0 z-50">
        <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-[2px]" />
        <div className="relative mx-auto minh-[700px] w-[860px]">
          {items.map((it) => (
            <div
              key={it.key}
              className="absolute"
              style={{ left: it.x, top: it.y }}
            >
              <HexButton
                title={it.title}
                subtitle={it.subtitle}
                icon={it.icon}
                w={it.w ?? W}
                h={it.h ?? H}
                center={!!it.center}
                onClick={() => handleHexClick(it.key)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* -------------------- Conversation Intelligence + restored sections -------------------- */

function ConversationIntel() {
  const { displayName } = useAuth();

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[34px] leading-[40px] font-semibold tracking-tight">
            Welcome back, <span className="text-slate-900">{displayName}</span>
          </h1>
        </div>

        <div className="hidden md:flex items-center">
          <HexLauncher />
        </div>
      </div>

      {/* Conversation Intelligence card (unchanged) */}
      <Card className="rounded-2xl border shadow-sm">
        <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
          <div className="flex items-center gap-2">
            <Mic2 className="h-5 w-5 text-violet-600" />
            <CardTitle className="text-base">
              Conversation Intelligence – Last 24 Hours
            </CardTitle>
          </div>
          <Button variant="outline" size="sm">
            View All Conversations
          </Button>
        </CardHeader>

        <CardContent className="space-y-4 pt-0">
          <p className="text-sm text-muted-foreground">
            AI-powered analysis of all customer interactions
          </p>

          {ciItems.map((it) => (
            <div key={it.id} className="rounded-xl border bg-white p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <ItemIcon t={it.icon} />
                  <div>
                    <div className="font-medium text-gray-900">{it.title}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {it.time}
                      {it.duration ? ` • ${it.duration}` : null}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <SentimentBadge s={it.sentiment} />
                  <SignalBadge level={it.signal} />
                </div>
              </div>

              <div className="mt-3 text-sm">
                <span className="font-semibold text-gray-900">Topics:</span>{" "}
                <span className="text-gray-700">{it.topics}</span>
              </div>

              <div className="mt-1 text-sm">
                <span className="font-semibold text-gray-900">
                  Action Items:
                </span>{" "}
                <span className="text-gray-700">{it.actions.join(" · ")}</span>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <Button variant="outline" size="sm" className="gap-2">
                  <PlayCircle className="h-4 w-4" /> Play Recording
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <FileText className="h-4 w-4" /> View Transcript
                </Button>
                <Button size="sm" className="bg-[#0ea5e9] hover:bg-[#0284c7]">
                  Follow Up
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Deal Intelligence – EXACT UI from your old code */}
      <DealIntelligenceOld />

      {/* Immediate To-Dos – EXACT UI from your old code */}
      <ImmediateTodosOld />
    </div>
  );
}

/* ====== Deal Intelligence + Immediate To-Dos (identical UI to the old snippet) ====== */

const StageBadge = ({
  label,
  tone,
}: {
  label: string;
  tone: "green" | "blue" | "red";
}) => {
  const map = {
    green: "bg-emerald-100 text-emerald-700",
    blue: "bg-blue-100 text-blue-700",
    red: "bg-rose-100 text-rose-700",
  } as const;
  return (
    <span
      className={`text-xs rounded-full px-2.5 py-1 font-medium ${map[tone]}`}
    >
      {label}
    </span>
  );
};

const EngagementBar = ({ value }: { value: number }) => {
  const tone =
    value >= 80
      ? "bg-emerald-500"
      : value >= 50
      ? "bg-amber-500"
      : "bg-rose-500";
  const clamped = Math.min(Math.max(value, 0), 100);
  return (
    <div className="flex items-center gap-2">
      <div className="h-2 w-28 rounded-full bg-slate-200 overflow-hidden">
        <div className={`h-full ${tone}`} style={{ width: `${clamped}%` }} />
      </div>
      <span className="text-sm text-slate-700">{value}</span>
    </div>
  );
};

function DealIntelligenceOld() {
  type Deal = {
    id: string;
    title: string;
    subtitle: string;
    stage: { label: string; tone: "green" | "blue" | "red" };
    engagement: number;
    amount: string;
    likelihood: string;
    risk?: string;
    dot: "green" | "yellow" | "red";
  };

  const deals: Deal[] = [
    {
      id: "d1",
      title: "Analytics Pro Inc. – Enterprise Upgrade + ML Features",
      subtitle: "Enterprise demo scheduled for tomorrow",
      stage: { label: "Negotiation", tone: "green" },
      engagement: 92,
      amount: "$120,000",
      likelihood: "85% likely",
      dot: "green",
    },
    {
      id: "d2",
      title: "DataInsights Corp – Advanced Analytics Package",
      subtitle: "Requested technical specs for real-time processing",
      stage: { label: "Evaluation", tone: "blue" },
      engagement: 74,
      amount: "$85,000",
      likelihood: "65% likely",
      risk: "Risk Factors: Budget approval pending, Competing vendor evaluation",
      dot: "yellow",
    },
    {
      id: "d3",
      title: "SmallBiz Analytics – Annual Renewal",
      subtitle: "No response for 2 weeks",
      stage: { label: "At Risk", tone: "red" },
      engagement: 28,
      amount: "$35,000",
      likelihood: "35% likely",
      risk: "Risk Factors: Champion left, Usage declined 65%, Unresolved support tickets",
      dot: "red",
    },
  ];

  return (
    <Card className="rounded-2xl border shadow-sm">
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 rounded-full grid place-items-center ring-1 ring-blue-200 bg-blue-50">
            <TrendingUp className="h-3.5 w-3.5 text-blue-600" />
          </div>
          <CardTitle className="text-base">
            Deal Intelligence – Expansion Pipeline
          </CardTitle>
        </div>
        <Button variant="outline" size="sm">
          Forecast Report
        </Button>
      </CardHeader>

      <CardContent className="space-y-4 pt-0">
        <p className="text-sm text-muted-foreground">
          AI-powered expansion opportunity tracking and risk assessment
        </p>

        {deals.map((d) => {
          const dotColor =
            d.dot === "green"
              ? "bg-emerald-100"
              : d.dot === "yellow"
              ? "bg-amber-100"
              : "bg-rose-100";
          return (
            <div key={d.id} className="rounded-xl border bg-white p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div
                    className={`h-6 w-6 rounded-full ring-1 ring-slate-200 ${dotColor}`}
                  />
                  <div>
                    <div className="font-semibold text-slate-900">
                      {d.title}
                    </div>
                    <div className="text-sm text-slate-500">{d.subtitle}</div>

                    <div className="mt-2 flex flex-wrap items-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500">Stage:</span>
                        <StageBadge label={d.stage.label} tone={d.stage.tone} />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500">Engagement:</span>
                        <EngagementBar value={d.engagement} />
                      </div>
                    </div>

                    {d.risk && (
                      <div className="mt-2 text-sm text-rose-600 flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        <span className="font-medium">Risk Factors:</span>
                        <span>{d.risk.replace("Risk Factors: ", "")}</span>
                      </div>
                    )}

                    <div className="mt-3 flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        className="bg-[#0ea5e9] hover:bg-[#0284c7]"
                      >
                        Next Best Action
                      </Button>
                      <Button variant="outline" size="sm">
                        View Timeline
                      </Button>
                      <Button variant="outline" size="sm">
                        Update Forecast
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="text-right whitespace-nowrap">
                  <div className="text-emerald-600 font-semibold">
                    {d.amount}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {d.likelihood}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

function ImmediateTodosOld() {
  type Todo = {
    id: string;
    type: "risk" | "opportunity" | "onboarding" | "risk2";
    title: string;
    subtitle: string;
    severity: "high" | "medium";
    cta: string;
  };

  const todos: Todo[] = [
    {
      id: "t1",
      type: "risk",
      title:
        "High Churn Risk: DataVision Corp – Recent negative sentiment and API integration concerns",
      subtitle:
        "Enterprise customer ($350K ARR) experiencing performance issues with real-time dashboard features. Active de-escalation required.",
      severity: "high",
      cta: "View De-escalation Plan",
    },
    {
      id: "t2",
      type: "opportunity",
      title:
        "Expansion Opportunity: Analytics Pro Inc. – High usage of advanced ML features",
      subtitle:
        "Mid-market customer ($180K ARR) requesting additional data connectors. Perfect candidate for Enterprise upgrade worth $120K additional ARR.",
      severity: "medium",
      cta: "Explore Opportunity",
    },
  ];

  const SeverityPill = ({ s }: { s: "high" | "medium" }) => (
    <span
      className={
        "text-xs rounded-full px-2.5 py-1 font-medium " +
        (s === "high"
          ? "bg-rose-100 text-rose-700"
          : "bg-amber-100 text-amber-700")
      }
    >
      {s}
    </span>
  );

  const LeftGlyph = ({ type }: { type: Todo["type"] }) => {
    const base =
      "h-5 w-5 rounded-full grid place-items-center ring-1 ring-slate-200";
    if (type === "risk" || type === "risk2")
      return (
        <div className={`${base} bg-rose-50`}>
          <AlertCircle className="h-3.5 w-3.5 text-rose-600" />
        </div>
      );
    if (type === "opportunity")
      return (
        <div className={`${base} bg-emerald-50`}>
          <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
        </div>
      );
    return (
      <div className={`${base} bg-blue-50`}>
        <CheckCircle className="h-3.5 w-3.5 text-blue-600" />
      </div>
    );
  };

  return (
    <Card className="rounded-2xl border shadow-sm">
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 rounded-full grid place-items-center ring-1 ring-blue-200 bg-blue-50">
            <CheckCircle className="h-3.5 w-3.5 text-blue-600" />
          </div>
          <CardTitle className="text-base">Immediate To-Dos</CardTitle>
        </div>
        <Button variant="outline" size="sm">
          View All To-Dos
        </Button>
      </CardHeader>

      <CardContent className="space-y-3 pt-0">
        <p className="text-sm text-muted-foreground">
          AI-prioritized tasks requiring your attention based on recent data.
        </p>

        {todos.map((t) => (
          <div key={t.id} className="rounded-xl border bg-white p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <LeftGlyph type={t.type} />
                <div>
                  <div className="font-semibold text-slate-900">{t.title}</div>
                  <div className="text-sm text-slate-500 mt-0.5">
                    {t.subtitle}
                  </div>
                </div>
              </div>
              <SeverityPill s={t.severity} />
            </div>

            <div className="mt-3">
              <Button size="sm" className="bg-[#0ea5e9] hover:bg-[#0284c7]">
                {t.cta}
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

/* ---------------------------- Page Shell ---------------------------- */

export function OverviewDashboard() {
  return (
    <div className="flex h-screen bg-slate-50">
      <main className="flex-1 overflow-hidden">
        <div className="h-[calc(100vh-56px)] overflow-y-auto">
          <div className="mx-auto max-w-[1120px] px-6 py-6">
            <div className="lg:grid-cols-[minmax(0,1fr)_320px]">
              <ConversationIntel />
              {/* Right column intentionally empty */}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default OverviewDashboard;
