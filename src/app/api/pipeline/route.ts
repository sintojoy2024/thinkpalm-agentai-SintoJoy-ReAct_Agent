import { NextRequest } from "next/server";
import { runPipeline } from "@/agents/orchestrator";
import type { PipelineStage, PipelineStreamEvent } from "@/types";

export const maxDuration = 120;

function encodeEvent(event: PipelineStreamEvent): Uint8Array {
  return new TextEncoder().encode(`${JSON.stringify(event)}\n`);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const prdText = body.prdText as string;

  if (!prdText || prdText.trim().length < 50) {
    return new Response(JSON.stringify({ error: "PRD text must be at least 50 characters" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: PipelineStreamEvent) => {
        controller.enqueue(encodeEvent(event));
      };

      try {
        const result = await runPipeline(prdText.trim(), {
          onProgress: (stage, message) => {
            send({ type: "progress", stage: stage as PipelineStage, message });
          },
          onAgentLog: (entry) => send({ type: "log", entry }),
        });

        send({ type: "complete", result });
      } catch (error) {
        const message = error instanceof Error ? error.message : "Pipeline failed";
        console.error("[pipeline]", message);
        send({ type: "error", message });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
