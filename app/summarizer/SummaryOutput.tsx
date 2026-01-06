"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";

interface SummaryOutputProps {
  finalSummary: string;
  finalCritique: string;
  score: string | number;
}

export default function SummaryOutput({ finalSummary, finalCritique, score }: SummaryOutputProps) {
  const [copied, setCopied] = useState(false);

  if (!finalSummary) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(finalSummary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2s
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* AI Summary Box */}
      <div className="relative group p-6 bg-bg rounded-2xl border border-primary shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-primary">AI Summary</h2>
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-fg bg-bg hover:bg-primary/10 hover:text-primary rounded-lg transition-colors border border-primary"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
        <div className="prose prose-fg max-w-none prose-p:leading-relaxed prose-pre:bg-bg/80">
          <ReactMarkdown>{finalSummary}</ReactMarkdown>
        </div>
      </div>

      {/* Evaluation / Judge Card */}
      <div className="p-6 bg-gradient-to-br from-bg/50 to-bg/70 rounded-2xl border border-primary shadow-inner">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-primary font-bold text-lg">Evaluation</h2>
            <p className="text-accent text-xs font-medium uppercase tracking-tighter">Academic Quality Audit</p>
          </div>
          <div className="flex flex-col items-center justify-center bg-bg h-16 w-16 rounded-full shadow-sm border border-primary">
            <span className="text-secondary text-2xl font-black leading-none">{score || "N/A"}</span>
            <span className="text-xs font-bold text-accent uppercase">/ 10</span>
          </div>
        </div>

        <div className="relative p-4 bg-bg/60 backdrop-blur-sm rounded-xl border border-primary">
          <p className="text-fg italic text-sm leading-relaxed pl-4">{finalCritique || "No critique available."}</p>
        </div>
      </div>
    </div>
  );
}
