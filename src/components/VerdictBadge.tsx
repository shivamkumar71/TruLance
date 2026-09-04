import React from "react";
import { CheckCircle2, AlertTriangle, XCircle, HelpCircle, AlertCircle, Scale } from "lucide-react";
import { VerdictType } from "../types";

interface VerdictBadgeProps {
  verdict: VerdictType;
  size?: "sm" | "md" | "lg";
}

export const VerdictBadge: React.FC<VerdictBadgeProps> = ({ verdict, size = "md" }) => {
  const getVerdictConfig = (v: VerdictType) => {
    switch (v) {
      case "TRUE":
        return {
          label: "TRUE",
          bg: "bg-emerald-500/10 dark:bg-emerald-500/15 border-emerald-500/30 text-emerald-700 dark:text-emerald-300",
          icon: <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />,
        };
      case "LIKELY TRUE":
        return {
          label: "LIKELY TRUE",
          bg: "bg-blue-500/10 dark:bg-blue-500/15 border-blue-500/30 text-blue-700 dark:text-blue-300",
          icon: <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />,
        };
      case "MIXED":
      case "MISLEADING":
        return {
          label: v === "MIXED" ? "MIXED" : "MISLEADING",
          bg: "bg-amber-500/10 dark:bg-amber-500/15 border-amber-500/30 text-amber-800 dark:text-amber-300",
          icon: <Scale className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />,
        };
      case "LIKELY FALSE":
        return {
          label: "LIKELY FALSE",
          bg: "bg-orange-500/10 dark:bg-orange-500/15 border-orange-500/30 text-orange-800 dark:text-orange-300",
          icon: <AlertCircle className="w-4 h-4 text-orange-600 dark:text-orange-400 shrink-0" />,
        };
      case "FALSE":
        return {
          label: "FALSE",
          bg: "bg-rose-500/10 dark:bg-rose-500/15 border-rose-500/30 text-rose-700 dark:text-rose-400",
          icon: <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />,
        };
      case "UNVERIFIED":
      case "UNVERIFIABLE" as any:
      default:
        return {
          label: "UNVERIFIED",
          bg: "bg-slate-100 dark:bg-slate-800/80 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300",
          icon: <HelpCircle className="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0" />,
        };
    }
  };

  const config = getVerdictConfig(verdict);
  const sizeClasses =
    size === "lg"
      ? "px-3.5 py-1.5 text-xs font-bold tracking-wider"
      : size === "sm"
      ? "px-2 py-0.5 text-[10px] font-bold tracking-wider"
      : "px-3 py-1 text-[11px] font-bold tracking-wider";

  return (
    <span
      id="verdict-badge"
      className={`inline-flex items-center gap-1.5 rounded-full border shadow-2xs ${config.bg} ${sizeClasses} uppercase select-none font-semibold`}
    >
      {config.icon}
      <span>{config.label}</span>
    </span>
  );
};
