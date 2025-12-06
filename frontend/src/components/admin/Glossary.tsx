// src/components/admin/Glossary.tsx
import React, { useMemo, useRef, useState } from "react";
import { Search, Upload, Trash2, Edit2, Plus } from "lucide-react";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DataSourcePanel } from "@/components/DataSourcePanel";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

/* ========================================================================== */
/* Types & Mock Data (replace with Supabase later)                            */
/* ========================================================================== */
type TermType = "acronym" | "synonym";
type GlossaryTerm = {
  id: string;
  term: string;
  type: TermType;
  definition: string;
  category: string;
};

const MOCK: GlossaryTerm[] = [
  {
    id: "1",
    term: "csm",
    type: "acronym",
    definition: "Customer Success Manager",
    category: "Analytical",
  },
  {
    id: "2",
    term: "cac",
    type: "acronym",
    definition: "Customer Acquisition Cost",
    category: "Analytical",
  },
  {
    id: "3",
    term: "cls",
    type: "acronym",
    definition: "Customer Lifetime Score",
    category: "Analytical",
  },
  {
    id: "4",
    term: "ctr",
    type: "acronym",
    definition: "Click-Through Rate",
    category: "Analytical",
  },
  {
    id: "5",
    term: "churn",
    type: "synonym",
    definition: "Customer attrition / cancellations",
    category: "Operational",
  },
];

/* ========================================================================== */
/* Component                                                                  */
/* ========================================================================== */
export function Glossary() {
  const [items, setItems] = useState<GlossaryTerm[]>(MOCK);
  const [tab, setTab] = useState<TermType>("acronym");
  const [letter, setLetter] = useState<string>("C"); // matches your screenshot
  const [query, setQuery] = useState("");
  const [categoryFilter] = useState<string>("all");

  // Add/Edit modal
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<GlossaryTerm | null>(null);

  // Upload CSV
  const fileRef = useRef<HTMLInputElement | null>(null);

  // Alphabet ring
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  const data = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items
      .filter((i) => i.type === tab)
      .filter((i) => (letter ? i.term[0]?.toUpperCase() === letter : true))
      .filter((i) =>
        categoryFilter === "all" ? true : i.category === categoryFilter
      )
      .filter((i) =>
        q
          ? i.term.toLowerCase().includes(q) ||
            i.definition.toLowerCase().includes(q)
          : true
      )
      .sort((a, b) => a.term.localeCompare(b.term));
  }, [items, tab, letter, query, categoryFilter]);

  const openCreate = () => {
    setEditing(null);
    setOpen(true);
  };
  const openEdit = (term: GlossaryTerm) => {
    setEditing(term);
    setOpen(true);
  };
  const onDelete = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    // TODO: await supabase.from('glossary').delete().eq('id', id)
  };
  const onSubmit = (form: {
    term: string;
    type: TermType;
    definition: string;
    category: string;
  }) => {
    if (editing) {
      setItems((prev) =>
        prev.map((i) => (i.id === editing.id ? { ...i, ...form } : i))
      );
      // TODO: await supabase.from('glossary').update(form).eq('id', editing.id)
    } else {
      const newTerm: GlossaryTerm = { id: `${Date.now()}`, ...form };
      setItems((prev) => [newTerm, ...prev]);
      // TODO: await supabase.from('glossary').insert(newTerm)
    }
    setOpen(false);
  };

  const onUploadClick = () => fileRef.current?.click();
  const onUploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // TODO: parse CSV and ingest (term,type,definition,category)
    e.target.value = "";
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />

        <div className="flex-1 flex flex-col">
          {/* Top bar */}
          <header className="h-14 border-b bg-white flex items-center px-4">
            <SidebarTrigger />
            <div className="ml-4">
              <h1 className="text-lg font-semibold">Glossary</h1>
            </div>

            <div className="ml-auto flex items-center gap-3">
              <div className="relative w-[340px]">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pl-9"
                />
              </div>

              <input
                ref={fileRef}
                type="file"
                accept=".csv"
                className="hidden"
                onChange={onUploadFile}
              />
              <Button
                onClick={onUploadClick}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Glossary
              </Button>
            </div>
          </header>

          {/* Content + right rail */}
          <div className="flex-1 flex">
            {/* MAIN */}
            <main className="flex-1 min-w-0 overflow-y-auto">
              <div className="mx-auto max-w-[1120px] px-6 py-6 font-['Poppins']">
                {/* Tabs */}
                <Tabs
                  value={tab}
                  onValueChange={(v) => setTab(v as TermType)}
                  className="w-full"
                >
                  <TabsList className="bg-transparent p-0 gap-3 mb-4">
                    <TabsTrigger
                      value="acronym"
                      className={`px-5 h-9 rounded-full ${
                        tab === "acronym"
                          ? "bg-gray-900 text-white"
                          : "bg-white border"
                      }`}
                    >
                      Acronyms
                    </TabsTrigger>
                    <TabsTrigger
                      value="synonym"
                      className={`px-5 h-9 rounded-full ${
                        tab === "synonym"
                          ? "bg-gray-900 text-white"
                          : "bg-white border"
                      }`}
                    >
                      Synonyms
                    </TabsTrigger>
                  </TabsList>

                  {/* Alphabet ring */}
                  <div className="flex flex-wrap gap-3 mb-5">
                    {letters.map((ltr) => (
                      <button
                        key={ltr}
                        onClick={() => setLetter(ltr)}
                        className={`h-10 w-10 rounded-full border text-sm ${
                          letter === ltr
                            ? "bg-gray-900 text-white border-gray-900"
                            : "bg-white text-gray-800 hover:bg-gray-50"
                        }`}
                      >
                        {ltr}
                      </button>
                    ))}
                    <button
                      onClick={() => setLetter("")}
                      className={`h-10 px-4 rounded-full border text-sm ml-1 ${
                        letter === ""
                          ? "bg-gray-900 text-white border-gray-900"
                          : "bg-white text-gray-800 hover:bg-gray-50"
                      }`}
                      title="Show All"
                    >
                      All
                    </button>
                  </div>

                  {/* Lists */}
                  <TabsContent value="acronym" className="mt-0 space-y-4">
                    {tab === "acronym" && (
                      <List
                        terms={data}
                        onEdit={openEdit}
                        onDelete={onDelete}
                      />
                    )}
                  </TabsContent>
                  <TabsContent value="synonym" className="mt-0 space-y-4">
                    {tab === "synonym" && (
                      <List
                        terms={data}
                        onEdit={openEdit}
                        onDelete={onDelete}
                      />
                    )}
                  </TabsContent>
                </Tabs>

                {/* Inline footer-like row (NOT sticky) */}
                <div className="mt-6 flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    {data.length} term{data.length === 1 ? "" : "s"} shown
                  </span>
                  <Button
                    onClick={openCreate}
                    className="bg-red-500 hover:bg-red-600 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Term
                  </Button>
                </div>
              </div>
            </main>

            {/* RIGHT RAIL */}
            <DataSourcePanel />
          </div>
        </div>
      </div>

      {/* Create/Edit Dialog */}
      <TermDialog
        open={open}
        onOpenChange={setOpen}
        initial={editing}
        onSubmit={onSubmit}
      />
    </SidebarProvider>
  );
}

/* ========================================================================== */
/* List + Row                                                                 */
/* ========================================================================== */
function List({
  terms,
  onEdit,
  onDelete,
}: {
  terms: GlossaryTerm[];
  onEdit: (t: GlossaryTerm) => void;
  onDelete: (id: string) => void;
}) {
  if (!terms.length) {
    return (
      <Card className="border bg-white">
        <CardContent className="p-8 text-center text-gray-600">
          No terms found.
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      {terms.map((t) => (
        <Card key={t.id} className="border bg-white">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="min-w-0">
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-gray-900 lowercase">
                    {t.term}
                  </span>
                  <Badge
                    variant="secondary"
                    className="uppercase text-[11px] tracking-wide"
                  >
                    {t.category}
                  </Badge>
                </div>
                <p className="text-gray-700 mt-2">{t.definition}</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <Button variant="ghost" size="icon" onClick={() => onEdit(t)}>
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(t.id)}
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  );
}

/* ========================================================================== */
/* Create/Edit Dialog                                                         */
/* ========================================================================== */
function TermDialog({
  open,
  onOpenChange,
  initial,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initial: GlossaryTerm | null;
  onSubmit: (vals: {
    term: string;
    type: TermType;
    definition: string;
    category: string;
  }) => void;
}) {
  const [term, setTerm] = useState(initial?.term ?? "");
  const [type, setType] = useState<TermType>(initial?.type ?? "acronym");
  const [category, setCategory] = useState<string>(
    initial?.category ?? "Analytical"
  );
  const [definition, setDefinition] = useState(initial?.definition ?? "");

  React.useEffect(() => {
    setTerm(initial?.term ?? "");
    setType(initial?.type ?? "acronym");
    setCategory(initial?.category ?? "Analytical");
    setDefinition(initial?.definition ?? "");
  }, [initial, open]);

  const canSave = term.trim() && definition.trim();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>{initial ? "Edit Term" : "Add Term"}</DialogTitle>
          <DialogDescription>
            {initial
              ? "Update the glossary entry."
              : "Create a new glossary entry for your organization."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3 items-center">
            <Label className="col-span-1">Term</Label>
            <Input
              className="col-span-2 lowercase"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder="e.g., csm"
            />
          </div>

          <div className="grid grid-cols-3 gap-3 items-center">
            <Label className="col-span-1">Type</Label>
            <Select value={type} onValueChange={(v) => setType(v as TermType)}>
              <SelectTrigger className="col-span-2">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="acronym">Acronym</SelectItem>
                <SelectItem value="synonym">Synonym</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-3 gap-3 items-center">
            <Label className="col-span-1">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="col-span-2">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Analytical">Analytical</SelectItem>
                <SelectItem value="Operational">Operational</SelectItem>
                <SelectItem value="Finance">Finance</SelectItem>
                <SelectItem value="Support">Support</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-3 gap-3 items-start">
            <Label className="col-span-1 pt-2">Definition</Label>
            <Textarea
              className="col-span-2"
              rows={4}
              value={definition}
              onChange={(e) => setDefinition(e.target.value)}
              placeholder="Write a clear, concise definition…"
            />
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            className="bg-red-500 hover:bg-red-600 text-white"
            disabled={!canSave}
            onClick={() =>
              onSubmit({
                term: term.trim(),
                type,
                definition: definition.trim(),
                category,
              })
            }
          >
            {initial ? "Save Changes" : "Add Term"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default Glossary;
