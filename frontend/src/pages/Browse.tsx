import React, { useMemo, useState, useRef, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import ReactMarkdown from "react-markdown";

import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import SearchFilters, { Filters } from "@/components/SearchFilters";
import { useServices } from "@/context/ServicesContext";
import ServiceCard from "@/components/ServiceCard";
import MapGoogle from "@/components/MapGoogle";
import { Button } from "@/components/ui/button";
import { MessageSquare, Send, Loader2, Sparkles } from "lucide-react";

type Message = { from: "user" | "ai"; text: string };

const Browse: React.FC = () => {
  const { services } = useServices();
  const [filters, setFilters] = useState<Filters>({
    q: "",
    category: "all",
    minRating: 0,
  });
  const [page, setPage] = useState(1);

  // 🔹 AI Studio states
  const [aiPrompt, setAiPrompt] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const API_URL = import.meta.env.VITE_API_BASE_URL;

  const pageSize = 20;

  // Scroll to bottom when messages update
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Filtering logic
  const filtered = useMemo(() => {
    return services.filter((s) => {
      const matchQ = `${s.name} ${s.location} ${s.tags?.join(" ") ?? ""}`
        .toLowerCase()
        .includes(filters.q.toLowerCase());
      const matchCat =
        filters.category === "all" || s.category?.name === filters.category;
      const matchRating = (s.rating ?? 0) >= filters.minRating;
      return matchQ && matchCat && matchRating;
    });
  }, [services, filters]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;
  const paginated = filtered.slice(start, end);

  // 🔹 AI Studio direct call
  const askAIStudio = async () => {
    if (!aiPrompt.trim()) return;
    try {
      setLoading(true);

      // user message
      setMessages((prev) => [...prev, { from: "user", text: aiPrompt }]);
      const userMessage = aiPrompt;
      setAiPrompt("");

      const res = await fetch(`${API_URL}/ai/discover`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: userMessage }),
      });

      const data = await res.json();

      // AI response
      setMessages((prev) => [...prev, { from: "ai", text: data.response }]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { from: "ai", text: "Sorry, I'm having trouble connecting right now. Please try again later." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const ChatBubble = ({ from, text }: Message) => {
    const isAI = from === "ai";
    return (
      <div
        className={`flex gap-3 mb-4 animate-fade-in ${
          isAI ? "justify-start" : "justify-end"
        }`}
      >
        {isAI && (
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0 mt-1">
            <Sparkles className="h-4 w-4 text-slate-50" />
          </div>
        )}
        <div
          className={`max-w-[75%] px-4 py-3 rounded-2xl break-words shadow-sm ${
            isAI
              ? "bg-gradient-to-br from-blue-50 via-emerald-50 to-teal-100 border border-slate-300 text-slate-800"
              : "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-slate-50"
          }`}
        >
          <ReactMarkdown className="prose prose-sm dark:prose-invert max-w-none">
            {text}
          </ReactMarkdown>
        </div>
        {!isAI && (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-50 via-emerald-50 to-teal-100 flex items-center justify-center flex-shrink-0 mt-1">
            <span className="text-xs font-semibold text-slate-800">You</span>
          </div>
        )}
      </div>
    );
  };

    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-emerald-50 to-teal-100">
      <Helmet>
        <title>Browse Services — Discover Adama</title>
        <meta
          name="description"
          content="Search and filter hotels, hospitals, restaurants, transport and government services in Adama City."
        />
        <link rel="canonical" href={window.location.href} />
      </Helmet>

      <SiteHeader />

      {/* Enhanced Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-emerald-50 to-teal-100 border-b">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-72 h-72 bg-sky-200 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-72 h-72 bg-amber-200 rounded-full blur-3xl"></div>
        </div>
        <div className="container mx-auto px-4 py-12 md:py-16 relative">
          <div className="text-center space-y-4">
            <h1 className="text-title md:text-4xl md:text-6xl tracking-tight bg-skyline-glow bg-clip-text text-transparent">
              Explore Adama Services
            </h1>
            <p className="text-paragraph md:text-xl md:text-2xl text-slate-700 max-w-3xl mx-auto">
              Discover hotels, hospitals, restaurants, transport and government services across the vibrant city of Adama
            </p>
            <div className="flex items-center justify-center gap-2 pt-4">
              <div className="px-4 py-2 rounded-full bg-sky-100 border border-sky-300 backdrop-blur-sm">
                <span className="text-lg font-bold text-sky-600">{filtered.length}</span>
                <span className="text-sm text-slate-500 ml-2">services available</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="container mx-auto flex-1 py-8 px-4 space-y-8">
        {/* Enhanced Search Filters */}
        <div className="bg-gradient-to-br from-blue-50 via-emerald-50 to-teal-100 backdrop-blur-sm rounded-2xl border shadow-elegant p-6 md:p-8 hover:shadow-xl transition-shadow duration-300">
          <SearchFilters 
            filters={filters}
            onChange={(f) => {
              setFilters(f);
              setPage(1);
            }}
            onReset={() => {
              setFilters({ q: "", category: "all", minRating: 0 });
              setPage(1);
            }}
          />
        </div>

        {/* Services List - single column for readability */}
        <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-subtitle md:text-2xl md:text-3xl font-bold tracking-tight text-slate-800">
                {filters.q || filters.category !== "all" || filters.minRating > 0
                  ? `Search Results (${filtered.length})`
                  : "All Services"}
              </h2>
              <div className="text-sm text-slate-500 hidden sm:block">
                Page {currentPage} of {totalPages} • {filtered.length} results
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {paginated.map((s, idx) => (
                <div
                  key={s._id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <ServiceCard service={s} />
                </div>
              ))}
            </div>

            {/* Enhanced Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-wrap items-center justify-center gap-2 pt-6">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setPage(1)} 
                  disabled={currentPage === 1}
                >
                  First
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Prev
                </Button>
                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 7) {
                    pageNum = i + 1;
                  } else if (currentPage <= 4) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 3) {
                    pageNum = totalPages - 6 + i;
                  } else {
                    pageNum = currentPage - 3 + i;
                  }
                  return (
                    <Button
                      key={pageNum}
                      variant={pageNum === currentPage ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPage(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(totalPages)}
                  disabled={currentPage === totalPages}
                >
                  Last
                </Button>
              </div>
            )}

            {filtered.length === 0 && (
              <div className="text-center py-20 space-y-6">
                <div className="w-32 h-32 mx-auto bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center text-6xl">
                  🔍
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-slate-800">No services found</h3>
                  <p className="text-slate-700 max-w-md mx-auto">
                    We couldn't find any services matching your criteria. Try adjusting your filters.
                  </p>
                </div>
                <Button variant="outline" className="border-sky-500 text-sky-500 hover:bg-sky-500 hover:text-white" onClick={() => {
                  setFilters({ q: "", category: "all", minRating: 0 });
                  setPage(1);
                }}>
                  Clear All Filters
                </Button>
              </div>
            )}
        </div>
      </main>

      {/* Enhanced AI Studio Chat */}
      <div className="container mx-auto px-4 pb-8">
        <div className="bg-gradient-to-br from-blue-50 via-emerald-50 to-teal-100 backdrop-blur-sm rounded-2xl border shadow-elegant p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center">
              <MessageSquare className="h-5 w-5 text-slate-50" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800">Ask Discover Adama AI</h3>
              <p className="text-sm text-slate-500">Get instant answers about services in Adama</p>
            </div>
          </div>

          <div className="h-80 overflow-y-auto border border-slate-200 rounded-xl p-4 flex flex-col bg-gradient-to-br from-blue-50 via-emerald-50 to-teal-100 mb-4 scrollbar-thin">
            {messages.length === 0 && (
              <div className="flex-1 flex items-center justify-center text-center text-slate-500">
                <div className="space-y-2">
                  <Sparkles className="h-8 w-8 mx-auto opacity-50" />
                  <p>Start a conversation to get recommendations</p>
                </div>
              </div>
            )}
            {messages.map((m, i) => (
              <ChatBubble key={i} from={m.from} text={m.text} />
            ))}
            {loading && (
              <div className="flex gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0 mt-1">
                  <Sparkles className="h-4 w-4 text-slate-50" />
                </div>
                <div className="px-4 py-3 rounded-2xl bg-gradient-to-br from-blue-50 via-emerald-50 to-teal-100 border border-slate-300">
                  <Loader2 className="h-4 w-4 animate-spin text-indigo-500" />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="flex gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="Ask about hotels, restaurants, hospitals, attractions..."
                className="w-full border rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-sky-500/50 bg-gradient-to-br from-blue-50 via-emerald-50 to-teal-100 border-slate-300"
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && askAIStudio()}
                disabled={loading}
              />
              {aiPrompt && (
                <button
                  onClick={() => setAiPrompt("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800"
                >
                  ✕
                </button>
              )}
            </div>
            <Button 
              onClick={askAIStudio} 
              disabled={loading || !aiPrompt.trim()}
              className="px-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-slate-50"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Thinking...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Send
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
};

export default Browse;
