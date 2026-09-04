import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ShieldCheck,
  Search,
  Layers,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Sparkles,
  ArrowRight,
  Database,
  Globe,
} from "lucide-react";

interface DemoScenario {
  id: string;
  claim: string;
  verdict: "TRUE" | "MISLEADING" | "FALSE";
  confidence: number;
  sources: { publisher: string; title: string; category: string }[];
  summary: string;
}

const DEMO_SCENARIOS: DemoScenario[] = [
  {
    id: "moon-drift",
    claim: "The Moon is slowly drifting away from Earth at 3.8 cm per year.",
    verdict: "TRUE",
    confidence: 93,
    sources: [
      { publisher: "NASA Lunar Science", title: "Lunar Laser Ranging Experiment Findings", category: "Official" },
      { publisher: "Nature Astronomy", title: "Tidal Friction and Earth-Moon Orbital Evolution", category: "Research" },
      { publisher: "Scientific American", title: "Why the Moon Is Moving Away From Earth", category: "Science" },
    ],
    summary: "Confirmed by 50+ years of laser ranging retroreflector measurements.",
  },
  {
    id: "mars-water",
    claim: "NASA discovered massive open flowing surface rivers on Mars in 2026.",
    verdict: "MISLEADING",
    confidence: 68,
    sources: [
      { publisher: "NASA JPL", title: "Perseverance Rover Ancient Lacustrine Sediments", category: "Official" },
      { publisher: "Reuters Fact Check", title: "Ancient dry riverbeds conflated with active rivers", category: "Fact Check" },
    ],
    summary: "Evidence confirms ancient riverbeds millions of years ago, not active flowing surface rivers.",
  },
  {
    id: "boiling-cure",
    claim: "Drinking boiled ocean saltwater cures acute viral pneumonia in 24 hours.",
    verdict: "FALSE",
    confidence: 95,
    sources: [
      { publisher: "World Health Organization", title: "Clinical Guidance on Respiratory Infections", category: "Official" },
      { publisher: "Mayo Clinic", title: "Hypernatremia and Severe Dehydration Risks of Seawater", category: "Research" },
    ],
    summary: "Medically refuted. High salinity causes severe dehydration and cellular damage.",
  },
];

export const HeroVerificationVisual: React.FC = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [activeStep, setActiveStep] = useState(0);

  // Cycle through scenarios
  useEffect(() => {
    const stepInterval = setInterval(() => {
      setActiveStep((prev) => {
        if (prev < 3) return prev + 1;
        return 0;
      });
    }, 2800);

    return () => clearInterval(stepInterval);
  }, []);

  useEffect(() => {
    if (activeStep === 0) {
      setActiveIdx((prev) => (prev + 1) % DEMO_SCENARIOS.length);
    }
  }, [activeStep]);

  const current = DEMO_SCENARIOS[activeIdx];

  const getVerdictBadge = (verdict: string) => {
    switch (verdict) {
      case "TRUE":
        return {
          bg: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
          icon: <CheckCircle2 className="w-3.5 h-3.5" />,
          label: "VERIFIED TRUE",
        };
      case "MISLEADING":
        return {
          bg: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
          icon: <AlertTriangle className="w-3.5 h-3.5" />,
          label: "MISLEADING",
        };
      case "FALSE":
      default:
        return {
          bg: "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30",
          icon: <AlertTriangle className="w-3.5 h-3.5" />,
          label: "FACTUALLY FALSE",
        };
    }
  };

  const badge = getVerdictBadge(current.verdict);

  return (
    <div className="relative w-full max-w-lg mx-auto">
      {/* Ambient background glow */}
      <div className="absolute -inset-2 bg-gradient-to-tr from-blue-600/20 via-indigo-600/10 to-blue-400/20 rounded-3xl blur-xl opacity-70 pointer-events-none dark:opacity-40" />

      {/* Main Container Card */}
      <div className="relative rounded-2xl bg-white dark:bg-[#0b1329] border border-slate-200/90 dark:border-slate-800 shadow-xl overflow-hidden transition-colors">
        {/* Card Header Bar */}
        <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-900/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700" />
              <div className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700" />
              <div className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700" />
            </div>
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 pl-1">
              TruthLens Live Verification Engine
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              Live
            </span>
          </div>
        </div>

        {/* Step Progression Indicators */}
        <div className="grid grid-cols-4 border-b border-slate-100 dark:border-slate-800/60 text-[10px] font-semibold">
          {[
            { label: "1. Input", icon: <Sparkles className="w-2.5 h-2.5" /> },
            { label: "2. Claim", icon: <Layers className="w-2.5 h-2.5" /> },
            { label: "3. Sources", icon: <Search className="w-2.5 h-2.5" /> },
            { label: "4. Verdict", icon: <ShieldCheck className="w-2.5 h-2.5" /> },
          ].map((s, idx) => {
            const isCurrent = activeStep === idx;
            const isDone = activeStep > idx;

            return (
              <div
                key={idx}
                className={`py-2 px-2 text-center flex items-center justify-center gap-1 transition-all ${
                  isCurrent
                    ? "bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 font-bold"
                    : isDone
                    ? "text-slate-700 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-900/30"
                    : "text-slate-400 dark:text-slate-600"
                }`}
              >
                {s.icon}
                <span className="hidden sm:inline">{s.label}</span>
              </div>
            );
          })}
        </div>

        {/* Dynamic Card Content */}
        <div className="p-5 sm:p-6 space-y-4 min-h-[300px] flex flex-col justify-between">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${current.id}-${activeStep}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              className="space-y-4"
            >
              {/* Step 1: Input & Extraction */}
              <div>
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 dark:text-slate-500 mb-1.5">
                  <span className="uppercase tracking-wider">Submitted Claim</span>
                  <span className="text-[10px] text-blue-600 dark:text-blue-400">Extracted & normalized</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200">
                  "{current.claim}"
                </div>
              </div>

              {/* Step 2/3: Discovered & Cross-Checked Sources */}
              <div>
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 dark:text-slate-500 mb-2">
                  <span className="uppercase tracking-wider">Evidence Sources ({current.sources.length})</span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400">Independent matching</span>
                </div>

                <div className="space-y-2">
                  {current.sources.map((src, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -4 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08, duration: 0.2 }}
                      className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-slate-900 dark:text-slate-100 text-[11px]">
                            {src.publisher}
                          </span>
                          <span className="px-1.5 py-0.2 text-[9px] font-bold rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                            {src.category}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                          {src.title}
                        </p>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Step 4: Final Verdict & Confidence Preview */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border ${badge.bg}`}
                  >
                    {badge.icon}
                    <span>{badge.label}</span>
                  </span>
                  <span className="text-xs text-slate-600 dark:text-slate-300 font-semibold">
                    {current.confidence}% Confidence
                  </span>
                </div>

                <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium hidden sm:inline">
                  {current.summary.slice(0, 42)}...
                </span>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Quick Scenario Selector Pills */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-[11px]">
            <span className="text-slate-400 text-[10px]">Test scenario:</span>
            <div className="flex items-center gap-1.5">
              {DEMO_SCENARIOS.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setActiveIdx(idx);
                    setActiveStep(3);
                  }}
                  className={`px-2 py-1 rounded-md text-[10px] font-semibold transition-colors cursor-pointer ${
                    activeIdx === idx
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
                  }`}
                >
                  {idx === 0 ? "Moon Orbit" : idx === 1 ? "Mars Rivers" : "Health Claim"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
