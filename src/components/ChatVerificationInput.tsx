import React, { useState, useRef, useEffect } from "react";
import {
  Plus,
  ArrowUp,
  Image as ImageIcon,
  FileText,
  X,
  Sparkles,
  AlertCircle,
  FileCheck,
  Check,
  Clipboard,
} from "lucide-react";
import { UploadedFileItem, VerifyRequestPayload } from "../types";
import { motion, AnimatePresence } from "motion/react";

interface ChatVerificationInputProps {
  onVerify: (data: VerifyRequestPayload) => void;
  isLoading: boolean;
  initialText?: string;
  placeholder?: string;
  onClearInitialText?: () => void;
  className?: string;
  autoFocus?: boolean;
}

export const ChatVerificationInput: React.FC<ChatVerificationInputProps> = ({
  onVerify,
  isLoading,
  initialText = "",
  placeholder = "Ask TruthLens to verify any claim, news headline, rumor, or drop an image...",
  onClearInitialText,
  className = "",
  autoFocus = false,
}) => {
  const [text, setText] = useState(initialText);
  const [uploadedFile, setUploadedFile] = useState<UploadedFileItem | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isPasted, setIsPasted] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [showUploadMenu, setShowUploadMenu] = useState(false);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);
  const uploadMenuRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Close upload popover when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (uploadMenuRef.current && !uploadMenuRef.current.contains(e.target as Node)) {
        setShowUploadMenu(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowUploadMenu(false);
    };

    if (showUploadMenu) {
      document.addEventListener("mousedown", handleClickOutside);
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [showUploadMenu]);

  // Sync external initialText when changed (e.g. clicking viral claim card)
  useEffect(() => {
    if (initialText) {
      setText(initialText);
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.style.height = "auto";
        textareaRef.current.style.height = `${Math.min(
          Math.max(textareaRef.current.scrollHeight, 44),
          180
        )}px`;
      }
    }
  }, [initialText]);

  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [autoFocus]);

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    const nextHeight = Math.min(Math.max(textarea.scrollHeight, 44), 180);
    textarea.style.height = `${nextHeight}px`;
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    if (fileError) setFileError(null);
    adjustTextareaHeight();
  };

  const processFile = (file: File) => {
    setFileError(null);
    const validExtensions = ["jpg", "jpeg", "png", "webp", "gif", "pdf", "docx", "txt", "doc"];
    const ext = file.name.split(".").pop()?.toLowerCase() || "";

    if (!validExtensions.includes(ext)) {
      setFileError("Supported formats: Images (JPG, PNG, WebP, GIF), PDFs, DOCX, and Text documents.");
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      setFileError("File is over 25MB maximum limit.");
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
      setFileError("Failed to read file.");
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setFileError(null);
    if (imageInputRef.current) imageInputRef.current.value = "";
    if (docInputRef.current) docInputRef.current.value = "";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handlePasteClipboard = async () => {
    try {
      const clipText = await navigator.clipboard.readText();
      if (clipText) {
        setText(clipText);
        setIsPasted(true);
        setFileError(null);
        setTimeout(() => setIsPasted(false), 1800);
        setTimeout(adjustTextareaHeight, 10);
      }
    } catch {
      textareaRef.current?.focus();
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isLoading) return;

    const trimmed = text.trim();
    if (!trimmed && !uploadedFile) {
      setFileError("Please enter a claim or attach an image to verify.");
      return;
    }

    if (trimmed && trimmed.length < 5 && !uploadedFile) {
      setFileError("Please enter a complete statement (at least 5 characters).");
      return;
    }

    setFileError(null);

    if (uploadedFile && trimmed) {
      onVerify({
        text: trimmed,
        file: uploadedFile,
        userContext: trimmed,
      });
    } else if (uploadedFile) {
      onVerify({
        file: uploadedFile,
        text: uploadedFile.name,
      });
    } else {
      onVerify({
        text: trimmed,
      });
    }

    onClearInitialText?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Enter without Shift triggers verification
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const hasContent = text.trim().length > 0 || uploadedFile !== null;

  return (
    <div className={`w-full ${className}`}>
      {/* Hidden file input for images */}
      <input
        ref={imageInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        onChange={handleFileChange}
        className="hidden"
        id="chat-image-upload-input"
      />

      {/* Hidden file input for documents */}
      <input
        ref={docInputRef}
        type="file"
        accept="application/pdf,.docx,.doc,.txt"
        onChange={handleFileChange}
        className="hidden"
        id="chat-doc-upload-input"
      />

      {/* Error notification banner */}
      <AnimatePresence>
        {fileError && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="mb-3 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/25 text-rose-700 dark:text-rose-300 text-xs flex items-center justify-between gap-3 shadow-sm backdrop-blur-md"
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

      {/* Google AI Studio Outer Container with Rotating Colorful Boundary Line */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`ai-studio-border-container transition-all duration-300 ${
          isDragging
            ? "ring-4 ring-teal-400/50 scale-[1.01]"
            : isFocused
            ? "shadow-2xl shadow-teal-500/10"
            : ""
        }`}
      >
        {/* Colorful Glowing Ambient Layer (Blurred) & Sharp Rainbow Beam strictly masked to border */}
        <div className="ai-studio-border-mask" aria-hidden="true">
          <div className="ai-studio-border-glow" />
          <div className="ai-studio-border-beam" />
        </div>

        {/* Inner Chat Box Canvas */}
        <div className="ai-studio-inner-box p-3.5 sm:p-5 flex flex-col gap-3">
          {/* File Attachment Chip / Preview */}
          <AnimatePresence>
            {uploadedFile && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                className="flex items-center justify-between p-2.5 sm:p-3 rounded-2xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 shadow-2xs backdrop-blur-md"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {uploadedFile.previewUrl ? (
                    <div className="relative group shrink-0">
                      <img
                        src={uploadedFile.previewUrl}
                        alt="Upload preview"
                        className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-600 shadow-sm"
                      />
                      <span className="absolute -bottom-1 -right-1 px-1 py-0.2 bg-teal-500 text-slate-950 font-black text-[9px] rounded-md uppercase">
                        IMG
                      </span>
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-teal-500/15 border border-teal-500/30 text-teal-600 dark:text-teal-400 flex flex-col items-center justify-center shrink-0 font-bold text-[10px] uppercase">
                      <FileCheck className="w-5 h-5 mb-0.5" />
                      <span>{uploadedFile.name.split(".").pop() || "DOC"}</span>
                    </div>
                  )}

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                        {uploadedFile.name}
                      </p>
                      <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 shrink-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Attached
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {formatFileSize(uploadedFile.size)} • Ready for verification
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer shrink-0"
                  title="Remove attachment"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Text Area (Auto-growing like ChatGPT) */}
          <div className="relative w-full">
            <textarea
              ref={textareaRef}
              value={text}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={placeholder}
              rows={2}
              className="w-full bg-transparent text-sm sm:text-base text-slate-900 dark:text-slate-100 placeholder:text-slate-400/80 resize-none outline-none leading-relaxed transition-all min-h-[44px] max-h-[180px] py-1"
            />
          </div>

          {/* Bottom Action Bar: + Icon, Helper info & Enter / Send Button */}
          <div className="flex items-center justify-between pt-1 sm:pt-2 border-t border-slate-200/60 dark:border-slate-800/60 gap-3">
            {/* Left Tools: Plus Icon Button with Popover Menu for Upload & Paste */}
            <div className="flex items-center gap-2">
              <div className="relative" ref={uploadMenuRef}>
                <button
                  type="button"
                  onClick={() => setShowUploadMenu((prev) => !prev)}
                  id="btn-chat-upload-plus"
                  aria-expanded={showUploadMenu}
                  className={`flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full transition-all duration-200 cursor-pointer border shadow-2xs hover:scale-105 active:scale-95 ${
                    showUploadMenu
                      ? "bg-teal-500 text-slate-950 border-teal-400 rotate-45 shadow-teal-500/30"
                      : "bg-slate-100 hover:bg-slate-200/90 dark:bg-slate-800/90 dark:hover:bg-slate-700/90 text-slate-700 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-300 border-slate-200/80 dark:border-slate-700/80"
                  }`}
                  title="Attach evidence (Image or Document)"
                  aria-label="Upload options"
                >
                  <Plus className="w-5 h-5 transition-transform duration-200" />
                </button>

                {/* Upload Options Popover Menu */}
                <AnimatePresence>
                  {showUploadMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.16, ease: "easeOut" }}
                      className="absolute bottom-full mb-3 left-0 z-50 min-w-[250px] sm:min-w-[270px] p-2 rounded-2xl bg-white dark:bg-[#0c1626] border border-slate-200/90 dark:border-slate-700/90 shadow-2xl shadow-slate-900/15 dark:shadow-black/60 backdrop-blur-xl"
                    >
                      <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-800/80 mb-1 flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                          Add Evidence
                        </span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500">Max 25MB</span>
                      </div>

                      {/* Option 1: Image Upload */}
                      <button
                        type="button"
                        onClick={() => {
                          setShowUploadMenu(false);
                          imageInputRef.current?.click();
                        }}
                        className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-colors text-left cursor-pointer group"
                      >
                        <div className="w-9 h-9 rounded-xl bg-teal-500/15 border border-teal-500/30 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                          <ImageIcon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-teal-600 dark:group-hover:text-teal-300 transition-colors">
                            Upload Image
                          </p>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                            Photos, screenshots, memes (JPG, PNG, WebP)
                          </p>
                        </div>
                      </button>

                      {/* Option 2: Document Upload */}
                      <button
                        type="button"
                        onClick={() => {
                          setShowUploadMenu(false);
                          docInputRef.current?.click();
                        }}
                        className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-colors text-left cursor-pointer group mt-0.5"
                      >
                        <div className="w-9 h-9 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors">
                            Upload Document
                          </p>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                            PDF reports, DOCX, text files
                          </p>
                        </div>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button
                type="button"
                onClick={handlePasteClipboard}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                title="Paste from clipboard"
              >
                {isPasted ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Pasted</span>
                  </>
                ) : (
                  <>
                    <Clipboard className="w-3.5 h-3.5" />
                    <span>Paste</span>
                  </>
                )}
              </button>

              <span className="hidden md:inline-block text-[11px] text-slate-400 dark:text-slate-500">
                Images, PDFs & claims
              </span>
            </div>

            {/* Right Tools: Enter Helper Hint & Send Button */}
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-slate-400 dark:text-slate-500">
                <span>Press</span>
                <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-[10px] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-semibold">
                  Enter ↵
                </kbd>
                <span>to verify</span>
              </span>

              {/* Submit / Verify Button */}
              <button
                type="button"
                onClick={() => handleSubmit()}
                disabled={isLoading || !hasContent}
                id="btn-chat-verify-submit"
                aria-label="Verify claim"
                className={`relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full transition-all duration-200 shadow-md ${
                  hasContent && !isLoading
                    ? "bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-300 hover:to-emerald-300 text-slate-950 cursor-pointer shadow-teal-500/25 hover:scale-105 active:scale-95"
                    : "bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed"
                }`}
                title="Start verification"
              >
                {isLoading ? (
                  <Sparkles className="w-4 h-4 animate-spin text-teal-700 dark:text-teal-300" />
                ) : (
                  <ArrowUp className="w-5 h-5 stroke-[2.5]" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

