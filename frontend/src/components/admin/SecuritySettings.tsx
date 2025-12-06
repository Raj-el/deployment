import React, { useMemo, useRef, useState } from "react";
import {
  Key,
  Shield,
  AlertTriangle,
  Eye,
  EyeOff,
  Copy,
  RotateCcw,
  Trash2,
  CreditCard,
  TrendingUp,
  Plus,
  CalendarClock,
} from "lucide-react";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DataSourcePanel } from "@/components/DataSourcePanel";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

/* =============================================================================
   Mock Data (replace with Supabase/REST later)
   ============================================================================= */
type ApiKey = {
  id: string;
  name: string;
  keyMasked: string; // masked for list view
  fullKey: string; // unmasked (never ship to client in prod)
  createdAt: string;
  lastUsed: string;
  status: "active" | "inactive" | "revoked";
  permissions: string[];
  expiresAt?: string; // ISO
};

const MOCK_KEYS: ApiKey[] = [
  {
    id: "k_1",
    name: "Integration Service",
    keyMasked: "sk_live_abc123…xyz789",
    fullKey: "sk_live_abc1234567890xyz789",
    createdAt: "2025-01-15",
    lastUsed: "2 hours ago",
    status: "active",
    permissions: ["read", "write"],
    expiresAt: "2025-12-31",
  },
  {
    id: "k_2",
    name: "Analytics Dashboard",
    keyMasked: "sk_live_def456…uvw123",
    fullKey: "sk_live_def456000111uvw123",
    createdAt: "2025-01-10",
    lastUsed: "1 day ago",
    status: "active",
    permissions: ["read"],
  },
  {
    id: "k_3",
    name: "Backup Service",
    keyMasked: "sk_live_ghi789…rst456",
    fullKey: "sk_live_ghi789555666rst456",
    createdAt: "2025-01-01",
    lastUsed: "1 week ago",
    status: "inactive",
    permissions: ["read", "backup"],
    expiresAt: "2025-08-01",
  },
];

const MOCK_USAGE_24H = 847; // show in stats (replace with metrics)
const SECURITY_EVENTS = [
  {
    type: "login_success",
    who: "john.doe@company.com",
    ip: "192.168.1.100",
    when: "2m ago",
  },
  {
    type: "login_failed",
    who: "unknown@suspicious.com",
    ip: "203.0.113.42",
    when: "1h ago",
  },
  {
    type: "api_key_used",
    who: "Integration Service",
    ip: "10.0.0.50",
    when: "3h ago",
  },
  {
    type: "password_reset",
    who: "sarah.wilson@company.com",
    ip: "192.168.1.101",
    when: "1d ago",
  },
];

const PLAN = {
  name: "Growth",
  price: "$299/mo",
  limits: { apiCalls: 100000, seats: 20, projects: 10 },
  usage: { apiCalls: 44000, seats: 12, projects: 7 },
};

/* =============================================================================
   Page
   ============================================================================= */
export function SecuritySettings() {
  const [keys, setKeys] = useState<ApiKey[]>(MOCK_KEYS);
  const [search, setSearch] = useState("");
  const [revealId, setRevealId] = useState<string | null>(null);

  // Create key modal
  const [openCreate, setOpenCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPerms, setNewPerms] = useState<string[]>(["read"]);
  const [expiresInDays, setExpiresInDays] = useState<string>("90");

  // Billing edit (mock)
  const fileRef = useRef<HTMLInputElement | null>(null);

  const stats = useMemo(() => {
    const active = keys.filter((k) => k.status === "active").length;
    return {
      active,
      usage24h: MOCK_USAGE_24H,
      securityScore: "99.9%",
      failedLogins24h: 1,
    };
  }, [keys]);

  const filtered = useMemo(
    () =>
      keys.filter((k) =>
        (k.name + k.keyMasked)
          .toLowerCase()
          .includes(search.trim().toLowerCase())
      ),
    [keys, search]
  );

  /* ---------------------------------- Actions (wire to backend later) ---------------------------------- */

  const copyFullKey = async (k: ApiKey) => {
    await navigator.clipboard.writeText(k.fullKey);
    // TODO: toast "Copied"
  };

  const regenerateKey = (id: string) => {
    setKeys((prev) =>
      prev.map((k) =>
        k.id === id
          ? {
              ...k,
              keyMasked:
                "sk_live_" +
                Math.random().toString(36).slice(2, 8) +
                "…" +
                Math.random().toString(36).slice(2, 8),
              // NOTE: backend should return a brand new secret here; never generate on client
            }
          : k
      )
    );
    // TODO: POST /api/keys/:id/regenerate -> returns new masked + secret once (show once flow)
  };

  const revokeKey = (id: string) => {
    setKeys((prev) =>
      prev.map((k) => (k.id === id ? { ...k, status: "revoked" } : k))
    );
    // TODO: POST /api/keys/:id/revoke
  };

  const createKey = () => {
    const id = "k_" + Date.now();
    const expiresAt =
      expiresInDays === "never"
        ? undefined
        : new Date(Date.now() + Number(expiresInDays) * 24 * 60 * 60 * 1000)
            .toISOString()
            .slice(0, 10);

    const newKey: ApiKey = {
      id,
      name: newName || "New Key",
      keyMasked:
        "sk_live_" +
        Math.random().toString(36).slice(2, 8) +
        "…" +
        Math.random().toString(36).slice(2, 8),
      fullKey: "sk_live_" + cryptoRandomLike(), // shown ONLY once on server in real impl
      createdAt: new Date().toISOString().slice(0, 10),
      lastUsed: "never",
      status: "active",
      permissions: newPerms,
      expiresAt,
    };
    setKeys([newKey, ...keys]);
    setOpenCreate(false);
    setNewName("");
    setNewPerms(["read"]);
    setExpiresInDays("90");
    // TODO: POST /api/keys {name, permissions, expiresAt} -> returns masked & one-time secret
  };

  const onUploadBillingDoc = () => fileRef.current?.click();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />

        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-14 border-b bg-white flex items-center px-4">
            <SidebarTrigger />
            <h1 className="ml-4 text-lg font-semibold">
              Security & Subscriptions
            </h1>

            <div className="ml-auto flex items-center gap-2">
              <div className="relative w-[320px]">
                <Input
                  placeholder="Search API keys…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-3"
                />
              </div>
              <Button
                onClick={() => setOpenCreate(true)}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                <Key className="w-4 h-4 mr-2" />
                Generate API Key
              </Button>
            </div>
          </header>

          {/* Content + right rail */}
          <div className="flex-1 flex">
            {/* MAIN */}
            <main className="flex-1 min-w-0 overflow-y-auto">
              <div className="mx-auto max-w-[1120px] px-6 py-6">
                {/* Stats row */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-6">
                  <StatPill
                    icon={<Shield className="w-6 h-6 text-emerald-600" />}
                    value={stats.securityScore}
                    label="Security Score"
                  />
                  <StatPill
                    icon={<Key className="w-6 h-6 text-blue-600" />}
                    value={stats.active}
                    label="Active API Keys"
                  />
                  <StatPill
                    icon={<AlertTriangle className="w-6 h-6 text-orange-600" />}
                    value={stats.failedLogins24h}
                    label="Failed Logins (24h)"
                  />
                  <StatPill
                    icon={<TrendingUp className="w-6 h-6 text-indigo-600" />}
                    value={MOCK_USAGE_24H}
                    label="API Requests (24h)"
                  />
                </div>

                {/* Tabs */}
                <Tabs defaultValue="api-keys" className="space-y-6">
                  <TabsList className="grid w-full grid-cols-3 lg:w-[520px]">
                    <TabsTrigger value="api-keys">API Keys</TabsTrigger>
                    <TabsTrigger value="subscription">Subscription</TabsTrigger>
                    <TabsTrigger value="audit-log">Audit Log</TabsTrigger>
                  </TabsList>

                  {/* API Keys */}
                  <TabsContent value="api-keys" className="space-y-6">
                    <Card className="border bg-white shadow-sm">
                      <CardHeader>
                        <CardTitle>API Key Management</CardTitle>
                        <CardDescription>
                          Create, revoke, set expirations, and scope
                          permissions.
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Name</TableHead>
                              <TableHead>Key</TableHead>
                              <TableHead>Permissions</TableHead>
                              <TableHead>Expires</TableHead>
                              <TableHead>Last Used</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead className="text-right">
                                Actions
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filtered.map((k) => (
                              <TableRow key={k.id} className="hover:bg-gray-50">
                                <TableCell>
                                  <div>
                                    <div className="font-medium text-gray-900">
                                      {k.name}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      Created: {k.createdAt}
                                    </div>
                                  </div>
                                </TableCell>

                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <code className="text-sm bg-gray-100 px-2 py-1 rounded font-mono">
                                      {revealId === k.id
                                        ? k.fullKey
                                        : k.keyMasked}
                                    </code>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-7 w-7"
                                      onClick={() =>
                                        setRevealId(
                                          revealId === k.id ? null : k.id
                                        )
                                      }
                                      title={
                                        revealId === k.id
                                          ? "Hide secret"
                                          : "Reveal once"
                                      }
                                    >
                                      {revealId === k.id ? (
                                        <EyeOff className="w-4 h-4" />
                                      ) : (
                                        <Eye className="w-4 h-4" />
                                      )}
                                    </Button>
                                  </div>
                                </TableCell>

                                <TableCell>
                                  <div className="flex flex-wrap gap-1">
                                    {k.permissions.map((p) => (
                                      <Badge
                                        key={p}
                                        variant="outline"
                                        className="text-[11px]"
                                      >
                                        {p}
                                      </Badge>
                                    ))}
                                  </div>
                                </TableCell>

                                <TableCell>
                                  {k.expiresAt ? (
                                    <div className="flex items-center gap-1 text-sm">
                                      <CalendarClock className="w-4 h-4 text-gray-500" />
                                      {k.expiresAt}
                                    </div>
                                  ) : (
                                    <span className="text-sm text-gray-500">
                                      Never
                                    </span>
                                  )}
                                </TableCell>

                                <TableCell className="text-sm text-gray-600">
                                  {k.lastUsed}
                                </TableCell>

                                <TableCell>
                                  <Badge
                                    variant={
                                      k.status === "active"
                                        ? "default"
                                        : k.status === "revoked"
                                        ? "destructive"
                                        : "secondary"
                                    }
                                    className={
                                      k.status === "active"
                                        ? "bg-green-100 text-green-800"
                                        : ""
                                    }
                                  >
                                    {k.status}
                                  </Badge>
                                </TableCell>

                                <TableCell className="text-right">
                                  <div className="flex items-center justify-end gap-1">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8"
                                      onClick={() => copyFullKey(k)}
                                      title="Copy"
                                    >
                                      <Copy className="w-4 h-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8"
                                      onClick={() => regenerateKey(k.id)}
                                      title="Regenerate"
                                    >
                                      <RotateCcw className="w-4 h-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8 text-red-600"
                                      onClick={() => revokeKey(k.id)}
                                      title="Revoke"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Subscription */}
                  <TabsContent value="subscription" className="space-y-6">
                    <Card className="border bg-white shadow-sm">
                      <CardHeader>
                        <CardTitle>Subscription</CardTitle>
                        <CardDescription>
                          View plan, usage, and manage billing.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-xl bg-gray-50 flex items-center justify-center">
                              <CreditCard className="w-6 h-6 text-gray-700" />
                            </div>
                            <div>
                              <div className="text-lg font-semibold">
                                {PLAN.name}
                              </div>
                              <div className="text-sm text-gray-600">
                                {PLAN.price}
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline">Change Plan</Button>
                            <Button
                              className="bg-red-500 hover:bg-red-600 text-white"
                              onClick={onUploadBillingDoc}
                            >
                              Update Billing
                            </Button>
                            <input
                              ref={fileRef}
                              type="file"
                              className="hidden"
                            />
                          </div>
                        </div>

                        {/* Usage bars */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <UsageBar
                            label="API Calls"
                            used={PLAN.usage.apiCalls}
                            limit={PLAN.limits.apiCalls}
                          />
                          <UsageBar
                            label="Seats"
                            used={PLAN.usage.seats}
                            limit={PLAN.limits.seats}
                          />
                          <UsageBar
                            label="Projects"
                            used={PLAN.usage.projects}
                            limit={PLAN.limits.projects}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Audit Log */}
                  <TabsContent value="audit-log" className="space-y-6">
                    <Card className="border bg-white shadow-sm">
                      <CardHeader>
                        <CardTitle>Security Audit Log</CardTitle>
                        <CardDescription>
                          Monitor authentication and API activity.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {SECURITY_EVENTS.map((e, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-4 p-3 rounded-lg border bg-gray-50"
                          >
                            <span className="text-sm font-medium uppercase tracking-wide text-gray-700">
                              {e.type.replace("_", " ")}
                            </span>
                            <Badge variant="outline" className="text-[11px]">
                              {e.ip}
                            </Badge>
                            <span className="text-sm text-gray-700">
                              {e.who}
                            </span>
                            <span className="ml-auto text-xs text-gray-500">
                              {e.when}
                            </span>
                          </div>
                        ))}
                        {/* TODO: server-side pagination & filters (date range, user, IP, type) */}
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </main>

            {/* RIGHT RAIL (Content Tree / Integrations) */}
            <DataSourcePanel />
          </div>
        </div>
      </div>

      {/* Create API Key Dialog */}
      <Dialog open={openCreate} onOpenChange={setOpenCreate}>
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle>Generate API Key</DialogTitle>
            <DialogDescription>
              Define scope, optional expiry, and a friendly name.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3 items-center">
              <Label className="col-span-1">Name</Label>
              <Input
                className="col-span-2"
                placeholder="e.g., Zapier Integration"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-3 gap-3 items-start">
              <Label className="col-span-1 pt-2">Permissions</Label>
              <div className="col-span-2 flex flex-wrap gap-2">
                {["read", "write", "backup", "admin"].map((p) => {
                  const active = newPerms.includes(p);
                  return (
                    <Button
                      key={p}
                      type="button"
                      variant={active ? "default" : "outline"}
                      className={
                        active
                          ? "bg-blue-600 hover:bg-blue-700 text-white h-8"
                          : "h-8"
                      }
                      onClick={() =>
                        setNewPerms((prev) =>
                          prev.includes(p)
                            ? prev.filter((x) => x !== p)
                            : [...prev, p]
                        )
                      }
                    >
                      {active ? "✓ " : ""}
                      {p}
                    </Button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 items-center">
              <Label className="col-span-1">Expiration</Label>
              <Select value={expiresInDays} onValueChange={setExpiresInDays}>
                <SelectTrigger className="col-span-2">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 days</SelectItem>
                  <SelectItem value="90">90 days</SelectItem>
                  <SelectItem value="180">180 days</SelectItem>
                  <SelectItem value="365">1 year</SelectItem>
                  <SelectItem value="never">Never</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenCreate(false)}>
              Cancel
            </Button>
            <Button
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={createKey}
            >
              <Plus className="w-4 h-4 mr-2" />
              Generate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
}

/* =============================================================================
   Helpers / small components
   ============================================================================= */
function StatPill({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: number | string;
  label: string;
}) {
  return (
    <Card className="rounded-2xl border bg-white shadow-sm">
      <CardContent className="p-5">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-gray-50 flex items-center justify-center">
            {icon}
          </div>
          <div>
            <div className="text-3xl font-bold leading-7">{value}</div>
            <div className="text-sm text-gray-600 mt-1">{label}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function UsageBar({
  label,
  used,
  limit,
}: {
  label: string;
  used: number;
  limit: number;
}) {
  const pct = Math.min(100, Math.round((used / limit) * 100));
  return (
    <div className="p-4 rounded-xl border bg-white">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-medium text-gray-800">{label}</div>
        <div className="text-sm text-gray-700">
          {used.toLocaleString()} / {limit.toLocaleString()}
        </div>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-green-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="text-xs text-gray-500 mt-1">{pct}% of plan</div>
    </div>
  );
}

function cryptoRandomLike() {
  // simple client placeholder; real key must be created server-side
  return (
    Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2)
  );
}

export default SecuritySettings;
