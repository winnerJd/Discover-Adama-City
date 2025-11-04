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

      const res =await fetch(`${API_URL}/ai/discover`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: aiPrompt }),
      });

      const data = await res.json();

      //  AI response
      setMessages((prev) => [...prev, { from: "ai", text: data.response }]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { from: "ai", text: "Error connecting to AI Studio" },
      ]);
    } finally {
      setLoading(false);
      setAiPrompt("");
    }
  };

  const ChatBubble = ({ from, text }: Message) => {
    const isAI = from === "ai";
    return (
      <div
        className={`max-w-[75%] px-4 py-2 rounded-2xl mb-3 break-words ${
          isAI
            ? "bg-blue-100 text-gray-800 self-start"
            : "bg-green-100 text-gray-900 self-end"
        }`}
      >
        <ReactMarkdown>{text}</ReactMarkdown>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-muted/30">
      <Helmet>
        <title>Browse Services — Discover Adama</title>
        <meta
          name="description"
          content="Search and filter hotels, hospitals, restaurants, transport and government services in Adama City."
        />
        <link rel="canonical" href={window.location.href} />
      </Helmet>

      <SiteHeader />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-primary">
        <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,...')]"></div>
        <div className="container mx-auto px-4 py-16 relative text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold">Explore Adama Services</h1>
          <p className="text-xl mt-2 text-white/90 max-w-2xl mx-auto">
            Discover hotels, hospitals, restaurants, transport and government
            services across the city
          </p>
          <p className="mt-2 text-white/80">{filtered.length} services available</p>
        </div>
      </section>

      <main className="container mx-auto flex-1 py-8 space-y-8">
        {/* Search Filters */}
        <div className="bg-card rounded-2xl border shadow-elegant p-6">
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

        {/* Services Grid */}
        <div className="grid gap-8 lg:grid-cols-[1.1fr_minmax(420px,0.9fr)]">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold tracking-tight">
                {filters.q || filters.category !== "all" || filters.minRating > 0
                  ? `Search Results (${filtered.length})`
                  : "All Services"}
              </h2>
              <div className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages} • {filtered.length} results
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {paginated.map((s, idx) => (
                <div
                  key={s._id}
                  className="animate-fade-in hover:scale-[1.01] transition-transform"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <ServiceCard service={s} />
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-4">
                <Button onClick={() => setPage(1)} disabled={currentPage === 1}>
                  First
                </Button>
                <Button
                  onClick={() => setPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Prev
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <Button
                    key={p}
                    variant={p === currentPage ? "default" : "ghost"}
                    onClick={() => setPage(p)}
                  >
                    {p}
                  </Button>
                ))}
                <Button
                  onClick={() => setPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
                <Button
                  onClick={() => setPage(totalPages)}
                  disabled={currentPage === totalPages}
                >
                  Last
                </Button>
              </div>
            )}

            {filtered.length === 0 && (
              <div className="text-center py-16 space-y-4">
                <div className="w-24 h-24 mx-auto bg-muted rounded-full flex items-center justify-center">
                  🔍
                </div>
                <h3 className="text-xl font-semibold">No services found</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  We couldn't find any services matching your criteria.
                </p>
              </div>
            )}
          </div>

          {/* Map */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Map View</h3>
              <div className="text-xs text-muted-foreground">
                Showing up to 50 locations
              </div>
            </div>
            <div className="sticky top-24 bg-card rounded-2xl border shadow-elegant overflow-hidden">
              <MapGoogle services={filtered.slice(0, 50) as any} height="520px" />
            </div>
          </div>
        </div>
      </main>

      {/* 🔹 AI Studio Chat  */}
      
      <div className="bg-card rounded-t-2xl border-t shadow-elegant p-6 mt-8">
        <h3 className="text-lg font-semibold">Ask Discover Adama AI</h3>

        <div className="h-80 overflow-y-auto border rounded-lg p-4 flex flex-col bg-muted">
          {messages.map((m, i) => (
            <ChatBubble key={i} from={m.from} text={m.text} />
          ))}
          {loading && <ChatBubble from="ai" text="💭 Thinking..." />}
          <div ref={chatEndRef} />
        </div>

        <div className="flex gap-2 mt-2">
          <input
            type="text"
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            placeholder="Ask about hotels, attractions, restaurants..."
            className="flex-1 border rounded-lg px-3 py-2 text-sm"
            onKeyDown={(e) => e.key === "Enter" && askAIStudio()}
          />
          <Button onClick={askAIStudio} disabled={loading}>
            {loading ? "Thinking..." : "Send"}
          </Button>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
};

export default Browse;
