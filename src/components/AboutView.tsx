import React from "react";
import { ArrowLeft, Shield, HeartHandshake, Eye, CheckCircle2, ArrowRight, Sparkles } from "lucide-react";

interface AboutViewProps {
  onBack: () => void;
  onNewCheck: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onBack, onNewCheck }) => {
  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-8 sm:py-10 animate-in fade-in duration-200">
      {/* Back button */}
      <button
        onClick={onBack}
        id="btn-about-back"
        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-[#0b1329] border border-slate-200 dark:border-slate-800 shadow-2xs mb-6 cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Home</span>
      </button>

      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-3">
          <Shield className="w-3.5 h-3.5" />
          <span>Our Mission</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          About TruthLens
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
          TruthLens is an AI-assisted fact-checking and verification platform built to help you <strong className="text-slate-900 dark:text-slate-100">know what’s true before you share</strong>.
        </p>
      </div>

      {/* Core Principles */}
      <div className="space-y-4 mb-10">
        <div className="p-6 rounded-2xl bg-white dark:bg-[#0b1329] border border-slate-200/90 dark:border-slate-800 shadow-2xs">
          <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 mb-1.5 flex items-center gap-2">
            <Eye className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Evidence Over Speculation</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            TruthLens does not declare something true or false based on a single source or an opaque AI guess. Every result is grounded in tangible, primary evidence with direct source citations from official registers, scientific publications, and reputable newsrooms.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-[#0b1329] border border-slate-200/90 dark:border-slate-800 shadow-2xs">
          <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 mb-1.5 flex items-center gap-2">
            <HeartHandshake className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Honesty About Uncertainty</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            When evidence is sparse, outdated, or conflicting, TruthLens clearly flags the result as Unverified or Insufficient Evidence rather than fabricating artificial certainty.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-[#0b1329] border border-slate-200/90 dark:border-slate-800 shadow-2xs">
          <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 mb-1.5 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Respect for Privacy & Local Control</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Your uploaded files and text submissions are analyzed strictly for verification purposes in real time. Your previous verification history stays stored locally on your device.
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="p-8 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-900/60 text-center">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">
          Have something to verify?
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-5">
          Check any claim or document in seconds before you share it.
        </p>
        <button
          onClick={onNewCheck}
          id="btn-about-start-check"
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer shadow-sm hover:shadow-blue-500/20 inline-flex items-center gap-2"
        >
          <span>Start Fact Checking</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
