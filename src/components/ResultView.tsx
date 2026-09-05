import React, { useState } from "react";
import {
  ArrowLeft,
  ExternalLink,
  Calendar,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  FileSearch,
  Image as ImageIcon,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Info,
  Landmark,
  FlaskConical,
  Scale,
  Library,
  Newspaper,
  Globe,
  Building2,
} from "lucide-react";
import { VerificationResult, VerificationSource } from "../types";
import { VerdictBadge } from "./VerdictBadge";
import { ConfidenceMeter } from "./ConfidenceMeter";
import { motion, AnimatePresence } from "motion/react";

interface ResultViewProps {
  result: VerificationResult;
  onReset: () => void;
}

// Domain Type classification & Authority Favicon component
const SourceFavicon: React.FC<{ source: VerificationSource }> = ({ source }) => {
  const [imgError, setImgError] = useState(false);

  let hostname = "";
  if (source.url) {
    try {
      hostname = new URL(source.url).hostname.toLowerCase().replace(/^www\./, "");
    } catch {}
  }

  const category = (source.category || "").toLowerCase();
  const tier = (source.tier || "").toLowerCase();
  const publisher = (source.publisher || "").toLowerCase();

  // Determine Domain Authority Category
  const isGov =
    hostname.endsWith(".gov") ||
    hostname.endsWith(".gov.in") ||
    hostname.endsWith(".nic.in") ||
    hostname.endsWith(".mil") ||
    hostname.includes("pmo.gov") ||
    hostname.includes("who.int") ||
    hostname.includes("un.org") ||
    category === "official" ||
    tier.includes("official") ||
    publisher.includes("government") ||
    publisher.includes("ministry") ||
    publisher.includes("nasa") ||
    publisher.includes("white house");

  const isScience =
    hostname.includes("nature.com") ||
    hostname.includes("science.org") ||
    hostname.includes("cell.com") ||
    hostname.includes("thelancet.com") ||
    hostname.includes("arxiv.org") ||
    hostname.includes("nih.gov") ||
    hostname.endsWith(".edu") ||
    category === "research" ||
    category === "peer-reviewed" ||
    tier.includes("peer-reviewed");

  const isFactCheck =
    category === "fact check" ||
    hostname.includes("snopes.com") ||
    hostname.includes("factcheck.org") ||
    hostname.includes("politifact.com") ||
    hostname.includes("boomlive.in") ||
    hostname.includes("altnews.in") ||
    hostname.includes("afp.com") ||
    publisher.includes("fact check") ||
    publisher.includes("snopes") ||
    publisher.includes("politifact");

  const isArchive =
    hostname.includes("wikipedia.org") ||
    hostname.includes("archive.org") ||
    category === "historical context";

  let IconComponent = Newspaper;
  let domainBadgeBg = "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800/60";
  let domainLabel = "News / Media";

  if (isGov) {
    IconComponent = Landmark;
    domainBadgeBg = "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60";
    domainLabel = "Official / Gov";
  } else if (isScience) {
    IconComponent = FlaskConical;
    domainBadgeBg = "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/60";
    domainLabel = "Scientific / Journal";
  } else if (isFactCheck) {
    IconComponent = Scale;
    domainBadgeBg = "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/60";
    domainLabel = "Fact-Check Org";
  } else if (isArchive) {
    IconComponent = Library;
    domainBadgeBg = "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800/60";
    domainLabel = "Archive / Wiki";
  }

  const faviconUrl = hostname ? `https://www.google.com/s2/favicons?domain=${hostname}&sz=32` : null;

  return (
    <div className="flex items-center gap-1.5">
      <div
        className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 border overflow-hidden ${domainBadgeBg}`}
        title={`${domainLabel} (${hostname || source.publisher || "Domain"})`}
      >
        {faviconUrl && !imgError ? (
          <img
            src={faviconUrl}
            alt=""
            className="w-4 h-4 object-contain"
            onError={() => setImgError(true)}
            referrerPolicy="no-referrer"
          />
        ) : (
          <IconComponent className="w-3.5 h-3.5" />
        )}
      </div>
      <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold border hidden sm:inline-flex items-center gap-1 ${domainBadgeBg}`}>
        <IconComponent className="w-2.5 h-2.5" />
        {domainLabel}
      </span>
    </div>
  );
};

export const ResultView: React.FC<ResultViewProps> = ({ result, onReset }) => {
  const [copied, setCopied] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const handleCopy = () => {
    const text = `TruthLens Verification Report:
Claim: "${result.claim}"
Verdict: ${result.verdict} (${result.confidence}% Evidence Confidence - ${result.confidenceLabel || "Calibrated"})

Why: ${result.why}

${result.supportingEvidence && result.supportingEvidence.length > 0 ? `Supporting Evidence:\n${result.supportingEvidence.map((e) => `• ${e}`).join("\n")}\n\n` : ""}${result.contradictingEvidence && result.contradictingEvidence.length > 0 ? `Contradicting Evidence:\n${result.contradictingEvidence.map((e) => `• ${e}`).join("\n")}\n\n` : ""}${result.contextEvidence && result.contextEvidence.length > 0 ? `Important Context:\n${result.contextEvidence.map((e) => `• ${e}`).join("\n")}\n\n` : ""}Sources:
${result.sources?.map((s) => `• ${s.publisher || "Source"}: "${s.title}" ${s.url ? `(${s.url})` : "[Exact source page could not be verified]"}`).join("\n")}

${result.truthCorrection ? `What the evidence says instead:\n${result.truthCorrection}\n\n` : ""}
Bottom Line: ${result.bottomLine || result.why}

Verified by TruthLens — Evidence First.`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isImageAnalysis = Boolean(result.imageAnalysis) && (result.contentType === "image" || Boolean(result.imageAnalysis?.isAuthentic));
  const isDocumentAnalysis = Boolean(result.documentAnalysis) || result.contentType === "pdf" || result.contentType === "document";
  const hasDisputedPoints = result.disputedPoints && result.disputedPoints.length > 0;
  const hasTimeline = result.timelineItems && result.timelineItems.length > 0;
  const hasTransparency = Boolean(result.searchTransparency);
  const hasDetailedAnalysis =
    result.detailedAnalysis &&
    (result.detailedAnalysis.reasoning ||
      result.detailedAnalysis.sourceComparison ||
      result.detailedAnalysis.conflictingEvidence ||
      result.detailedAnalysis.factChecks?.length);

  // Evidence groupings
  const supporting = result.supportingEvidence || [];
  const contradicting = result.contradictingEvidence || [];
  const context = result.contextEvidence || [];
  const generalEvidence = result.evidence || [];
  const hasCategorizedEvidence = supporting.length > 0 || contradicting.length > 0 || context.length > 0;

  const getRelationshipBadge = (rel?: string) => {
    const normalized = (rel || "").toUpperCase();
    if (normalized === "SUPPORTS") {
      return (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
          Supports
        </span>
      );
    }
    if (normalized === "CONTRADICTS") {
      return (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-500/20">
          Contradicts
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
        Context
      </span>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="page-surface w-full max-w-3xl mx-auto px-4 py-8 sm:py-10"
    >
      {/* Top Action Bar */}
      <div className="flex items-center justify-between gap-3 mb-6">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onReset}
          id="btn-result-new-check"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-[#0b1329] border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-2xs transition-all cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>New Check</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleCopy}
          id="btn-result-copy-report"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-[#0b1329] border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-colors shadow-2xs cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </motion.button>
      </div>

      {/* Main Verification Report Container */}
      <div className="bg-white dark:bg-[#0b1329] border border-slate-200/90 dark:border-slate-800 rounded-3xl shadow-lg shadow-slate-900/5 dark:shadow-black/30 overflow-hidden mb-6 transition-colors">
        {/* 1. TOP: VERDICT & CONFIDENCE */}
        <div className="p-6 sm:p-7 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-1.5">
              Verdict
            </span>
            <VerdictBadge verdict={result.verdict} size="lg" />
          </div>

          <ConfidenceMeter
            score={result.confidence}
            evidenceStrength={result.evidenceStrength}
            confidenceLabel={result.confidenceLabel}
            claimType={result.claimType}
            verificationDifficulty={result.verificationDifficulty}
          />
        </div>

        {/* 2. CLAIM */}
        <div className="p-6 sm:p-7 border-b border-slate-100 dark:border-slate-800/80">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-1.5">
            Claim
          </span>
          <p className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-50 leading-snug">
            "{result.claim}"
          </p>
          {result.normalizedClaim && result.normalizedClaim !== result.claim && (
            <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
              <span className="font-semibold text-slate-600 dark:text-slate-300">Normalized Assertion:</span>{" "}
              {result.normalizedClaim}
            </p>
          )}
          {result.checkedFocus && (
            <div className="mt-2.5 inline-flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2.5 py-1 rounded-md font-medium">
              <span>Context requested:</span>
              <span className="font-semibold">{result.checkedFocus}</span>
            </div>
          )}
        </div>

        {/* 3. WHY? */}
        <div className="p-6 sm:p-7 border-b border-slate-100 dark:border-slate-800/80">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-2">
            Why?
          </span>
          <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
            {result.why}
          </p>
        </div>

        {result.truthCorrection && result.verdict !== "TRUE" && result.verdict !== "LIKELY TRUE" && (
          <div className="p-6 sm:p-7 border-b border-teal-200/70 dark:border-teal-900/60 bg-teal-50/60 dark:bg-teal-950/20">
            <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-300 block mb-2">
              What the evidence says instead
            </span>
            <p className="text-sm sm:text-base text-teal-950 dark:text-teal-100 leading-relaxed font-semibold">
              {result.truthCorrection}
            </p>
          </div>
        )}

        {/* 4. EVIDENCE (Supporting, Contradicting, Important Context) */}
        <div className="p-6 sm:p-7 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/20 dark:bg-slate-950/10 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
              Evidence Breakdown
            </span>
            {(result.verdict === "UNVERIFIED" || result.verdict === "UNVERIFIABLE") && (
              <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
                Absence of contradiction is not proof of truth
              </span>
            )}
          </div>

          {hasCategorizedEvidence ? (
            <div className="space-y-4">
              {/* Supporting Evidence */}
              {supporting.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5 uppercase tracking-wider">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>Supporting Evidence</span>
                  </h4>
                  <ul className="space-y-2 pl-5">
                    {supporting.map((point, idx) => (
                      <li key={idx} className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 list-disc leading-relaxed">
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Contradicting Evidence */}
              {contradicting.length > 0 && (
                <div className="space-y-2 pt-1">
                  <h4 className="text-xs font-bold text-rose-700 dark:text-rose-400 flex items-center gap-1.5 uppercase tracking-wider">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 shrink-0" />
                    <span>Contradicting Evidence</span>
                  </h4>
                  <ul className="space-y-2 pl-5">
                    {contradicting.map((point, idx) => (
                      <li key={idx} className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 list-disc leading-relaxed">
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Context Evidence */}
              {context.length > 0 && (
                <div className="space-y-2 pt-1">
                  <h4 className="text-xs font-bold text-slate-700 dark:text-slate-400 flex items-center gap-1.5 uppercase tracking-wider">
                    <Info className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    <span>Important Context</span>
                  </h4>
                  <ul className="space-y-2 pl-5">
                    {context.map((point, idx) => (
                      <li key={idx} className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 list-disc leading-relaxed">
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : generalEvidence.length > 0 ? (
            <ul className="space-y-2.5">
              {generalEvidence.map((point, idx) => {
                const isContradiction =
                  point.toLowerCase().includes("no reliable evidence") ||
                  point.toLowerCase().includes("refutes") ||
                  point.toLowerCase().includes("false") ||
                  point.toLowerCase().includes("contradicts");

                return (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300"
                  >
                    {isContradiction ? (
                      <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    )}
                    <span className="leading-relaxed">{point}</span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-xs text-slate-500 dark:text-slate-400 italic">
              Limited direct evidence available in public records.
            </p>
          )}
        </div>

        {/* 5. IMAGE CHECK / DOCUMENT CHECK (Only for file inputs) */}
        {(isImageAnalysis || result.imageAssessment || result.imageAnalysis) && (
          <div className="p-6 sm:p-7 border-b border-slate-100 dark:border-slate-800/80 bg-blue-50/20 dark:bg-blue-950/20 space-y-3">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Image Verification & Forensics
              </span>
            </div>

            <div className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {(result.imageAssessment?.authenticityRating || result.imageAnalysis?.authenticityRating) && (
                <p>
                  <strong>Visual Authenticity:</strong>{" "}
                  <span className="px-2.5 py-0.5 rounded-md bg-blue-100/80 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-semibold inline-block">
                    {result.imageAssessment?.authenticityRating || result.imageAnalysis?.authenticityRating}
                  </span>
                </p>
              )}
              {(result.imageAssessment?.captionAccuracy || result.imageAnalysis?.captionAccuracy) && (
                <p>
                  <strong>Caption & Context Alignment:</strong>{" "}
                  {result.imageAssessment?.captionAccuracy || result.imageAnalysis?.captionAccuracy}
                </p>
              )}
              {(result.imageAssessment?.notes || result.imageAnalysis?.notes) && (
                <p>
                  <strong>Forensic Notes:</strong>{" "}
                  {result.imageAssessment?.notes || result.imageAnalysis?.notes}
                </p>
              )}
              <p className="text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                TruthLens strictly separates visual authenticity from factual truth: an authentic photograph can accompany a false claim, and a misleading claim does not automatically imply image manipulation.
              </p>
            </div>
          </div>
        )}

        {(isDocumentAnalysis || result.documentAssessment || result.documentAnalysis) && (
          <div className="p-6 sm:p-7 border-b border-slate-100 dark:border-slate-800/80 bg-blue-50/20 dark:bg-blue-950/20 space-y-3">
            <div className="flex items-center gap-2">
              <FileSearch className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Document Details
              </span>
            </div>
            {((result.documentAssessment?.extractedClaims && result.documentAssessment.extractedClaims.length > 0) ||
              (result.documentAnalysis?.extractedClaims && result.documentAnalysis.extractedClaims.length > 0)) && (
              <div>
                <strong className="text-xs text-slate-800 dark:text-slate-200">Extracted Assertions:</strong>
                <ul className="list-disc list-inside space-y-1 text-xs text-slate-600 dark:text-slate-400 mt-1 pl-1">
                  {(result.documentAssessment?.extractedClaims || result.documentAnalysis?.extractedClaims || []).map((cl, i) => (
                    <li key={i}>{cl}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* 6. SOURCES */}
        <div className="p-6 sm:p-7 border-b border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                Sources
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                {!result.sources || result.sources.length === 0
                  ? "Reliable evidence was not found"
                  : result.sources.length === 1
                  ? "1 strong source found"
                  : result.sources.length === 2
                  ? "2 independent sources found"
                  : `${result.sources.length}+ independent sources evaluated`}
              </p>
            </div>
          </div>

          {result.sources && result.sources.length > 0 ? (
            <div className="grid grid-cols-1 gap-3">
              {result.sources.map((source: VerificationSource, index: number) => {
                const effectiveUrl = source.canonicalUrl || source.url;
                const hasValidUrl =
                  effectiveUrl &&
                  typeof effectiveUrl === "string" &&
                  (effectiveUrl.startsWith("http://") || effectiveUrl.startsWith("https://"));

                const sourceDate = source.publishedDate || source.date;
                const summaryText = source.summary || source.evidenceSummary || source.relevance;
                const tierDisplay = source.sourceTier || source.tier;

                return (
                  <div
                    key={index}
                    className="p-4 rounded-xl bg-slate-50/70 dark:bg-slate-900/60 border border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <SourceFavicon source={source} />
                        {source.publisher && (
                          <span className="font-bold text-xs text-slate-900 dark:text-slate-100">
                            {source.publisher}
                          </span>
                        )}
                        {getRelationshipBadge(source.relationship)}
                        {source.category && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                            {source.category}
                          </span>
                        )}
                        {tierDisplay && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60">
                            {tierDisplay.split(":")[0]}
                          </span>
                        )}
                        {source.independence === "Syndicated" && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                            Syndicated Wire
                          </span>
                        )}
                        {sourceDate && (
                          <span className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {sourceDate}
                          </span>
                        )}
                      </div>

                      <h4 className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
                        {hasValidUrl ? (
                          <a
                            href={effectiveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline focus:outline-hidden"
                          >
                            "{source.title}"
                          </a>
                        ) : (
                          <span>"{source.title}"</span>
                        )}
                      </h4>

                      {summaryText && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                          {summaryText}
                        </p>
                      )}
                    </div>

                    <div className="shrink-0 pt-1 sm:pt-0">
                      {hasValidUrl ? (
                        <a
                          href={effectiveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-600 dark:text-blue-400 text-xs font-bold transition-colors cursor-pointer border border-blue-200 dark:border-blue-800/80"
                        >
                          <span>Open Source</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      ) : (
                        <span className="text-[11px] text-slate-400 dark:text-slate-500 italic">
                          Exact source page unverified
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 text-xs text-slate-500 dark:text-slate-400 text-center">
              Reliable external evidence was not found for this specific claim.
            </div>
          )}
        </div>

        {/* 7. BOTTOM LINE */}
        {result.bottomLine && (
          <div className="p-6 sm:p-7 bg-slate-50/60 dark:bg-slate-900/60">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-1.5">
              Bottom Line
            </span>
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 leading-relaxed">
              {result.bottomLine}
            </p>
          </div>
        )}

        {/* 8. Expandable Details (Nuances, Timeline, Forensics, Search Audit) */}
        {(hasDetailedAnalysis || hasDisputedPoints || hasTimeline || hasTransparency) && (
          <div className="border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/40 dark:bg-slate-950/20">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="w-full px-6 py-3.5 flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              <span>Details & Investigation Context</span>
              {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showDetails && (
              <div className="p-6 pt-2 space-y-4 text-xs sm:text-sm text-slate-700 dark:text-slate-300 border-t border-slate-100 dark:border-slate-800/60 animate-in fade-in">
                {/* Search Transparency & Multi-Stage Pipeline Audit */}
                {result.searchTransparency && (
                  <div className="p-3.5 rounded-xl bg-slate-100/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 text-xs">
                    <h5 className="font-bold text-slate-900 dark:text-slate-100 mb-2 flex items-center gap-1.5">
                      <FileSearch className="w-3.5 h-3.5 text-blue-500" />
                      <span>Search & Evidence Pipeline Audit</span>
                    </h5>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2.5">
                      <div className="p-2 rounded-lg bg-white dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 block font-medium">Reference Date</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">{result.searchTransparency.temporalReferenceDate || "September 1, 2026"}</span>
                      </div>
                      <div className="p-2 rounded-lg bg-white dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 block font-medium">Discovered Sources</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">{result.searchTransparency.sourcesFound}</span>
                      </div>
                      <div className="p-2 rounded-lg bg-white dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 block font-medium">Official Sources</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">{result.searchTransparency.officialSourcesFound}</span>
                      </div>
                      <div className="p-2 rounded-lg bg-white dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 block font-medium">Independent Sources</span>
                        <span className="font-bold text-blue-600 dark:text-blue-400">{result.searchTransparency.independentSourcesFound}</span>
                      </div>
                    </div>
                    {result.searchTransparency.queriesUsed && result.searchTransparency.queriesUsed.length > 0 && (
                      <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">Staged Research Queries:</span>
                        <ul className="list-disc list-inside mt-1 space-y-0.5 font-mono text-[10px] text-slate-600 dark:text-slate-400">
                          {result.searchTransparency.queriesUsed.map((q, idx) => (
                            <li key={idx} className="truncate">{q}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
                {hasDisputedPoints && (
                  <div>
                    <h5 className="font-bold text-slate-900 dark:text-slate-100 mb-1.5 flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                      <span>Nuances & Disputed Elements</span>
                    </h5>
                    <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400 pl-1">
                      {result.disputedPoints!.map((p, i) => (
                        <li key={i}>{p}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {result.detailedAnalysis?.reasoning && (
                  <div>
                    <h5 className="font-bold text-slate-900 dark:text-slate-100 mb-1">
                      Forensic Reasoning
                    </h5>
                    <p className="leading-relaxed text-slate-600 dark:text-slate-400">
                      {result.detailedAnalysis.reasoning}
                    </p>
                  </div>
                )}

                {hasTimeline && (
                  <div>
                    <h5 className="font-bold text-slate-900 dark:text-slate-100 mb-2 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-blue-500" />
                      <span>Documented Timeline</span>
                    </h5>
                    <div className="space-y-2 border-l-2 border-slate-200 dark:border-slate-800 pl-3">
                      {result.timelineItems!.map((item, idx) => (
                        <div key={idx} className="text-xs">
                          <span className="font-bold text-blue-600 dark:text-blue-400">
                            {item.date}:
                          </span>{" "}
                          <span className="text-slate-600 dark:text-slate-400">{item.event}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      <div className="flex justify-center">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onReset}
          className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-500/20 transition-all cursor-pointer flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Verify Another Claim</span>
        </motion.button>
      </div>
    </motion.div>
  );
};
