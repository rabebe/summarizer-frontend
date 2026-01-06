"use client";

import { useEffect, useState } from "react";
import { fetchSummaries, Summary } from "../../lib/api";
import AuthGuard from "@/components/auth/AuthGuard";

export default function DashboardPage() {
  const [summaries, setSummaries] = useState<Summary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadSummaries() {
      try {
        const data = await fetchSummaries();
        setSummaries(data);
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message);
        else setError("Unknown error occurred");
      } finally {
        setLoading(false);
      }
    }

    loadSummaries();
  }, []);

  if (loading) return <p>Loading summaries...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <AuthGuard>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        {summaries.length === 0 ? (
          <p>No summaries found.</p>
        ) : (
          <ul className="space-y-4">
            {summaries.map((summary) => (
              <li key={summary.id} className="border p-4 rounded shadow">
                <p>
                  <strong>Input:</strong> {summary.input_text}
                </p>
                <p>
                  <strong>Output:</strong> {summary.output_text}
                </p>
                <p className="text-sm text-gray-500">
                  Created at:{" "}
                  {summary.created_at
                    ? new Date(summary.created_at).toLocaleString()
                    : "Unknown"}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </AuthGuard>
  );
}
