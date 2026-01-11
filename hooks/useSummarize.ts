"use client";

import { useState, useCallback } from "react";

/* ---------- Types ---------- */

export interface SummarizeRequest {
  document: string;
  max_refinement_steps?: number;
}

export type StreamEventType =
  | "refined_summary"
  | "judge_decision"
  | "final_summary"
  | "error";

export interface StreamEvent {
  event: StreamEventType;
  summary?: string;
  score?: number;
  critique?: string;
  message?: string;
  timestamp?: string;
}

/* ---------- Config ---------- */

const API_BASE = process.env.NEXT_PUBLIC_API_BASE!;

/* ---------- NDJSON Streaming Helper ---------- */

async function streamNDJSON<T>(
  response: Response,
  onEvent: (event: T) => void
) {
  const reader = response.body?.getReader();
  if (!reader) return;

  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      if (!line.trim()) continue;
      onEvent(JSON.parse(line) as T);
    }
  }

  if (buffer.trim()) {
    onEvent(JSON.parse(buffer) as T);
  }
}

/* ---------- Hook ---------- */

export interface DraftEntry {
  summary: string;
  critique: string;
  score: number;
}

export function useSummarize() {
  const [drafts, setDrafts] = useState<DraftEntry[]>([]);
  const [finalSummary, setFinalSummary] = useState<string>("");
  const [finalCritique, setFinalCritique] = useState<string>("");
  const [finalScore, setFinalScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const summarize = useCallback(async (data: SummarizeRequest) => {
    setLoading(true);
    setError(null);
    setDrafts([]);
    setFinalSummary("");
    setFinalCritique("");
    setFinalScore(null);

    try {
      const response = await fetch(`${API_BASE}/summarize_stream`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Summarization failed");
      }

      await streamNDJSON<StreamEvent>(response, (event) => {
        switch (event.event) {
          case "refined_summary":
            if (event.summary) {
              setDrafts((prev) => [
                ...prev,
                {
                  summary: event.summary ?? "",
                  critique: event.critique ?? "",
                  score: event.score ?? 0,
                },
              ]);
            }
            break;

          case "judge_decision":
            if (event.critique || event.score !== undefined) {
              setDrafts((prev) => [
                ...prev,
                { summary: "", critique: event.critique ?? "", score: event.score ?? 0 },
              ]);
            }
            break;

          case "final_summary":
            if (event.summary) setFinalSummary(event.summary);
            if (event.critique) setFinalCritique(event.critique);
            if (event.score !== undefined) setFinalScore(event.score);

            // Also add final summary to drafts
            setDrafts((prev) => [
              ...prev,
              {
                summary: event.summary ?? "",
                critique: event.critique ?? "",
                score: event.score ?? 0,
              },
            ]);
            break;

          case "error":
            if (event.message) setError(event.message);
            break;
        }
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
      setDrafts((prev) => [...prev, { summary: `Error: ${msg}`, critique: "", score: 0 }]);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    drafts,
    finalSummary,
    finalCritique,
    finalScore,
    loading,
    error,
    summarize,
  };
}
