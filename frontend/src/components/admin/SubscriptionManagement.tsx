// src/components/admin/SubscriptionManagement.tsx
import React, { useMemo, useState } from "react";
import {
  CreditCard,
  ArrowUpRight,
  Home,
  Clock3,
  Zap,
  Database,
  Users,
  BarChart3,
  Pencil,
  CheckCircle2,
} from "lucide-react";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DataSourcePanel } from "@/components/DataSourcePanel";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/* ============================================================================
   Types & Mock Data (replace with live data)
   ============================================================================ */
type PlanTier = "Starter" | "Pro" | "Enterprise";

type Subscription = {
  plan: PlanTier;
  pricePerMonth: number; // USD
  contractStart: string; // ISO
  contractEnd: string; // ISO
  autoRenew: boolean;

  apiRateLimitPerHour: number;
  apiUsedThisHour: number;

  storageGbIncluded: number;
  storageGbUsed: number;

  seatsIncluded: number;
  seatsUsed: number;

  features: string[]; // purchased features
  featuresActive: string[]; // subset that are active
  supportLevel: "Standard" | "Priority" | "Premier";
  dataRetentionYears: 1 | 2 | 3;
};

const MOCK_SUBSCRIPTION: Subscription = {
  plan: "Pro",
  pricePerMonth: 299,
  contractStart: "2024-01-15T00:00:00.000Z",
  contractEnd: "2025-01-14T23:59:59.000Z",
  autoRenew: true,

  apiRateLimitPerHour: 10000,
  apiUsedThisHour: 2847,

  storageGbIncluded: 500,
  storageGbUsed: 127.3,

  seatsIncluded: 25,
  seatsUsed: 18,

  features: [
    "Advanced Analytics",
    "Custom Dashboards",
    "Real-time Reporting",
    "Customer Insights",
    "Predictive Analytics",
    "Custom Reports",
  ],
  featuresActive: [
    "Customer Insights",
    "Predictive Analytics",
    "Custom Reports",
  ],
  supportLevel: "Priority",
  dataRetentionYears: 2,
};

const PLAN_OPTIONS: Array<{
  tier: PlanTier;
  price: number;
  limits: { apiPerHour: number; storageGb: number; seats: number };
}> = [
  {
    tier: "Starter",
    price: 99,
    limits: { apiPerHour: 2000, storageGb: 50, seats: 5 },
  },
  {
    tier: "Pro",
    price: 299,
    limits: { apiPerHour: 10000, storageGb: 500, seats: 25 },
  },
  {
    tier: "Enterprise",
    price: 999,
    limits: { apiPerHour: 100000, storageGb: 5000, seats: 250 },
  },
];

/* ============================================================================
   Page
   ============================================================================ */
export function SubscriptionManagement() {
  const [sub, setSub] = useState<Subscription>(MOCK_SUBSCRIPTION);
  const [openUpgrade, setOpenUpgrade] = useState(false);
  const [openBilling, setOpenBilling] = useState(false);

  const remainingText = useMemo(() => {
    const end = new Date(sub.contractEnd).getTime();
    const now = Date.now();
    const ms = Math.max(end - now, 0);
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));
    const months = Math.floor(days / 30);
    const remDays = days - months * 30;
    return `${months} Months ${remDays} Days remaining`;
  }, [sub.contractEnd]);

  const apiPct = Math.min(
    100,
    (sub.apiUsedThisHour / sub.apiRateLimitPerHour) * 100
  );
  const storagePct = Math.min(
    100,
    (sub.storageGbUsed / sub.storageGbIncluded) * 100
  );
  const seatsPct = Math.min(100, (sub.seatsUsed / sub.seatsIncluded) * 100);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar activeKey="/admin/subscription" />

        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-14 border-b bg-white flex items-center px-4">
            <SidebarTrigger />
            <div className="ml-4">
              <div className="flex items-center gap-2 text-xs text-slate-500"></div>
              <h1 className="text-lg font-semibold">Subscription Management</h1>
            </div>

            <div className="ml-auto flex items-center gap-2">
              <Button variant="outline" onClick={() => setOpenBilling(true)}>
                <Pencil className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button
                className="bg-red-500 hover:bg-red-600 text-white"
                onClick={() => setOpenUpgrade(true)}
              >
                <ArrowUpRight className="w-4 h-4 mr-2" />
                Upgrade
              </Button>
            </div>
          </header>

          {/* Content + right rail */}
          <div className="flex-1 flex">
            <main className="flex-1 min-w-0 overflow-y-auto">
              <div className="mx-auto max-w-[1120px] px-6 py-6 font-['Poppins']">
                <Card className="border bg-white">
                  <CardContent className="p-0">
                    {/* Top “table” header */}
                    <div className="grid grid-cols-12 px-6 pt-5 pb-3 text-[12px] font-semibold text-red-600">
                      <div className="col-span-4">SUBSCRIPTION</div>
                      <div className="col-span-4">PURCHASED</div>
                      <div className="col-span-4">STATUS / IN USE</div>
                    </div>

                    {/* Rows */}
                    <Row
                      label="Plan Type"
                      leftIcon={
                        <BarChart3 className="w-4 h-4 text-slate-500" />
                      }
                      purchased={`${
                        sub.plan === "Pro" ? "DataAnalytics Pro" : sub.plan
                      }`}
                      status={
                        <Badge
                          variant="secondary"
                          className="bg-slate-900 text-white"
                        >
                          ACTIVE
                        </Badge>
                      }
                    />

                    <Row
                      label="Contract Duration"
                      purchased={
                        <div className="space-y-1">
                          <div>Start Date: {fmtDate(sub.contractStart)}</div>
                          <div>End Date: {fmtDate(sub.contractEnd)}</div>
                        </div>
                      }
                      status={
                        <span className="text-slate-700">{remainingText}</span>
                      }
                    />

                    <Row
                      label="Monthly Subscription"
                      leftIcon={
                        <CreditCard className="w-4 h-4 text-slate-500" />
                      }
                      purchased={`$${sub.pricePerMonth}/month`}
                      status={
                        <span className="text-slate-700">
                          {sub.autoRenew
                            ? "Auto-renew enabled"
                            : "Auto-renew disabled"}
                        </span>
                      }
                    />

                    <Row
                      label="API Rate Limit"
                      leftIcon={<Zap className="w-4 h-4 text-slate-500" />}
                      purchased={`${sub.apiRateLimitPerHour.toLocaleString()} requests / hour`}
                      status={
                        <div className="space-y-1">
                          <div className="text-slate-700">
                            {sub.apiUsedThisHour.toLocaleString()} used this
                            hour
                          </div>
                          <Progress value={apiPct} className="h-2" />
                        </div>
                      }
                    />

                    <Row
                      label="Data Storage"
                      leftIcon={<Database className="w-4 h-4 text-slate-500" />}
                      purchased={`${sub.storageGbIncluded.toLocaleString()} GB`}
                      status={
                        <div className="space-y-1">
                          <div className="text-slate-700">
                            {sub.storageGbUsed} GB used
                          </div>
                          <Progress value={storagePct} className="h-2" />
                        </div>
                      }
                    />

                    <Row
                      label="Analytics Features"
                      purchased={
                        <div className="space-y-1">
                          {sub.features.slice(0, 3).map((f) => (
                            <div key={f}>{f}</div>
                          ))}
                          {sub.features.slice(3).map((f) => (
                            <div key={f}>{f}</div>
                          ))}
                        </div>
                      }
                      status={
                        <div className="flex flex-wrap gap-2">
                          {sub.featuresActive.map((f) => (
                            <Badge
                              key={f}
                              variant="secondary"
                              className="bg-slate-900 text-white text-[10px]"
                            >
                              {f}{" "}
                              <span className="ml-1 rounded bg-green-500 text-white px-1 text-[9px]">
                                ACTIVE
                              </span>
                            </Badge>
                          ))}
                        </div>
                      }
                    />

                    <Row
                      label="User Seats"
                      leftIcon={<Users className="w-4 h-4 text-slate-500" />}
                      purchased={`${sub.seatsIncluded} seats`}
                      status={
                        <div className="space-y-1">
                          <div className="text-slate-700">
                            {sub.seatsUsed} seats in use
                          </div>
                          <Progress value={seatsPct} className="h-2" />
                        </div>
                      }
                    />

                    <Row
                      label="Support Level"
                      leftIcon={<Clock3 className="w-4 h-4 text-slate-500" />}
                      purchased={`${sub.supportLevel} Support`}
                      status={
                        <Badge
                          variant="secondary"
                          className="bg-slate-900 text-white"
                        >
                          ACTIVE
                        </Badge>
                      }
                    />

                    <Row
                      label="Data Retention"
                      purchased={`${sub.dataRetentionYears} Years`}
                      status={
                        <Badge
                          variant="secondary"
                          className="bg-slate-900 text-white"
                        >
                          ACTIVE
                        </Badge>
                      }
                    />
                  </CardContent>
                </Card>

                {/* Footnote / description */}
                <Card className="mt-6 border bg-white">
                  <CardContent className="p-5">
                    <div className="text-sm font-semibold mb-2">
                      DataAnalytics Pro Subscription
                    </div>
                    <ul className="text-sm text-slate-600 list-disc pl-5 space-y-1">
                      <li>
                        Advanced analytics platform with predictive insights and
                        custom reporting
                      </li>
                      <li>
                        Current usage is well within limits across all service
                        categories
                      </li>
                      <li>
                        Priority support included with 24/7 technical assistance
                      </li>
                      <li>
                        Auto-renewal active – next billing date:{" "}
                        {fmtDate(
                          addMonth(
                            new Date(sub.contractStart),
                            12
                          ).toISOString()
                        )}
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                {/* Quick usage summary cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <UsageCard
                    label="API Usage (this hour)"
                    value={`${sub.apiUsedThisHour.toLocaleString()} / ${sub.apiRateLimitPerHour.toLocaleString()}`}
                    pct={apiPct}
                  />
                  <UsageCard
                    label="Storage Used"
                    value={`${sub.storageGbUsed} GB / ${sub.storageGbIncluded} GB`}
                    pct={storagePct}
                  />
                  <UsageCard
                    label="Seats Used"
                    value={`${sub.seatsUsed} / ${sub.seatsIncluded}`}
                    pct={seatsPct}
                  />
                </div>
              </div>
            </main>

            {/* Right rail */}
            <DataSourcePanel />
          </div>
        </div>
      </div>

      {/* Upgrade dialog */}
      <UpgradeDialog
        open={openUpgrade}
        onOpenChange={setOpenUpgrade}
        current={sub}
        onConfirm={(tier) => {
          // TODO backend: POST /subscription/upgrade { targetTier: tier }
          const plan = PLAN_OPTIONS.find((p) => p.tier === tier)!;
          setSub((prev) => ({
            ...prev,
            plan: plan.tier,
            pricePerMonth: plan.price,
            apiRateLimitPerHour: plan.limits.apiPerHour,
            storageGbIncluded: plan.limits.storageGb,
            seatsIncluded: plan.limits.seats,
          }));
          setOpenUpgrade(false);
        }}
      />

      {/* Edit billing dialog */}
      <BillingDialog
        open={openBilling}
        onOpenChange={setOpenBilling}
        sub={sub}
        onSave={(payload) => {
          // TODO backend: POST /billing/profile  (card & address)
          // TODO backend: PATCH /subscription { autoRenew, supportLevel, retentionYears }
          setSub((prev) => ({
            ...prev,
            autoRenew: payload.autoRenew,
            supportLevel: payload.supportLevel,
            dataRetentionYears: payload.retentionYears,
          }));
          setOpenBilling(false);
        }}
      />
    </SidebarProvider>
  );
}

/* ============================================================================
   Row component (three-column definition row)
   ============================================================================ */
function Row({
  label,
  purchased,
  status,
  leftIcon,
}: {
  label: string;
  purchased: React.ReactNode;
  status: React.ReactNode;
  leftIcon?: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-12 items-start px-6 py-4 border-t">
      <div className="col-span-4">
        <div className="flex items-center gap-2 font-medium text-slate-900">
          {leftIcon}
          <span>{label}</span>
        </div>
      </div>
      <div className="col-span-4 text-slate-800">{purchased}</div>
      <div className="col-span-4">{status}</div>
    </div>
  );
}

/* ============================================================================
   Usage mini card
   ============================================================================ */
function UsageCard({
  label,
  value,
  pct,
}: {
  label: string;
  value: string;
  pct: number;
}) {
  return (
    <Card className="border bg-white">
      <CardContent className="p-4">
        <div className="text-sm text-slate-600">{label}</div>
        <div className="text-lg font-semibold mt-1">{value}</div>
        <Progress value={pct} className="h-2 mt-2" />
      </CardContent>
    </Card>
  );
}

/* ============================================================================
   Upgrade Plan Dialog
   ============================================================================ */
function UpgradeDialog({
  open,
  onOpenChange,
  current,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  current: Subscription;
  onConfirm: (tier: PlanTier) => void;
}) {
  const [tier, setTier] = useState<PlanTier>(current.plan);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Change Plan</DialogTitle>
          <DialogDescription>
            Select a plan that fits your organization.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <Label>Plan</Label>
          <Select value={tier} onValueChange={(v) => setTier(v as PlanTier)}>
            <SelectTrigger>
              <SelectValue placeholder="Select plan" />
            </SelectTrigger>
            <SelectContent>
              {PLAN_OPTIONS.map((p) => (
                <SelectItem key={p.tier} value={p.tier}>
                  {p.tier} — ${p.price}/mo ·{" "}
                  {p.limits.apiPerHour.toLocaleString()} req/hr ·{" "}
                  {p.limits.storageGb} GB · {p.limits.seats} seats
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex items-center gap-2 text-xs text-slate-600 mt-2">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            Prorated billing will be applied on change.
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            className="bg-red-500 hover:bg-red-600 text-white"
            onClick={() => onConfirm(tier)}
          >
            <ArrowUpRight className="w-4 h-4 mr-2" />
            Confirm Change
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ============================================================================
   Billing & Settings Dialog
   ============================================================================ */
function BillingDialog({
  open,
  onOpenChange,
  sub,
  onSave,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  sub: Subscription;
  onSave: (payload: {
    cardNumber: string;
    nameOnCard: string;
    autoRenew: boolean;
    supportLevel: Subscription["supportLevel"];
    retentionYears: Subscription["dataRetentionYears"];
    address: string;
  }) => void;
}) {
  const [cardNumber, setCardNumber] = useState("");
  const [nameOnCard, setNameOnCard] = useState("");
  const [address, setAddress] = useState("");
  const [autoRenew, setAutoRenew] = useState(sub.autoRenew);
  const [supportLevel, setSupportLevel] = useState<
    Subscription["supportLevel"]
  >(sub.supportLevel);
  const [retentionYears, setRetentionYears] = useState<
    Subscription["dataRetentionYears"]
  >(sub.dataRetentionYears);

  const save = () =>
    onSave({
      cardNumber,
      nameOnCard,
      autoRenew,
      supportLevel,
      retentionYears,
      address,
    });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle>Edit Billing & Settings</DialogTitle>
          <DialogDescription>
            Manage payment details and account-wide settings.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Name on Card</Label>
              <Input
                value={nameOnCard}
                onChange={(e) => setNameOnCard(e.target.value)}
                placeholder="Jane Doe"
              />
            </div>
            <div className="space-y-2">
              <Label>Card Number</Label>
              <Input
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                placeholder="4242 4242 4242 4242"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Billing Address</Label>
            <Input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Street, City, State, ZIP"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label>Auto-renew</Label>
              <Select
                value={autoRenew ? "on" : "off"}
                onValueChange={(v) => setAutoRenew(v === "on")}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="on">Enabled</SelectItem>
                  <SelectItem value="off">Disabled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Support Level</Label>
              <Select
                value={supportLevel}
                onValueChange={(v) =>
                  setSupportLevel(v as Subscription["supportLevel"])
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Standard">Standard</SelectItem>
                  <SelectItem value="Priority">Priority</SelectItem>
                  <SelectItem value="Premier">Premier</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Data Retention</Label>
              <Select
                value={String(retentionYears)}
                onValueChange={(v) => setRetentionYears(Number(v) as 1 | 2 | 3)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Year</SelectItem>
                  <SelectItem value="2">2 Years</SelectItem>
                  <SelectItem value="3">3 Years</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="text-xs text-slate-500">
            {/* TODO backend: tokenize card with your PSP (e.g., Stripe) and never store raw PAN. */}
            Your card is processed securely. We do not store card numbers on our
            servers.
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={save}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ============================================================================
   Utils
   ============================================================================ */
function fmtDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
function addMonth(d: Date, m: number) {
  const nd = new Date(d);
  nd.setMonth(nd.getMonth() + m);
  return nd;
}
