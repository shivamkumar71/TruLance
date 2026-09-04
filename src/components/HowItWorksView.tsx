import React from "react";
import { ArrowLeft, CheckCircle2, Shield, Search, FileText, Database, ArrowRight, Sparkles, Layers, Eye } from "lucide-react";

interface HowItWorksViewProps {
  onBack: () => void;
  onNewCheck: () => void;
}

export const HowItWorksView: React.FC<HowItWorksViewProps> = ({ onBack, onNewCheck }) => {
  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-8 sm:py-10 animate-in fade-in duration-200">
      {/* Back button */}
      <button
        onClick={onBack}
        id="btn-how-it-works-back"
        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-[#0b1329] border border-slate-200 dark:border-slate-800 shadow-2xs mb-6 cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Home</span>
      </button>

      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-3">
          <Shield className="w-3.5 h-3.5" />
          <span>Verification Methodology</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          How TruthLens Works
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
          TruthLens is built around a simple product promise: <strong className="text-slate-900 dark:text-slate-200">“Know what’s true. Before you share.”</strong> Every submission is analyzed against authentic public evidence, never pre-calculated assumptions.
        </p>
      </div>

      {/* Steps */}
      <div className="space-y-5 mb-10">
        <div className="p-6 rounded-2xl bg-white dark:bg-[#0b1329] border border-slate-200/90 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-lg bg-blue-600 text-white text-xs font-bold flex items-center justify-center font-mono">
                01
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Submit & Ingest
              </h3>
            </div>
            <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed pl-9">
            Paste a text claim, message or social headline, or upload an image, screenshot, PDF or document. When uploading files, you can optionally provide context to specify what to focus on.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-[#0b1329] border border-slate-200/90 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-lg bg-blue-600 text-white text-xs font-bold flex items-center justify-center font-mono">
                02
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Extract & Understand the Claim
              </h3>
            </div>
            <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed pl-9">
            TruthLens extracts the central factual assertions, key entities, dates, and premise without altering the statement's true meaning.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-[#0b1329] border border-slate-200/90 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-lg bg-blue-600 text-white text-xs font-bold flex items-center justify-center font-mono">
                03
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Search & Cross-Check Evidence
              </h3>
            </div>
            <Search className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed pl-9">
            TruthLens queries live registries, peer-reviewed scientific journals, official governmental portals, and reputable independent watchdogs. Sources are vetted to ensure clickable, exact article URLs are retrieved.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-[#0b1329] border border-slate-200/90 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-lg bg-blue-600 text-white text-xs font-bold flex items-center justify-center font-mono">
                04
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Calibrated Verdict & Explainability
              </h3>
            </div>
            <Eye className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed pl-9">
            You receive a transparent verdict (True, Likely True, Misleading, Likely False, False, or Insufficient Evidence) paired with a calibrated evidence confidence score, concise "Why?" explanation, and direct source links.
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="p-8 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-900/60 text-center">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">
          Ready to verify a claim?
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-5">
          Paste a headline, statement, or upload a document to get started.
        </p>
        <button
          onClick={onNewCheck}
          id="btn-how-it-works-start-check"
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer shadow-sm hover:shadow-blue-500/20 inline-flex items-center gap-2"
        >
          <span>Start Fact Checking</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
