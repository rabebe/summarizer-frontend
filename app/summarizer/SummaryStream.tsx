"use client";

export interface DraftEntry {
  summary: string;
  critique: string;
  score: number;
}

export interface SummaryStreamProps {
  drafts: DraftEntry[];
}

export default function SummaryStream({ drafts }: SummaryStreamProps) {
  return (
    <div className="card p-4 bg-gray-800/60 rounded-xl shadow space-y-2">
      <h2 className="text-xl font-semibold">Draft Summaries</h2>

      {/* If there are drafts, show them; otherwise show subtle message */}
      {drafts.length > 0 ? (
        <ul className="space-y-2">
          {drafts.map((draft, idx) => (
            <li key={idx} className="p-2 bg-gray-900/40 rounded text-gray-200">
              <p className="font-medium">{draft.summary || "No summary yet"}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400 italic">Draft summaries will appear here as they are generated...</p>
      )}
    </div>
  );
}
