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
