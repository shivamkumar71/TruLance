import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Shield,
  Check,
  Loader2,
  Terminal,
  Search,
  Scale,
  Sparkles,
  Layers,
  Clock,
} from "lucide-react";
import { VerificationProgressEvent } from "../types";

interface VerificationLoaderProps {
  hasFile?: boolean;
  progress?: VerificationProgressEvent | null;
}

interface StepItem {
  id: "parse" | "search" | "analyze" | "crossref" | "verdict";
  title: string;
  detail: string;
  icon: React.ElementType;
}

const STEPS: StepItem[] = [
  {
    id: "parse",
    title: "Read input",
    detail: "Extract the claim and key facts",
    icon: Sparkles,
  },
  {
    id: "search",
    title: "Search sources",
    detail: "Query live news, records and fact-checks",
    icon: Search,
  },
  {
    id: "analyze",
    title: "Analyze evidence",
    detail: "Match sources against the claim",
    icon: Scale,
  },
  {
    id: "crossref",
    title: "Cross-check",
    detail: "Look for agreement and contradictions",
    icon: Layers,
  },
  {
    id: "verdict",
    title: "Prepare verdict",
    detail: "Calibrate confidence and citations",
    icon: Shield,
  },
];

const STEP_ORDER = STEPS.map((step) => step.id);

export const VerificationLoader: React.FC<VerificationLoaderProps> = ({ progress }) => {
  const [elapsedSec, setElapsedSec] = useState(0);
  const [displayPercent, setDisplayPercent] = useState(2);
  const startTimeRef = useRef(Date.now());
  const animFrameRef = useRef<number>(0);

  const currentStepId = progress?.step || "parse";
  const currentStepIndex = Math.max(0, STEP_ORDER.indexOf(currentStepId));
  const targetPercent = Math.max(2, Math.min(97, progress?.percent ?? 4));
  const activeStep = STEPS[currentStepIndex] || STEPS[0];
  const activeLog =
    progress?.log ||
    progress?.message ||
    "Waiting for the verification engine...";

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSec(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const animate = () => {
      setDisplayPercent((prev) => {
        if (prev === targetPercent) return prev;
        const delta = targetPercent - prev;
        const next = prev + Math.sign(delta) * Math.max(1, Math.abs(delta) * 0.18);
        if (Math.abs(targetPercent - next) < 0.6) return targetPercent;
        return Math.round(next);
      });
      animFrameRef.current = requestAnimationFrame(animate);
    };
    animFrameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [targetPercent]);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div
      id="verification-loader-container"
      className="w-full max-w-xl mx-auto py-10 px-4 sm:px-6 flex flex-col items-center justify-center text-center select-none relative"
    >
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-teal-500/10 dark:bg-teal-600/15 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="relative w-28 h-28 mb-7 flex items-center justify-center">
        <motion.div
          className="absolute inset-0 rounded-full border border-teal-500/20 dark:border-teal-400/20 bg-teal-500/5 dark:bg-teal-500/10"
          animate={{ scale: [1, 1.35, 1], opacity: [0.6, 0.15, 0.6] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -inset-1 rounded-full"
          style={{
            background: "conic-gradient(from 0deg, transparent 0%, rgba(45,212,191,0.35) 25%, transparent 50%)",
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute -inset-2 rounded-full border border-dashed border-teal-500/30 dark:border-teal-400/30"
          animate={{ rotate: 360 }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        />
        <div className="w-16 h-16 rounded-2xl bg-white/90 dark:bg-[#0b1329]/90 backdrop-blur-md border border-teal-200 dark:border-teal-800/80 shadow-lg shadow-teal-500/20 flex items-center justify-center relative overflow-hidden z-10">
          <Shield className="w-7 h-7 text-teal-600 dark:text-teal-300" />
          <motion.div
            className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-teal-400 to-transparent shadow-[0_0_10px_rgba(45,212,191,1)]"
            animate={{ top: ["0%", "100%", "0%"] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </div>

      <div className="mb-3">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 text-[11px] font-mono font-medium border border-slate-200/60 dark:border-slate-700/60">
          <Clock className="w-3 h-3" />
          Live for {formatTime(elapsedSec)}
        </span>
      </div>

      <div className="mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-300 text-xs font-semibold mb-2 border border-teal-500/20">
          <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
          <span>
            {activeStep.title} · {currentStepIndex + 1}/{STEPS.length}
          </span>
        </div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          {progress?.title || "Checking the claim"}
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
          {progress?.message || "Connected to the live verification pipeline."}
          {typeof progress?.sourcesFound === "number" ? ` · ${progress.sourcesFound} sources` : ""}
        </p>
      </div>

      <div className="w-full max-w-md mb-6">
        <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5 px-1">
          <span className="truncate">{activeStep.title}</span>
          <span className="font-mono text-teal-600 dark:text-teal-300 font-extrabold">
            {displayPercent}%
          </span>
        </div>
        <div className="w-full h-2 rounded-full bg-slate-200/80 dark:bg-slate-800/80 overflow-hidden p-0.5 border border-slate-300/40 dark:border-slate-700/50">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-teal-500 to-cyan-400 shadow-sm relative overflow-hidden"
            animate={{ width: `${displayPercent}%` }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent"
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>
        </div>
      </div>

      <div className="w-full max-w-md bg-slate-950 text-slate-200 rounded-2xl p-3.5 mb-6 text-left font-mono text-[11px] border border-slate-800 shadow-inner flex items-center gap-2.5 overflow-hidden">
        <Terminal className="w-4 h-4 text-emerald-400 shrink-0" />
        <AnimatePresence mode="wait">
          <motion.div
            key={activeLog}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="truncate text-emerald-400 font-medium"
          >
            {activeLog}
          </motion.div>
        </AnimatePresence>
        <motion.span
          className="w-1.5 h-4 bg-emerald-400 shrink-0"
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        />
      </div>

      <div className="w-full max-w-md bg-white/90 dark:bg-[#0c1427]/90 backdrop-blur-md border border-slate-200/90 dark:border-slate-800/90 rounded-2xl p-5 shadow-lg shadow-slate-900/5 dark:shadow-black/20 space-y-3.5 text-left">
        {STEPS.map((step, idx) => {
          const isDone = idx < currentStepIndex;
          const isCurrent = idx === currentStepIndex;

          return (
            <motion.div
              key={step.id}
              animate={{ opacity: isDone || isCurrent ? 1 : 0.4 }}
              className={`flex items-start gap-3.5 transition-all duration-300 ${
                isDone
                  ? "text-slate-800 dark:text-slate-200"
                  : isCurrent
                  ? "text-teal-600 dark:text-teal-300"
                  : "text-slate-400 dark:text-slate-600"
              }`}
            >
              <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 border transition-all">
                {isDone ? (
                  <div className="w-full h-full rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                ) : isCurrent ? (
                  <div className="w-full h-full rounded-lg bg-teal-500/15 border border-teal-500/30 text-teal-600 dark:text-teal-300 flex items-center justify-center">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  </div>
                ) : (
                  <div className="w-full h-full rounded-lg bg-slate-100 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-600" />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className={`text-xs font-bold leading-snug ${isCurrent ? "font-extrabold" : ""}`}>
                    {step.title}
                  </p>
                  {isCurrent && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300">
                      Live
                    </span>
                  )}
                  {isDone && (
                    <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400">
                      Done
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5">
                  {isCurrent && progress?.message ? progress.message : step.detail}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
