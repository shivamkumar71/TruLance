import React, { useEffect, useRef, useState } from "react";
import {
  Shield,
  Search,
  Layers,
  CheckCircle2,
  FileText,
  Clock,
  ArrowRight,
  Sparkles,
  Database,
  Eye,
  FileCheck,
  ShieldAlert,
  Image as ImageIcon,
  FileSpreadsheet,
} from "lucide-react";

interface HomeViewProps {
  onNavigateToCheck: () => void;
  onNavigateToHowItWorks: () => void;
  onNavigateToFeatures?: () => void;
}

interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
}

const SpotlightCard: React.FC<SpotlightCardProps> = ({ children, className = "" }) => {
  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--spotlight-x", `${event.clientX - rect.left}px`);
    event.currentTarget.style.setProperty("--spotlight-y", `${event.clientY - rect.top}px`);
  };

  return (
    <div onPointerMove={handlePointerMove} className={`spotlight-card ${className}`}>
      <div className="spotlight-card-glow" aria-hidden="true" />
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigateToCheck,
  onNavigateToHowItWorks,
}) => {
  const [heroPointer, setHeroPointer] = useState({ x: 50, y: 20 });
  const [activeWorkflowStep, setActiveWorkflowStep] = useState(0);
  const workflowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const workflow = workflowRef.current;
    if (!workflow) return;

    const steps = Array.from(workflow.querySelectorAll<HTMLElement>("[data-workflow-step]"));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveWorkflowStep(Number(entry.target.getAttribute("data-workflow-step")));
          }
        });
      },
      { threshold: 0.55, rootMargin: "0px 0px -12% 0px" }
    );

    steps.forEach((step: HTMLElement) => observer.observe(step));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="w-full flex flex-col items-center">
      {/* 1. HERO SECTION */}
      <section
        className="hero-surface relative isolate w-full overflow-hidden"
        onPointerMove={(event) => {
          const rect = event.currentTarget.getBoundingClientRect();
          setHeroPointer({
            x: ((event.clientX - rect.left) / rect.width) * 100,
            y: ((event.clientY - rect.top) / rect.height) * 100,
          });
        }}
        style={{ "--hero-pointer-x": `${heroPointer.x}%`, "--hero-pointer-y": `${heroPointer.y}%` } as React.CSSProperties}
      >
        <div className="hero-orbit hero-orbit-one" aria-hidden="true" />
        <div className="hero-orbit hero-orbit-two" aria-hidden="true" />
        <div className="relative z-10 mx-auto grid min-h-[610px] w-full max-w-7xl items-center gap-12 px-4 py-20 sm:px-8 lg:grid-cols-12 lg:gap-10 lg:py-24">
          <div className="max-w-4xl text-left lg:col-span-7">
            <div className="hero-reveal mb-7 inline-flex items-center gap-2 rounded-full border border-teal-400/25 bg-teal-400/10 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-teal-300">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-300 shadow-[0_0_12px_rgba(94,234,212,0.9)]" />
              Evidence-first verification
            </div>
            <h1 className="hero-reveal hero-delay-one max-w-4xl text-5xl font-bold leading-[0.98] tracking-[-0.04em] text-slate-50 sm:text-7xl lg:text-[88px]">
              Know what’s true.
              <br />
              <span className="hero-gradient-text">Before you share it.</span>
            </h1>
            <p className="hero-reveal hero-delay-two mt-8 max-w-2xl text-base leading-8 text-slate-300 sm:text-xl">
              AI-powered verification for claims, news, images and documents, backed by evidence instead of guesswork.
            </p>
            <div className="hero-reveal hero-delay-three mt-9 flex flex-wrap gap-3">
              {[
                { icon: FileText, label: "Text" },
                { icon: ImageIcon, label: "Images" },
                { icon: FileCheck, label: "Documents" },
                { icon: Shield, label: "Source-backed" },
              ].map(({ icon: Icon, label }) => (
                <span key={label} className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-3.5 py-2.5 text-sm text-slate-200 backdrop-blur-sm">
                  <Icon className="h-4 w-4 text-teal-300" />
                  {label}
                </span>
              ))}
            </div>
            <div className="hero-reveal hero-delay-four mt-12 flex flex-wrap items-center gap-5">
              <button type="button" onClick={onNavigateToCheck} id="btn-hero-check-claim" className="hero-cta inline-flex items-center gap-2 rounded-xl bg-teal-400 px-7 py-3.5 text-sm font-bold text-slate-950 shadow-[0_10px_30px_rgba(45,212,191,0.22)] transition hover:-translate-y-0.5 hover:bg-teal-300">
                Try the live demo <ArrowRight className="h-4 w-4" />
              </button>
              <button type="button" onClick={onNavigateToHowItWorks} id="btn-hero-how-it-works" className="group inline-flex items-center gap-2 text-sm font-semibold text-slate-300 transition hover:text-teal-300">
                See how it works <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1.5" />
              </button>
            </div>
          </div>

          <div className="hero-reveal hero-delay-two relative lg:col-span-5" aria-label="A researcher reviewing evidence on a laptop">
            <div className="hero-image-glow" aria-hidden="true" />
            <div className="hero-image-frame">
              <img
                src="https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1100&q=85"
                alt="Research team reviewing information on a laptop"
                className="hero-image"
                loading="eager"
              />
              <div className="hero-image-wash" aria-hidden="true" />
              <div className="hero-scan-line" aria-hidden="true" />
              <div className="hero-scan-status" aria-hidden="true"><span /> Scanning visual context</div>
              <div className="hero-image-label hero-image-label-top">
                <span className="hero-image-dot" />
                Evidence in context
              </div>
              <div className="hero-image-caption">
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-teal-200">TruthLens method</span>
                <span className="mt-1 block text-sm font-semibold text-white">Read the evidence. Then decide.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TRUST & VALUE STRIP */}
      <section className="w-full border-y border-slate-200/80 dark:border-slate-800/80 bg-white/60 dark:bg-[#090f20]/60 backdrop-blur-sm py-8 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <p className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Core Principles
            </p>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
              Evidence determines the answer. We never invent sources.
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 w-full md:w-auto">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="text-left">
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">Claim Extraction</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Identify exact facts</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <Database className="w-4 h-4" />
              </div>
              <div className="text-left">
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">Evidence Research</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Direct public records</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <Layers className="w-4 h-4" />
              </div>
              <div className="text-left">
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">Source Agreement</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Cross-checking facts</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <Eye className="w-4 h-4" />
              </div>
              <div className="text-left">
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">Calibrated Verdicts</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Zero hallucinations</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS (4 SIMPLE STEPS) */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-20">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold mb-3">
            <span>Evidence-Driven Workflow</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            How It Works
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-3 leading-relaxed">
            Every submission is checked against actual public records and verified articles.
          </p>
        </div>

        <div ref={workflowRef} className="workflow-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Step 1 */}
          <div data-workflow-step="0" className={`workflow-step p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 shadow-2xs ${activeWorkflowStep >= 0 ? "workflow-step-active" : ""}`}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-extrabold text-blue-600 dark:text-blue-400 font-mono tracking-wider">
                01
              </span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-2">
              Submit
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Paste text or upload content.
            </p>
          </div>

          {/* Step 2 */}
          <div data-workflow-step="1" className={`workflow-step p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 shadow-2xs ${activeWorkflowStep >= 1 ? "workflow-step-active" : ""}`}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-extrabold text-blue-600 dark:text-blue-400 font-mono tracking-wider">
                02
              </span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Search className="w-4 h-4" />
              </div>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-2">
              Research
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              TruthLens searches relevant sources.
            </p>
          </div>

          {/* Step 3 */}
          <div data-workflow-step="2" className={`workflow-step p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 shadow-2xs ${activeWorkflowStep >= 2 ? "workflow-step-active" : ""}`}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-extrabold text-blue-600 dark:text-blue-400 font-mono tracking-wider">
                03
              </span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Layers className="w-4 h-4" />
              </div>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-2">
              Compare
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Evidence is checked for agreement and contradiction.
            </p>
          </div>

          {/* Step 4 */}
          <div data-workflow-step="3" className={`workflow-step p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 shadow-2xs ${activeWorkflowStep >= 3 ? "workflow-step-active" : ""}`}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-extrabold text-blue-600 dark:text-blue-400 font-mono tracking-wider">
                04
              </span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Shield className="w-4 h-4" />
              </div>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-2">
              Verify
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Get a clear result with sources.
            </p>
          </div>
        </div>
      </section>

      {/* 4. WHY TRUTHLENS */}
      <section className="w-full border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-[#080e1c]/50 py-20 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-xs font-semibold mb-3">
              <span>Why TruthLens</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Evidence-first, not chatbot answers
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-3 leading-relaxed">
              TruthLens optimizes for accuracy, source quality, recency, and transparent reasoning.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <SpotlightCard className="p-6 rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-2">
                Claim Extraction
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Extract the core factual propositions from text, images, or documents before searching for external corroboration.
              </p>
            </SpotlightCard>

            <SpotlightCard className="p-6 rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-2">
                Multi-Source Agreement
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Cross-check assertions against multiple independent sources, distinguishing original reporting from syndicated copies.
              </p>
            </SpotlightCard>

            <SpotlightCard className="p-6 rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
                <FileCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-2">
                Image & Document Verification
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Verify screenshots, photographs, PDFs, and Word documents while separating media authenticity from claim truth.
              </p>
            </SpotlightCard>

            <SpotlightCard className="p-6 rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
                <Eye className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-2">
                Exact Source Pages
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Every citation points to the specific relevant article or document, validated in real-time to avoid dead 404 links.
              </p>
            </SpotlightCard>

            <SpotlightCard className="p-6 rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-2">
                Calibrated Confidence
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Confidence reflects actual evidence depth and source consensus, distinguishing solid facts from emerging or unverified claims.
              </p>
            </SpotlightCard>

            <SpotlightCard className="p-6 rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-2">
                Recency Awareness
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Time-sensitive breaking claims prioritize fresh reports, while historical claims are corroborated with authoritative records.
              </p>
            </SpotlightCard>
          </div>
        </div>
      </section>

    </div>
  );
};
