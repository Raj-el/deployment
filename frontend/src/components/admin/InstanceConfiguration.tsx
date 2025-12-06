// src/components/admin/InstanceConfiguration.tsx
import React, { useMemo, useState } from "react";
import {
  Plus,
  ChevronDown,
  Paintbrush,
  Bell,
  LayoutDashboard,
  BookOpenCheck,
  Building2,
  SlidersHorizontal,
  Sun,
  Moon,
} from "lucide-react";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DataSourcePanel } from "@/components/DataSourcePanel";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

/* =====================================================================================
   Mock shape (replace with your config table). Each key mirrors the screenshot rows.
   ===================================================================================== */
type ConfigRow =
  | {
      key: "company-info";
      summary: string;
      value: string; // pointer/slug
      type: "pointer";
    }
  | {
      key: "whats-new";
      summary: string;
      value: string; // release note bundle id
      type: "pointer";
    }
  | {
      key: "theme";
      summary: string;
      value: "light" | "dark" | "system";
      type: "theme";
    }
  | {
      key: "analytics-dashboard";
      summary: string;
      value: string; // dashboard layout id
      type: "pointer";
    }
  | {
      key: "user-preferences";
      summary: string;
      value: {
        defaultLocale: string;
        compactMode: boolean;
        tipsOnboarding: boolean;
      };
      type: "userprefs";
    }
  | {
      key: "notification-settings";
      summary: string;
      value: {
        enabled: boolean;
        digest: "off" | "daily" | "weekly";
      };
      type: "notifications";
    };

const INITIAL: ConfigRow[] = [
  {
    key: "company-info",
    summary: "DataAnalytics Corp company information configuration",
    value: "custom-config",
    type: "pointer",
  },
  {
    key: "whats-new",
    summary: "What's new feature announcements configuration",
    value: "cfa64cb3-7f66-41ae-bf74-49ab1bc611a4",
    type: "pointer",
  },
  {
    key: "theme",
    summary: "Application theme and styling configuration",
    value: "light",
    type: "theme",
  },
  {
    key: "analytics-dashboard",
    summary: "Analytics dashboard layout and settings",
    value: "8b42ef1a-3c5d-47fe-9a1b-2d6e8f4c7a9b",
    type: "pointer",
  },
  {
    key: "user-preferences",
    summary: "Default user preferences and settings",
    value: {
      defaultLocale: "en-US",
      compactMode: false,
      tipsOnboarding: true,
    },
    type: "userprefs",
  },
  {
    key: "notification-settings",
    summary: "System notification configuration",
    value: { enabled: true, digest: "daily" },
    type: "notifications",
  },
];

/* =====================================================================================
   Page
   ===================================================================================== */
export function InstanceConfiguration() {
  const [rows, setRows] = useState<ConfigRow[]>(INITIAL);
  const [openAdd, setOpenAdd] = useState(false);

  // create a small label/icon map to match the screenshot style titles on left
  const meta = useMemo(
    () => ({
      "company-info": {
        label: "company-info",
        icon: <Building2 className="w-4 h-4" />,
      },
      "whats-new": {
        label: "whats-new",
        icon: <BookOpenCheck className="w-4 h-4" />,
      },
      theme: { label: "theme", icon: <Paintbrush className="w-4 h-4" /> },
      "analytics-dashboard": {
        label: "analytics-dashboard",
        icon: <LayoutDashboard className="w-4 h-4" />,
      },
      "user-preferences": {
        label: "user-preferences",
        icon: <SlidersHorizontal className="w-4 h-4" />,
      },
      "notification-settings": {
        label: "notification-settings",
        icon: <Bell className="w-4 h-4" />,
      },
    }),
    []
  );

  // helpers to update individual rows (mock persist)
  const setRowValue = (key: ConfigRow["key"], value: any) => {
    setRows((prev) =>
      prev.map((r) => (r.key === key ? ({ ...r, value } as any) : r))
    );
    // TODO backend: POST /admin/config/update { key, value }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />

        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-14 border-b bg-white flex items-center px-4">
            <SidebarTrigger />
            <div className="ml-4">
              <h1 className="text-lg font-semibold">Instance configuration</h1>
            </div>
            <div className="ml-auto">
              <Button
                onClick={() => setOpenAdd(true)}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add config
              </Button>
            </div>
          </header>

          {/* Content + right rail */}
          <div className="flex-1 flex">
            {/* MAIN */}
            <main className="flex-1 min-w-0 overflow-y-auto">
              <div className="mx-auto max-w-[1120px] px-6 py-6 space-y-4">
                {rows.map((r) => (
                  <RowCard
                    key={r.key}
                    meta={meta[r.key]}
                    row={r}
                    onChange={setRowValue}
                  />
                ))}

                {/* Guidelines block */}
                <Card className="border bg-white mt-6">
                  <CardContent className="p-5">
                    <h3 className="font-semibold mb-3">
                      Configuration Guidelines
                    </h3>
                    <ul className="text-sm text-gray-600 space-y-1 list-disc pl-5">
                      <li>
                        Configuration keys should be lowercase with hyphens.
                      </li>
                      <li>
                        Values are typically UUIDs or configuration identifiers.
                      </li>
                      <li>
                        Changes take effect immediately across the platform.
                      </li>
                      <li>
                        Contact support for assistance with critical
                        configurations.
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </main>

            {/* RIGHT RAIL (content tree / sources) */}
            <DataSourcePanel />
          </div>
        </div>
      </div>

      {/* Add Config Dialog */}
      <AddConfigDialog
        open={openAdd}
        onOpenChange={setOpenAdd}
        onCreate={(newRow) => {
          setRows((p) => [newRow, ...p]);
          // TODO backend: POST /admin/config/create { newRow }
        }}
      />
    </SidebarProvider>
  );
}

/* =====================================================================================
   Row Card – matches screenshot: title/summary at left, compact control at right
   ===================================================================================== */
function RowCard({
  meta,
  row,
  onChange,
}: {
  meta: { label: string; icon: React.ReactNode };
  row: ConfigRow;
  onChange: (key: ConfigRow["key"], value: any) => void;
}) {
  return (
    <div className="rounded-xl border bg-white px-5 py-4 flex items-center justify-between">
      <div className="min-w-0">
        <div className="flex items-center gap-2 text-gray-900 font-medium">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-gray-100">
            {meta.icon}
          </span>
          <span className="truncate">{meta.label}</span>
        </div>
        <p className="text-sm text-gray-600 mt-1">{row.summary}</p>
      </div>

      {/* Right-side control area (styled to resemble the screenshot’s pill/selects) */}
      <div className="ml-6 shrink-0 w-[420px]">
        {row.type === "pointer" && (
          <Select value={row.value} onValueChange={(v) => onChange(row.key, v)}>
            <SelectTrigger className="w-full justify-between">
              <SelectValue placeholder="Select configuration id" />
              <ChevronDown className="w-4 h-4 opacity-50" />
            </SelectTrigger>
            <SelectContent>
              {/* TODO backend: populate from your config registry */}
              <SelectItem value="custom-config">custom-config</SelectItem>
              <SelectItem value="1d8db76b-6b41-4404-b076-3f90a728b33e">
                1d8db76b-6b41-4404-b076-3f90a728b33e
              </SelectItem>
              <SelectItem value="8b42ef1a-3c5d-47fe-9a1b-2d6e8f4c7a9b">
                8b42ef1a-3c5d-47fe-9a1b-2d6e8f4c7a9b
              </SelectItem>
              <SelectItem value="cfa64cb3-7f66-41ae-bf74-49ab1bc611a4">
                cfa64cb3-7f66-41ae-bf74-49ab1bc611a4
              </SelectItem>
            </SelectContent>
          </Select>
        )}

        {row.type === "theme" && (
          <div className="flex items-center gap-3">
            <ThemeChip
              label="Light"
              active={row.value === "light"}
              icon={<Sun className="w-4 h-4" />}
              onClick={() => onChange(row.key, "light")}
            />
            <ThemeChip
              label="Dark"
              active={row.value === "dark"}
              icon={<Moon className="w-4 h-4" />}
              onClick={() => onChange(row.key, "dark")}
            />
            <ThemeChip
              label="System"
              active={row.value === "system"}
              icon={<SlidersHorizontal className="w-4 h-4" />}
              onClick={() => onChange(row.key, "system")}
            />
          </div>
        )}

        {row.type === "userprefs" && (
          <div className="grid grid-cols-3 gap-3 items-center">
            <div className="col-span-1">
              <Label className="text-xs">Default locale</Label>
              <Select
                value={row.value.defaultLocale}
                onValueChange={(v) =>
                  onChange(row.key, { ...row.value, defaultLocale: v })
                }
              >
                <SelectTrigger className="w-full mt-1">
                  <SelectValue placeholder="Locale" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en-US">en-US</SelectItem>
                  <SelectItem value="en-GB">en-GB</SelectItem>
                  <SelectItem value="es-ES">es-ES</SelectItem>
                  <SelectItem value="de-DE">de-DE</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-1">
              <Label className="text-xs">Compact mode</Label>
              <div className="mt-2">
                <Switch
                  checked={row.value.compactMode}
                  onCheckedChange={(on) =>
                    onChange(row.key, { ...row.value, compactMode: on })
                  }
                  className="data-[state=checked]:bg-green-600"
                />
              </div>
            </div>
            <div className="col-span-1">
              <Label className="text-xs">Show tips</Label>
              <div className="mt-2">
                <Switch
                  checked={row.value.tipsOnboarding}
                  onCheckedChange={(on) =>
                    onChange(row.key, { ...row.value, tipsOnboarding: on })
                  }
                  className="data-[state=checked]:bg-green-600"
                />
              </div>
            </div>
          </div>
        )}

        {row.type === "notifications" && (
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Switch
                checked={row.value.enabled}
                onCheckedChange={(on) =>
                  onChange(row.key, { ...row.value, enabled: on })
                }
                className="data-[state=checked]:bg-green-600"
              />
              <span className="text-sm text-gray-700">Enabled</span>
            </div>
            <div className="w-56">
              <Label className="text-xs">Digest frequency</Label>
              <Select
                value={row.value.digest}
                onValueChange={(v) =>
                  onChange(row.key, { ...row.value, digest: v as any })
                }
              >
                <SelectTrigger className="w-full mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="off">Off</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* --- tiny button-like chips used for theme --- */
function ThemeChip({
  active,
  label,
  icon,
  onClick,
}: {
  active: boolean;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 h-10 px-3 rounded-lg border transition ${
        active
          ? "bg-gray-900 text-white border-gray-900"
          : "bg-white hover:bg-gray-50"
      }`}
      aria-pressed={active}
    >
      {icon}
      <span className="text-sm">{label}</span>
    </button>
  );
}

/* =====================================================================================
   Add Config Dialog (lets admins create a new pointer-type config quickly)
   ===================================================================================== */
function AddConfigDialog({
  open,
  onOpenChange,
  onCreate,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onCreate: (row: ConfigRow) => void;
}) {
  const [key, setKey] = useState("custom-config-key");
  const [summary, setSummary] = useState("");
  const [pointer, setPointer] = useState("");

  const canSave = key.trim() && pointer.trim();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Add configuration</DialogTitle>
          <DialogDescription>
            Create a new configuration pointer. (Advanced types can be added
            later.)
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3 items-center">
            <Label className="col-span-1">Key</Label>
            <Input
              className="col-span-2"
              placeholder="lowercase-with-hyphens"
              value={key}
              onChange={(e) => setKey(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-3 gap-3 items-start">
            <Label className="col-span-1 pt-2">Summary</Label>
            <Textarea
              className="col-span-2"
              rows={3}
              placeholder="Short description…"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-3 gap-3 items-center">
            <Label className="col-span-1">Value (id)</Label>
            <Input
              className="col-span-2"
              placeholder="UUID or config id"
              value={pointer}
              onChange={(e) => setPointer(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter className="mt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            disabled={!canSave}
            onClick={() => {
              onCreate({
                key: key as any,
                summary: summary || "Custom configuration",
                value: pointer,
                type: "pointer",
              });
              onOpenChange(false);
            }}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default InstanceConfiguration;
