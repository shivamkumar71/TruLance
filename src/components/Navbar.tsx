import React, { useState } from "react";
import { Shield, Menu, X, PlusCircle, Globe, Sparkles } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

interface NavbarProps {
  currentTab: "home" | "check" | "how-it-works" | "features" | "history" | "about";
  onSelectTab: (tab: "home" | "check" | "how-it-works" | "features" | "history" | "about") => void;
  onNewCheck: () => void;
  historyCount?: number;
  hasActiveResult?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onNewCheck,
  historyCount = 0,
  hasActiveResult = false,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (tab: "home" | "check" | "how-it-works" | "features" | "history" | "about") => {
    onSelectTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-[#070d18]/90 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 sm:h-18 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <button
          onClick={() => handleNavClick("home")}
          id="btn-brand-logo"
          className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none"
          aria-label="TruthLens Home"
        >
          <div className="w-8 h-8 rounded-xl bg-blue-600/10 dark:bg-blue-500/15 border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-105 transition-transform shadow-2xs">
            <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">
            TruthLens
          </span>
        </button>

        {/* Center Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600 dark:text-slate-300">
          <button
            onClick={() => handleNavClick("home")}
            id="nav-link-home"
            className={`transition-colors cursor-pointer ${
              currentTab === "home"
                ? "text-blue-600 dark:text-blue-400 font-semibold"
                : "hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Home
          </button>
          <button
            onClick={() => handleNavClick("how-it-works")}
            id="nav-link-how-it-works"
            className={`transition-colors cursor-pointer ${
              currentTab === "how-it-works"
                ? "text-blue-600 dark:text-blue-400 font-semibold"
                : "hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            How It Works
          </button>
          <button
            onClick={() => handleNavClick("features")}
            id="nav-link-features"
            className={`transition-colors cursor-pointer ${
              currentTab === "features"
                ? "text-blue-600 dark:text-blue-400 font-semibold"
                : "hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Features
          </button>
          <button
            onClick={() => handleNavClick("history")}
            id="nav-link-history"
            className={`transition-colors cursor-pointer flex items-center gap-1.5 ${
              currentTab === "history"
                ? "text-blue-600 dark:text-blue-400 font-semibold"
                : "hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <span>History</span>
            {historyCount > 0 && (
              <span className="px-1.5 py-0.2 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-[10px] rounded-full font-bold">
                {historyCount}
              </span>
            )}
          </button>
          <button
            onClick={() => handleNavClick("about")}
            id="nav-link-about"
            className={`transition-colors cursor-pointer ${
              currentTab === "about"
                ? "text-blue-600 dark:text-blue-400 font-semibold"
                : "hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            About
          </button>
        </nav>

        {/* Right Controls */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Active result button if user is in another tab */}
          {hasActiveResult && (
            <button
              onClick={onNewCheck}
              id="btn-header-new-check"
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 text-xs font-semibold hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-colors cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>New Check</span>
            </button>
          )}

          {/* Dark / Light Toggle */}
          <ThemeToggle />

          {/* Get Started / Check Claim Button */}
          <button
            onClick={() => handleNavClick("check")}
            id="btn-nav-get-started"
            className="hidden sm:inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold transition-all shadow-sm hover:shadow-blue-500/20 active:scale-[0.98] cursor-pointer"
          >
            Check a Claim
          </button>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            id="btn-mobile-menu-toggle"
            className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#070d18] px-5 py-4 space-y-2 text-sm font-medium animate-in slide-in-from-top-2 duration-150">
          <button
            onClick={() => handleNavClick("home")}
            className={`w-full text-left px-3 py-2 rounded-lg ${
              currentTab === "home"
                ? "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-semibold"
                : "text-slate-700 dark:text-slate-300"
            }`}
          >
            Home
          </button>
          <button
            onClick={() => handleNavClick("check")}
            className={`w-full text-left px-3 py-2 rounded-lg ${
              currentTab === "check"
                ? "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-semibold"
                : "text-slate-700 dark:text-slate-300"
            }`}
          >
            Check a Claim
          </button>
          <button
            onClick={() => handleNavClick("how-it-works")}
            className={`w-full text-left px-3 py-2 rounded-lg ${
              currentTab === "how-it-works"
                ? "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-semibold"
                : "text-slate-700 dark:text-slate-300"
            }`}
          >
            How It Works
          </button>
          <button
            onClick={() => handleNavClick("features")}
            className={`w-full text-left px-3 py-2 rounded-lg ${
              currentTab === "features"
                ? "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-semibold"
                : "text-slate-700 dark:text-slate-300"
            }`}
          >
            Features
          </button>
          <button
            onClick={() => handleNavClick("history")}
            className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between ${
              currentTab === "history"
                ? "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-semibold"
                : "text-slate-700 dark:text-slate-300"
            }`}
          >
            <span>History</span>
            {historyCount > 0 && (
              <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-xs rounded-full font-bold">
                {historyCount}
              </span>
            )}
          </button>
          <button
            onClick={() => handleNavClick("about")}
            className={`w-full text-left px-3 py-2 rounded-lg ${
              currentTab === "about"
                ? "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-semibold"
                : "text-slate-700 dark:text-slate-300"
            }`}
          >
            About
          </button>

          <div className="pt-2">
            <button
              onClick={() => handleNavClick("check")}
              className="w-full py-2.5 rounded-xl bg-blue-600 text-white font-semibold flex items-center justify-center text-sm shadow-sm"
            >
              Start Fact Checking
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
