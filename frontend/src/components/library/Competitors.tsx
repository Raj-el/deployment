// src/components/competitors/Competitors.tsx
import React, { useMemo, useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DataSourcePanel } from "@/components/DataSourcePanel";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  ArrowLeft,
  Plus,
  MoreHorizontal,
  ExternalLink,
  Search,
  FileDown,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/* Mock data (replace with API)                                               */
/* -------------------------------------------------------------------------- */
type Competitor = {
  id: string;
  name: string;
  website: string;
  products: number;
  content: number;
};

const MOCK: Competitor[] = [
  {
    id: "1",
    name: "TaskMaster Pro",
    website: "https://www.taskmasterpro.com",
    products: 8,
    content: 320,
  },
  {
    id: "2",
    name: "TeamSync",
    website: "https://www.teamsync.io",
    products: 6,
    content: 245,
  },
  {
    id: "3",
    name: "ProjectFlow",
    website: "https://www.projectflow.app",
    products: 9,
    content: 412,
  },
  {
    id: "4",
    name: "HiveMind Suite",
    website: "https://www.hivemindsuite.com",
    products: 7,
    content: 589,
  },
  {
    id: "5",
    name: "Collabra",
    website: "https://www.collabra.ai",
    products: 5,
    content: 298,
  },
];

/* Utility: initial avatar letter */
const initials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .map((p) => p[0])
    .join("")
    .slice(0, 1)
    .toUpperCase();

/* -------------------------------------------------------------------------- */
/* Single component with shell + page body                                    */
/* -------------------------------------------------------------------------- */
export function Competitors() {
  /* ----------------------------- Local state ----------------------------- */
  const [rows, setRows] = useState<Competitor[]>(MOCK);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<keyof Competitor>("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Add Competitor modal
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<{
    name: string;
    website: string;
    products: string;
  }>({
    name: "",
    website: "",
    products: "",
  });
  const [formErr, setFormErr] = useState<string>("");

  /* ------------------------------ Derivations ---------------------------- */
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((r) =>
      [r.name, r.website].some((v) => v.toLowerCase().includes(q))
    );
  }, [rows, search]);

  const sorted = useMemo(() => {
    const copy = [...filtered];
    copy.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      let comp = 0;
      if (typeof av === "number" && typeof bv === "number") comp = av - bv;
      else comp = String(av).localeCompare(String(bv));
      return sortDir === "asc" ? comp : -comp;
    });
    return copy;
  }, [filtered, sortKey, sortDir]);

  const paged = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, page]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));

  /* ------------------------------ Handlers ------------------------------- */
  const toggleSort = (key: keyof Competitor) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const onAdd = () => {
    // Basic validation
    if (!form.name.trim() || !form.website.trim()) {
      setFormErr("Name and Website are required.");
      return;
    }
    try {
      // rudimentary URL check
      const u = new URL(form.website.trim());
      if (!u.protocol.startsWith("http")) throw new Error("Invalid");
    } catch {
      setFormErr("Enter a valid URL (e.g., https://example.com).");
      return;
    }
    const products = Number(form.products || 0);
    if (Number.isNaN(products) || products < 0) {
      setFormErr("Products must be a non-negative number.");
      return;
    }
    setFormErr("");
    const newRow: Competitor = {
      id: String(Date.now()),
      name: form.name.trim(),
      website: form.website.trim(),
      products,
      content: 0, // start from 0; will fill after crawl
    };
    setRows((r) => [newRow, ...r]);
    setOpen(false);
    setForm({ name: "", website: "", products: "" });

    // TODO(back-end):
    // - POST /competitors {name, website, products}
    // - trigger background "public data fetch" job (crawl & count content)
    // - after job completes, update content count via websockets or polling
  };

  const onExport = () => {
    // Very simple CSV export from current filtered+sorted set
    const header = ["name", "website", "products", "content"];
    const csv = [
      header.join(","),
      ...sorted.map((r) =>
        [r.name, r.website, r.products, r.content].join(",")
      ),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "competitors.csv";
    a.click();
    URL.revokeObjectURL(url);
    // TODO(back-end): Alternatively GET /competitors/export -> stream CSV/XLSX
  };

  /* -------------------------------- Render ------------------------------- */
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        {/* LEFT NAV */}
        <AppSidebar activeKey="/library/competitors" />

        {/* CENTER + RIGHT */}
        <div className="flex-1 flex flex-col">
          {/* TOP BAR */}
          <header className="h-14 border-b bg-white flex items-center px-4">
            <SidebarTrigger />
            <div className="ml-4">
              <h1 className="text-lg font-semibold">Competitors</h1>
            </div>
          </header>

          {/* MAIN + RIGHT RAIL */}
          <div className="flex-1 flex">
            <main className="flex-1 min-w-0 overflow-y-auto">
              <div className="mx-auto max-w-[1120px] px-6 py-6">
                {/* Page title row */}
                <div className="mt-4 mb-4 flex items-center justify-between">
                  <h2 className="text-[28px] font-semibold text-slate-900">
                    DataAnalytics Corp Competitors
                  </h2>

                  <div className="flex items-center gap-2">
                    <div className="relative hidden md:block">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <Input
                        placeholder="Search competitors…"
                        value={search}
                        onChange={(e) => {
                          setSearch(e.target.value);
                          setPage(1);
                        }}
                        className="pl-9 w-[260px]"
                      />
                    </div>

                    <Button
                      variant="outline"
                      className="gap-2"
                      onClick={onExport}
                    >
                      <FileDown className="w-4 h-4" />
                      Export
                    </Button>

                    <Button
                      className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => setOpen(true)}
                    >
                      <Plus className="w-4 h-4" />
                      Add Competitor
                    </Button>
                  </div>
                </div>

                {/* Table card (flat like screenshot) */}
                <Card className="border bg-white">
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow className="hover:bg-transparent">
                          <TableHead className="w-[45%]">COMPETITOR</TableHead>
                          <TableHead
                            onClick={() => toggleSort("products")}
                            className="cursor-pointer select-none"
                          >
                            PRODUCTS{" "}
                            {sortKey === "products"
                              ? sortDir === "asc"
                                ? "↑"
                                : "↓"
                              : ""}
                          </TableHead>
                          <TableHead
                            onClick={() => toggleSort("content")}
                            className="cursor-pointer select-none"
                          >
                            CONTENT{" "}
                            {sortKey === "content"
                              ? sortDir === "asc"
                                ? "↑"
                                : "↓"
                              : ""}
                          </TableHead>
                          <TableHead className="w-[25%]">
                            LINK TO PUBLIC DATA
                          </TableHead>
                          <TableHead className="text-right pr-6">
                            Actions
                          </TableHead>
                        </TableRow>
                      </TableHeader>

                      <TableBody>
                        {paged.map((c) => (
                          <TableRow key={c.id} className="hover:bg-slate-50/60">
                            <TableCell>
                              <div className="flex items-start gap-3">
                                <div className="mt-1 w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-semibold">
                                  {initials(c.name)}
                                </div>
                                <div className="min-w-0">
                                  <div className="font-medium text-slate-900">
                                    {c.name}
                                  </div>
                                  <a
                                    href={c.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-blue-600 truncate block"
                                  >
                                    {c.website}
                                  </a>
                                </div>
                              </div>
                            </TableCell>

                            <TableCell className="align-middle">
                              {c.products}
                            </TableCell>
                            <TableCell className="align-middle">
                              {c.content}
                            </TableCell>

                            <TableCell className="align-middle">
                              <a
                                href={c.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline flex items-center gap-1"
                              >
                                {c.name}
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            </TableCell>

                            <TableCell className="text-right pr-6">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-8 w-8"
                                  >
                                    <MoreHorizontal className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() =>
                                      window.open(c.website, "_blank")
                                    }
                                  >
                                    Open Website
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => {
                                      // TODO(back-end): Navigate to competitor profile /library/competitors/:id
                                    }}
                                  >
                                    View Profile
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => {
                                      // TODO(back-end): DELETE /competitors/:id
                                      setRows((r) =>
                                        r.filter((x) => x.id !== c.id)
                                      );
                                    }}
                                    className="text-red-600 focus:text-red-600"
                                  >
                                    Remove
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}

                        {paged.length === 0 && (
                          <TableRow>
                            <TableCell
                              colSpan={5}
                              className="py-12 text-center text-slate-500"
                            >
                              No competitors match your search.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                {/* Pagination (simple) */}
                <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
                  <div>
                    Showing{" "}
                    <span className="font-medium">
                      {(page - 1) * pageSize + 1}
                    </span>{" "}
                    –{" "}
                    <span className="font-medium">
                      {Math.min(page * pageSize, sorted.length)}
                    </span>{" "}
                    of <span className="font-medium">{sorted.length}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page === 1}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                    >
                      Prev
                    </Button>
                    <div className="px-2">
                      Page <span className="font-medium">{page}</span> of{" "}
                      <span className="font-medium">{totalPages}</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page === totalPages}
                      onClick={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </div>
            </main>

            {/* RIGHT RAIL (kept consistent with other pages) */}
            <DataSourcePanel />
          </div>
        </div>
      </div>

      {/* Add Competitor Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Competitor</DialogTitle>
            <DialogDescription>
              Track a new competitor. Public data will be fetched automatically.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name *</label>
              <Input
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                placeholder="e.g., TaskMaster Pro"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Website *</label>
              <Input
                value={form.website}
                onChange={(e) =>
                  setForm((f) => ({ ...f, website: e.target.value }))
                }
                placeholder="https://example.com"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Products</label>
              <Input
                type="number"
                min={0}
                value={form.products}
                onChange={(e) =>
                  setForm((f) => ({ ...f, products: e.target.value }))
                }
                placeholder="0"
              />
            </div>

            {formErr && <div className="text-sm text-red-600">{formErr}</div>}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={onAdd}
            >
              Save & Fetch Data
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
}
