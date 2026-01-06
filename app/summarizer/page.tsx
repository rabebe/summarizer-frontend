"use client";

import { useState, useEffect } from "react";
import AuthGuard from "@/components/auth/AuthGuard";
import DocumentInput from "./DocumentInput";
import QuotaBadge from "./QuotaBadge";
import SummaryOutput from "./SummaryOutput";
import SummaryStream from "./SummaryStream";
import { useQuota } from "@/hooks/useQuota";

interface DraftEntry {
  summary: string;
  critique: string;
  score: string | number;
}

export default function SummarizerPage() {
  const [document, setDocument] = useState("");
  const [drafts, setDrafts] = useState<DraftEntry[]>([]);
  const [finalSummary, setFinalSummary] = useState("");
  const [finalCritique, setFinalCritique] = useState("");
  const [score, setScore] = useState<string | number>("N/A");
  const [loading, setLoading] = useState(false);

  const MAX_REFINEMENT_STEPS = 3;
  const { stepsTaken, maxSteps: quotaMax, refreshQuota } = useQuota(MAX_REFINEMENT_STEPS);
  const API_BASE = process.env.NEXT_PUBLIC_API_URL;

  // --- Load persisted data from localStorage ---
  useEffect(() => {
    const savedDoc = localStorage.getItem("refinebot_doc");
    const savedSummary = localStorage.getItem("refinebot_final");
    const savedCritique = localStorage.getItem("refinebot_critique");
    const savedScore = localStorage.getItem("refinebot_score");

    if (savedDoc) setDocument(savedDoc);
    if (savedSummary) setFinalSummary(savedSummary);
    if (savedCritique) setFinalCritique(savedCritique);
    if (savedScore) setScore(savedScore);
  }, []);

  useEffect(() => {
    localStorage.setItem("refinebot_doc", document);
    localStorage.setItem("refinebot_final", finalSummary);
    localStorage.setItem("refinebot_critique", finalCritique);
    localStorage.setItem("refinebot_score", String(score));
  }, [document, finalSummary, finalCritique, score]);

  // --- Handlers ---
  const handleClear = () => {
    if (window.confirm("Are you sure you want to clear the workspace?")) {
      setDocument("");
      setFinalSummary("");
      setFinalCritique("");
      setScore("N/A");
      setDrafts([]);
      localStorage.removeItem("refinebot_doc");
      localStorage.removeItem("refinebot_final");
      localStorage.removeItem("refinebot_critique");
      localStorage.removeItem("refinebot_score");
    }
  };

  const handleSummarize = async () => {
    if (!document || document.trim().length < 100) {
      alert("Please enter at least 100 characters to summarize.");
      return;
    }

    setLoading(true);
    setDrafts([]);
    setFinalSummary("");
    setFinalCritique("");
    setScore("N/A");

    try {
      const response = await fetch(`${API_BASE}/summarize_stream`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          document: document,
          max_refinement_steps: MAX_REFINEMENT_STEPS,
        }),
        credentials: "include",
      });

      const contentType = response.headers.get("content-type");

      // --- Handle cache hits (JSON) ---
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();

        if (data.status === "sqlite_fuzzy_cache" || data.status === "cached") {
          setFinalSummary(data.final_summary);
          setScore(data.final_judge_result?.score ?? "N/A");
          setFinalCritique(data.final_judge_result?.critique ?? "");
          setDrafts([{
            summary: data.final_summary,
            critique: data.final_judge_result?.critique ?? "",
            score: data.final_judge_result?.score ?? "N/A"
          }]);
        }
        setLoading(false);
        return;
      }

      // --- Streaming AI response ---
      setDrafts([{ summary: "Generating new summary...", critique: "", score: "N/A" }]);
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) return;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n").filter(line => line.trim() !== "");

        for (const line of lines) {
          const payload = JSON.parse(line);

          if (payload.event === "initial_summary" || payload.event === "refined_summary") {
            setDrafts(prev => [
              ...prev,
              { summary: payload.summary, critique: "", score: "N/A" }
            ]);
            setFinalSummary(payload.summary);
          }

          if (payload.event === "judge_decision" || payload.event === "final_summary") {
            setDrafts(prev => {
              const updated = [...prev];
              const last = updated[updated.length - 1];
              if (last) {
                last.critique = payload.critique ?? last.critique;
                last.score = payload.score ?? last.score;
              }
              return updated;
            });
            if (payload.critique) setFinalCritique(payload.critique);
            if (payload.score) setScore(payload.score);
          }
        }
      }

      await refreshQuota();

    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setDrafts([{ summary: `Error: ${msg}`, critique: "", score: "N/A" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthGuard>
      <div className="p-8 max-w-5xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold">RefineBot Summarizer</h1>

        {/* Input area */}
        <DocumentInput
          document={document}
          setDocument={setDocument}
          onClear={handleClear}
          onSummarize={handleSummarize}
          loading={loading}
        />

        {/* Quota / Metrics */}
        <QuotaBadge stepsTaken={stepsTaken} maxSteps={quotaMax} />

        {/* Draft / Streaming summaries */}
        <SummaryStream drafts={drafts} />

        {/* Final summary output */}
        <SummaryOutput
          finalSummary={finalSummary}
          finalCritique={finalCritique}
          score={score}
        />
      </div>
    </AuthGuard>
  );
}
