export const API_BASE = process.env.NEXT_PUBLIC_API_URL!;

/* ---------- Types ---------- */

export interface Summary {
  id: number;
  input_text: string;
  output_text: string;
  created_at?: string;
}

export interface SummarizeRequest {
  document: string;
  max_refinement_steps?: number;
}

export interface StreamEvent {
  event: "refined_summary" | "judge_decision" | "final_summary" | "error";
  summary?: string;
  score?: number;
  critique?: string;
  message?: string;
  timestamp?: string;
}

/* ---------- Dashboard ---------- */

export async function fetchSummaries(): Promise<Summary[]> {
  const res = await fetch(`${API_BASE}/dashboard`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error(`Failed to fetch summaries: ${res.statusText}`);
  return res.json();
}

/* ---------- Auth Helpers ---------- */

export async function login(username: string, password: string) {
  const res = await fetch(`${API_BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
    credentials: "include",
  });

  if (!res.ok) {
    const { error } = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(`Login failed: ${error}`);
  }

  return res.json();
}

export async function register(username: string, password: string, email: string) {
  const res = await fetch(`${API_BASE}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password, email }),
    credentials: "include",
  });

  if (!res.ok) {
    const { error } = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(`Registration failed: ${error}`);
  }

  return res.json();
}

export async function logout() {
  const res = await fetch(`${API_BASE}/logout`, {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) throw new Error(`Logout failed: ${res.statusText}`);
  return res.json();
}

/* ---------- Summarization ---------- */

// Non-streaming
export async function summarizeDocument(request: SummarizeRequest) {
  const res = await fetch(`${API_BASE}/summarize`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
    credentials: "include",
  });

  if (!res.ok) throw new Error(`Summarization failed: ${res.statusText}`);
  return res.json();
}

// Streaming version
export async function summarizeDocumentStream(
  request: SummarizeRequest,
  onEvent: (event: StreamEvent) => void
) {
  const res = await fetch(`${API_BASE}/summarize_stream`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
    credentials: "include",
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(errData.error || `Streaming summarization failed: ${res.statusText}`);
  }

  if (!res.body) throw new Error("No response body from server");

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n").filter(Boolean);
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      try {
        onEvent(JSON.parse(line) as StreamEvent);
      } catch (err) {
        console.error("Failed to parse stream line:", line, err);
      }
    }
  }

  if (buffer.trim()) {
    try {
      onEvent(JSON.parse(buffer) as StreamEvent);
    } catch (err) {
      console.error("Failed to parse final stream buffer:", buffer, err);
    }
  }
}
