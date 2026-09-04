import React, { useState, useRef } from "react";
import {
  FileText,
  UploadCloud,
  X,
  FileSpreadsheet,
  Search,
  ArrowRight,
  Shield,
  Zap,
  Globe,
  Bot,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
} from "lucide-react";
import { UploadedFileItem, VerifyRequestPayload } from "../types";

interface HomeScreenProps {
  onVerify: (data: VerifyRequestPayload) => void;
  isLoading: boolean;
  onNavigateTab?: (tab: "home" | "features" | "how-it-works" | "try-it" | "history" | "about") => void;
}

const EXAMPLE_CLAIMS = [
  "NASA announced a new Moon mission this week.",
  "The Moon is drifting away from Earth at approximately 3.8 cm per year.",
  "Drinking boiling ocean water cures viral pneumonia within 24 hours.",
  "Scientists confirmed the discovery of liquid water lakes under Mars ice caps.",
];

export const HomeScreen: React.FC<HomeScreenProps> = ({ onVerify, isLoading, onNavigateTab }) => {
  const [activeTab, setActiveTab] = useState<"text" | "file">("text");
  const [claimText, setClaimText] = useState("");
  const [userContext, setUserContext] = useState("");
  const [uploadedFile, setUploadedFile] = useState<UploadedFileItem | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const tryItRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);

  const scrollToTryIt = () => {
    tryItRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const processFile = async (file: File) => {
    setFileError(null);
    const validExtensions = ["jpg", "jpeg", "png", "webp", "gif", "pdf", "docx", "txt", "doc"];
    const ext = file.name.split(".").pop()?.toLowerCase() || "";

    if (!validExtensions.includes(ext)) {
      setFileError("Supported formats: Images (JPG, PNG, WebP), PDFs, DOCX, and Text documents.");
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      setFileError("File exceeds 20MB limit. Please upload a smaller file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64Content = result.split(",")[1];
      const isImg = file.type.startsWith("image/");

      setUploadedFile({
        file,
        base64: base64Content,
        name: file.name,
        size: file.size,
        type: file.type || "application/octet-stream",
        previewUrl: isImg ? result : undefined,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === "text") {
      if (!claimText.trim()) return;
      onVerify({ text: claimText.trim() });
    } else {
      if (!uploadedFile) return;
      onVerify({
        file: uploadedFile,
        userContext: userContext.trim() || undefined,
      });
    }
  };

  const hasValidInput = activeTab === "text" ? claimText.trim().length > 0 : uploadedFile !== null;

  return (
    <div className="w-full flex flex-col items-center">
      {/* 1. EXACT TEMPLATE HERO SECTION */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-8 pt-8 pb-16 lg:pt-14 lg:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Typography & CTAs */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-100/70 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 text-xs font-semibold mb-6 tracking-wide shadow-2xs">
              <span>AI-Powered Fake News Detection</span>
            </div>

            {/* Display Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.12] mb-6">
              Guard the truth in
              <br />
              an era of
              <br />
              <span className="text-blue-600 dark:text-blue-500">misinformation</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl mb-8 font-normal">
              TruthGuard uses advanced AI to detect fake news in real-time, providing you with credible information and detailed analysis.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-10 w-full sm:w-auto">
              <button
                type="button"
                onClick={scrollToTryIt}
                id="btn-hero-try-now"
                className="px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-all shadow-md shadow-blue-500/20 hover:shadow-blue-500/30 active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Try It Now</span>
              </button>

              <button
                type="button"
                onClick={scrollToFeatures}
                id="btn-hero-learn-more"
                className="px-7 py-3.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 font-semibold text-sm transition-all shadow-2xs cursor-pointer"
              >
                <span>Learn More</span>
              </button>
            </div>

            {/* 3 Bullets underneath */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-xs font-medium text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-200/60 dark:border-slate-800/60 w-full">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                  <Shield className="w-3 h-3" />
                </div>
                <span>AI-powered fact checking</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-3 h-3" />
                </div>
                <span>Real-time verification</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                  <Globe className="w-3 h-3" />
                </div>
                <span>Multi-source validation</span>
              </div>
            </div>
          </div>

          {/* Right Column: Exact 3D Floating Hero Graphic Card from Template */}
          <div className="lg:col-span-5 flex items-center justify-center">
            <div className="relative w-full max-w-[420px] aspect-square rounded-3xl bg-gradient-to-tr from-white/90 via-white/80 to-blue-50/50 dark:from-slate-900 dark:via-slate-900/90 dark:to-blue-950/40 p-8 sm:p-10 shadow-2xl shadow-blue-500/10 border border-slate-200/90 dark:border-slate-800 flex items-center justify-center backdrop-blur-md">
              {/* Background ambient glow inside card */}
              <div className="absolute inset-0 bg-radial from-blue-400/10 via-transparent to-transparent rounded-3xl pointer-events-none" />

              {/* Central Glowing Shield Contour */}
              <div className="relative z-10 flex flex-col items-center justify-center">
                <div className="w-24 h-28 sm:w-28 sm:h-32 text-blue-600 dark:text-blue-400 flex items-center justify-center drop-shadow-[0_4px_16px_rgba(37,99,235,0.25)]">
                  <svg
                    className="w-full h-full"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
              </div>

              {/* Floating Pill: Verified Content (Top Left) */}
              <div className="absolute top-6 left-6 sm:top-8 sm:left-8 z-20 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-200/80 dark:border-slate-700 shadow-md flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-100 animate-in fade-in zoom-in-95">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-xs shadow-emerald-500/50" />
                <span>Verified Content</span>
              </div>

              {/* Floating Pill: Questionable Content (Bottom Left) */}
              <div className="absolute bottom-16 left-4 sm:bottom-20 sm:left-6 z-20 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-200/80 dark:border-slate-700 shadow-md flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-100 animate-in fade-in zoom-in-95">
                <span className="w-2 h-2 rounded-full bg-amber-400 shadow-xs shadow-amber-400/50" />
                <span>Questionable Content</span>
              </div>

              {/* Floating Pill: Fake Content Detected (Bottom Right) */}
              <div className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 z-20 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-200/80 dark:border-slate-700 shadow-md flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-100 animate-in fade-in zoom-in-95">
                <span className="w-2 h-2 rounded-full bg-rose-500 shadow-xs shadow-rose-500/50" />
                <span>Fake Content Detected</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. INTERACTIVE "TRY IT" VERIFICATION STUDIO */}
      <section
        id="try-it-section"
        ref={tryItRef}
        className="w-full max-w-4xl mx-auto px-4 sm:px-8 py-10"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100/70 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Verification Sandbox</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Verify any claim in seconds
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-lg mx-auto mt-2">
            Submit a statement, viral post, screenshot, or document to inspect live verified evidence.
          </p>
        </div>

        {/* Verification Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl shadow-lg shadow-blue-500/5 overflow-hidden transition-all">
          {/* Tab Selection */}
          <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 p-2 gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("text")}
              id="tab-mode-text"
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === "text"
                  ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-2xs border border-slate-200/80 dark:border-slate-800"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Paste a claim or message</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("file")}
              id="tab-mode-file"
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === "file"
                  ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-2xs border border-slate-200/80 dark:border-slate-800"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <UploadCloud className="w-4 h-4" />
              <span>Upload image, screenshot, PDF or document</span>
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-5 sm:p-7 space-y-4">
            {/* TEXT MODE */}
            {activeTab === "text" && (
              <div>
                <textarea
                  id="claim-text-input"
                  value={claimText}
                  onChange={(e) => setClaimText(e.target.value)}
                  placeholder="Paste a claim, message, headline or post..."
                  rows={4}
                  className="w-full bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                />
              </div>
            )}

            {/* FILE MODE */}
            {activeTab === "file" && (
              <div className="space-y-4">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*,.pdf,.docx,.doc,.txt"
                  className="hidden"
                  id="file-upload-input"
                />

                {!uploadedFile ? (
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    id="dropzone-file-upload"
                    className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all ${
                      isDragging
                        ? "border-blue-500 bg-blue-50/50 dark:bg-blue-950/30"
                        : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-950/30"
                    }`}
                  >
                    <div className="w-11 h-11 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 mx-auto flex items-center justify-center mb-3">
                      <UploadCloud className="w-5 h-5" />
                    </div>
                    <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1">
                      Drop an image, screenshot, PDF or document
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      or <span className="text-blue-600 dark:text-blue-400 underline font-medium">choose a file</span>
                    </p>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-3">
                      Supports JPG, PNG, Screenshots, PDF, DOCX (Up to 20MB)
                    </p>
                  </div>
                ) : (
                  <div
                    id="uploaded-file-card"
                    className="p-4 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      {uploadedFile.previewUrl ? (
                        <img
                          src={uploadedFile.previewUrl}
                          alt="Upload preview"
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                        />
                      ) : uploadedFile.type.includes("pdf") ? (
                        <div className="w-12 h-12 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center shrink-0">
                          <FileText className="w-6 h-6" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center shrink-0">
                          <FileSpreadsheet className="w-6 h-6" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                          {uploadedFile.name}
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          {(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                      >
                        Change file
                      </button>
                      <button
                        type="button"
                        onClick={handleRemoveFile}
                        className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                        title="Remove file"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {fileError && (
                  <p className="text-xs text-rose-600 dark:text-rose-400">{fileError}</p>
                )}

                {/* Optional Context Field (FILE mode ONLY) */}
                <div className="space-y-1.5 pt-1">
                  <label
                    htmlFor="file-context-input"
                    className="block text-xs font-medium text-slate-700 dark:text-slate-300"
                  >
                    Add context <span className="text-slate-400 font-normal">(optional)</span>
                  </label>
                  <input
                    id="file-context-input"
                    type="text"
                    value={userContext}
                    onChange={(e) => setUserContext(e.target.value)}
                    placeholder="Tell us what you want us to verify..."
                    className="w-full bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                  <p className="text-[11px] text-slate-400 dark:text-slate-500">
                    Example: "Is this photo from the event mentioned in the caption?"
                  </p>
                </div>
              </div>
            )}

            {/* Check Button */}
            <button
              type="submit"
              disabled={!hasValidInput || isLoading}
              id="btn-check-claim"
              className={`w-full py-3.5 px-5 rounded-xl text-sm font-bold tracking-tight transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm ${
                hasValidInput && !isLoading
                  ? "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20 active:scale-[0.99]"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed border border-slate-200/50 dark:border-slate-800"
              }`}
            >
              <Search className="w-4 h-4" />
              <span>Check this claim</span>
            </button>
          </form>
        </div>

        {/* Quick Example Claims */}
        <div className="mt-5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
            Try an example claim:
          </p>
          <div className="flex flex-wrap gap-2">
            {EXAMPLE_CLAIMS.map((claim, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setActiveTab("text");
                  setClaimText(claim);
                }}
                className="text-left text-xs bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/80 border border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 py-1.5 px-3 rounded-xl transition-all cursor-pointer shadow-2xs"
              >
                "{claim.length > 50 ? claim.slice(0, 50) + "..." : claim}"
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 3. EXACT "FEATURES" SECTION FROM TEMPLATE */}
      <section
        id="features-section"
        ref={featuresRef}
        className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-16 border-t border-slate-200/70 dark:border-slate-800/70"
      >
        <div className="text-center max-w-2xl mx-auto mb-14">
          {/* Small pill badge */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-100/70 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 text-xs font-semibold mb-3">
            <span>Features</span>
          </div>

          {/* Heading */}
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
            Cutting-edge technology to combat misinformation
          </h2>

          {/* Subtitle */}
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            TruthGuard combines advanced AI models, real-time verification, and user-friendly interfaces to help you separate fact from fiction.
          </p>
        </div>

        {/* 4 Feature Cards Grid (Exact matching cards from 5th.jpg) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: AI-Powered Detection */}
          <div className="p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-6">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                AI-Powered Detection
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Advanced AI models analyze news content and detect misinformation with high accuracy.
              </p>
            </div>
          </div>

          {/* Card 2: 5-Second Verification */}
          <div className="p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-6">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                5-Second Verification
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Get instant results in under 5 seconds, allowing you to quickly separate fact from fiction.
              </p>
            </div>
          </div>

          {/* Card 3: Multi-Source Validation */}
          <div className="p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-6">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                Multi-Source Validation
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Cross-references information with trusted fact-checking sources and databases worldwide.
              </p>
            </div>
          </div>

          {/* Card 4: Autonomous AI Agents */}
          <div className="p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-6">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                Autonomous AI Agents
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Deep research agents autonomously research, verify facts, and generate credible reports.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS PROCESS SECTION */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-16 border-t border-slate-200/70 dark:border-slate-800/70">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-100/70 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 text-xs font-semibold mb-3">
            <span>How It Works</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
            Simple 4-step verification process
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            From raw input to verifiable truth with complete transparent citations.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Step 1 */}
          <div className="p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm relative">
            <span className="inline-block px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold text-xs mb-4">
              Step 01
            </span>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              Add your content
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Upload an image, PDF or document, or paste a claim directly into the verification box.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm relative">
            <span className="inline-block px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold text-xs mb-4">
              Step 02
            </span>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              Extract assertions
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              TruthGuard identifies key factual claims, entities, dates, and forensic visual cues.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm relative">
            <span className="inline-block px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold text-xs mb-4">
              Step 03
            </span>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              Query live evidence
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Cross-references claims with trusted registries, databases, and newsrooms.
            </p>
          </div>

          {/* Step 4 */}
          <div className="p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm relative">
            <span className="inline-block px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold text-xs mb-4">
              Step 04
            </span>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              Examine the report
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Receive a clear verdict, calibrated confidence meter, and direct source links.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
