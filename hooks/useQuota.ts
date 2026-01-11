"use client";

import { useState, useEffect, useCallback } from "react";
import { API_BASE } from "@/lib/api";

export function useQuota(initialLimit: number = 3) {
  const [remaining, setRemaining] = useState(initialLimit); // quota left
  const [limit, setLimit] = useState(initialLimit);         // total quota
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch the current quota from backend
   */
  const refreshQuota = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/me/quota`, {
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch quota");
      }

      const data = await res.json();
      setRemaining(data.remaining);
      setLimit(data.limit);
    } catch (err) {
      console.error("Quota fetch error:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Call after a successful new summary to decrement remaining quota locally
   */
  const decrementLocalQuota = useCallback(() => {
    setRemaining((prev) => Math.max(prev - 1, 0));
  }, []);

  /**
   * Check if user can submit a new summary
   */
  const canSubmit = remaining > 0 && !loading;

  // Initial load
  useEffect(() => {
    refreshQuota();
  }, [refreshQuota]);

  return {
    remaining,
    limit,
    loading,
    error,
    canSubmit,
    refreshQuota,      // sync with backend
    decrementLocalQuota, // call after successful submission
  };
}
