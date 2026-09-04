import React, { useState, useRef } from "react";
import {
  FileText,
  UploadCloud,
  X,
  Search,
  ArrowLeft,
  AlertCircle,
  Sparkles,
  Clipboard,
  Check,
  ChevronDown,
  ChevronUp,
  FileSpreadsheet,
  Image as ImageIcon,
  FileCheck,
  Command,
  CornerDownLeft,
} from "lucide-react";
import { UploadedFileItem, VerifyRequestPayload } from "../types";
import { motion, AnimatePresence } from "motion/react";

interface CheckWorkspaceProps {
  onVerify: (data: VerifyRequestPayload) => void;
  isLoading: boolean;
  onBackToHome: () => void;
}

interface SampleClaim {
  category: string;
  badgeBg: string;
  badgeText: string;
  icon: string;
  claim: string;
}

const SAMPLE_CLAIMS: SampleClaim[] = [
  {
    category: "Space",
    badgeBg: "bg-indigo-500/10 dark:bg-indigo-500/20 border-indigo-500/30",
    badgeText: "text-indigo-600 dark:text-indigo-400",
    icon: "🪐",
    claim: "The Moon is drifting away from Earth at approximately 3.8 cm per year.",
  },
  {
    category: "Science",
    badgeBg: "bg-cyan-500/10 dark:bg-cyan-500/20 border-cyan-500/30",
    badgeText: "text-cyan-600 dark:text-cyan-400",
    icon: "🔬",
    claim: "NASA confirmed the discovery of liquid water lakes on current Mars surface.",
  },
  {
    category: "Health",
    badgeBg: "bg-rose-500/10 dark:bg-rose-500/20 border-rose-500/30",
    badgeText: "text-rose-600 dark:text-rose-400",
    icon: "⚕️",
    claim: "Drinking boiled salt water cures viral pneumonia in 24 hours.",
  },
  {
    category: "Climate",
    badgeBg: "bg-emerald-500/10 dark:bg-emerald-500/20 border-emerald-500/30",
    badgeText: "text-emerald-600 dark:text-emerald-400",
    icon: "🌊",
    claim: "Global mean sea level has risen approximately 20 cm since 1900.",
  },
];

export const CheckWorkspace: React.FC<CheckWorkspaceProps> = ({
  onVerify,
  isLoading,
  onBackToHome,
}) => {
  const [activeMode, setActiveMode] = useState<"text" | "file">("text");
  const [claimText, setClaimText] = useState("");
  const [userContext, setUserContext] = useState("");
  const [uploadedFile, setUploadedFile] = useState<UploadedFileItem | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isPasted, setIsPasted] = useState(false);
  const [showContextAccordion, setShowContextAccordion] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [highlightClaimPulse, setHighlightClaimPulse] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const wordCount = claimText.trim() ? claimText.trim().split(/\s+/).length : 0;
  const charCount = claimText.length;

  const processFile = async (file: File) => {
    setFileError(null);
    const validExtensions = ["jpg", "jpeg", "png", "webp", "gif", "pdf", "docx", "txt", "doc"];
    const ext = file.name.split(".").pop()?.toLowerCase() || "";

    if (!validExtensions.includes(ext)) {
      setFileError("Unsupported file format. Please upload an Image (JPG, PNG, WebP), PDF, DOCX, or TXT file.");
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      setFileError("File exceeds 25MB limit. Please upload a smaller file.");
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
    reader.onerror = () => {
      setFileError("Failed to read the file. Please try again.");
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
    setFileError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handlePasteClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setClaimText(text);
        setIsPasted(true);
        setFileError(null);
        setTimeout(() => setIsPasted(false), 1800);
      }
    } catch {
      // Clipboard access denied or unsupported, focus textarea
      textareaRef.current?.focus();
    }
  };

  const handleSelectSample = (claim: string) => {
    setClaimText(claim);
    setFileError(null);
    setHighlightClaimPulse(true);
    setTimeout(() => setHighlightClaimPulse(false), 500);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isLoading) return;

    if (activeMode === "text") {
      const trimmed = claimText.trim();
      if (!trimmed) {
        setFileError("Please enter a claim to verify.");
        return;
      }
      if (trimmed.length < 5) {
        setFileError("Please enter a complete statement to allow evidence searching.");
        return;
      }
      setFileError(null);
      onVerify({ text: trimmed });
    } else {
      if (!uploadedFile) {
        setFileError("Please select a file to upload.");
        return;
      }
      setFileError(null);
      onVerify({
        file: uploadedFile,
        userContext: userContext.trim() || undefined,
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Cmd + Enter or Ctrl + Enter triggers verification
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const isSubmitDisabled =
    isLoading || (activeMode === "text" ? claimText.trim().length === 0 : uploadedFile === null);

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-8 sm:py-12 relative">
      {/* Subtle Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 dark:bg-blue-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Top Header Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <button
            type="button"
            onClick={onBackToHome}
            id="btn-workspace-back-home"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors mb-2 cursor-pointer group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Overview</span>
          </button>

          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Verify a Claim
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Studio
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Input statements, screenshots, documents, or research claims for factual cross-examination.
          </p>
        </div>
      </div>

      {/* Main Verification Card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative bg-white/90 dark:bg-[#0c1427]/90 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800/90 rounded-3xl shadow-xl shadow-slate-900/5 dark:shadow-black/40 overflow-hidden transition-colors"
      >
        {/* Mode Selector Tabs with Motion Sliding Pill */}
        <div className="p-2 border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-900/50">
          <div className="relative flex p-1 bg-slate-200/50 dark:bg-slate-800/60 rounded-2xl">
            {/* Text Tab */}
            <button
              type="button"
              onClick={() => {
                setActiveMode("text");
                setFileError(null);
              }}
              id="tab-paste-text"
              className={`relative z-10 flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                activeMode === "text"
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Text Statement</span>
              {activeMode === "text" && (
                <motion.div
                  layoutId="activeWorkspaceTabPill"
                  className="absolute inset-0 bg-white dark:bg-[#0f1a33] rounded-xl shadow-sm border border-slate-200/60 dark:border-slate-700/60 -z-10"
                  transition={{ type: "spring", stiffness: 450, damping: 35 }}
                />
              )}
            </button>

            {/* File Tab */}
            <button
              type="button"
              onClick={() => {
                setActiveMode("file");
                setFileError(null);
              }}
              id="tab-upload-file"
              className={`relative z-10 flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                activeMode === "file"
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <UploadCloud className="w-4 h-4" />
              <span>Image / Document</span>
              {uploadedFile && (
                <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
              )}
              {activeMode === "file" && (
                <motion.div
                  layoutId="activeWorkspaceTabPill"
                  className="absolute inset-0 bg-white dark:bg-[#0f1a33] rounded-xl shadow-sm border border-slate-200/60 dark:border-slate-700/60 -z-10"
                  transition={{ type: "spring", stiffness: 450, damping: 35 }}
                />
              )}
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          {/* Validation Error Alert Banner */}
          <AnimatePresence>
            {fileError && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.98 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  x: [-6, 6, -3, 3, 0],
                }}
                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                transition={{ duration: 0.3 }}
                className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-300 text-xs flex items-center justify-between gap-3 shadow-sm"
              >
                <div className="flex items-center gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                  <span className="font-semibold">{fileError}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setFileError(null)}
                  className="p-1 rounded-lg text-rose-500 hover:bg-rose-500/20 transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* MODE 1: TEXT CLAIM */}
          {activeMode === "text" && (
            <div className="space-y-4">
              {/* Textarea Wrapper with Interactive Glowing Focus */}
              <div
                className={`relative rounded-2xl transition-all duration-200 ${
                  isInputFocused
                    ? "ring-4 ring-blue-500/15 border-blue-500 dark:border-blue-400"
                    : "border-slate-200 dark:border-slate-800"
                } ${
                  highlightClaimPulse
                    ? "ring-4 ring-emerald-500/20 border-emerald-500"
                    : ""
                } border bg-slate-50/50 dark:bg-slate-900/40 p-4 sm:p-5`}
              >
                {/* Textarea Top Actions */}
                <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-200/60 dark:border-slate-800/60">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Statement to Verify
                    </span>
                    {charCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                        {wordCount} words
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handlePasteClipboard}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                      title="Paste from clipboard"
                    >
                      {isPasted ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-500" />
                          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                            Pasted!
                          </span>
                        </>
                      ) : (
                        <>
                          <Clipboard className="w-3 h-3" />
                          <span>Paste</span>
                        </>
                      )}
                    </button>

                    {claimText && (
                      <button
                        type="button"
                        onClick={() => {
                          setClaimText("");
                          textareaRef.current?.focus();
                        }}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-medium text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                        title="Clear statement"
                      >
                        <X className="w-3 h-3" />
                        <span>Clear</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Input Textarea */}
                <textarea
                  ref={textareaRef}
                  id="claim-text-input"
                  value={claimText}
                  onChange={(e) => {
                    setClaimText(e.target.value);
                    if (fileError) setFileError(null);
                  }}
                  onKeyDown={handleKeyDown}
                  onFocus={() => setIsInputFocused(true)}
                  onBlur={() => setIsInputFocused(false)}
                  placeholder="Paste a headline, claim, viral rumor, or quote to investigate with real-time public evidence…"
                  rows={5}
                  className="w-full bg-transparent text-sm sm:text-base text-slate-900 dark:text-slate-100 placeholder:text-slate-400/80 resize-none outline-none leading-relaxed transition-all"
                />

                {/* Textarea Bottom Status & Shortcut Hint */}
                <div className="flex items-center justify-between pt-3 mt-2 border-t border-slate-200/60 dark:border-slate-800/60 text-[11px] text-slate-400 dark:text-slate-500">
                  <div className="flex items-center gap-2">
                    <span className="hidden sm:inline">Press</span>
                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-slate-200/80 dark:bg-slate-800 font-mono text-[10px] text-slate-700 dark:text-slate-300 font-semibold">
                      <Command className="w-2.5 h-2.5 inline sm:hidden" />
                      <span className="hidden sm:inline">Ctrl / ⌘</span>
                      <span>+</span>
                      <CornerDownLeft className="w-2.5 h-2.5" />
                    </span>
                    <span>to verify instantly</span>
                  </div>

                  <span>{charCount} characters</span>
                </div>
              </div>

              {/* Sample Claims Category Pills */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                    <span>Try an example claim:</span>
                  </span>
                  <span className="text-[11px] text-slate-400 dark:text-slate-500">Click to fill</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {SAMPLE_CLAIMS.map((sample, idx) => (
                    <motion.button
                      key={idx}
                      type="button"
                      whileHover={{ scale: 1.01, y: -1 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSelectSample(sample.claim)}
                      className="p-3 rounded-2xl bg-white dark:bg-slate-900/80 hover:bg-blue-50/50 dark:hover:bg-blue-950/30 border border-slate-200/80 dark:border-slate-800/80 hover:border-blue-300 dark:hover:border-blue-700/60 text-left transition-all cursor-pointer group shadow-2xs flex flex-col justify-between gap-1.5"
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs">{sample.icon}</span>
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md border ${sample.badgeBg} ${sample.badgeText}`}
                        >
                          {sample.category}
                        </span>
                      </div>
                      <p className="text-xs font-medium text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-2 leading-snug">
                        {sample.claim}
                      </p>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Submit Button with Shimmer & Pro Physics */}
              <div className="pt-3">
                <motion.button
                  type="submit"
                  disabled={isSubmitDisabled}
                  id="btn-submit-text-claim"
                  whileHover={!isSubmitDisabled ? { scale: 1.01 } : {}}
                  whileTap={!isSubmitDisabled ? { scale: 0.98 } : {}}
                  className={`relative overflow-hidden w-full py-4 px-6 rounded-2xl font-bold text-sm sm:text-base transition-all flex items-center justify-center gap-2.5 shadow-md ${
                    isSubmitDisabled
                      ? "bg-slate-100 dark:bg-slate-800/80 text-slate-400 dark:text-slate-600 cursor-not-allowed border border-slate-200/60 dark:border-slate-800"
                      : "bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-blue-500/25 cursor-pointer"
                  }`}
                >
                  <Search className="w-4 h-4" />
                  <span>Verify with Evidence</span>
                </motion.button>
              </div>
            </div>
          )}

          {/* MODE 2: FILE UPLOAD */}
          {activeMode === "file" && (
            <div className="space-y-5">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,application/pdf,.docx,.txt"
                onChange={handleFileChange}
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
                  className={`p-8 sm:p-12 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                    isDragging
                      ? "border-blue-500 bg-blue-50/60 dark:bg-blue-950/40 scale-[1.01]"
                      : "border-slate-300/80 dark:border-slate-700/80 hover:border-blue-400 dark:hover:border-blue-500 bg-slate-50/50 dark:bg-slate-900/30"
                  }`}
                >
                  <motion.div
                    animate={isDragging ? { scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] } : {}}
                    transition={{ repeat: Infinity, duration: 1.2 }}
                    className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4 shadow-sm border border-blue-200/50 dark:border-blue-800/50"
                  >
                    <UploadCloud className="w-7 h-7" />
                  </motion.div>

                  <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 mb-1.5">
                    {isDragging ? "Drop your file here" : "Upload image, screenshot, PDF or document"}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-4 max-w-sm">
                    Drag and drop file here, or click to browse from your device
                  </p>

                  {/* Format Pills */}
                  <div className="flex flex-wrap items-center justify-center gap-2 pt-2 border-t border-slate-200/60 dark:border-slate-800/60 w-full max-w-md">
                    <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-200/60 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 text-[11px] font-semibold">
                      <ImageIcon className="w-3 h-3 text-blue-500" />
                      <span>JPG, PNG, WebP</span>
                    </div>
                    <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-200/60 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 text-[11px] font-semibold">
                      <FileCheck className="w-3 h-3 text-red-500" />
                      <span>PDF Reports</span>
                    </div>
                    <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-200/60 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 text-[11px] font-semibold">
                      <FileSpreadsheet className="w-3 h-3 text-indigo-500" />
                      <span>DOCX & TXT</span>
                    </div>
                    <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                      (Max 25MB)
                    </span>
                  </div>
                </div>
              ) : (
                /* Uploaded File Card */
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 shadow-sm"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    {uploadedFile.previewUrl ? (
                      <img
                        src={uploadedFile.previewUrl}
                        alt="Preview"
                        className="w-14 h-14 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0 shadow-2xs"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex flex-col items-center justify-center shrink-0 font-extrabold text-xs uppercase border border-blue-200/60 dark:border-blue-800/60">
                        <FileText className="w-5 h-5 mb-0.5" />
                        <span>{uploadedFile.name.split(".").pop() || "FILE"}</span>
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                          {uploadedFile.name}
                        </p>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 shrink-0">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          Ready
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                        <span>{formatFileSize(uploadedFile.size)}</span>
                        <span>•</span>
                        <span className="uppercase font-semibold">
                          {uploadedFile.name.split(".").pop()} file
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer border border-slate-200/80 dark:border-slate-700/80"
                    >
                      Replace
                    </button>
                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                      title="Remove file"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Collapsible Context Section */}
              <div className="border border-slate-200/80 dark:border-slate-800/80 rounded-2xl bg-slate-50/40 dark:bg-slate-900/30 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setShowContextAccordion(!showContextAccordion)}
                  className="w-full px-4 py-3 flex items-center justify-between text-left text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100/50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <span>Add specific question or context</span>
                    <span className="text-[10px] font-normal text-slate-400">(optional)</span>
                  </div>
                  {showContextAccordion ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </button>

                <AnimatePresence>
                  {showContextAccordion && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="px-4 pb-4 overflow-hidden"
                    >
                      <textarea
                        id="file-context-input"
                        value={userContext}
                        onChange={(e) => setUserContext(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="E.g., Is this document genuinely from the Ministry of Finance? Check if this screenshot was altered..."
                        rows={3}
                        className="w-full p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 resize-none outline-none transition-all"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Submit File Button */}
              <div className="pt-2">
                <motion.button
                  type="submit"
                  disabled={isSubmitDisabled}
                  id="btn-submit-file-claim"
                  whileHover={!isSubmitDisabled ? { scale: 1.01 } : {}}
                  whileTap={!isSubmitDisabled ? { scale: 0.98 } : {}}
                  className={`w-full py-4 px-6 rounded-2xl font-bold text-sm sm:text-base transition-all flex items-center justify-center gap-2.5 shadow-md ${
                    isSubmitDisabled
                      ? "bg-slate-100 dark:bg-slate-800/80 text-slate-400 dark:text-slate-600 cursor-not-allowed border border-slate-200/60 dark:border-slate-800"
                      : "bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-blue-500/25 cursor-pointer"
                  }`}
                >
                  <Search className="w-4 h-4" />
                  <span>Analyze & Verify Document</span>
                </motion.button>
              </div>
            </div>
          )}
        </form>
      </motion.div>
    </div>
  );
};
