// src/pages/CSQuery.tsx
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MessageSquare,
  History,
  Search as SearchIcon,
  Send,
  Mic,
  Paperclip,
  Globe,
  Settings,
  Image as ImageIcon,
  MessageCircle,
  Star,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";

/* ---- App shell (same pattern as Reports/HelpCenter/Settings) ---- */
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DataSourcePanel } from "@/components/DataSourcePanel";

export function CSQuery() {
  type Tab = "ai" | "history" | "search";

  // Mock data (can be fetched later)
  const mockQueries = React.useMemo(
    () => [
      {
        id: "1",
        question:
          "How do I handle a customer who wants to downgrade their plan during renewal?",
        answer:
          "Focus on understanding the root cause first. Often downgrades signal unmet value expectations...",
        timestamp: "2024-01-25T10:30:00",
        rating: 5,
        source: "AI",
      },
      {
        id: "2",
        question: "What are the best practices for quarterly business reviews?",
        answer:
          "QBRs should be customer-centric and value-focused. Structure them around business outcomes...",
        timestamp: "2024-01-24T15:20:00",
        rating: 4,
        source: "Expert",
      },
    ],
    []
  );

  const [tab, setTab] = React.useState<Tab>("ai");
  const [prompt, setPrompt] = React.useState("");
  const [isSending, setIsSending] = React.useState(false);

  type ChatMsg = {
    id: string;
    role: "user" | "assistant";
    timestamp: string; // ISO
    content: string;
  };
  const [messages, setMessages] = React.useState<ChatMsg[]>([]);
  const [rating, setRating] = React.useState<number | null>(null);
  const [feedback, setFeedback] = React.useState("");
  const scrollRef = React.useRef<HTMLDivElement>(null);

  // keep scroll pinned to bottom when messages change
  React.useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages]);

  const nowIso = () => new Date().toISOString();

  const buildAssistantReply = (userQ: string) => {
    // BACKEND: Replace with LLM API call; return markdown or blocks.
    return [
      `Based on your question about "${userQ}", here are some key insights:\n`,
      "**Key Recommendations:**",
      "• Focus on data-driven customer success metrics",
      "• Implement proactive health scoring systems",
      "• Establish regular check-ins with key accounts",
      "",
      "**Best Practices:**",
      "1. Monitor usage patterns and engagement metrics",
      "2. Create personalized onboarding experiences",
      "3. Develop comprehensive training materials",
      "",
      "*Sources: DataAnalytics CS Playbook, Customer Success Best Practices Guide*",
    ].join("\n");
  };

  const onSend = () => {
    if (!prompt.trim()) return;
    const user = {
      id: crypto.randomUUID(),
      role: "user" as const,
      timestamp: nowIso(),
      content: prompt.trim(),
    };

    setIsSending(true);
    setMessages((m) => [...m, user]);

    // BACKEND: swap this timeout for an async fetch to your AI service
    setTimeout(() => {
      const assistant = {
        id: crypto.randomUUID(),
        role: "assistant" as const,
        timestamp: nowIso(),
        content: buildAssistantReply(prompt.trim()),
      };
      setMessages((m) => [...m, assistant]);
      setIsSending(false);
      setPrompt("");
      setRating(null);
      setFeedback("");
    }, 600);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        {/* Left nav */}
        <AppSidebar />

        {/* Center + Right rail */}
        <div className="flex-1 flex flex-col">
          {/* Top bar */}
          <header className="h-14 border-b bg-white flex items-center px-4">
            <SidebarTrigger />
            <div className="ml-4">
              <h1 className="text-lg font-semibold">CS Query</h1>
            </div>
          </header>

          {/* Middle area: center content + right rail */}
          <div className="flex-1 flex">
            {/* CENTER CONTENT */}
            <main className="flex-1 min-w-0 overflow-y-auto">
              <div className="mx-auto max-w-[1120px] px-6 py-5 font-['Poppins']">
                {/* Page header */}
                <div className="mb-3">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-slate-700" />
                    <h2 className="text-xl font-semibold">
                      CS Query Assistant – <span>DataAnalytics Corp</span>
                    </h2>
                  </div>
                  <p className="mt-1 text-sm text-slate-600">
                    Ask questions about customer success, product features, or
                    best practices. Get AI-powered responses with expert
                    validation.
                  </p>
                </div>

                {/* Tabs */}
                <div className="mb-3 flex gap-2">
                  <Button
                    variant={tab === "ai" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setTab("ai")}
                    className={tab === "ai" ? "" : "text-slate-600"}
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    AI Chat
                  </Button>
                  <Button
                    variant={tab === "history" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setTab("history")}
                    className={tab === "history" ? "" : "text-slate-600"}
                  >
                    <History className="mr-2 h-4 w-4" />
                    Query History
                  </Button>
                  <Button
                    variant={tab === "search" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setTab("search")}
                    className={tab === "search" ? "" : "text-slate-600"}
                  >
                    <SearchIcon className="mr-2 h-4 w-4" />
                    Public Q&A Search
                  </Button>
                </div>

                {/* AI Chat panel */}
                {tab === "ai" && (
                  <Card className="rounded-2xl">
                    <CardContent className="p-0">
                      <div className="relative h-[560px] overflow-hidden">
                        {/* CHAT LIST */}
                        <div
                          ref={scrollRef}
                          className="absolute inset-0 overflow-y-auto px-4 py-6 pb-40"
                        >
                          {messages.length === 0 ? (
                            <div className="h-full flex items-center justify-center">
                              <div className="text-center">
                                <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-xl border border-slate-200 text-slate-500">
                                  <MessageCircle className="h-6 w-6" />
                                </div>
                                <p className="text-sm text-slate-600">
                                  Ask your{" "}
                                  <span className="font-semibold">
                                    DataAnalytics Corp
                                  </span>{" "}
                                  CS questions here
                                </p>
                              </div>
                            </div>
                          ) : (
                            <div className="mx-auto max-w-4xl space-y-6">
                              {messages.map((m) => {
                                const time = new Date(
                                  m.timestamp
                                ).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                });

                                if (m.role === "user") {
                                  return (
                                    <div
                                      key={m.id}
                                      className="flex justify-end"
                                    >
                                      <div className="bg-[#0F172A] text-white rounded-2xl px-4 py-3 max-w-sm">
                                        <div className="text-sm font-medium">
                                          {m.content}
                                        </div>
                                        <div className="text-[11px] opacity-70 mt-1 text-right">
                                          {time}
                                        </div>
                                      </div>
                                    </div>
                                  );
                                }

                                return (
                                  <div
                                    key={m.id}
                                    className="flex justify-start"
                                  >
                                    <div className="rounded-xl border bg-slate-50 p-5 w-full md:w-[720px]">
                                      <div className="text-[15px] font-medium mb-3">
                                        Based on your question:{" "}
                                        <span className="italic">
                                          “
                                          {
                                            [...messages]
                                              .reverse()
                                              .find((x) => x.role === "user")
                                              ?.content
                                          }
                                          ”
                                        </span>
                                        , here are some key insights:
                                      </div>

                                      <div className="space-y-4 text-[15px] leading-relaxed">
                                        <div className="space-y-2">
                                          <div className="font-semibold">
                                            Key Recommendations:
                                          </div>
                                          <ul className="list-disc pl-5 space-y-1">
                                            <li>
                                              Focus on data-driven customer
                                              success metrics
                                            </li>
                                            <li>
                                              Implement proactive health scoring
                                              systems
                                            </li>
                                            <li>
                                              Establish regular check-ins with
                                              key accounts
                                            </li>
                                          </ul>
                                        </div>

                                        <div className="space-y-2">
                                          <div className="font-semibold">
                                            Best Practices:
                                          </div>
                                          <ol className="list-decimal pl-5 space-y-1">
                                            <li>
                                              Monitor usage patterns and
                                              engagement metrics
                                            </li>
                                            <li>
                                              Create personalized onboarding
                                              experiences
                                            </li>
                                            <li>
                                              Develop comprehensive training
                                              materials
                                            </li>
                                          </ol>
                                        </div>

                                        <div className="pt-1">
                                          <div className="text-sm font-medium mb-2">
                                            Sources:
                                          </div>
                                          <div className="flex flex-wrap gap-2">
                                            <Badge variant="secondary">
                                              DataAnalytics CS Playbook
                                            </Badge>
                                            <Badge variant="secondary">
                                              Customer Success Best Practices
                                              Guide
                                            </Badge>
                                          </div>
                                        </div>
                                      </div>

                                      {/* Feedback / Rating row */}
                                      <div className="mt-5 pt-4 border-t">
                                        <div className="text-sm font-medium mb-2">
                                          Rate this response:
                                        </div>
                                        <div className="flex items-center gap-1 mb-3">
                                          {[1, 2, 3, 4, 5].map((i) => (
                                            <button
                                              key={i}
                                              onClick={() => setRating(i)}
                                              className="p-1"
                                              aria-label={`Rate ${i} star${
                                                i > 1 ? "s" : ""
                                              }`}
                                            >
                                              <Star
                                                className={`h-5 w-5 ${
                                                  (rating ?? 0) >= i
                                                    ? "fill-yellow-400 text-yellow-400"
                                                    : "text-slate-300"
                                                }`}
                                              />
                                            </button>
                                          ))}
                                        </div>

                                        <textarea
                                          value={feedback}
                                          onChange={(e) =>
                                            setFeedback(e.target.value)
                                          }
                                          placeholder="Optional: Provide feedback on accuracy, completeness, clarity, or relevance..."
                                          className="w-full rounded-md border p-3 text-sm"
                                          rows={3}
                                        />

                                        <div className="mt-3 flex flex-wrap gap-3">
                                          <Button
                                            className="bg-slate-900 hover:bg-slate-800"
                                            onClick={() => {
                                              // BACKEND: POST rating + feedback for analytics
                                              setFeedback("");
                                            }}
                                          >
                                            Submit Feedback
                                          </Button>

                                          <Button variant="outline">
                                            Ask an Expert
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>

                        {/* Composer */}
                        <div className="absolute left-0 right-0 bottom-6 flex justify-center">
                          <div className="w-[880px] max-w-[92vw] rounded-full bg-[#15171C] text-white shadow-2xl ring-1 ring-black/10">
                            <div className="flex items-center px-4 py-3">
                              {/* prefix icons */}
                              <div className="mr-3 flex items-center gap-2 text-slate-300/80">
                                <Paperclip className="h-4 w-4" />
                                <Globe className="h-4 w-4" />
                                <Settings className="h-4 w-4" />
                                <ImageIcon className="h-4 w-4" />
                              </div>

                              {/* input */}
                              <input
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    onSend();
                                  }
                                }}
                                placeholder="e.g., How to improve customer onboarding for Analytics Pro Inc.?"
                                className="flex-1 bg-transparent text-[15px] placeholder:text-slate-400 focus:outline-none"
                              />

                              {/* actions */}
                              <div className="ml-3 flex items-center gap-2">
                                <button
                                  type="button"
                                  className="grid h-8 w-8 place-items-center rounded-full bg-white/10 hover:bg-white/15"
                                  aria-label="Voice input"
                                >
                                  <Mic className="h-4 w-4" />
                                </button>
                                <Button
                                  size="sm"
                                  onClick={onSend}
                                  disabled={isSending || !prompt.trim()}
                                  className="rounded-full bg-sky-600 hover:bg-sky-700"
                                >
                                  {isSending ? (
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                  ) : (
                                    <Send className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* History panel */}
                {tab === "history" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-semibold">
                        Recent Queries
                      </h3>
                      <Button variant="outline" size="sm">
                        Search History
                      </Button>
                    </div>

                    <div className="space-y-4">
                      {mockQueries.map((q) => (
                        <Card key={q.id} className="rounded-xl">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-[15px] font-medium">
                              {q.question}
                            </CardTitle>
                            <div className="mt-2 flex items-center gap-3 text-sm text-slate-600">
                              <Badge
                                variant={
                                  q.source === "AI" ? "default" : "secondary"
                                }
                              >
                                {q.source === "AI"
                                  ? "🤖 AI Response"
                                  : "👨‍💼 Expert Response"}
                              </Badge>
                              <span>
                                {new Date(q.timestamp).toLocaleDateString()}
                              </span>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className="rounded-lg bg-slate-50 p-4 text-sm">
                              {q.answer}
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i <= q.rating
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "text-slate-300"
                                    }`}
                                  />
                                ))}
                              </div>
                              <div className="flex items-center gap-1">
                                <Button size="sm" variant="ghost">
                                  <ThumbsUp className="mr-1 h-4 w-4" />
                                  Helpful
                                </Button>
                                <Button size="sm" variant="ghost">
                                  <ThumbsDown className="mr-1 h-4 w-4" />
                                  Not Helpful
                                </Button>
                                <Button size="sm" variant="outline">
                                  Ask Follow-up
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Public search placeholder */}
                {tab === "search" && (
                  <Card className="rounded-2xl">
                    <CardContent className="p-8 text-center text-slate-600">
                      Public Q&A search is coming soon. You’ll be able to search
                      curated answers across the community and your company
                      knowledge.
                    </CardContent>
                  </Card>
                )}
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

export default CSQuery;
