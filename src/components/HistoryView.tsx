import React, { useState, useMemo } from "react";
import { HistoryItem } from "../types";
import { VerdictBadge } from "./VerdictBadge";
import {
  History,
  Trash2,
  ArrowRight,
  FileText,
  Image as ImageIcon,
  ExternalLink,
  Search,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Filter,
} from "lucide-react";

interface HistoryViewProps {
  items: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
  onNewCheck: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  items,
  onSelect,
  onDelete,
  onClearAll,
  onNewCheck,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterVerdict, setFilterVerdict] = useState<string>("ALL");

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Search filter
      const matchesSearch =
        searchQuery.trim() === "" ||
        item.claim.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.result?.why?.toLowerCase().includes(searchQuery.toLowerCase());

      // Verdict filter
      let matchesVerdict = true;
      if (filterVerdict === "TRUE") {
        matchesVerdict = item.verdict === "TRUE" || item.verdict === "LIKELY TRUE";
      } else if (filterVerdict === "MISLEADING") {
        matchesVerdict = item.verdict === "MISLEADING";
      } else if (filterVerdict === "FALSE") {
        matchesVerdict = item.verdict === "FALSE" || item.verdict === "LIKELY FALSE";
      } else if (filterVerdict === "UNVERIFIED") {
        matchesVerdict = item.verdict === "UNVERIFIED";
      } else if (filterVerdict === "FILES") {
        matchesVerdict = item.contentType !== "text";
      }

      return matchesSearch && matchesVerdict;
    });
  }, [items, searchQuery, filterVerdict]);

  return (
    <div className="page-surface w-full max-w-3xl mx-auto px-4 py-8 sm:py-10 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Verification History
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Review past claims, images and documents verified in your browser.
          </p>
        </div>

        {items.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={onClearAll}
              className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 px-3 py-1.5 rounded-xl border border-rose-200 dark:border-rose-900/50 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          </div>
        )}
      </div>

      {/* Controls & Search */}
      {items.length > 0 && (
        <div className="space-y-3 mb-6">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search previous verified claims..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-[#0b1329] border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            {[
              { id: "ALL", label: `All (${items.length})` },
              { id: "TRUE", label: "True" },
              { id: "MISLEADING", label: "Misleading" },
              { id: "FALSE", label: "False" },
              { id: "UNVERIFIED", label: "Unverified" },
              { id: "FILES", label: "Files/Images" },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilterVerdict(f.id)}
                className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer text-xs ${
                  filterVerdict === f.id
                    ? "bg-blue-600 text-white"
                    : "bg-white dark:bg-[#0b1329] text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* List / Empty State */}
      {items.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-[#0b1329] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xs">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 mx-auto flex items-center justify-center mb-3">
            <History className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">
            Your verified claims will appear here
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-6">
            Whenever you verify a claim or document with TruthLens, your report is saved here privately.
          </p>
          <button
            onClick={onNewCheck}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer shadow-sm hover:shadow-blue-500/20"
          >
            Check your first claim
          </button>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="p-8 text-center bg-white dark:bg-[#0b1329] border border-slate-200 dark:border-slate-800 rounded-2xl">
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
            No verification records match your search or filter.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-xl bg-white dark:bg-[#0b1329] border border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-2xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
            >
              <div
                onClick={() => onSelect(item)}
                className="flex-1 cursor-pointer min-w-0"
              >
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <VerdictBadge verdict={item.verdict} size="sm" />
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    {item.evidenceStrength || `${item.confidence}% Evidence`}
                  </span>
                  <span className="text-[11px] font-medium text-slate-600 dark:text-slate-300">
                    {item.confidence}%
                  </span>
                  {item.claimType && (
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                      • {item.claimType}
                    </span>
                  )}
                  <span className="text-[11px] text-slate-400 dark:text-slate-500">
                    • {item.sourcesCount} {item.sourcesCount === 1 ? "source" : "sources"}
                  </span>
                  <span className="text-[11px] text-slate-400 dark:text-slate-500">
                    • {item.timestamp}
                  </span>
                  {item.contentType !== "text" && (
                    <span className="px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] uppercase font-bold">
                      {item.contentType}
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  "{item.claim}"
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0 justify-end pt-1 sm:pt-0">
                <button
                  onClick={() => onSelect(item)}
                  className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800/80 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                >
                  <span>Open</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
                <button
                  onClick={() => onDelete(item.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30"
                  title="Delete record"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
