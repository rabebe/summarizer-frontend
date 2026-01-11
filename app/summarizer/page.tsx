"use client";

import { useState, useEffect } from "react";
import AuthGuard from "@/components/auth/AuthGuard";
import DocumentInput from "./DocumentInput";
import QuotaBadge from "./QuotaBadge";
import SummaryOutput from "./SummaryOutput";
import SummaryStream from "./SummaryStream";
import { useQuota } from "@/hooks/useQuota";
import { StreamEvent } from "@/hooks/useSummarize";

interface DraftEntry {
  summary: string;
  critique: string;
  score: number;
}

export default function SummarizerPage() {
  const [document, setDocument] = useState("");
  const [drafts, setDrafts] = useState<DraftEntry[]>([]);
  const [finalSummary, setFinalSummary] = useState("");
  const [finalCritique, setFinalCritique] = useState("");
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  const { remaining, limit, loading: quotaLoading, refreshQuota, decrementLocalQuota } = useQuota(3);
  const API_BASE = process.env.NEXT_PUBLIC_API_URL;

  // --- Hydrate from localStorage ---
  useEffect(() => {
    if (typeof window === "undefined") return;

    setDocument(localStorage.getItem("refinebot_doc") ?? "");
    setFinalSummary(localStorage.getItem("refinebot_final") ?? "");
    setFinalCritique(localStorage.getItem("refinebot_critique") ?? "");
    setScore(Number(localStorage.getItem("refinebot_score") ?? 0));
    setHydrated(true);
  }, []);

  // --- Persist to localStorage ---
  useEffect(() => {
    if (!hydrated) return;

    localStorage.setItem("refinebot_doc", document);
    localStorage.setItem("refinebot_final", finalSummary);
    localStorage.setItem("refinebot_critique", finalCritique);
    localStorage.setItem("refinebot_score", String(score));
  }, [document, finalSummary, finalCritique, score, hydrated]);

  // --- Clear workspace ---
  const handleClear = () => {
    if (!window.confirm("Are you sure you want to clear the workspace?")) return;

    setDocument("");
    setFinalSummary("");
    setFinalCritique("");
    setScore(0);
    setDrafts([]);
    setError(null);

    if (typeof window !== "undefined") {
      localStorage.removeItem("refinebot_doc");
      localStorage.removeItem("refinebot_final");
      localStorage.removeItem("refinebot_critique");
      localStorage.removeItem("refinebot_score");
    }
  };

  // --- Stream summarization ---
  const handleStreamSummarize = async () => {
    if (!document || document.trim().length < 100) {
      alert("Please enter at least 100 characters to summarize.");
      return;
    }

    if (remaining <= 0) {
      alert("You have reached your daily quota.");
      return;
    }

    setLoading(true);
    setDrafts([]);
    setFinalSummary("");
    setFinalCritique("");
    setScore(0);
    setError(null);

    try {
      const response = await fetch(`${API_BASE}/summarize_stream`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ document, max_refinement_steps: 3 }),
        credentials: "include",
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Summarization failed");
      }

      // Read the entire response as text (works for cached single-line responses)
      const text = await response.text();
      const lines = text.split("\n").filter(Boolean);

      for (const line of lines) {
        const payload: StreamEvent = JSON.parse(line);

        switch (payload.event) {
          case "refined_summary":
            if (payload.summary) {
              setDrafts((prev) => [
                ...prev,
                {
                  summary: payload.summary ?? "",
                  critique: payload.critique ?? "",
                  score: payload.score ?? 0,
                },
              ]);
            }
            break;

          case "judge_decision":
            if (payload.critique || payload.score !== undefined) {
              setDrafts((prev) => [
                ...prev,
                {
                  summary: "",
                  critique: payload.critique ?? "",
                  score: payload.score ?? 0,
                },
              ]);
            }
            break;

          case "final_summary":
            setFinalSummary(payload.summary ?? "");
            setFinalCritique(payload.critique ?? "");
            setScore(payload.score ?? 0);
            setDrafts((prev) => [
              ...prev,
              {
                summary: payload.summary ?? "",
                critique: payload.critique ?? "",
                score: payload.score ?? 0,
              },
            ]);
            break;

          case "error":
            setError(payload.message ?? "Unknown error");
            setDrafts((prev) => [
              ...prev,
              { summary: `Error: ${payload.message ?? "Unknown"}`, critique: "", score: 0 },
            ]);
            break;
        }
      }

      decrementLocalQuota();
      await refreshQuota();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
      setDrafts([{ summary: `Error: ${msg}`, critique: "", score: 0 }]);
    } finally {
      setLoading(false);
    }
  };


  // --- Render ---
  return (
    <AuthGuard>
      <div className="p-8 max-w-5xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold">RefineBot Summarizer</h1>

        <DocumentInput
          document={document}
          setDocument={setDocument}
          onClear={handleClear}
          onStreamSummarize={handleStreamSummarize}
          loading={loading || remaining <= 0}
        />

        <div className="flex items-center gap-4">
          <QuotaBadge stepsTaken={limit - remaining} maxSteps={limit} />
          {quotaLoading && <span className="text-sm text-gray-400">Loading quota...</span>}
        </div>

        {error && <div className="p-4 bg-red-100 text-red-800 rounded-lg">{error}</div>}

        {/* Draft streaming */}
        <SummaryStream drafts={drafts} />

        {/* Always show final summary */}
        <SummaryOutput finalSummary={finalSummary} finalCritique={finalCritique} score={score} />
      </div>
    </AuthGuard>
  );
}
