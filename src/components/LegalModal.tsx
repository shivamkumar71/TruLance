import React from "react";
import { X, Shield } from "lucide-react";

interface LegalModalProps {
  type: "privacy" | "terms" | null;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ type, onClose }) => {
  if (!type) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white dark:bg-[#0b1329] border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-xl relative animate-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Shield className="w-4 h-4" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            {type === "privacy" ? "Privacy Policy" : "Terms of Service"}
          </h3>
        </div>

        <div className="text-xs text-slate-600 dark:text-slate-300 space-y-3 max-h-[60vh] overflow-y-auto pr-1 leading-relaxed">
          {type === "privacy" ? (
            <>
              <p>
                <strong>TruthLens Privacy Policy</strong>
              </p>
              <p>
                1. <strong>Data Collection:</strong> TruthLens processes user-submitted text and files solely for the purpose of analyzing factual assertions against external public evidence.
              </p>
              <p>
                2. <strong>Local Storage:</strong> Your verification history is stored locally in your browser's localStorage and is never sold or distributed.
              </p>
              <p>
                3. <strong>Source Discovery:</strong> Evidence queries evaluate public search and reference registries to return verified article links and credible source ratings.
              </p>
            </>
          ) : (
            <>
              <p>
                <strong>TruthLens Terms of Service</strong>
              </p>
              <p>
                1. <strong>Informational Tool:</strong> TruthLens is designed as an evidence synthesis and fact-checking assistance platform. Results are generated from public records and reputable reporting.
              </p>
              <p>
                2. <strong>User Verification:</strong> We encourage users to inspect the direct source citations provided on every report card.
              </p>
              <p>
                3. <strong>Acceptable Use:</strong> TruthLens may not be used for malicious content generation or automated denial-of-service attempts.
              </p>
            </>
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
