import React, { useMemo, useState } from "react";
import {
  ArrowLeft, ExternalLink, Copy, Check, ChevronDown, ChevronUp,
  AlertCircle, Calendar, CheckCircle2, AlertTriangle, Info,
  ShieldCheck, Landmark, FlaskConical, Scale, Library, Newspaper,
  Globe, FileSearch, Image as ImageIcon, Clock, Link2, Search,
  Sparkles, ShieldAlert, GitCompareArrows
} from "lucide-react";
import { VerificationResult, VerificationSource } from "../types";
import { VerdictBadge } from "./VerdictBadge";
import { ConfidenceMeter } from "./ConfidenceMeter";
import { motion, AnimatePresence } from "motion/react";

interface ResultViewProps {
  result: VerificationResult;
  onReset: () => void;
}

const cleanText = (value?: string | null) =>
  (value || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/\s+/g, " ")
    .trim();

const safeUrl = (value?: string | null): string | null => {
  if (!value) return null;
  try {
    const u = new URL(value);
    if (u.protocol !== "https:" && u.protocol !== "http:") return null;
    if (!u.hostname || u.hostname === "example.com" || u.hostname === "localhost") return null;
    return u.toString();
  } catch {
    return null;
  }
};

const hostnameOf = (url?: string | null) => {
  const clean = safeUrl(url);
  if (!clean) return "";
  try { return new URL(clean).hostname.replace(/^www\./, ""); } catch { return ""; }
};

const sourceKind = (source: VerificationSource) => {
  const host = hostnameOf(source.url || source.canonicalUrl);
  const category = (source.category || "").toLowerCase();
  if (category.includes("official") || /\.gov(\.in)?$|\.nic\.in$|\.mil$/.test(host) || /who\.int|un\.org|nasa\.gov/.test(host)) {
    return { label: "Primary / Official", icon: Landmark, cls: "source-kind-official" };
  }
  if (category.includes("research") || /nature\.com|science\.org|arxiv\.org|nih\.gov|pubmed/.test(host)) {
    return { label: "Research", icon: FlaskConical, cls: "source-kind-research" };
  }
  if (category.includes("fact") || /snopes\.com|factcheck\.org|politifact\.com|boomlive\.in|altnews\.in|afp\.com/.test(host)) {
    return { label: "Fact-check", icon: Scale, cls: "source-kind-factcheck" };
  }
  if (category.includes("historical") || /wikipedia\.org|archive\.org/.test(host)) {
    return { label: "Archive / Context", icon: Library, cls: "source-kind-context" };
  }
  if (category.includes("news")) return { label: "News / Reporting", icon: Newspaper, cls: "source-kind-news" };
  return { label: "Web source", icon: Globe, cls: "source-kind-web" };
};

const relationshipMeta = (relationship?: string) => {
  switch ((relationship || "NEUTRAL").toUpperCase()) {
    case "SUPPORTS": return { label: "Supports claim", cls: "rel-support", icon: CheckCircle2 };
    case "CONTRADICTS": return { label: "Contradicts claim", cls: "rel-contradict", icon: AlertTriangle };
    case "CONTEXT": return { label: "Adds context", cls: "rel-context", icon: Info };
    default: return { label: "Neutral", cls: "rel-neutral", icon: Info };
  }
};

const verdictTone = (verdict: string) => {
  const v = verdict.toUpperCase();
  if (v === "TRUE" || v === "LIKELY TRUE") return "result-hero-true";
  if (v === "FALSE" || v === "LIKELY FALSE" || v === "MISLEADING") return "result-hero-false";
  return "result-hero-neutral";
};

const SourceCard: React.FC<{ source: VerificationSource }> = ({ source }) => {
  const [faviconError, setFaviconError] = useState(false);
  const url = safeUrl(source.url || source.canonicalUrl);
  const host = hostnameOf(url);
  const kind = sourceKind(source);
  const rel = relationshipMeta(source.relationship);
  const KindIcon = kind.icon;
  const RelIcon = rel.icon;
  const favicon = host ? `https://www.google.com/s2/favicons?domain=${encodeURIComponent(host)}&sz=64` : null;
  const isVerified = Boolean(source.isVerified && url);

  return (
    <article className="result-source-card-v2">
      <div className="flex items-start gap-3">
        <div className={`source-favicon-v2 ${kind.cls}`}>
          {favicon && !faviconError ? (
            <img src={favicon} alt="" onError={() => setFaviconError(true)} referrerPolicy="no-referrer" />
          ) : <KindIcon className="w-4 h-4" />}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
            <span className={`source-kind-pill ${kind.cls}`}><KindIcon className="w-3 h-3" />{kind.label}</span>
            <span className={`source-relation-pill ${rel.cls}`}><RelIcon className="w-3 h-3" />{rel.label}</span>
            {isVerified && <span className="source-verified-pill"><ShieldCheck className="w-3 h-3" />Validated URL</span>}
          </div>
          <h4 className="text-sm font-bold leading-snug text-slate-900 dark:text-slate-100">
            {cleanText(source.title) || "Verified source"}
          </h4>
          <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-slate-500 dark:text-slate-400">
            <span className="font-semibold">{cleanText(source.publisher) || host || "Web source"}</span>
            {source.date && <><span>•</span><span>{cleanText(source.date)}</span></>}
            {host && <><span>•</span><span className="font-mono">{host}</span></>}
          </div>
          {(source.evidenceSummary || source.relevance || source.summary) && (
            <p className="mt-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
              {cleanText(source.evidenceSummary || source.relevance || source.summary)}
            </p>
          )}
          <div className="mt-3 flex items-center justify-between gap-3">
            <span className="text-[10px] text-slate-400 dark:text-slate-500">
              {source.independence ? `${source.independence} source` : "Source relationship shown above"}
            </span>
            {isVerified ? (
              <a
                href={url!}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-bold text-teal-700 dark:text-teal-300 bg-teal-500/10 hover:bg-teal-500/15 border border-teal-500/20 transition-colors"
              >
                Open original <ExternalLink className="w-3 h-3" />
              </a>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold text-slate-400 bg-slate-100 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700">
                <ShieldAlert className="w-3 h-3" /> Source URL unavailable
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

const EvidenceList: React.FC<{ title: string; items: string[]; tone: "support" | "contradict" | "context" }> = ({ title, items, tone }) => {
  if (!items.length) return null;
  const meta = tone === "support"
    ? { icon: CheckCircle2, cls: "evidence-support-v2" }
    : tone === "contradict"
      ? { icon: AlertTriangle, cls: "evidence-contradict-v2" }
      : { icon: Info, cls: "evidence-context-v2" };
  const Icon = meta.icon;
  return (
    <div className={`result-evidence-panel-v2 ${meta.cls}`}>
      <h3><Icon className="w-4 h-4" />{title}</h3>
      <ul>{items.map((item, i) => <li key={i}>{cleanText(item)}</li>)}</ul>
    </div>
  );
};

export const ResultView: React.FC<ResultViewProps> = ({ result, onReset }) => {
  const [copied, setCopied] = useState(false);
  const [showAudit, setShowAudit] = useState(false);

  const supporting = result.supportingEvidence || [];
  const contradicting = result.contradictingEvidence || [];
  const context = result.contextEvidence || result.context || [];
  const generalEvidence = result.evidence || [];
  const sources = useMemo(
    () => (result.sources || []).filter((s) => Boolean(s.title || s.url || s.canonicalUrl)),
    [result.sources]
  );

  const verifiedSourceCount = sources.filter((s) => Boolean(s.isVerified && safeUrl(s.url || s.canonicalUrl))).length;
  const sourceCount = sources.length;
  const hasEvidence = supporting.length + contradicting.length + context.length + generalEvidence.length > 0;
  const hasTimeline = Boolean(result.timelineItems?.length || result.timeline?.length);
  const timeline = result.timelineItems || result.timeline || [];
  const hasImage = Boolean(result.imageAnalysis || result.imageAssessment || result.contentType === "image");
  const hasDocument = Boolean(result.documentAnalysis || result.documentAssessment || result.contentType === "pdf" || result.contentType === "document");
  const hasAudit = Boolean(result.searchTransparency || result.detailedAnalysis || result.disputedPoints?.length || result.uncertainties?.length || hasTimeline);

  const handleCopy = async () => {
    const sourceText = sources.map((s) => {
      const u = safeUrl(s.url || s.canonicalUrl);
      return `• ${cleanText(s.publisher) || "Source"} — ${cleanText(s.title)}${u ? ` — ${u}` : ""}`;
    }).join("\n");
    const text = [
      "TruthLens Verification Report",
      "",
      `Claim: "${result.claim}"`,
      `Verdict: ${result.verdict}`,
      `Evidence confidence: ${result.confidence}%`,
      `Evidence strength: ${result.evidenceStrength || "Not specified"}`,
      "",
      `Why: ${result.why}`,
      supporting.length ? `\nSupporting evidence:\n${supporting.map(x => `• ${x}`).join("\n")}` : "",
      contradicting.length ? `\nContradicting evidence:\n${contradicting.map(x => `• ${x}`).join("\n")}` : "",
      context.length ? `\nContext:\n${context.map(x => `• ${x}`).join("\n")}` : "",
      `\nSources:\n${sourceText || "No validated source URL available."}`,
      result.bottomLine ? `\nBottom line: ${result.bottomLine}` : ""
    ].join("\n");
    try { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch {}
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="result-page-v2 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10"
    >
      <div className="result-toolbar-v2">
        <button onClick={onReset} className="result-toolbar-btn"><ArrowLeft className="w-4 h-4" /> New check</button>
        <button onClick={handleCopy} className="result-toolbar-btn">
          {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
          {copied ? "Copied" : "Copy report"}
        </button>
      </div>

      <section className={`result-hero-v2 ${verdictTone(result.verdict)}`}>
        <div className="result-hero-content-v2">
          <div className="flex items-center gap-2 mb-3">
            <span className="result-trust-chip"><ShieldCheck className="w-3.5 h-3.5" /> Evidence-backed report</span>
            {result.analyzedAt && <span className="result-time-chip">Checked {new Date(result.analyzedAt).toLocaleString()}</span>}
          </div>
          <p className="result-eyebrow mb-2">Verification verdict</p>
          <VerdictBadge verdict={result.verdict} size="lg" />
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            The verdict reflects the evidence retrieved for this claim. A high confidence score does not mean certainty; the underlying sources remain visible below.
          </p>
        </div>
        <div className="result-confidence-v2">
          <ConfidenceMeter
            score={result.confidence}
            evidenceStrength={result.evidenceStrength}
            confidenceLabel={result.confidenceLabel}
            claimType={result.claimType}
            verificationDifficulty={result.verificationDifficulty}
          />
          <div className="result-mini-stats">
            <div><strong>{sourceCount}</strong><span>sources</span></div>
            <div><strong>{verifiedSourceCount}</strong><span>validated URLs</span></div>
            <div><strong>{result.evidenceStrength ? result.evidenceStrength.replace(" Evidence", "") : "—"}</strong><span>evidence</span></div>
          </div>
        </div>
      </section>

      <div className="result-trust-note">
        <ShieldCheck className="w-4 h-4 shrink-0" />
        <span><strong>How to read this:</strong> TruthLens is an evidence-assisted verification tool, not a truth oracle. When reliable evidence is insufficient or conflicting, the report can surface uncertainty instead of treating missing evidence as proof.</span>
      </div>

      <section className="result-card-v2 result-claim-v2">
        <div className="result-section-head-v2"><span>01</span><h2>Claim being checked</h2></div>
        <blockquote>“{cleanText(result.claim)}”</blockquote>
        {result.normalizedClaim && result.normalizedClaim !== result.claim && (
          <div className="result-secondary-row"><span>Normalized assertion</span><p>{cleanText(result.normalizedClaim)}</p></div>
        )}
        {result.checkedFocus && (
          <div className="result-focus-chip"><Search className="w-3.5 h-3.5" /> Focus: <strong>{cleanText(result.checkedFocus)}</strong></div>
        )}
        <div className="result-meta-grid">
          {result.claimType && <div><span>Claim type</span><strong>{result.claimType}</strong></div>}
          {result.verificationDifficulty && <div><span>Verification difficulty</span><strong>{result.verificationDifficulty}</strong></div>}
          {result.confidenceLabel && <div><span>Confidence label</span><strong>{result.confidenceLabel}</strong></div>}
        </div>
      </section>

      <section className="result-card-v2">
        <div className="result-section-head-v2"><span>02</span><h2>Why this verdict?</h2></div>
        <p className="result-lead-v2">{cleanText(result.why)}</p>
        {(result.trueFact || result.truthCorrection) && result.verdict !== "TRUE" && result.verdict !== "LIKELY TRUE" && (
          <div className="result-correction-v2">
            <div className="flex items-center gap-2 mb-2"><Sparkles className="w-4 h-4 text-teal-500" /><strong>What the evidence indicates</strong></div>
            <p>{cleanText(result.trueFact || result.truthCorrection)}</p>
          </div>
        )}
        {result.bottomLine && (
          <div className="result-bottom-line-v2"><span>Bottom line</span><p>{cleanText(result.bottomLine)}</p></div>
        )}
      </section>

      <section className="result-card-v2">
        <div className="result-section-head-v2"><span>03</span><h2>Evidence breakdown</h2></div>
        {!hasEvidence ? (
          <div className="result-empty-v2"><Info className="w-5 h-5" /><div><strong>Evidence is limited</strong><p>No structured evidence points were returned. Review the source trail and uncertainty before relying on the verdict.</p></div></div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            <EvidenceList title="Supporting evidence" items={supporting.length ? supporting : []} tone="support" />
            <EvidenceList title="Contradicting evidence" items={contradicting.length ? contradicting : []} tone="contradict" />
            <EvidenceList title="Important context" items={context.length ? context : []} tone="context" />
          </div>
        )}
        {!supporting.length && !contradicting.length && !context.length && generalEvidence.length > 0 && (
          <ul className="result-general-evidence-v2">{generalEvidence.map((x,i) => <li key={i}>{cleanText(x)}</li>)}</ul>
        )}
      </section>

      <section className="result-card-v2">
        <div className="result-section-head-v2">
          <span>04</span><h2>Source trail</h2>
          <span className="ml-auto result-count-pill">{verifiedSourceCount} validated</span>
        </div>
        <div className="result-source-intro">
          <div><ShieldCheck className="w-5 h-5 text-teal-500" /><div><strong>Only validated source URLs are presented as clickable evidence.</strong><p>Each source is shown with its publisher, relationship to the claim, and available provenance.</p></div></div>
          {result.searchTransparency?.independentSourcesFound !== undefined && (
            <span className="result-independence-pill"><GitCompareArrows className="w-3.5 h-3.5" /> {result.searchTransparency.independentSourcesFound} independent</span>
          )}
        </div>
        {sources.length ? (
          <div className="space-y-3">{sources.map((source, i) => <SourceCard source={source} key={`${source.url || source.title}-${i}`} />)}</div>
        ) : (
          <div className="result-empty-v2"><Link2 className="w-5 h-5" /><div><strong>No validated source was returned</strong><p>TruthLens should not invent or display a source link when it cannot validate the source page.</p></div></div>
        )}
      </section>

      {(hasImage || hasDocument) && (
        <section className="result-card-v2">
          <div className="result-section-head-v2"><span>05</span><h2>Content analysis</h2></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {hasImage && result.imageAnalysis && (
              <div className="result-analysis-box-v2"><div className="flex items-center gap-2"><ImageIcon className="w-4 h-4 text-teal-500" /><strong>Image assessment</strong></div><p>{cleanText(result.imageAnalysis.visualContext || result.imageAnalysis.notes || result.imageAnalysis.isAuthentic || result.imageAnalysis.authenticityRating || "Visual assessment available.")}</p>{result.imageAnalysis.originEstablished !== undefined && <span>Origin established: {result.imageAnalysis.originEstablished ? "Yes" : "No"}</span>}</div>
            )}
            {hasDocument && (result.documentAnalysis || result.documentAssessment) && (
              <div className="result-analysis-box-v2"><div className="flex items-center gap-2"><FileSearch className="w-4 h-4 text-teal-500" /><strong>Document assessment</strong></div><p>{cleanText((result.documentAnalysis || result.documentAssessment)?.notes || (result.documentAnalysis || result.documentAssessment)?.tablesSummary || "Document content was included in the verification workflow.")}</p>{(result.documentAnalysis || result.documentAssessment)?.extractedClaims?.length ? <span>{(result.documentAnalysis || result.documentAssessment)!.extractedClaims!.length} extracted claims</span> : null}</div>
            )}
          </div>
        </section>
      )}

      {hasTimeline && (
        <section className="result-card-v2">
          <div className="result-section-head-v2"><span>06</span><h2>Timeline & context</h2></div>
          <div className="result-timeline-v2">
            {timeline.map((item, i) => <div key={i} className="result-timeline-item-v2"><div className="result-timeline-dot" /><div><span>{cleanText(item.date)}</span><p>{cleanText(item.event)}</p></div></div>)}
          </div>
        </section>
      )}

      {hasAudit && (
        <section className="result-card-v2 result-audit-v2">
          <button className="result-audit-toggle" onClick={() => setShowAudit(v => !v)}>
            <span><span className="result-section-number">07</span><span><strong>Research & audit details</strong><small>Search transparency, uncertainty and investigation context</small></span></span>
            {showAudit ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          <AnimatePresence initial={false}>
            {showAudit && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                <div className="pt-5 space-y-5">
                  {result.searchTransparency && (
                    <div>
                      <h3 className="audit-heading"><Search className="w-4 h-4" />Search transparency</h3>
                      <div className="audit-stat-grid">
                        <div><strong>{result.searchTransparency.sourcesFound}</strong><span>found</span></div>
                        <div><strong>{result.searchTransparency.sourcesEvaluated}</strong><span>evaluated</span></div>
                        <div><strong>{result.searchTransparency.officialSourcesFound}</strong><span>official</span></div>
                        <div><strong>{result.searchTransparency.independentSourcesFound}</strong><span>independent</span></div>
                      </div>
                      {result.searchTransparency.temporalContext && <p className="audit-copy">{cleanText(result.searchTransparency.temporalContext)}</p>}
                      {result.searchTransparency.queriesUsed?.length ? <details className="mt-3"><summary>Research queries used</summary><ul>{result.searchTransparency.queriesUsed.map((q,i)=><li key={i}>{cleanText(q)}</li>)}</ul></details> : null}
                    </div>
                  )}
                  {(result.disputedPoints?.length || result.uncertainties?.length) ? (
                    <div><h3 className="audit-heading"><AlertCircle className="w-4 h-4 text-amber-500" />Uncertainties & disputed points</h3><ul className="audit-list">{(result.disputedPoints || result.uncertainties || []).map((x,i)=><li key={i}>{cleanText(x)}</li>)}</ul></div>
                  ) : null}
                  {result.detailedAnalysis && (
                    <div className="space-y-3">
                      {result.detailedAnalysis.reasoning && <div><h3 className="audit-heading">Reasoning</h3><p className="audit-copy">{cleanText(result.detailedAnalysis.reasoning)}</p></div>}
                      {result.detailedAnalysis.sourceComparison && <div><h3 className="audit-heading">Source comparison</h3><p className="audit-copy">{cleanText(result.detailedAnalysis.sourceComparison)}</p></div>}
                      {result.detailedAnalysis.conflictingEvidence && <div><h3 className="audit-heading">Conflicting evidence</h3><p className="audit-copy">{cleanText(result.detailedAnalysis.conflictingEvidence)}</p></div>}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      )}

      <div className="result-disclaimer-v2">
        <ShieldAlert className="w-4 h-4 shrink-0" />
        <p><strong>Important:</strong> AI-assisted verification can make mistakes. For high-stakes decisions, open the original sources and verify the underlying evidence yourself.</p>
      </div>

      <div className="flex justify-center pt-2">
        <motion.button whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }} onClick={onReset} className="result-primary-cta">
          <ArrowLeft className="w-4 h-4" /> Verify another claim
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ResultView;
