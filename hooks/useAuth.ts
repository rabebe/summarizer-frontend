"use client";

import { useState, useEffect } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export function useAuth() {
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null); // null = loading
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch(`${API_BASE}/me`, {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setUserId(data.user_id);
          setLoggedIn(true);
        } else {
          setLoggedIn(false);
        }
      } catch {
        setLoggedIn(false);
      }
    }

    checkAuth();
  }, []);

  const logout = async () => {
    await fetch(`${API_BASE}/logout`, {
      method: "POST",
      credentials: "include",
    });
    setLoggedIn(false);
    setUserId(null);
  };

  return { loggedIn, userId, logout };
}
