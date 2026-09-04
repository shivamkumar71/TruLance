import React from "react";
import { Shield } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-[#070d18]/70 py-6 px-4 sm:px-8 mt-auto transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
        {/* Project Branding */}
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-lg bg-blue-600/10 dark:bg-blue-500/15 border border-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Shield className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          </div>
          <span className="font-bold text-sm tracking-tight text-slate-900 dark:text-slate-100">
            TruthLens
          </span>
        </div>

        {/* Copyright */}
        <div className="text-center sm:text-right text-[12px] text-slate-400 dark:text-slate-500">
          <span>© 2026 TruthLens. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
};
