"use client";

export interface DraftEntry {
  summary: string;
  critique: string;
  score: string | number;
}

export interface SummaryStreamProps {
  drafts: DraftEntry[];
}

export default function SummaryStream({ drafts }: SummaryStreamProps) {
  return (
    <div className="card p-4 bg-gray-800/60 rounded-xl shadow space-y-2">
      <h2 className="text-xl font-semibold">Draft Summaries</h2>
      {drafts.length === 0 ? (
        <p className="text-gray-400 italic">Draft summaries will appear here.</p>
      ) : (
        <ul className="space-y-2">
          {drafts.map((draft, idx) => (
            <li key={idx} className="p-2 bg-gray-900/40 rounded text-gray-200">
              <p className="font-medium">{draft.summary}</p>
              <p className="italic text-sm text-gray-400">{draft.critique || "No critique yet"}</p>
              <p className="text-xs text-gray-500 font-bold">Score: {draft.score ?? "N/A"}/10</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
