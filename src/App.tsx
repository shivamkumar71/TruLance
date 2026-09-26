import React, { useState } from "react";
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
import { VerificationResult, VerifyRequestPayload, HistoryItem, VerificationProgressEvent } from "./types";
import { motion, AnimatePresence } from "motion/react";

const RESULT_COMPLETION_DELAY_MS = 700;
const PROGRESS_STEP_DISPLAY_MS = 550;
const PROGRESS_STEP_ORDER = ["parse", "search", "analyze", "crossref", "verdict"] as const;

const wait = (ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms));

export type NavTab = "home" | "check" | "how-it-works" | "features" | "history" | "about";

function MainApp() {
  const [currentTab, setCurrentTab] = useState<NavTab>("home");
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [legalModal, setLegalModal] = useState<"privacy" | "terms" | null>(null);
  const [liveProgress, setLiveProgress] = useState<VerificationProgressEvent | null>(null);
  const [resultPreviewUrl, setResultPreviewUrl] = useState<string | null>(null);

  // Verification history is kept only for the current browser session.
  // Persistent verification data is stored server-side in MongoDB.
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

    setHistoryItems((prev) => [item, ...prev].slice(0, 50));
  };

  const handleDeleteHistory = (id: string) => {
    setHistoryItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearAllHistory = () => {
    setHistoryItems([]);
  };

  const handleVerify = async (data: VerifyRequestPayload) => {
    setIsLoading(true);
    setApiError(null);
    setLiveProgress({
      type: "progress",
      step: "parse",
      percent: 4,
      title: "Starting",
      message: "Connecting to the verification engine",
      log: "BOOT :: opening live progress stream...",
    });
    // A proxy can deliver several SSE events in one network chunk. Present each
    // newly reached stage in order so React does not batch the user past it.
    let displayedStepIndex = 0;
    const presentProgress = async (payload: VerificationProgressEvent) => {
      const nextStepIndex = Math.max(0, PROGRESS_STEP_ORDER.indexOf(payload.step || "parse"));
      setLiveProgress(payload);

      if (nextStepIndex > displayedStepIndex) {
        displayedStepIndex = nextStepIndex;
        await wait(PROGRESS_STEP_DISPLAY_MS);
      }
    };

    try {
      const response = await fetch("/api/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "text/event-stream",
          "X-TruthLens-Stream": "1",
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
        const errorBody = await response.text().catch(() => "");
        let errorMessage = "";
        try {
          errorMessage = JSON.parse(errorBody)?.error || "";
        } catch {
          errorMessage = errorBody.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
        }
        throw new Error(
          errorMessage || `Verification request failed (${response.status}). Please try again.`
        );
      }

      const contentType = response.headers.get("content-type") || "";
      let jsonResult: VerificationResult | null = null;

      if (contentType.includes("text/event-stream") && response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const chunks = buffer.split("\n\n");
          buffer = chunks.pop() || "";

          for (const chunk of chunks) {
            const dataLine = chunk
              .split("\n")
              .find((line) => line.startsWith("data: "));
            if (!dataLine) continue;
            const payload = JSON.parse(dataLine.slice(6)) as VerificationProgressEvent;
            if (payload.type === "progress") {
              await presentProgress(payload);
            } else if (payload.type === "result" && payload.result) {
              jsonResult = payload.result;
            } else if (payload.type === "error") {
              throw new Error(payload.error || "Verification failed.");
            }
          }
        }

        if (!jsonResult && buffer.trim()) {
          const dataLine = buffer
            .split("\n")
            .find((line) => line.startsWith("data: "));
          if (dataLine) {
          const payload = JSON.parse(dataLine.slice(6)) as VerificationProgressEvent;
          if (payload.type === "progress") await presentProgress(payload);
          if (payload.type === "result" && payload.result) jsonResult = payload.result;
            if (payload.type === "error") throw new Error(payload.error || "Verification failed.");
          }
        }
      } else {
        jsonResult = await response.json();
      }

      if (!jsonResult) {
        throw new Error("Verification finished without a result. Please try again.");
      }

      // Let the final loader step visibly complete before showing the report.
      // Otherwise these updates are batched and the loader disappears instantly.
      setLiveProgress({
        type: "progress",
        step: "verdict",
        percent: 100,
        title: "Verification complete",
        message: "Evidence report is ready",
        log: "VERDICT :: report ready",
        sourcesFound: jsonResult.sources?.length || 0,
      });
      await wait(RESULT_COMPLETION_DELAY_MS);

      setResult(jsonResult);
      setResultPreviewUrl(data.file?.previewUrl || null);
      saveToHistory(jsonResult);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      console.error("Verification error:", err);
      setApiError(
        err.message || "Something went wrong while verifying this claim. Please try again."
      );
      setCurrentTab("check");
    } finally {
      setIsLoading(false);
      setLiveProgress(null);
    }
  };

  const handleReset = () => {
    setResult(null);
    setResultPreviewUrl(null);
    setApiError(null);
    setCurrentTab("check");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSelectHistoryItem = (item: HistoryItem) => {
    setResult(item.result);
    setResultPreviewUrl(null);
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
    <div className="app-shell min-h-screen text-slate-900 dark:text-slate-100 flex flex-col justify-between selection:bg-teal-500/20 selection:text-teal-700 dark:selection:text-teal-200 font-sans transition-colors duration-200">
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
              <VerificationLoader progress={liveProgress} />
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
              <ResultView result={result} onReset={handleReset} onHome={() => handleTabChange("home")} inputPreviewUrl={resultPreviewUrl} />
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
