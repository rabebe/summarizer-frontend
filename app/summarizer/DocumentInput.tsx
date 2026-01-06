"use client";

import React from "react";

export interface DocumentInputProps {
  document: string;
  setDocument: React.Dispatch<React.SetStateAction<string>>;
  onClear: () => void;
  onSummarize: () => Promise<void>;
  loading: boolean;
}

export default function DocumentInput({
  document,
  setDocument,
  onClear,
  onSummarize,
  loading,
}: DocumentInputProps) {
  return (
    <div className="card p-6 bg-gray-800/60 rounded-xl shadow space-y-4 border border-gray-700">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-cyan-400">Input Document</h2>
        <span className="text-xs text-gray-400">{document.length} / 5000 characters</span>
      </div>
      
      <textarea
        value={document}
        onChange={(e) => setDocument(e.target.value)}
        className="w-full h-48 p-4 bg-gray-900/80 text-white border border-gray-600 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all resize-none"
        placeholder="Paste your document here..."
        maxLength={5000}
      />

      <div className="flex justify-end items-center gap-4">
        {/* Clear Button */}
        <button
          onClick={onClear}
          disabled={loading || !document}
          className="text-gray-400 hover:text-white text-sm font-medium transition-colors disabled:opacity-50"
        >
          Clear Workspace
        </button>

        {/* Primary Action Button */}
        <button
          onClick={onSummarize}
          className="bg-cyan-600 hover:bg-cyan-500 active:scale-95 px-6 py-2.5 rounded-lg font-bold text-white transition-all shadow-lg shadow-cyan-900/20 disabled:bg-gray-700 disabled:text-gray-400 disabled:scale-100"
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <span className="animate-spin text-lg">⏳</span>
              <span>Summarizing...</span>
            </div>
          ) : (
            "Start RefineBot"
          )}
        </button>
      </div>
    </div>
  );
}