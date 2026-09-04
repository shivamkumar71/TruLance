import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Shield,
  Check,
  Loader2,
  Terminal,
  Database,
  Search,
  Scale,
  Sparkles,
  Layers,
} from "lucide-react";

interface VerificationLoaderProps {
  hasFile?: boolean;
}

interface StepItem {
  id: string;
  title: string;
  detail: string;
  terminalLog: string;
  icon: React.ElementType;
}

const STEPS: StepItem[] = [
  {
    id: "extract",
    title: "Extracting Core Propositions",
    detail: "Parsing key claims, factual assertions and named entities",
    terminalLog: "PARSE :: isolating verifiable propositions & entity graphs...",
    icon: Sparkles,
  },
  {
    id: "search",
    title: "Gathering Public Evidence",
    detail: "Searching authoritative archives, primary documents & records",
    terminalLog: "SEARCH :: querying indexed web archives & official records...",
    icon: Search,
  },
  {
    id: "compare",
    title: "Analyzing Source Consensus",
    detail: "Cross-checking agreement, contradictions & publisher credibility",
    terminalLog: "EVALUATE :: cross-referencing consensus & source tier weights...",
    icon: Scale,
  },
  {
    id: "context",
    title: "Auditing Context & Timeline",
    detail: "Reviewing publication dates, shifts in facts & media integrity",
    terminalLog: "AUDIT :: checking temporal continuity & media authenticity...",
    icon: Layers,
  },
  {
    id: "synthesize",
    title: "Calibrating Confidence & Verdict",
    detail: "Synthesizing transparent evidence report with verified citations",
    terminalLog: "COMPILE :: finalizing calibrated confidence & source citations...",
    icon: Shield,
  },
];

export const VerificationLoader: React.FC<VerificationLoaderProps> = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progressPercent, setProgressPercent] = useState(12);

  useEffect(() => {
    const stepTimer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < STEPS.length - 1) return prev + 1;
        return prev;
      });
    }, 1400);

    const progressTimer = setInterval(() => {
      setProgressPercent((prev) => {
        if (prev < 96) {
          const delta = Math.floor(Math.random() * 8) + 4;
          return Math.min(96, prev + delta);
        }
        return prev;
      });
    }, 450);

    return () => {
      clearInterval(stepTimer);
      clearInterval(progressTimer);
    };
  }, []);

  const activeStepItem = STEPS[currentStep] || STEPS[0];

  return (
    <div
      id="verification-loader-container"
      className="w-full max-w-xl mx-auto py-10 px-4 sm:px-6 flex flex-col items-center justify-center text-center select-none relative"
    >
      {/* Background Soft Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500/10 dark:bg-blue-600/15 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Futuristic Radar & Holographic Scanner HUD */}
      <div className="relative w-28 h-28 mb-7 flex items-center justify-center">
        {/* Outermost pulsing ring */}
        <motion.div
          className="absolute inset-0 rounded-full border border-blue-500/20 dark:border-blue-400/20 bg-blue-500/5 dark:bg-blue-500/10"
          animate={{
            scale: [1, 1.35, 1],
            opacity: [0.6, 0.15, 0.6],
          }}
          transition={{
            duration: 2.4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Outer dashed rotating ring */}
        <motion.div
          className="absolute -inset-2 rounded-full border border-dashed border-blue-500/30 dark:border-blue-400/30"
          animate={{ rotate: 360 }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Counter-rotating inner ring */}
        <motion.div
          className="absolute inset-2 rounded-full border border-blue-400/25 dark:border-blue-300/20"
          animate={{ rotate: -360 }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Central Core with Shield and Scanning Beam */}
        <div className="w-16 h-16 rounded-2xl bg-white/90 dark:bg-[#0b1329]/90 backdrop-blur-md border border-blue-200 dark:border-blue-800/80 shadow-lg shadow-blue-500/20 flex items-center justify-center relative overflow-hidden z-10">
          <Shield className="w-7 h-7 text-blue-600 dark:text-blue-400" />

          {/* Vertical Scanner Laser Sweep */}
          <motion.div
            className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent shadow-[0_0_10px_rgba(59,130,246,1)]"
            animate={{
              top: ["0%", "100%", "0%"],
            }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        {/* Corner Target Markers */}
        <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-blue-500/60" />
        <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-blue-500/60" />
        <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-blue-500/60" />
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-blue-500/60" />
      </div>

      {/* Main Status Heading & Live Percentage */}
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-semibold mb-2 border border-blue-500/20">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <span>Stage {currentStep + 1} of {STEPS.length} in Progress</span>
        </div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Investigating Claim & Evidence
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
          Querying trusted knowledge bases and validating source consensus with zero hallucination tolerance.
        </p>
      </div>

      {/* Progress Bar with Numerical Indicator */}
      <div className="w-full max-w-md mb-6">
        <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5 px-1">
          <span className="truncate">{activeStepItem.title}</span>
          <span className="font-mono text-blue-600 dark:text-blue-400 font-extrabold">{progressPercent}%</span>
        </div>
        <div className="w-full h-2 rounded-full bg-slate-200/80 dark:bg-slate-800/80 overflow-hidden p-0.5 border border-slate-300/40 dark:border-slate-700/50">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-500 shadow-sm"
            initial={{ width: "10%" }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Live Terminal Telemetry Log Ticker */}
      <div className="w-full max-w-md bg-slate-950 text-slate-200 rounded-2xl p-3.5 mb-6 text-left font-mono text-[11px] border border-slate-800 shadow-inner flex items-center gap-2.5 overflow-hidden">
        <Terminal className="w-4 h-4 text-emerald-400 shrink-0" />
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStepItem.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="truncate text-emerald-400 font-medium"
          >
            {activeStepItem.terminalLog}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Step Progression List Card */}
      <div className="w-full max-w-md bg-white/90 dark:bg-[#0c1427]/90 backdrop-blur-md border border-slate-200/90 dark:border-slate-800/90 rounded-2xl p-5 shadow-lg shadow-slate-900/5 dark:shadow-black/20 space-y-3.5 text-left">
        {STEPS.map((step, idx) => {
          const isDone = idx < currentStep;
          const isCurrent = idx === currentStep;
          const Icon = step.icon;

          return (
            <div
              key={step.id}
              className={`flex items-start gap-3.5 transition-all duration-300 ${
                isDone
                  ? "text-slate-800 dark:text-slate-200"
                  : isCurrent
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-slate-400 dark:text-slate-600 opacity-50"
              }`}
            >
              {/* Status Indicator Icon */}
              <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 border transition-all">
                {isDone ? (
                  <div className="w-full h-full rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                ) : isCurrent ? (
                  <div className="w-full h-full rounded-lg bg-blue-500/15 border border-blue-500/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  </div>
                ) : (
                  <div className="w-full h-full rounded-lg bg-slate-100 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-600" />
                  </div>
                )}
              </div>

              {/* Text Info */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className={`text-xs font-bold leading-snug ${isCurrent ? "text-blue-600 dark:text-blue-400 font-extrabold" : ""}`}>
                    {step.title}
                  </p>
                  {isCurrent && (
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                      Processing
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5">
                  {step.detail}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
