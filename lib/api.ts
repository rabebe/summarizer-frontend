export const API_BASE = process.env.NEXT_PUBLIC_API_URL!;

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

// Fetch all summaries (dashboard)
export async function fetchSummaries(): Promise<Summary[]> {
  const res = await fetch(`${API_BASE}/dashboard`, {
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch summaries: ${res.statusText}`);
  }
  return res.json();
}

// Auth helpers
export async function login(username: string, password: string) {
  const res = await fetch(`${API_BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error(`Login failed: ${res.statusText}`);
  }
  return res.json();
}

export async function register(username: string, password: string) {
  const res = await fetch(`${API_BASE}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error(`Registration failed: ${res.statusText}`);
  }
  return res.json();
}

export async function logout() {
  const res = await fetch(`${API_BASE}/logout`, {
    method: "POST",
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error(`Logout failed: ${res.statusText}`);
  }
  return res.json();
}

// Summarization
export async function summarizeDocument(request: SummarizeRequest) {
  const res = await fetch(`${API_BASE}/summarize`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error(`Summarization failed: ${res.statusText}`);
  }
  return res.json();
}
