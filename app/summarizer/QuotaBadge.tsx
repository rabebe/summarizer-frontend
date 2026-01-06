"use client";

export interface QuotaBadgeProps {
  stepsTaken: number;
  maxSteps: number;
}

export default function QuotaBadge({ stepsTaken, maxSteps }: QuotaBadgeProps) {
  return (
    <div className="card p-4 bg-gray-800/60 rounded-xl shadow text-center">
      <h3 className="text-lg font-semibold text-gray-400 mb-2">Quota</h3>
      <p className="text-2xl font-bold text-purple-400">
        {stepsTaken} / {maxSteps}
      </p>
    </div>
  );
}
