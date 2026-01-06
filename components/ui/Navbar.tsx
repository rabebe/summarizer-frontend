"use client";

import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export default function Navbar() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true); // Added to handle initial mount check
  const router = useRouter();

  const checkAuth = useCallback(async () => {
    if (!API_BASE) return;
    try {
      const res = await fetch(`${API_BASE}/me`, {
        credentials: "include",
      });

      if (!res.ok) {
        setLoggedIn(false);
      } else {
        const data = await res.json();
        setLoggedIn(!!data.user_id);
      }
    } catch (err) {
      console.error("Auth check failed:", err);
      setLoggedIn(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // 1. Define the call as an async operation inside the effect
    const initializeAuth = async () => {
      await checkAuth();
    };

    initializeAuth();

    // 2. Set up the event listener
    const handleAuthChange = () => {
      checkAuth();
    };

    window.addEventListener("auth-change", handleAuthChange);
    return () => window.removeEventListener("auth-change", handleAuthChange);
  }, [checkAuth]);

  // Logout handler
  const handleLogout = async () => {
    try {
      const res = await fetch(`${API_BASE}/logout`, {
        method: "POST",
        credentials: "include",
      });
      if (res.ok) {
        setLoggedIn(false);
        window.dispatchEvent(new Event("auth-change"));
        router.push("/login");
      }
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <nav className="fixed top-0 w-full z-30 bg-gray-900/90 backdrop-blur border-b border-gray-700 text-white">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-extrabold tracking-tight">
          RefineBot
        </Link>

        <div className="flex gap-6 text-sm font-semibold items-center">
          {/* Prevent flickering while checking auth */}
          {!loading && (
            <>
              {!loggedIn ? (
                <>
                  <Link href="/login" className="hover:text-cyan-400">Login</Link>
                  <Link href="/register" className="hover:text-cyan-400">Register</Link>
                </>
              ) : (
                <>
                  <Link href="/summarizer" className="hover:text-cyan-400">Summarize</Link>
                  <Link href="/dashboard" className="hover:text-cyan-400">Dashboard</Link>
                  <button onClick={handleLogout} className="text-red-400 hover:text-red-300">
                    Logout
                  </button>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}