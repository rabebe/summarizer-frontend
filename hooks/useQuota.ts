"use client";

import { useState, useEffect, useCallback } from "react";
import { API_BASE } from "@/lib/api";

export function useQuota(initialMaxSteps: number = 3) {
  const [stepsTaken, setStepsTaken] = useState(0);
  const [maxSteps, setMaxSteps] = useState(initialMaxSteps);
  const [loading, setLoading] = useState(true);
  
  /**
   * Fetches the current usage count from the Flask backend.
   * This ensures the UI reflects the actual Redis state.
   */
  const refreshQuota = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/me/quota`, { 
        credentials: "include" 
      });
      
      if (res.ok) {
        const data = await res.json();
        // data.count should be the number of summaries used today (e.g., 0, 1, 2, or 3)
        setStepsTaken(data.count);
        setMaxSteps(data.limit);
      }
    } catch (err) {
      console.error("Failed to sync quota with backend:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Sync with backend on initial load
  useEffect(() => {
    refreshQuota();
  }, [refreshQuota]);

  return { 
    stepsTaken, 
    maxSteps, 
    setMaxSteps, 
    refreshQuota, // Call after a successful summary
    loading 
  };
}
