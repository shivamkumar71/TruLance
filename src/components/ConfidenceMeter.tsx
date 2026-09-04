import React from "react";
import { EvidenceStrength, ConfidenceLevel, ClaimType, VerificationDifficulty } from "../types";

interface ConfidenceMeterProps {
  score: number;
  evidenceStrength?: EvidenceStrength;
  confidenceLabel?: ConfidenceLevel;
  claimType?: ClaimType;
  verificationDifficulty?: VerificationDifficulty;
}

export const ConfidenceMeter: React.FC<ConfidenceMeterProps> = ({
  score,
  evidenceStrength,
  confidenceLabel,
  claimType,
  verificationDifficulty,
}) => {
  const normalized = Math.max(5, Math.min(98, Math.round(score)));

  // Derive explicit Evidence Strength string if not provided
  const derivedStrength: EvidenceStrength =
    evidenceStrength ||
    (normalized >= 90
      ? "Very High Evidence"
      : normalized >= 75
      ? "High Evidence"
      : normalized >= 50
      ? "Moderate Evidence"
      : normalized >= 30
      ? "Limited Evidence"
      : "Insufficient Evidence");

  const getStyle = (strength: EvidenceStrength) => {
    switch (strength) {
      case "Very High Evidence":
        return {
          barColor: "bg-blue-600 dark:bg-blue-500",
          textColor: "text-blue-700 dark:text-blue-400",
          badgeBg: "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30",
        };
      case "High Evidence":
        return {
          barColor: "bg-emerald-600 dark:bg-emerald-500",
          textColor: "text-emerald-700 dark:text-emerald-400",
          badgeBg: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
        };
      case "Moderate Evidence":
        return {
          barColor: "bg-amber-500",
          textColor: "text-amber-700 dark:text-amber-400",
          badgeBg: "bg-amber-500/10 text-amber-800 dark:text-amber-300 border-amber-500/30",
        };
      case "Limited Evidence":
        return {
          barColor: "bg-orange-500",
          textColor: "text-orange-700 dark:text-orange-400",
          badgeBg: "bg-orange-500/10 text-orange-800 dark:text-orange-300 border-orange-500/30",
        };
      case "Insufficient Evidence":
      default:
        return {
          barColor: "bg-slate-400 dark:bg-slate-600",
          textColor: "text-slate-600 dark:text-slate-400",
          badgeBg: "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700",
        };
    }
  };

  const style = getStyle(derivedStrength);

  return (
    <div id="confidence-score-block" className="flex flex-col sm:items-end gap-1.5">
      {/* Evidence Strength & Percentage */}
      <div className="flex items-center sm:justify-end gap-2 flex-wrap">
        <span
          className={`px-2.5 py-0.5 rounded-full text-xs font-bold border shadow-2xs ${style.badgeBg}`}
        >
          {derivedStrength}
        </span>
        <span className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
          {normalized}%
        </span>
      </div>

      {/* Progress Bar & Sub-indicators */}
      <div className="flex items-center gap-2">
        <div className="w-28 sm:w-32 h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-300/40 dark:border-slate-700/50">
          <div
            className={`h-full ${style.barColor} rounded-full transition-all duration-700 ease-out`}
            style={{ width: `${normalized}%` }}
          />
        </div>
        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
          Calibrated Score
        </span>
      </div>

      {/* Claim Type and Difficulty Meta */}
      {(claimType || verificationDifficulty) && (
        <div className="flex items-center gap-1.5 text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
          {claimType && (
            <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium">
              {claimType}
            </span>
          )}
          {verificationDifficulty && (
            <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium">
              {verificationDifficulty} Difficulty
            </span>
          )}
        </div>
      )}
    </div>
  );
};

