// src/components/content/ContentManager.tsx
import React, { useMemo, useState } from "react";
import {
  ArrowLeft,
  Database,
  FolderOpen,
  Link,
  Settings,
  PlugZap,
  Unplug,
  Upload,
  CheckCircle2,
  Clock,
  Search,
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

type SourceStatus = "connected" | "not_connected" | "pending";
type Source = {
  key: string;
  name: string;
  blurb: string;
  category: "CRM" | "Support" | "CS Ops" | "Docs" | "Chat/Collab" | "Files";
  status: SourceStatus;
  docs?: number;
  lastSync?: string;
};

const MOCK_SOURCES: Source[] = [
  {
    key: "salesforce",
    name: "Salesforce",
    blurb: "Accounts, contacts, opportunities, support cases.",
    category: "CRM",
    status: "connected",
    docs: 1423,
    lastSync: "2h ago",
  },
  {
    key: "hubspot",
    name: "HubSpot",
    blurb: "Leads, deals, marketing activities, tickets.",
    category: "CRM",
    status: "not_connected",
  },
  {
    key: "zendesk",
    name: "Zendesk",
    blurb: "Support tickets, customer interactions, help center articles.",
    category: "Support",
    status: "pending",
  },
  {
    key: "gainsight",
    name: "Gainsight",
    blurb: "Health scores, playbooks, customer lifecycle data.",
    category: "CS Ops",
    status: "connected",
    docs: 318,
    lastSync: "1h ago",
  },
  {
    key: "totango",
    name: "Totango",
    blurb: "Customer success segments, health, tasks.",
    category: "CS Ops",
    status: "not_connected",
  },
  {
    key: "teams",
    name: "Microsoft Teams",
    blurb: "Chat transcripts, meeting notes, shared files.",
    category: "Chat/Collab",
    status: "not_connected",
  },
  {
    key: "slack",
    name: "Slack",
    blurb: "Channel messages, threads, shared files.",
    category: "Chat/Collab",
    status: "connected",
    docs: 928,
    lastSync: "Just now",
  },
  {
    key: "sharepoint",
    name: "SharePoint",
    blurb: "Documents, lists, internal sites. Data is synced and indexed.",
    category: "Docs",
    status: "connected",
    docs: 560,
    lastSync: "4h ago",
  },
  {
    key: "gdrive",
    name: "Google Drive",
    blurb: "Docs, Sheets, Slides, shared Drive files.",
    category: "Files",
    status: "not_connected",
  },
];

function StatusBadge({ status }: { status: SourceStatus }) {
  if (status === "connected")
    return <Badge className="bg-emerald-100 text-emerald-800">Connected</Badge>;
  if (status === "pending")
    return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
  return <Badge className="bg-rose-100 text-rose-800">Not Connected</Badge>;
}

function SourceIcon({ name }: { name: string }) {
  const map: Record<string, string> = {
    Salesforce: "⚡",
    HubSpot: "📈",
    Zendesk: "🛠️",
    Gainsight: "🧭",
    Totango: "🗂️",
    "Microsoft Teams": "💬",
    Slack: "💬",
    SharePoint: "📁",
    "Google Drive": "🟩",
  };
  return (
    <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-xl">
      {map[name] ?? "📦"}
    </div>
  );
}

export function ContentManager() {
  const [tab, setTab] = useState<"sources" | "upload">("sources");
  const [search, setSearch] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const filtered = useMemo(
    () =>
      MOCK_SOURCES.filter((s) =>
        (s.name + s.category + s.blurb)
          .toLowerCase()
          .includes(search.toLowerCase())
      ),
    [search]
  );

  const onDropFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    setProgress(0);
    // TODO(back-end): POST /uploads (multipart) -> returns ids; then POST /ingest to index
    let pct = 0;
    const t = setInterval(() => {
      pct += 8 + Math.random() * 12;
      setProgress(Math.min(100, pct));
      if (pct >= 100) {
        clearInterval(t);
        setTimeout(() => setUploading(false), 400);
      }
    }, 250);
  };

  const onBrowse = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;
    input.accept = ".pdf,.doc,.docx,.txt,.md,.ppt,.pptx";
    input.onchange = () => onDropFiles(input.files);
    input.click();
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        {/* LEFT NAV */}
        <AppSidebar activeKey="/library/content-manager" />
        {/* CENTER + RIGHT */}
        <div className="flex-1 flex flex-col">
          {/* TOP BAR */}
          <header className="h-14 border-b bg-white flex items-center px-4">
            <SidebarTrigger />
            <div className="ml-4">
              <h1 className="text-lg font-semibold">Content Manager</h1>
            </div>
          </header>

          <div className="flex-1 flex">
            {/* MAIN */}
            <main className="flex-1 min-w-0 overflow-y-auto">
              <div className="mx-auto max-w-[1120px] px-6 py-6 font-['Poppins']">
                <div className="mt-5">
                  <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
                    <TabsList className="w-full grid grid-cols-2 bg-slate-100 rounded-full p-1">
                      <TabsTrigger
                        value="sources"
                        className="rounded-full data-[state=active]:bg-white data-[state=active]:shadow-sm"
                      >
                        Connected Data Sources
                      </TabsTrigger>
                      <TabsTrigger
                        value="upload"
                        className="rounded-full data-[state=active]:bg-white data-[state=active]:shadow-sm"
                      >
                        Manual Upload
                      </TabsTrigger>
                    </TabsList>

                    {/* === Connected Data Sources === */}
                    <TabsContent value="sources" className="mt-5">
                      <Card className="border bg-white">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">
                            Automated Data Ingestion
                          </CardTitle>
                          <CardDescription>
                            Connect and manage automated data feeds from your
                            various platforms.
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                            {filtered.map((s) => (
                              <Card key={s.key} className="border bg-white">
                                <CardContent className="p-5">
                                  <div className="flex items-start gap-3">
                                    <SourceIcon name={s.name} />
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2">
                                        <h3 className="font-semibold text-slate-900">
                                          {s.name}
                                        </h3>
                                        <StatusBadge status={s.status} />
                                      </div>
                                      <p className="text-sm text-slate-600 mt-1">
                                        {s.blurb}
                                      </p>

                                      {s.status === "connected" && (
                                        <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                                          <div className="flex items-center gap-2">
                                            <FolderOpen className="w-4 h-4 text-slate-400" />
                                            <span>
                                              {(s.docs ?? 0).toLocaleString()}{" "}
                                              docs
                                            </span>
                                          </div>
                                          <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-slate-400" />
                                            <span>Last sync: {s.lastSync}</span>
                                          </div>
                                        </div>
                                      )}

                                      <div className="mt-4 flex gap-2">
                                        {s.status === "connected" && (
                                          <>
                                            <Button
                                              variant="outline"
                                              className="gap-2"
                                            >
                                              <Settings className="w-4 h-4" />
                                              Configure
                                            </Button>
                                            <Button className="bg-rose-500 hover:bg-rose-600 text-white gap-2">
                                              <Unplug className="w-4 h-4" />
                                              Disconnect
                                            </Button>
                                            {/* TODO(back-end):
                                                - Configure: open modal -> PATCH /sources/:key
                                                - Disconnect: DELETE /sources/:key (revoke + stop jobs)
                                             */}
                                          </>
                                        )}
                                        {s.status === "not_connected" && (
                                          <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
                                            <PlugZap className="w-4 h-4" />
                                            Connect
                                          </Button>
                                          /* TODO(back-end): start OAuth/keys then POST /sources */
                                        )}
                                        {s.status === "pending" && (
                                          <Button
                                            disabled
                                            className="bg-blue-600 text-white gap-2"
                                          >
                                            <Clock className="w-4 h-4" />
                                            Connection Pending…
                                          </Button>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    {/* === Manual Upload === */}
                    <TabsContent value="upload" className="mt-5">
                      <Card className="border bg-white">
                        <CardHeader>
                          <CardTitle>Upload Documents</CardTitle>
                          <CardDescription>
                            Drag & drop or browse. Supported: PDF, DOCX, TXT,
                            MD, PPT/PPTX
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div
                            className={[
                              "rounded-2xl border-2 border-dashed p-10 text-center transition",
                              dragOver
                                ? "border-blue-500 bg-blue-50"
                                : "border-slate-300 hover:bg-slate-50",
                            ].join(" ")}
                            onDragOver={(e) => {
                              e.preventDefault();
                              setDragOver(true);
                            }}
                            onDragLeave={() => setDragOver(false)}
                            onDrop={(e) => {
                              e.preventDefault();
                              setDragOver(false);
                              onDropFiles(e.dataTransfer.files);
                            }}
                            onClick={onBrowse}
                          >
                            <Upload
                              className={`w-14 h-14 mx-auto ${
                                dragOver ? "text-blue-600" : "text-slate-400"
                              }`}
                            />
                            <div className="mt-3 font-medium text-slate-900">
                              {dragOver
                                ? "Drop files to upload"
                                : "Upload your documents"}
                            </div>
                            <div className="text-sm text-slate-600">
                              Drag & drop files here, or click to browse
                            </div>

                            {!uploading && (
                              <div className="mt-4">
                                <Button
                                  onClick={onBrowse}
                                  className="bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                  Browse Files
                                </Button>
                              </div>
                            )}

                            {uploading && (
                              <div className="mt-6 max-w-md mx-auto">
                                <div className="flex items-center justify-between text-sm text-slate-600 mb-2">
                                  <span>Uploading & processing…</span>
                                  <span>{Math.floor(progress)}%</span>
                                </div>
                                <Progress value={progress} className="h-2" />
                              </div>
                            )}
                          </div>

                          {/* TODO(back-end):
                              - Validate client-side; show per-file progress/errors
                              - POST /uploads -> get job ids; then POST /ingest
                              - Poll /jobs/:id or use SSE/WebSocket for status
                           */}
                        </CardContent>
                      </Card>

                      {/* Recent uploads (static sample; wire to API) */}
                      <Card className="mt-5 border bg-white">
                        <CardHeader>
                          <CardTitle>Recent Uploads</CardTitle>
                          <CardDescription>
                            Files uploaded directly to the knowledge base
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {[
                            {
                              name: "Product Roadmap Q4.pdf",
                              size: "2.4 MB",
                              when: "1 hour ago",
                              status: "Processed",
                            },
                            {
                              name: "Customer Onboarding Guide.docx",
                              size: "1.8 MB",
                              when: "3 hours ago",
                              status: "Processed",
                            },
                            {
                              name: "API Documentation.md",
                              size: "856 KB",
                              when: "Yesterday",
                              status: "Processing",
                            },
                          ].map((f) => (
                            <div
                              key={f.name}
                              className="flex items-center gap-4 p-4 rounded-lg border bg-slate-50"
                            >
                              <div className="w-10 h-10 rounded-md bg-blue-100 flex items-center justify-center">
                                <FolderOpen className="w-5 h-5 text-blue-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-slate-900 truncate">
                                  {f.name}
                                </div>
                                <div className="text-sm text-slate-600">
                                  {f.size} • {f.when}
                                </div>
                              </div>
                              {f.status === "Processed" ? (
                                <Badge className="bg-emerald-100 text-emerald-800 flex items-center gap-1">
                                  <CheckCircle2 className="w-4 h-4" />{" "}
                                  {f.status}
                                </Badge>
                              ) : (
                                <Badge className="bg-yellow-100 text-yellow-800 flex items-center gap-1">
                                  <Clock className="w-4 h-4" /> {f.status}
                                </Badge>
                              )}
                            </div>
                          ))}
                          {/* TODO(back-end): GET /uploads?limit=10 */}
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </main>

            {/* RIGHT RAIL */}
            <DataSourcePanel />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
