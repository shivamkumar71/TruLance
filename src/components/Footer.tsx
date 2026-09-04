import React from "react";
import { Shield } from "lucide-react";

interface FooterProps {
  onSelectTab: (tab: "home" | "check" | "how-it-works" | "features" | "history" | "about") => void;
  onOpenLegal: (type: "privacy" | "terms") => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab, onOpenLegal }) => {
  return (
    <footer className="w-full border-t border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-[#070d18]/70 py-10 px-4 sm:px-8 mt-auto transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-500 dark:text-slate-400">
        {/* Left branding */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5 sm:gap-3.5 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-blue-600/10 dark:bg-blue-500/15 border border-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Shield className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="font-bold text-sm text-slate-900 dark:text-slate-100">TruthLens</span>
          </div>
          <span className="hidden sm:inline text-slate-300 dark:text-slate-700">•</span>
          <span className="text-slate-500">“Verify before you trust.”</span>
        </div>

        {/* Center Links */}
        <div className="flex items-center gap-5 sm:gap-7 flex-wrap justify-center font-medium">
          <button
            onClick={() => onSelectTab("home")}
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
          >
            Home
          </button>
          <button
            onClick={() => onSelectTab("check")}
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
          >
            Check
          </button>
          <button
            onClick={() => onSelectTab("how-it-works")}
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
          >
            How It Works
          </button>
          <button
            onClick={() => onSelectTab("history")}
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
          >
            History
          </button>
          <button
            onClick={() => onSelectTab("about")}
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
          >
            About
          </button>
          <button
            onClick={() => onOpenLegal("privacy")}
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
          >
            Privacy
          </button>
          <button
            onClick={() => onOpenLegal("terms")}
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
          >
            Terms
          </button>
        </div>

        {/* Right Copyright */}
        <div className="text-center sm:text-right text-[11px] text-slate-400 dark:text-slate-500">
          <span>© 2026 TruthLens. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
};
