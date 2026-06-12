import type { AgentLogEntry, PipelineResult, PipelineStage, PipelineStreamEvent } from "@/types";

export interface PipelineStreamCallbacks {
  onProgress?: (stage: PipelineStage, message: string) => void;
  onLog?: (entry: AgentLogEntry) => void;
}

export async function runPipelineStream(
  prdText: string,
  callbacks: PipelineStreamCallbacks
): Promise<PipelineResult> {
  const res = await fetch("/api/pipeline", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prdText }),
  });

  if (!res.ok && res.headers.get("Content-Type")?.includes("application/json")) {
    const err = await res.json();
    throw new Error(err.error || "Pipeline failed");
  }

  if (!res.body) {
    throw new Error("No response stream from pipeline");
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let result: PipelineResult | null = null;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      if (!line.trim()) continue;
      const event = JSON.parse(line) as PipelineStreamEvent;

      if (event.type === "progress") {
        callbacks.onProgress?.(event.stage, event.message);
      } else if (event.type === "log") {
        callbacks.onLog?.(event.entry);
      } else if (event.type === "complete") {
        result = event.result;
      } else if (event.type === "error") {
        throw new Error(event.message);
      }
    }
  }

  if (!result) {
    throw new Error("Pipeline completed without a result");
  }

  return result;
}
