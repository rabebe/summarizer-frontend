export type StreamEvent =
  | { event: "initial_summary"; summary: string }
  | { event: "judge_decision"; score: number | null; critique: string | null; refinement_needed: boolean | null }
  | { event: "refined_summary"; summary: string }
  | { event: "final_summary"; summary: string }
  | { event: "error"; message: string };

export interface SummarizeRequest {
  document: string;
  max_refinement_steps?: number;
}
