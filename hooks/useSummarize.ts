"use client";

import { useState } from "react";

/* ---------- Types ---------- */

export interface SummarizeRequest {
  document: string;
  max_refinement_steps?: number;
}

export interface StreamEvent {
  event: string;
  summary?: string;
  score?: number | string;
  critique?: string;
  refinement_needed?: boolean;
  message?: string;
  timestamp: string;
}

/* ---------- Config ---------- */

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE!;

/* ---------- NDJSON helper ---------- */

export async function streamNDJSON<T>(
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

export function useSummarize() {
  const [summary, setSummary] = useState("");
  const [events, setEvents] = useState<StreamEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const summarize = async (data: SummarizeRequest) => {
    setLoading(true);
    setError(null);
    setSummary("");
    setEvents([]);

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
        setEvents((prev) => [...prev, event]);

        if (event.event === "final_summary" && event.summary) {
          setSummary(event.summary);
        }

        if (event.event === "error" && event.message) {
          setError(event.message);
        }
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    summary,
    events,
    loading,
    error,
    summarize,
  };
}
