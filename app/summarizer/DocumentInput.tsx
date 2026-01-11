"use client";

import React from "react";

const MIN_CHARS = 100;
const MAX_CHARS = 5000;

export interface DocumentInputProps {
  document: string;
  setDocument: React.Dispatch<React.SetStateAction<string>>;
  onClear: () => void;
  onStreamSummarize?: () => Promise<void>;
  loading: boolean;
}

export default function DocumentInput({
  document,
  setDocument,
  onClear,
  onStreamSummarize,
  loading,
}: DocumentInputProps) {
  const isTooShort = document.length > 0 && document.length < MIN_CHARS;
  const isNearLimit = document.length >= MAX_CHARS - 200;

  return (
    <div className="card p-6 bg-gray-800/60 rounded-xl shadow space-y-4 border border-gray-700">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-cyan-400">
          Input Document
        </h2>
        <span className="text-xs text-gray-400">
          {document.length} / {MAX_CHARS} characters
          {isTooShort && (
            <span className="ml-2 text-yellow-400">
              (min {MIN_CHARS})
            </span>
          )}
        </span>
      </div>

      {/* Textarea */}
      <textarea
        value={document}
        onChange={(e) => setDocument(e.target.value)}
        className="w-full h-48 p-4 bg-gray-900/80 text-white border border-gray-600 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all resize-none"
        placeholder="Paste your document here..."
        maxLength={MAX_CHARS}
      />

      {/* Character warning */}
      {isNearLimit && (
        <p className="text-xs text-red-400">
          Approaching maximum character limit
        </p>
      )}

      {/* Actions */}
      <div className="flex justify-end items-center gap-4">
        {/* Clear Button */}
        <button
          type="button"
          onClick={onClear}
          disabled={loading || !document}
          className="text-gray-400 hover:text-white text-sm font-medium transition-colors disabled:opacity-50"
        >
          Clear Workspace
        </button>

        {/* Stream Button */}
        {onStreamSummarize && (
          <button
            type="button"
            onClick={onStreamSummarize}
            disabled={loading || document.length < MIN_CHARS}
            className="bg-purple-600 hover:bg-purple-500 active:scale-95 px-4 py-2 rounded-lg font-bold text-white transition-all shadow-lg shadow-purple-900/20 disabled:bg-gray-700 disabled:text-gray-400 disabled:scale-100"
          >
            {loading ? "Streaming…" : "Stream"}
          </button>
        )}
      </div>
    </div>
  );
}
