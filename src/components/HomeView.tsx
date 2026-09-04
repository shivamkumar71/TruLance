import React from "react";
import {
  Shield,
  Search,
  Layers,
  CheckCircle2,
  FileText,
  Clock,
  ArrowRight,
  Sparkles,
  Database,
  Eye,
  FileCheck,
  ShieldAlert,
  Image as ImageIcon,
  FileSpreadsheet,
} from "lucide-react";
import { HeroVerificationVisual } from "./HeroVerificationVisual";

interface HomeViewProps {
  onNavigateToCheck: () => void;
  onNavigateToHowItWorks: () => void;
  onNavigateToFeatures?: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigateToCheck,
  onNavigateToHowItWorks,
}) => {
  return (
    <div className="w-full flex flex-col items-center">
      {/* 1. HERO SECTION */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-8 pt-8 pb-16 lg:pt-16 lg:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          {/* Left Column */}
          <div className="lg:col-span-6 flex flex-col items-start text-left">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 dark:bg-blue-500/15 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-semibold mb-6 tracking-wide shadow-2xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Evidence-First Verification Platform</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.12] mb-6">
              Check what’s true.
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl mb-8 font-normal">
              Verify claims, images and documents using evidence from trusted sources.
            </p>

            {/* Primary & Secondary CTAs */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-10 w-full sm:w-auto">
              <button
                type="button"
                onClick={onNavigateToCheck}
                id="btn-hero-check-claim"
                className="px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-all shadow-md shadow-blue-500/20 hover:shadow-blue-500/30 active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Check a Claim</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onNavigateToHowItWorks}
                id="btn-hero-how-it-works"
                className="px-6 py-3.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 text-slate-700 dark:text-slate-300 font-semibold text-sm transition-colors hover:bg-slate-100/50 dark:hover:bg-slate-800/50 cursor-pointer"
              >
                How It Works
              </button>
            </div>

            {/* Input Capability Indicators */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-5 text-xs text-slate-500 dark:text-slate-400 font-medium pt-2 border-t border-slate-200/80 dark:border-slate-800/80 w-full">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-bold mr-1">
                Supported:
              </span>
              <div className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-blue-500" />
                <span>Text</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-blue-500" />
                <span>Image</span>
              </div>
              <div className="flex items-center gap-1.5">
                <FileCheck className="w-3.5 h-3.5 text-blue-500" />
                <span>PDF</span>
              </div>
              <div className="flex items-center gap-1.5">
                <FileSpreadsheet className="w-3.5 h-3.5 text-blue-500" />
                <span>Document</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual (Claim → Research → Evidence → Verdict) */}
          <div className="lg:col-span-6 w-full flex items-center justify-center">
            <HeroVerificationVisual />
          </div>
        </div>
      </section>

      {/* 2. TRUST & VALUE STRIP */}
      <section className="w-full border-y border-slate-200/80 dark:border-slate-800/80 bg-white/60 dark:bg-[#090f20]/60 backdrop-blur-sm py-8 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <p className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Core Principles
            </p>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
              Evidence determines the answer. We never invent sources.
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 w-full md:w-auto">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="text-left">
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">Claim Extraction</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Identify exact facts</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <Database className="w-4 h-4" />
              </div>
              <div className="text-left">
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">Evidence Research</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Direct public records</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <Layers className="w-4 h-4" />
              </div>
              <div className="text-left">
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">Source Agreement</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Cross-checking facts</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <Eye className="w-4 h-4" />
              </div>
              <div className="text-left">
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">Calibrated Verdicts</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Zero hallucinations</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS (4 SIMPLE STEPS) */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-20">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold mb-3">
            <span>Evidence-Driven Workflow</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            How It Works
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-3 leading-relaxed">
            Every submission is checked against actual public records and verified articles.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Step 1 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:border-blue-500/40 transition-all">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-extrabold text-blue-600 dark:text-blue-400 font-mono tracking-wider">
                01
              </span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-2">
              Submit
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Paste text or upload content.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:border-blue-500/40 transition-all">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-extrabold text-blue-600 dark:text-blue-400 font-mono tracking-wider">
                02
              </span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Search className="w-4 h-4" />
              </div>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-2">
              Research
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              TruthLens searches relevant sources.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:border-blue-500/40 transition-all">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-extrabold text-blue-600 dark:text-blue-400 font-mono tracking-wider">
                03
              </span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Layers className="w-4 h-4" />
              </div>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-2">
              Compare
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Evidence is checked for agreement and contradiction.
            </p>
          </div>

          {/* Step 4 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:border-blue-500/40 transition-all">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-extrabold text-blue-600 dark:text-blue-400 font-mono tracking-wider">
                04
              </span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Shield className="w-4 h-4" />
              </div>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-2">
              Verify
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Get a clear result with sources.
            </p>
          </div>
        </div>
      </section>

      {/* 4. WHY TRUTHLENS */}
      <section className="w-full border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-[#080e1c]/50 py-20 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-xs font-semibold mb-3">
              <span>Why TruthLens</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Evidence-first, not chatbot answers
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-3 leading-relaxed">
              TruthLens optimizes for accuracy, source quality, recency, and transparent reasoning.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-2">
                Claim Extraction
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Extract the core factual propositions from text, images, or documents before searching for external corroboration.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-2">
                Multi-Source Agreement
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Cross-check assertions against multiple independent sources, distinguishing original reporting from syndicated copies.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
                <FileCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-2">
                Image & Document Verification
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Verify screenshots, photographs, PDFs, and Word documents while separating media authenticity from claim truth.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
                <Eye className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-2">
                Exact Source Pages
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Every citation points to the specific relevant article or document, validated in real-time to avoid dead 404 links.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-2">
                Calibrated Confidence
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Confidence reflects actual evidence depth and source consensus, distinguishing solid facts from emerging or unverified claims.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-2">
                Recency Awareness
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Time-sensitive breaking claims prioritize fresh reports, while historical claims are corroborated with authoritative records.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FINAL CTA */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-20">
        <div className="p-8 sm:p-12 lg:p-16 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white text-center flex flex-col items-center justify-center shadow-xl shadow-blue-600/20 relative overflow-hidden">
          <div className="absolute -right-16 -top-16 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-black/10 rounded-full blur-2xl pointer-events-none" />

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 max-w-xl">
            Check what’s true.
          </h2>

          <p className="text-sm sm:text-base text-blue-100 max-w-md mb-8 leading-relaxed font-normal">
            Verify claims, images and documents using evidence from trusted sources.
          </p>

          <button
            type="button"
            onClick={onNavigateToCheck}
            id="btn-final-cta-start"
            className="px-8 py-4 rounded-xl bg-white text-blue-700 hover:bg-blue-50 font-bold text-sm sm:text-base shadow-lg transition-all active:scale-[0.98] cursor-pointer flex items-center gap-2"
          >
            <span>Check a Claim</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
};
