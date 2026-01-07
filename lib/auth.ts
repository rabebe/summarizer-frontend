const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export async function checkAuth(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/me`, {
      method: "GET",
      credentials: "include",
    });

    if (!res.ok) return false;

    const data = await res.json();

    return !!data.user_id;
  } catch (err) {
    console.error("Auth check failed:", err);
    return false;
  }
}

export async function register(username: string, password: string, email: string) {
  const res = await fetch(`${API_BASE}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password, email }),
    credentials: "include",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Registration failed");
  }

  return data;
}
