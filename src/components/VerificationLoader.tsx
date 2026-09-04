import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Shield, Check, Loader2 } from "lucide-react";

interface VerificationLoaderProps {
  hasFile?: boolean;
}

const STEPS = [
  { title: "Analyzing claim", detail: "Claim identified" },
  { title: "Finding evidence", detail: "Searching relevant sources" },
  { title: "Checking sources", detail: "Comparing independent evidence" },
  { title: "Checking context", detail: "Reviewing dates and context" },
  { title: "Building result", detail: "Synthesizing transparent report" },
];

export const VerificationLoader: React.FC<VerificationLoaderProps> = () => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const stepTimer = setInterval(() => {
      setCurrentStep((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 1100);

    return () => {
      clearInterval(stepTimer);
    };
  }, []);

  return (
    <div
      id="verification-loader-container"
      className="w-full max-w-lg mx-auto py-12 px-6 flex flex-col items-center justify-center text-center select-none"
    >
      {/* Central Scanner */}
      <div className="relative w-20 h-20 mb-8 flex items-center justify-center">
        <motion.div
          className="absolute inset-0 rounded-full border border-blue-500/20 bg-blue-500/5 dark:bg-blue-500/10"
          animate={{
            scale: [1, 1.25, 1],
            opacity: [0.7, 0.2, 0.7],
          }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="absolute inset-1 rounded-full border-2 border-dashed border-blue-500/30 dark:border-blue-400/30"
          animate={{ rotate: 360 }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        <div className="w-12 h-12 rounded-2xl bg-white dark:bg-[#0b1329] border border-slate-200 dark:border-slate-800 shadow-md flex items-center justify-center relative overflow-hidden z-10">
          <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <motion.div
            className="absolute inset-x-0 h-0.5 bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.9)]"
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
      </div>

      <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-1">
        Investigating claim
      </h2>
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
        Cross-checking evidence and evaluating source consensus
      </p>

      {/* Step Progression */}
      <div className="w-full max-w-sm bg-white dark:bg-[#0b1329] border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-2xs space-y-3.5 text-left mb-4">
        {STEPS.map((step, idx) => {
          const isDone = idx < currentStep;
          const isCurrent = idx === currentStep;

          return (
            <div
              key={step.title}
              className={`flex items-start gap-3 transition-all duration-300 ${
                isDone
                  ? "text-slate-800 dark:text-slate-200"
                  : isCurrent
                  ? "text-blue-600 dark:text-blue-400 font-semibold"
                  : "text-slate-400 dark:text-slate-600 opacity-60"
              }`}
            >
              <div className="w-5 h-5 flex items-center justify-center shrink-0 mt-0.5">
                {isDone ? (
                  <div className="w-4 h-4 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                ) : isCurrent ? (
                  <Loader2 className="w-4 h-4 animate-spin text-blue-600 dark:text-blue-400" />
                ) : (
                  <div className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700" />
                )}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold leading-snug">{step.title}</p>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 leading-tight">
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
