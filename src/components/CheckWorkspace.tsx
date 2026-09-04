import React, { useState, useRef } from "react";
import {
  FileText,
  UploadCloud,
  X,
  Search,
  ArrowLeft,
  AlertCircle,
} from "lucide-react";
import { UploadedFileItem, VerifyRequestPayload } from "../types";

interface CheckWorkspaceProps {
  onVerify: (data: VerifyRequestPayload) => void;
  isLoading: boolean;
  onBackToHome: () => void;
}

const EXAMPLE_CLAIMS = [
  "The Moon is drifting away from Earth at approximately 3.8 cm per year.",
  "NASA confirmed the discovery of liquid water lakes on current Mars surface.",
  "Drinking boiled salt water cures viral pneumonia in 24 hours.",
  "Global mean sea level has risen approximately 20 cm since 1900.",
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

  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const isSubmitDisabled =
    isLoading || (activeMode === "text" ? claimText.trim().length === 0 : uploadedFile === null);

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-8 sm:py-12">
      {/* Top Header */}
      <div className="mb-6">
        <button
          type="button"
          onClick={onBackToHome}
          id="btn-workspace-back-home"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors mb-3 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </button>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Verify a claim
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Paste text or upload an image, PDF or document.
        </p>
      </div>

      {/* Main Verification Container */}
      <div className="bg-white dark:bg-[#0b1329] border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden transition-colors">
        {/* Mode Selector Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 p-1.5 gap-1.5">
          <button
            type="button"
            onClick={() => {
              setActiveMode("text");
              setFileError(null);
            }}
            id="tab-paste-text"
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeMode === "text"
                ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-2xs font-bold"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Text</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveMode("file");
              setFileError(null);
            }}
            id="tab-upload-file"
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeMode === "file"
                ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-2xs font-bold"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload</span>
          </button>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          {/* Validation Error Banner */}
          {fileError && (
            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/80 text-rose-800 dark:text-rose-300 text-xs flex items-center justify-between gap-3 animate-in fade-in">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
                <span>{fileError}</span>
              </div>
              <button
                type="button"
                onClick={() => setFileError(null)}
                className="text-rose-500 hover:text-rose-700 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* TAB 1: TEXT */}
          {activeMode === "text" && (
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="claim-text-input"
                  className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2"
                >
                  Claim
                </label>
                <div className="relative">
                  <textarea
                    id="claim-text-input"
                    value={claimText}
                    onChange={(e) => {
                      setClaimText(e.target.value);
                      if (fileError) setFileError(null);
                    }}
                    placeholder="Paste a claim, news article excerpt, or statement…"
                    rows={5}
                    className="w-full p-4 rounded-xl bg-slate-50/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 resize-none outline-none transition-all"
                  />
                  {claimText && (
                    <button
                      type="button"
                      onClick={() => setClaimText("")}
                      className="absolute right-3 top-3 p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-200/60 dark:bg-slate-800 hover:bg-slate-300 transition-colors cursor-pointer"
                      title="Clear text"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Sample Claims */}
              <div>
                <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 block mb-2">
                  Sample claims:
                </span>
                <div className="flex flex-wrap gap-2">
                  {EXAMPLE_CLAIMS.map((ex, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setClaimText(ex);
                        if (fileError) setFileError(null);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 text-xs font-medium text-left transition-colors cursor-pointer border border-transparent hover:border-blue-200 dark:hover:border-blue-900/60"
                    >
                      {ex.length > 55 ? `${ex.slice(0, 55)}...` : ex}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitDisabled}
                  id="btn-submit-text-claim"
                  className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-xs ${
                    isSubmitDisabled
                      ? "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed border border-slate-200/50 dark:border-slate-800"
                      : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20 active:scale-[0.99] cursor-pointer"
                  }`}
                >
                  <Search className="w-4 h-4" />
                  <span>Verify</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: UPLOAD */}
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
                  className={`p-8 sm:p-10 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                    isDragging
                      ? "border-blue-500 bg-blue-50/50 dark:bg-blue-950/30"
                      : "border-slate-200 dark:border-slate-800 hover:border-blue-400 bg-slate-50/40 dark:bg-slate-900/40"
                  }`}
                >
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1">
                    Upload image, PDF, or document
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                    Drag and drop or click to browse
                  </p>
                  <span className="text-[11px] text-slate-400 dark:text-slate-500">
                    Supports Images (JPG, PNG, WebP), Screenshots, PDFs, and DOCX (up to 25MB)
                  </span>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    {uploadedFile.previewUrl ? (
                      <img
                        src={uploadedFile.previewUrl}
                        alt="Preview"
                        className="w-12 h-12 rounded-lg object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 font-bold text-xs uppercase">
                        {uploadedFile.name.split(".").pop() || "FILE"}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                        {uploadedFile.name}
                      </p>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        <span>{formatFileSize(uploadedFile.size)}</span>
                        <span>•</span>
                        <span className="uppercase">{uploadedFile.name.split(".").pop()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      Replace
                    </button>
                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                      title="Remove file"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Optional User Context */}
              <div>
                <label
                  htmlFor="file-context-input"
                  className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2"
                >
                  Add context (optional)
                </label>
                <textarea
                  id="file-context-input"
                  value={userContext}
                  onChange={(e) => setUserContext(e.target.value)}
                  placeholder="What should we verify? Add context if needed..."
                  rows={2}
                  className="w-full p-3.5 rounded-xl bg-slate-50/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 resize-none outline-none transition-all"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitDisabled}
                  id="btn-submit-file-claim"
                  className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-xs ${
                    isSubmitDisabled
                      ? "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed border border-slate-200/50 dark:border-slate-800"
                      : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20 active:scale-[0.99] cursor-pointer"
                  }`}
                >
                  <Search className="w-4 h-4" />
                  <span>Verify</span>
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
