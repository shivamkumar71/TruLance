import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ExternalLink,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Share2,
  Download,
  MessageSquare,
  CalendarDays,
  FileImage,
  Target,
  Globe2,
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Info,
  Search,
  Image as ImageIcon,
  Sparkles,
  GitCommit,
  Layers,
  ArrowRight,
  TrendingUp,
  FileCheck,
  HelpCircle,
  Compass,
} from "lucide-react";
import { VerificationResult, VerificationSource } from "../types";
import { motion, AnimatePresence } from "motion/react";

interface ResultViewProps {
  result: VerificationResult;
  onReset: () => void;
  onHome?: () => void;
  inputPreviewUrl?: string | null;
}

const text = (v?: string | null) =>
  (v || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

const safeUrl = (value?: string | null): string | null => {
  if (!value) return null;
  try {
    const u = new URL(value);
    if (!["http:", "https:"].includes(u.protocol) || !u.hostname || u.hostname === "example.com" || u.hostname === "localhost") {
      return null;
    }
    return u.toString();
  } catch {
    return null;
  }
};

const host = (url?: string | null) => {
  const u = safeUrl(url);
  if (!u) return "";
  try {
    return new URL(u).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
};

const verdictMeta = (verdict: string) => {
  const v = verdict.toUpperCase();
  if (v === "TRUE" || v === "LIKELY TRUE") {
    return {
      tone: "true",
      label: verdict,
      icon: CheckCircle2,
      title: "Supported by multi-source evidence.",
      badgeBg: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
      cardBorder: "border-emerald-500/40 dark:border-emerald-500/30",
      gradient: "from-emerald-500/10 via-teal-500/5 to-transparent",
      haloColor: "rgba(16, 185, 129, 0.25)",
      ringColor: "#10b981",
    };
  }
  if (v === "FALSE" || v === "LIKELY FALSE" || v === "MISLEADING") {
    return {
      tone: "false",
      label: verdict,
      icon: XCircle,
      title: "Directly conflicts with verified public records.",
      badgeBg: "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30",
      cardBorder: "border-rose-500/40 dark:border-rose-500/30",
      gradient: "from-rose-500/10 via-orange-500/5 to-transparent",
      haloColor: "rgba(244, 63, 94, 0.25)",
      ringColor: "#f43f5e",
    };
  }
  return {
    tone: "mixed",
    label: verdict,
    icon: Info,
    title: "Available evidence does not support a definitive claim.",
    badgeBg: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
    cardBorder: "border-amber-500/40 dark:border-amber-500/30",
    gradient: "from-amber-500/10 via-yellow-500/5 to-transparent",
    haloColor: "rgba(245, 158, 11, 0.25)",
    ringColor: "#f59e0b",
  };
};

const relation = (s: VerificationSource) => {
  const r = (s.relationship || "NEUTRAL").toUpperCase();
  if (r === "SUPPORTS") {
    return {
      label: "Supports",
      bg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25",
      dot: "bg-emerald-500",
      icon: CheckCircle2,
    };
  }
  if (r === "CONTRADICTS") {
    return {
      label: "Contradicts",
      bg: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/25",
      dot: "bg-rose-500",
      icon: XCircle,
    };
  }
  if (r === "CONTEXT") {
    return {
      label: "Context",
      bg: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/25",
      dot: "bg-sky-500",
      icon: Info,
    };
  }
  return {
    label: "Neutral",
    bg: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/25",
    dot: "bg-slate-400",
    icon: Info,
  };
};

const KNOWN_PUBLISHERS: Record<string, string> = {
  "reuters.com": "Reuters",
  "apnews.com": "Associated Press",
  "bbc.com": "BBC News",
  "bbc.co.uk": "BBC News",
  "thehindu.com": "The Hindu",
  "nytimes.com": "The New York Times",
  "wsj.com": "The Wall Street Journal",
  "bloomberg.com": "Bloomberg",
  "theguardian.com": "The Guardian",
  "washingtonpost.com": "The Washington Post",
  "snopes.com": "Snopes",
  "factcheck.org": "FactCheck.org",
  "politifact.com": "PolitiFact",
  "boomlive.in": "BOOM Live",
  "altnews.in": "Alt News",
  "afp.com": "AFP Fact Check",
  "nasa.gov": "NASA",
  "jpl.nasa.gov": "NASA / JPL",
  "pmo.gov.in": "Prime Minister's Office",
  "india.gov.in": "Government of India",
  "mospi.gov.in": "MoSPI India",
  "rbi.org.in": "Reserve Bank of India",
  "eci.gov.in": "Election Commission of India",
  "who.int": "WHO",
  "un.org": "United Nations",
  "nature.com": "Nature Journal",
  "science.org": "Science",
  "cell.com": "Cell Press",
  "thelancet.com": "The Lancet",
  "arxiv.org": "arXiv",
  "nih.gov": "NIH",
  "wikipedia.org": "Wikipedia",
  "ndtv.com": "NDTV",
  "indianexpress.com": "The Indian Express",
  "timesofindia.indiatimes.com": "The Times of India",
  "hindustantimes.com": "Hindustan Times",
  "news18.com": "News18",
  "spacenews.com": "SpaceNews",
  "youtube.com": "YouTube",
  "youtu.be": "YouTube",
};

const resolveSourceIdentity = (source: VerificationSource, url: string | null) => {
  let pubName = text(source.publisher);
  let domain = host(source.publisherDomain || source.publisherUrl);
  const rawUrlHost = host(url);

  if (!domain && rawUrlHost && !rawUrlHost.includes("google.com")) {
    domain = rawUrlHost;
  }

  if (!domain || domain.includes("google.com")) {
    if (pubName) {
      const lower = pubName.toLowerCase();
      for (const [dom, name] of Object.entries(KNOWN_PUBLISHERS)) {
        if (lower.includes(name.toLowerCase()) || name.toLowerCase().includes(lower)) {
          domain = dom;
          pubName = name;
          break;
        }
      }
    }
  }

  if (!pubName || pubName.toLowerCase() === "google" || pubName.toLowerCase() === "google news") {
    if (domain && !domain.includes("google.com")) {
      const known = KNOWN_PUBLISHERS[domain];
      if (known) {
        pubName = known;
      } else {
        const parts = domain.split(".");
        const main = parts.length >= 2 ? parts[parts.length - 2] : domain;
        pubName = main.charAt(0).toUpperCase() + main.slice(1);
      }
    } else {
      pubName = "News Source";
    }
  }

  const displayDomain = domain && !domain.includes("google.com") ? domain : rawUrlHost || "";
  const logoDomain = domain && !domain.includes("google.com") ? domain : null;

  return {
    publisher: pubName,
    domain: displayDomain,
    logoUrl: logoDomain
      ? `https://www.google.com/s2/favicons?domain=${encodeURIComponent(logoDomain)}&sz=64`
      : null,
  };
};

const sourceType = (s: VerificationSource, realDomain?: string) => {
  const h = realDomain || host(s.publisherDomain || s.publisherUrl || s.url || s.canonicalUrl);
  const c = (s.category || "").toLowerCase();
  const st = (s.sourceType || "").toLowerCase();
  if (c.includes("youtube") || st === "youtube" || /youtube\.com|youtu\.be/.test(h)) return "YouTube Video";
  if (c.includes("wiki") || st === "wikipedia" || /wikipedia\.org/.test(h)) return "Wikipedia";
  if (
    c.includes("official") ||
    st === "government" ||
    st === "official" ||
    /\.gov(\.in)?$|\.nic\.in$|\.mil$/.test(h) ||
    /who\.int|un\.org|nasa\.gov/.test(h)
  )
    return "Official / Govt";
  if (
    c.includes("research") ||
    st === "research" ||
    st === "academic" ||
    /nature\.com|science\.org|arxiv\.org|nih\.gov|pubmed/.test(h)
  )
    return "Research";
  if (c.includes("fact") || st === "fact_check") return "Fact Check";
  if (c.includes("news") || st === "news") return "News Wire";
  return "Verified Source";
};

export const ResultView: React.FC<ResultViewProps> = ({
  result,
  onReset,
  onHome,
  inputPreviewUrl,
}) => {
  const [copied, setCopied] = useState(false);
  const [auditOpen, setAuditOpen] = useState(false);
  const [referenceImageFailed, setReferenceImageFailed] = useState(false);
  const [showAllSources, setShowAllSources] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);
  const [feedbackError, setFeedbackError] = useState("");
  const [feedbackSending, setFeedbackSending] = useState(false);
  const [feedbackForm, setFeedbackForm] = useState({ name: "", email: "", message: "" });

  const sources = useMemo(
    () => (result.sources || []).filter((s) => Boolean(s.title || s.url || s.canonicalUrl)),
    [result.sources]
  );
  const verifiedSources = sources.filter((s) => Boolean(s.isVerified && safeUrl(s.url || s.canonicalUrl)));
  const referenceSource = verifiedSources.find((s) => Boolean(s.referenceImageUrl));
  const referenceImageUrl = referenceSource?.referenceImageUrl;

  useEffect(() => setReferenceImageFailed(false), [referenceImageUrl]);

  const supporting = result.supportingEvidence || [];
  const contradicting = result.contradictingEvidence || [];
  const context = result.contextEvidence || result.context || [];
  const meta = verdictMeta(result.verdict);
  const VerdictIcon = meta.icon;
  const isMedia = result.contentType === "image";
  const hasDocument = result.contentType === "pdf" || result.contentType === "document";
  const independent =
    result.searchTransparency?.independentSourcesFound ??
    new Set(verifiedSources.map((s) => s.independence)).size;

  const supportCount =
    result.searchTransparency?.supportingSourcesFound ??
    sources.filter((s) => s.relationship?.toUpperCase() === "SUPPORTS").length;
  const contradictCount =
    result.searchTransparency?.contradictingSourcesFound ??
    sources.filter((s) => s.relationship?.toUpperCase() === "CONTRADICTS").length;
  const relatedCount = sources.filter((s) => s.relationship?.toUpperCase() === "CONTEXT").length;

  const visibleSources = showAllSources ? verifiedSources : verifiedSources.slice(0, 6);

  const copyReport = async () => {
    const lines = [
      "TruthLens Verification Report",
      "",
      `Verdict: ${result.verdict}`,
      `Claim: ${text(result.claim)}`,
      `Confidence: ${result.confidence}% (${result.confidenceLabel || "Confidence"})`,
      `Evidence Strength: ${result.evidenceStrength || "Assessed"}`,
      "",
      `Why: ${text(result.why)}`,
      result.truthCorrection ? `Correction: ${text(result.truthCorrection)}` : "",
      "",
      `Sources (${verifiedSources.length} validated):`,
      ...verifiedSources.map(
        (s, i) => `${i + 1}. ${text(s.publisher) || host(s.url)} — ${text(s.title)} (${s.url})`
      ),
    ]
      .filter(Boolean)
      .join("\n");

    try {
      await navigator.clipboard.writeText(lines);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {}
  };

  const share = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `TruthLens: ${result.verdict}`,
          text: `TruthLens Verification: ${result.verdict} — "${text(result.claim)}"`,
          url: window.location.href,
        });
      } else {
        copyReport();
      }
    } catch {}
  };

  const downloadReport = () => {
    const content = [
      "============================================================",
      "                TRUTHLENS VERIFICATION REPORT               ",
      "============================================================",
      "",
      `VERDICT:           ${result.verdict}`,
      `CONFIDENCE:        ${result.confidence}% (${result.confidenceLabel || "Assessed"})`,
      `EVIDENCE STRENGTH: ${result.evidenceStrength || "Multi-source verified"}`,
      `ANALYSED AT:       ${result.analyzedAt || new Date().toISOString()}`,
      "",
      "CLAIM UNDER INVESTIGATION:",
      `"${text(result.claim)}"`,
      "",
      "WHY THIS VERDICT:",
      text(result.why),
      "",
      result.truthCorrection ? `GROUND TRUTH CORRECTION:\n${text(result.truthCorrection)}\n\n` : "",
      "KEY EVIDENCE POINTS:",
      ...supporting.map((x) => `[+] Supported: ${text(x)}`),
      ...contradicting.map((x) => `[-] Contradicted: ${text(x)}`),
      ...context.map((x) => `[*] Context: ${text(x)}`),
      "",
      "VALIDATED CITATIONS & SOURCES:",
      ...verifiedSources.map(
        (s, i) => `${i + 1}. [${s.relationship || "NEUTRAL"}] ${text(s.publisher) || host(s.url)}: "${text(s.title)}" — ${s.url}`
      ),
      "",
      "============================================================",
      "Generated by TruthLens Live Evidence Engine",
    ].join("\n");

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `truthlens-report-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const submitFeedback = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedbackError("");
    setFeedbackSending(true);
    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(feedbackForm),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error || "Feedback could not be submitted.");
      setFeedbackOpen(false);
      setFeedbackForm({ name: "", email: "", message: "" });
      setFeedbackSuccess(true);
      window.setTimeout(() => setFeedbackSuccess(false), 4000);
      window.setTimeout(() => onHome?.(), 250);
    } catch (error: any) {
      setFeedbackError(error.message || "Feedback could not be submitted.");
    } finally {
      setFeedbackSending(false);
    }
  };

  // 3 Key nodes for the Knowledge Graph
  const graphSources = verifiedSources
    .filter((s) => ["SUPPORTS", "CONTRADICTS", "CONTEXT"].includes((s.relationship || "").toUpperCase()))
    .slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8"
    >
      {/* 1. TOP ACTION BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800">
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800/80 dark:hover:bg-slate-700/80 border border-slate-200/80 dark:border-slate-700/80 transition-all cursor-pointer shadow-2xs group w-fit"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Studio</span>
        </button>

        <div className="flex items-center flex-wrap gap-2">
          {feedbackSuccess && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
              <Check className="w-3.5 h-3.5" /> Feedback sent!
            </span>
          )}

          <button
            type="button"
            onClick={copyReport}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 transition-colors cursor-pointer"
            title="Copy report text"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={share}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>

          <button
            type="button"
            onClick={downloadReport}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setFeedbackError("");
              setFeedbackOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 transition-colors cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Feedback</span>
          </button>
        </div>
      </div>

      {/* FEEDBACK MODAL */}
      <AnimatePresence>
        {feedbackOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={() => !feedbackSending && setFeedbackOpen(false)}
          >
            <motion.form
              className="w-full max-w-md p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl relative space-y-4"
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              onMouseDown={(e) => e.stopPropagation()}
              onSubmit={submitFeedback}
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                  Your Voice Matters
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                  Share Feedback
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Help us make TruthLens verification more reliable and useful.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Name
                </label>
                <input
                  required
                  minLength={2}
                  maxLength={80}
                  value={feedbackForm.name}
                  onChange={(e) => setFeedbackForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Your name"
                  className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Email
                </label>
                <input
                  required
                  type="email"
                  maxLength={254}
                  value={feedbackForm.email}
                  onChange={(e) => setFeedbackForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="you@example.com"
                  className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Feedback
                </label>
                <textarea
                  required
                  minLength={10}
                  maxLength={3000}
                  rows={3}
                  value={feedbackForm.message}
                  onChange={(e) => setFeedbackForm((f) => ({ ...f, message: e.target.value }))}
                  placeholder="What worked well, or what could be improved?"
                  className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                />
              </div>

              {feedbackError && <p className="text-xs text-rose-500 font-medium">{feedbackError}</p>}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setFeedbackOpen(false)}
                  disabled={feedbackSending}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={feedbackSending}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-teal-500 hover:bg-teal-400 text-slate-950 transition-colors cursor-pointer shadow-md shadow-teal-500/20"
                >
                  {feedbackSending ? "Submitting..." : "Submit Feedback"}
                </button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. HERO SECTION: SUBMITTED EVIDENCE + PRIMARY VERDICT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Input Evidence Card (5 cols) */}
        <div className="lg:col-span-5 rounded-3xl p-6 bg-white/80 dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 shadow-xl backdrop-blur-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <FileImage className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                {isMedia ? "IMAGE EVIDENCE" : hasDocument ? "DOCUMENT EVIDENCE" : "INPUT CLAIM"}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/25">
                {verifiedSources.length} Sources Analyzed
              </span>
            </div>

            <div className="py-5">
              {isMedia && inputPreviewUrl ? (
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 group max-h-[220px]">
                  <img
                    src={inputPreviewUrl}
                    alt="Submitted input"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <button
                    type="button"
                    onClick={() => window.open(inputPreviewUrl, "_blank")}
                    className="absolute bottom-2 right-2 px-2.5 py-1 rounded-lg bg-black/70 hover:bg-black text-white text-[11px] font-semibold flex items-center gap-1 backdrop-blur-sm transition-colors cursor-pointer"
                  >
                    <ExternalLink className="w-3 h-3" /> View Original
                  </button>
                </div>
              ) : (
                <blockquote className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100 leading-snug tracking-tight italic">
                  “{text(result.claim)}”
                </blockquote>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-teal-500" />
              <span>Category:</span>
              <strong className="text-slate-800 dark:text-slate-200 font-semibold">
                {result.claimType || "Factual Claim"}
              </strong>
            </span>
            <span>{isMedia ? "Visual Media" : hasDocument ? "Document Scan" : "Text"}</span>
          </div>
        </div>

        {/* Right: Primary Verdict Card (7 cols) */}
        <div
          className={`lg:col-span-7 rounded-3xl p-6 sm:p-7 bg-white dark:bg-slate-900 border ${meta.cardBorder} shadow-2xl relative overflow-hidden flex flex-col justify-between`}
          style={{
            boxShadow: `0 20px 50px -15px ${meta.haloColor}`,
          }}
        >
          {/* Subtle ambient background glow */}
          <div
            className={`absolute -top-24 -right-24 w-72 h-72 rounded-full blur-3xl pointer-events-none opacity-40 bg-gradient-to-br ${meta.gradient}`}
          />

          <div>
            {/* Top row: Verdict pill & Confidence badge */}
            <div className="flex items-center justify-between gap-3 mb-5">
              <span className="text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
                Official AI Verdict
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-500" />
                {result.confidenceLabel || "Confidence"}: {result.confidence}%
              </span>
            </div>

            {/* Verdict Title & Big Icon */}
            <div className="flex items-start gap-4 mb-4">
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border ${meta.badgeBg} shadow-md`}
              >
                <VerdictIcon className="w-8 h-8 stroke-[2.5]" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-none mb-1.5">
                  {meta.label}
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
                  {meta.title}
                </p>
              </div>
            </div>

            {/* Bottom-line summary */}
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80 mb-5">
              {text(result.why)}
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 block mb-0.5">Verified At</span>
              <strong className="text-xs text-slate-800 dark:text-slate-200 truncate block">
                {result.analyzedAt
                  ? new Date(result.analyzedAt).toLocaleDateString([], {
                      month: "short",
                      day: "numeric",
                    })
                  : "Today"}
              </strong>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 block mb-0.5">Sources Validated</span>
              <strong className="text-xs text-emerald-600 dark:text-emerald-400 truncate block">
                {verifiedSources.length} Reputable Outlets
              </strong>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 block mb-0.5">Independent</span>
              <strong className="text-xs text-teal-600 dark:text-teal-400 truncate block">
                {independent} Publishers
              </strong>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 block mb-0.5">Evidence Quality</span>
              <strong className="text-xs text-slate-800 dark:text-slate-200 truncate block">
                {result.evidenceStrength?.replace(" Evidence", "") || "High Grade"}
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* 3. ROW 2: EVIDENCE STRENGTH + WHY THIS VERDICT BREAKDOWN */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card A: Evidence Strength Meter */}
        <div className="rounded-3xl p-6 bg-white/80 dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 shadow-xl backdrop-blur-xl flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-5">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Evidence Strength & Consensus
              </h2>
            </div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
              Metric Score
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6 my-auto py-2">
            {/* Circular Gauge */}
            <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="transparent"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-slate-200 dark:text-slate-800"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="transparent"
                  stroke={meta.ringColor}
                  strokeWidth="8"
                  strokeDasharray={`${(result.confidence * 264) / 100} 264`}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-black text-slate-900 dark:text-white">
                  {result.confidence}%
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                  Confidence
                </span>
              </div>
            </div>

            {/* Source Consensus breakdown */}
            <div className="flex-1 w-full space-y-2.5">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 text-xs">
                <span className="flex items-center gap-2 font-medium text-emerald-700 dark:text-emerald-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" /> Supporting Outlets
                </span>
                <strong className="font-bold text-emerald-800 dark:text-emerald-200">
                  {supportCount} Sources
                </strong>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-rose-500/5 dark:bg-rose-500/10 border border-rose-500/20 text-xs">
                <span className="flex items-center gap-2 font-medium text-rose-700 dark:text-rose-300">
                  <span className="w-2 h-2 rounded-full bg-rose-500" /> Contradicting Outlets
                </span>
                <strong className="font-bold text-rose-800 dark:text-rose-200">
                  {contradictCount} Sources
                </strong>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-sky-500/5 dark:bg-sky-500/10 border border-sky-500/20 text-xs">
                <span className="flex items-center gap-2 font-medium text-sky-700 dark:text-sky-300">
                  <span className="w-2 h-2 rounded-full bg-sky-500" /> Context & Background
                </span>
                <strong className="font-bold text-sky-800 dark:text-sky-200">
                  {relatedCount} Sources
                </strong>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-500 shrink-0" />
            <span>
              Verified across {verifiedSources.length} authenticated sources including major news, fact checks, and public databases.
            </span>
          </p>
        </div>

        {/* Card B: Why this verdict & Key Evidence Points */}
        <div className="rounded-3xl p-6 bg-white/80 dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 shadow-xl backdrop-blur-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                  Investigative Findings
                </h2>
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                Key Evidence
              </span>
            </div>

            <div className="space-y-3">
              {/* Ground Truth Correction (if available) */}
              {result.truthCorrection && (
                <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/25">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300 block mb-1">
                    Ground Truth Reality
                  </span>
                  <p className="text-xs text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                    {text(result.truthCorrection)}
                  </p>
                </div>
              )}

              {/* Supported Points */}
              {supporting.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Confirmed Facts:
                  </span>
                  <ul className="space-y-1 pl-4">
                    {supporting.slice(0, 2).map((x, i) => (
                      <li
                        key={i}
                        className="text-xs text-slate-600 dark:text-slate-300 list-disc leading-snug"
                      >
                        {text(x)}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Contradicting Points */}
              {contradicting.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1">
                    <XCircle className="w-3.5 h-3.5" /> Disproven / Contradicted Points:
                  </span>
                  <ul className="space-y-1 pl-4">
                    {contradicting.slice(0, 2).map((x, i) => (
                      <li
                        key={i}
                        className="text-xs text-slate-600 dark:text-slate-300 list-disc leading-snug"
                      >
                        {text(x)}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Context Points */}
              {context.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-sky-600 dark:text-sky-400 flex items-center gap-1">
                    <Info className="w-3.5 h-3.5" /> Context & Background:
                  </span>
                  <ul className="space-y-1 pl-4">
                    {context.slice(0, 2).map((x, i) => (
                      <li
                        key={i}
                        className="text-xs text-slate-600 dark:text-slate-300 list-disc leading-snug"
                      >
                        {text(x)}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400">
            Source analysis synthesized with multi-step cross-referencing.
          </div>
        </div>
      </div>

      {/* 4. FOUNDER-LEVEL EVIDENCE KNOWLEDGE GRAPH */}
      <div className="rounded-3xl p-6 sm:p-8 bg-slate-900 dark:bg-[#070e1b] border border-slate-800 text-white shadow-2xl relative overflow-hidden">
        {/* Subtle grid pattern background */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)`,
            backgroundSize: "24px 24px",
          }}
        />

        {/* Header with Title & Legend */}
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-teal-400" />
              <h2 className="text-lg font-bold text-white tracking-tight">
                Evidence Investigation Graph
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Visual mapping: from raw input claim → multi-source evidence extraction → synthesized conclusion.
            </p>
          </div>

          {/* Graph Legend */}
          <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-300 bg-slate-800/80 px-3 py-1.5 rounded-full border border-slate-700/80 w-fit">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" /> Supports
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-400" /> Contradicts
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-sky-400" /> Context
            </span>
          </div>
        </div>

        {/* FLOWCHART / GRAPH CANVAS */}
        <div className="relative z-10 pt-8 pb-4 max-w-3xl mx-auto flex flex-col items-center">
          {/* STEP 1: INPUT CLAIM NODE */}
          <div className="w-full max-w-md p-4 rounded-2xl bg-slate-800/90 border border-slate-700 shadow-xl text-center relative group hover:border-teal-400/50 transition-colors">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-teal-500/20 text-teal-300 border border-teal-500/30 mb-2">
              <Target className="w-3 h-3" /> INPUT CLAIM
            </div>
            <p className="text-xs sm:text-sm font-semibold text-slate-200 line-clamp-2">
              “{text(result.claim)}”
            </p>
            {/* Glowing Anchor Dot */}
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-teal-400 ring-4 ring-slate-900" />
          </div>

          {/* CONNECTOR 1 (Down to Evidence Nodes) */}
          <div className="h-10 w-0.5 bg-gradient-to-b from-teal-400 to-slate-600 relative my-0.5">
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse" />
          </div>

          {/* STEP 2: MULTI-SOURCE EVIDENCE NODES (3 Columns) */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-3.5 my-2">
            {graphSources.map((s, idx) => {
              const rel = relation(s);
              const RelIcon = rel.icon;
              const identity = resolveSourceIdentity(s, s.url || null);

              return (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-slate-600 transition-all shadow-md flex flex-col justify-between gap-2.5 relative group"
                >
                  <div className="flex items-center justify-between gap-1.5">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border ${rel.bg}`}
                    >
                      <RelIcon className="w-3 h-3" />
                      {rel.label}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">#{idx + 1}</span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {identity.logoUrl && (
                        <img
                          src={identity.logoUrl}
                          alt=""
                          className="w-4 h-4 rounded-full shrink-0"
                          onError={(e) => ((e.target as HTMLElement).style.display = "none")}
                        />
                      )}
                      <strong className="text-xs font-bold text-white truncate block">
                        {identity.publisher}
                      </strong>
                    </div>
                    <p className="text-[11px] text-slate-300 line-clamp-2 leading-snug">
                      {text(s.title)}
                    </p>
                  </div>

                  {s.url && (
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[10px] font-semibold text-teal-400 hover:text-teal-300 transition-colors w-fit pt-1 border-t border-slate-700/60"
                    >
                      Inspect Source <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  )}
                </div>
              );
            })}
            {graphSources.length === 0 && (
              <div className="col-span-3 p-4 text-center text-xs text-slate-400">
                Live evidence sources processed for verdict synthesis.
              </div>
            )}
          </div>

          {/* CONNECTOR 2 (Converging down to Verdict) */}
          <div className="h-10 w-0.5 bg-gradient-to-b from-slate-600 to-emerald-400 relative my-0.5">
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>

          {/* STEP 3: SYNTHESIZED VERDICT NODE */}
          <div
            className={`w-full max-w-lg p-5 rounded-2xl bg-gradient-to-b from-slate-800 to-slate-900 border ${meta.cardBorder} shadow-2xl text-center relative`}
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-800 text-white border border-slate-700 mb-2">
              <Sparkles className="w-3 h-3 text-teal-400" />
              EVIDENCE-BASED CONCLUSION
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight mb-1">
              {meta.label}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed max-w-md mx-auto">
              {text(result.bottomLine || result.why)}
            </p>
          </div>
        </div>
      </div>

      {/* 5. CLAIM COMPARISON: SUBMITTED CLAIM VS VERIFIED REALITY */}
      <div className="rounded-3xl p-6 bg-white/80 dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 shadow-xl backdrop-blur-xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-6">
          <div className="flex items-center gap-2">
            <GitCommit className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              {isMedia ? "Visual Evidence Comparison" : "Claim vs. Verified Reality"}
            </h2>
          </div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
            Side-by-Side Analysis
          </span>
        </div>

        {isMedia ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Your Submitted Image
              </span>
              {inputPreviewUrl ? (
                <img
                  src={inputPreviewUrl}
                  alt="Submitted"
                  className="w-full h-48 object-cover rounded-xl border border-slate-200 dark:border-slate-700"
                />
              ) : (
                <div className="w-full h-48 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                  <ImageIcon className="w-8 h-8" />
                </div>
              )}
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Reference Source Evidence
              </span>
              {referenceImageUrl && !referenceImageFailed ? (
                <img
                  src={referenceImageUrl}
                  alt="Reference"
                  onError={() => setReferenceImageFailed(true)}
                  className="w-full h-48 object-cover rounded-xl border border-slate-200 dark:border-slate-700"
                />
              ) : (
                <div className="w-full h-48 rounded-xl bg-slate-100 dark:bg-slate-800 flex flex-col items-center justify-center text-slate-400 text-xs p-4 text-center">
                  <Search className="w-8 h-8 mb-2 opacity-50" />
                  <span>Verified via public records & news wires</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-stretch">
            {/* Left: What internet claimed */}
            <div className="p-5 rounded-2xl bg-rose-500/5 dark:bg-rose-500/10 border border-rose-500/20 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                    Circulating Rumor / Claim
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 leading-relaxed italic">
                  “{text(result.claim)}”
                </p>
              </div>
              <span className="text-[10px] text-slate-400 mt-4 block">
                Submitted for verification
              </span>
            </div>

            {/* Right: What facts confirm */}
            <div className="p-5 rounded-2xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    Verified Public Record
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 leading-relaxed">
                  {text(result.truthCorrection || result.bottomLine || result.why)}
                </p>
              </div>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-4 block">
                Validated against {verifiedSources.length} authentic sources
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 6. VERIFIED EVIDENCE TRAIL: FOUNDER-LEVEL SOURCES TABLE */}
      <div className="rounded-3xl p-6 bg-white/80 dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 shadow-xl backdrop-blur-xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <Globe2 className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Evidence Trail ({showAllSources ? "All Verified Sources" : "Top Evidence Sources"})
            </h2>
          </div>

          {verifiedSources.length > 6 ? (
            <button
              type="button"
              onClick={() => setShowAllSources((v) => !v)}
              className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline cursor-pointer flex items-center gap-1"
            >
              <span>{showAllSources ? "Show Top Sources" : `View All (${verifiedSources.length})`}</span>
              <ArrowRight className={`w-3 h-3 transition-transform ${showAllSources ? "-rotate-90" : ""}`} />
            </button>
          ) : (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/25">
              {verifiedSources.length} Citations Validated
            </span>
          )}
        </div>

        {/* Table of Sources */}
        <div className="space-y-2.5">
          {visibleSources.map((s, idx) => {
            const url = safeUrl(s.url || s.canonicalUrl);
            const rel = relation(s);
            const RelIcon = rel.icon;
            const identity = resolveSourceIdentity(s, url);

            return (
              <div
                key={url || idx}
                className="p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100/90 dark:bg-slate-800/50 dark:hover:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700/70 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left group"
              >
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  {/* Rank Badge */}
                  <span className="w-6 h-6 rounded-lg bg-slate-200/80 dark:bg-slate-700 flex items-center justify-center text-[11px] font-bold text-slate-700 dark:text-slate-300 shrink-0">
                    {idx + 1}
                  </span>

                  {/* Publisher Favicon & Names */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      {identity.logoUrl && (
                        <img
                          src={identity.logoUrl}
                          alt=""
                          className="w-4 h-4 rounded-full shrink-0"
                          onError={(e) => ((e.target as HTMLElement).style.display = "none")}
                        />
                      )}
                      <strong className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        {identity.publisher}
                      </strong>
                      {identity.domain && (
                        <span className="text-[10px] text-slate-400 truncate">
                          ({identity.domain})
                        </span>
                      )}
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border flex items-center gap-1 ${rel.bg}`}>
                        <RelIcon className="w-2.5 h-2.5" />
                        {rel.label}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-200/60 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 font-medium">
                        {sourceType(s, identity.domain)}
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 dark:text-slate-300 line-clamp-1 group-hover:text-teal-600 dark:group-hover:text-teal-300 transition-colors">
                      {text(s.title)}
                    </p>
                  </div>
                </div>

                {/* Right Action: Open URL */}
                <div className="shrink-0 flex items-center justify-end">
                  {url ? (
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900 hover:bg-teal-500 hover:text-slate-950 dark:hover:bg-teal-400 dark:hover:text-slate-950 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-all shadow-2xs group/btn cursor-pointer"
                    >
                      <span>Read Source</span>
                      <ExternalLink className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
                    </a>
                  ) : (
                    <span className="text-[10px] text-slate-400">Unavailable</span>
                  )}
                </div>
              </div>
            );
          })}

          {verifiedSources.length === 0 && (
            <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-center text-xs text-amber-700 dark:text-amber-300">
              No direct external citations could be verified for this specific inquiry.
            </div>
          )}
        </div>
      </div>

      {/* 7. AUDIT & TRANSPARENCY DRAWER */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 overflow-hidden">
        <button
          type="button"
          onClick={() => setAuditOpen((v) => !v)}
          className="w-full flex items-center justify-between p-4 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-teal-500" />
            <span>Research & Audit Details</span>
          </span>
          {auditOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        <AnimatePresence>
          {auditOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="p-4 pt-0 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 space-y-3"
            >
              {result.searchTransparency && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3">
                  <div className="p-2.5 rounded-xl bg-slate-100/70 dark:bg-slate-800/50">
                    <span className="text-[10px] block text-slate-400">Sources Discovered</span>
                    <strong className="text-sm font-bold text-slate-800 dark:text-slate-200">
                      {result.searchTransparency.sourcesFound}
                    </strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-100/70 dark:bg-slate-800/50">
                    <span className="text-[10px] block text-slate-400">Sources Evaluated</span>
                    <strong className="text-sm font-bold text-slate-800 dark:text-slate-200">
                      {result.searchTransparency.sourcesEvaluated}
                    </strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-100/70 dark:bg-slate-800/50">
                    <span className="text-[10px] block text-slate-400">Official Outlets</span>
                    <strong className="text-sm font-bold text-slate-800 dark:text-slate-200">
                      {result.searchTransparency.officialSourcesFound}
                    </strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-100/70 dark:bg-slate-800/50">
                    <span className="text-[10px] block text-slate-400">Independent Publishers</span>
                    <strong className="text-sm font-bold text-slate-800 dark:text-slate-200">
                      {result.searchTransparency.independentSourcesFound}
                    </strong>
                  </div>
                </div>
              )}

              {result.searchTransparency?.queriesUsed && (
                <div className="pt-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Search Queries Executed
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {result.searchTransparency.queriesUsed.map((q, i) => (
                      <code
                        key={i}
                        className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-mono text-[10px] text-slate-700 dark:text-slate-300"
                      >
                        {q}
                      </code>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 8. FOOTER CALL TO ACTION */}
      <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200/80 dark:border-slate-800">
        <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <span>AI-assisted verification. For legal or critical claims, always inspect original citations.</span>
        </p>

        <button
          type="button"
          onClick={onReset}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-wider bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-300 hover:to-emerald-300 text-slate-950 transition-all duration-200 shadow-xl shadow-teal-500/20 hover:scale-105 active:scale-95 cursor-pointer shrink-0"
        >
          <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
          <span>Verify Another Claim</span>
        </button>
      </div>
    </motion.div>
  );
};

export default ResultView;
