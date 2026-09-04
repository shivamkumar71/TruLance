import React, { useState, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { HomeView } from "./components/HomeView";
import { CheckWorkspace } from "./components/CheckWorkspace";
import { ResultView } from "./components/ResultView";
import { HistoryView } from "./components/HistoryView";
import { HowItWorksView } from "./components/HowItWorksView";
import { AboutView } from "./components/AboutView";
import { VerificationLoader } from "./components/VerificationLoader";
import { LegalModal } from "./components/LegalModal";
import { Footer } from "./components/Footer";
import { ThemeProvider } from "./context/ThemeContext";
import { VerificationResult, VerifyRequestPayload, HistoryItem } from "./types";
import { motion, AnimatePresence } from "motion/react";

const HISTORY_STORAGE_KEY = "truthlens-history-v1";

export type NavTab = "home" | "check" | "how-it-works" | "features" | "history" | "about";

function MainApp() {
  const [currentTab, setCurrentTab] = useState<NavTab>("home");
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [legalModal, setLegalModal] = useState<"privacy" | "terms" | null>(null);

  // Load history from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (saved) {
        setHistoryItems(JSON.parse(saved));
      }
    } catch (e) {
      console.warn("Failed to load history from localStorage:", e);
    }
  }, []);

  // Save history to localStorage
  const saveToHistory = (newResult: VerificationResult) => {
    const item: HistoryItem = {
      id: "hist-" + Date.now() + "-" + Math.random().toString(36).slice(2, 7),
      claim: newResult.claim,
      verdict: newResult.verdict,
      confidence: newResult.confidence,
      confidenceLabel: newResult.confidenceLabel,
      evidenceStrength: newResult.evidenceStrength,
      claimType: newResult.claimType,
      verificationDifficulty: newResult.verificationDifficulty,
      sourcesCount: newResult.sources?.length || 0,
      timestamp: new Date().toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      contentType: newResult.contentType || "text",
      result: newResult,
    };

    setHistoryItems((prev) => {
      const updated = [item, ...prev].slice(0, 50);
      try {
        localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn("Failed to persist history item:", e);
      }
      return updated;
    });
  };

  const handleDeleteHistory = (id: string) => {
    setHistoryItems((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      try {
        localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn("Failed to update history:", e);
      }
      return updated;
    });
  };

  const handleClearAllHistory = () => {
    setHistoryItems([]);
    try {
      localStorage.removeItem(HISTORY_STORAGE_KEY);
    } catch (e) {
      console.warn("Failed to clear history:", e);
    }
  };

  const handleVerify = async (data: VerifyRequestPayload) => {
    setIsLoading(true);
    setApiError(null);

    try {
      const response = await fetch("/api/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: data.text,
          userContext: data.userContext,
          fileBase64: data.file?.base64,
          mimeType: data.file?.type,
          fileName: data.file?.name,
        }),
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => null);
        throw new Error(
          errJson?.error || `Verification request failed (${response.status}). Please try again.`
        );
      }

      const jsonResult: VerificationResult = await response.json();
      setResult(jsonResult);
      saveToHistory(jsonResult);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      console.error("Verification error:", err);
      setApiError(
        err.message || "Something went wrong while verifying this claim. Please try again."
      );
      // stay on check workspace if error occurs
      setCurrentTab("check");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setApiError(null);
    setCurrentTab("check");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSelectHistoryItem = (item: HistoryItem) => {
    setResult(item.result);
    setApiError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleTabChange = (tab: NavTab) => {
    if (tab === "features") {
      setCurrentTab("home");
      setResult(null);
      setTimeout(() => {
        const el = document.getElementById("features-section");
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 50);
      return;
    }

    setCurrentTab(tab);
    if (tab !== "home" && tab !== "check") {
      setResult(null);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#f4f7fb] dark:bg-[#070d18] text-slate-900 dark:text-slate-100 flex flex-col justify-between selection:bg-blue-500/20 selection:text-blue-700 dark:selection:text-blue-300 font-sans transition-colors duration-200">
      {/* Sticky Top Navigation */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={handleTabChange}
        onNewCheck={handleReset}
        historyCount={historyItems.length}
        hasActiveResult={!!result && !isLoading}
      />

      {/* Main Content View Container */}
      <main className="flex-1 flex flex-col items-center justify-start w-full">
        {/* Error Alert Banner */}
        {apiError && !isLoading && (
          <div className="w-full max-w-2xl mx-auto px-4 mt-6 animate-in fade-in">
            <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/80 text-rose-800 dark:text-rose-300 text-xs rounded-2xl flex items-center justify-between gap-3 shadow-2xs">
              <p className="font-medium">{apiError}</p>
              <button
                type="button"
                onClick={() => setApiError(null)}
                className="px-3 py-1.5 text-[11px] font-bold bg-rose-100 dark:bg-rose-900/60 rounded-xl hover:bg-rose-200 dark:hover:bg-rose-900 cursor-pointer shrink-0"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* View Transitions */}
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="w-full"
            >
              <VerificationLoader />
            </motion.div>
          ) : result ? (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="w-full"
            >
              <ResultView result={result} onReset={handleReset} />
            </motion.div>
          ) : currentTab === "check" ? (
            <motion.div
              key="check-workspace"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="w-full"
            >
              <CheckWorkspace
                onVerify={handleVerify}
                isLoading={isLoading}
                onBackToHome={() => handleTabChange("home")}
              />
            </motion.div>
          ) : currentTab === "history" ? (
            <motion.div
              key="history-tab"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="w-full"
            >
              <HistoryView
                items={historyItems}
                onSelect={handleSelectHistoryItem}
                onDelete={handleDeleteHistory}
                onClearAll={handleClearAllHistory}
                onNewCheck={handleReset}
              />
            </motion.div>
          ) : currentTab === "how-it-works" ? (
            <motion.div
              key="how-it-works-tab"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="w-full"
            >
              <HowItWorksView
                onBack={() => handleTabChange("home")}
                onNewCheck={handleReset}
              />
            </motion.div>
          ) : currentTab === "about" ? (
            <motion.div
              key="about-tab"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="w-full"
            >
              <AboutView
                onBack={() => handleTabChange("home")}
                onNewCheck={handleReset}
              />
            </motion.div>
          ) : (
            /* Home Landing Page */
            <motion.div
              key="home-page"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="w-full"
            >
              <HomeView
                onNavigateToCheck={() => handleTabChange("check")}
                onNavigateToHowItWorks={() => handleTabChange("how-it-works")}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Global Footer */}
      <Footer />

      {/* Legal Dialog */}
      <LegalModal type={legalModal} onClose={() => setLegalModal(null)} />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <MainApp />
    </ThemeProvider>
  );
}
