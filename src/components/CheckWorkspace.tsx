import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  Sparkles,
  Newspaper,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Search,
  Zap,
} from "lucide-react";
import { TrendingNewsItem, VerifyRequestPayload } from "../types";
import { motion } from "motion/react";
import { ChatVerificationInput } from "./ChatVerificationInput";

interface CheckWorkspaceProps {
  onVerify: (data: VerifyRequestPayload) => void;
  isLoading: boolean;
  onBackToHome: () => void;
}

const QUICK_PROMPTS = [
  {
    badge: "Viral Rumor",
    title: "Drinking ocean water cures pneumonia",
    prompt: "Drinking boiling ocean water cures viral pneumonia within 24 hours.",
    icon: "🌊",
  },
  {
    badge: "Space Science",
    title: "Liquid water lakes found on Mars",
    prompt: "Scientists confirmed the discovery of liquid water lakes under Mars ice caps.",
    icon: "🪐",
  },
  {
    badge: "Lunar Science",
    title: "Moon drifting away 3.8 cm per year",
    prompt: "The Moon is drifting away from Earth at approximately 3.8 cm per year.",
    icon: "🌙",
  },
  {
    badge: "Health Claim",
    title: "Raw garlic prevents respiratory infections",
    prompt: "Eating raw garlic daily prevents all respiratory viral infections.",
    icon: "🧄",
  },
];

export const CheckWorkspace: React.FC<CheckWorkspaceProps> = ({
  onVerify,
  isLoading,
  onBackToHome,
}) => {
  const [selectedPrompt, setSelectedPrompt] = useState("");
  const [newsItems, setNewsItems] = useState<TrendingNewsItem[]>([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const [newsSource, setNewsSource] = useState<"live" | "curated" | null>(null);

  const loadNews = async (signal?: AbortSignal) => {
    setNewsLoading(true);
    try {
      const response = await fetch(`/api/trending-news?t=${Date.now()}`, {
        cache: "no-store",
        signal,
      });
      if (!response.ok) throw new Error("News unavailable");
      const data = await response.json();
      setNewsItems(Array.isArray(data.news) ? data.news : []);
      setNewsSource(data.source === "live" ? "live" : "curated");
    } catch (error) {
      if ((error as Error).name !== "AbortError") {
        setNewsItems([]);
      }
    } finally {
      if (!signal?.aborted) setNewsLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    loadNews(controller.signal);
    return () => controller.abort();
  }, []);

  const handleSelectNews = (item: TrendingNewsItem) => {
    setSelectedPrompt(item.title);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSelectQuickPrompt = (prompt: string) => {
    setSelectedPrompt(prompt);
  };

  return (
    <div className="page-surface check-workspace w-full max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10 relative">
      <div className="check-orb pointer-events-none" aria-hidden="true" />

      {/* Top Header Bar & Status */}
      <div className="w-full mb-6">
        <div className="flex items-center justify-between gap-3 mb-4">
          <button
            type="button"
            onClick={onBackToHome}
            id="btn-workspace-back-home"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white bg-slate-100/90 hover:bg-slate-200/90 dark:bg-slate-800/80 dark:hover:bg-slate-700/80 border border-slate-200/80 dark:border-slate-700/80 transition-all cursor-pointer group shadow-2xs"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span>Home</span>
          </button>

          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live Evidence Engine
          </span>
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Verification Studio
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl leading-relaxed">
            Investigate viral claims, news headlines, photos, or documents against 5-6 verified public sources in real time.
          </p>
        </div>
      </div>

      {/* Founder-level Chat Section with Google AI Studio Traveling Colorful Line */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="w-full mb-8"
      >
        <ChatVerificationInput
          onVerify={onVerify}
          isLoading={isLoading}
          initialText={selectedPrompt}
          onClearInitialText={() => setSelectedPrompt("")}
          autoFocus={true}
          className="w-full"
        />

        {/* Quick Suggestion Prompt 2x2 Grid - Pixel-perfect alignment */}
        <div className="mt-4 w-full">
          <div className="flex items-center gap-1.5 mb-2.5 px-0.5">
            <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Try an example claim:
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
            {QUICK_PROMPTS.map((item) => (
              <button
                key={item.badge}
                type="button"
                onClick={() => handleSelectQuickPrompt(item.prompt)}
                className="flex items-center gap-3 p-2.5 rounded-xl bg-white/70 hover:bg-white dark:bg-slate-900/60 dark:hover:bg-slate-800/80 border border-slate-200/80 dark:border-slate-800 hover:border-teal-400/60 dark:hover:border-teal-500/50 transition-all text-left cursor-pointer group shadow-2xs"
              >
                <span className="text-base shrink-0 group-hover:scale-110 transition-transform">
                  {item.icon}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                      {item.badge}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-slate-800 dark:text-slate-200 group-hover:text-teal-600 dark:group-hover:text-teal-300 truncate transition-colors">
                    {item.title}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Viral Claims Radar Section */}
      <div className="mt-10 pt-6 border-t border-slate-200/80 dark:border-slate-800/80 w-full">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Newspaper className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Viral Claims Radar
            </span>
            {newsSource === "live" && (
              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                Live
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => loadNews()}
            disabled={newsLoading}
            id="btn-refresh-trending-news"
            className="text-xs text-slate-500 dark:text-slate-400 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-teal-600 dark:hover:text-teal-300 transition-colors cursor-pointer disabled:cursor-wait disabled:opacity-60 border border-slate-200/60 dark:border-slate-800"
            title="Refresh circulating claims"
          >
            <RefreshCw className={`w-3 h-3 ${newsLoading ? "animate-spin" : ""}`} />
            <span>{newsLoading ? "Scanning..." : "Refresh"}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {newsLoading &&
            [0, 1, 2, 3].map((idx) => (
              <div key={idx} className="h-[96px] rounded-2xl news-skeleton" />
            ))}

          {!newsLoading &&
            newsItems.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05, duration: 0.35 }}
                className="news-card p-3.5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 text-left shadow-2xs hover:border-teal-400/50 dark:hover:border-teal-500/50 transition-all flex flex-col justify-between gap-2.5 group"
              >
                <button
                  type="button"
                  onClick={() => handleSelectNews(item)}
                  className="text-left cursor-pointer w-full"
                >
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className="text-xs">{item.icon}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md border ${item.badgeBg} ${item.badgeText}`}>
                      {item.category}
                    </span>
                    <span className="text-[10px] text-slate-400 truncate">{item.sourceName}</span>
                  </div>
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-teal-600 dark:group-hover:text-teal-300 line-clamp-2 leading-snug transition-colors">
                    {item.title}
                  </p>
                </button>
                <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100 dark:border-slate-800/60">
                  <span className="text-[10px] text-slate-400">{item.publishedTime}</span>
                  <div className="flex items-center gap-2">
                    {item.sourceUrl && (
                      <a
                        href={item.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-500 hover:text-teal-600 dark:hover:text-teal-300 transition-colors"
                        onClick={(event) => event.stopPropagation()}
                      >
                        Source
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={() => handleSelectNews(item)}
                      className="inline-flex items-center gap-1 text-[10px] font-bold text-teal-600 dark:text-teal-400 hover:underline cursor-pointer"
                    >
                      <Search className="w-2.5 h-2.5" />
                      Check
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
        </div>
      </div>
    </div>
  );
};
