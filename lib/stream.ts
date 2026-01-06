export type StreamEvent =
  | { event: "initial_summary"; summary: string; timestamp: string }
  | { event: "refined_summary"; summary: string; timestamp: string }
  | { event: "judge_decision"; score?: number; critique?: string; refinement_needed?: boolean; timestamp: string }
  | { event: "final_summary"; summary: string; score?: number; critique?: string; refinement_needed?: boolean; timestamp: string }
  | { event: "error"; message: string; timestamp: string };

export async function streamNDJSON(url: string, callback: (event: StreamEvent) => void) {
  const res = await fetch(url, { credentials: "include" });
  if (!res.body) return;

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      if (!line) continue;
      try {
        const parsed: StreamEvent = JSON.parse(line);
        callback(parsed);
      } catch (err) {
        console.error("Failed to parse NDJSON line:", line, err);
      }
    }
  }

  // Handle any remaining data in the buffer
  if (buffer) {
    try {
      const parsed: StreamEvent = JSON.parse(buffer);
      callback(parsed);
    } catch (err) {
      console.error("Failed to parse remaining NDJSON buffer:", buffer, err);
    }
  }
}
