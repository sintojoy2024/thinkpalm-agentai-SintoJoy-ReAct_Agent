import type { PipelineResult, AgentLogEntry } from "@/types";
import { createSession, persistSession, getSession } from "@/memory/session-memory";
import { runPRDAnalyzer } from "@/agents/prd-analyzer";
import { runUIArchitect } from "@/agents/ui-architect";
import { runCodeGenerator } from "@/agents/code-generator";
import { buildPreviewFromTree } from "@/tools/preview-builder";

export interface OrchestratorOptions {
  onProgress?: (stage: string, message: string) => void;
  onAgentLog?: (entry: AgentLogEntry) => void;
}

/**
 * Multi-agent orchestrator: PRD Analyzer → UI Architect → Code Generator
 * Handoffs pass structured outputs through session memory.
 */
export async function runPipeline(
  prdText: string,
  options?: OrchestratorOptions
): Promise<PipelineResult> {
  const agentLog: AgentLogEntry[] = [];
  const log = (entry: AgentLogEntry) => {
    agentLog.push(entry);
    options?.onAgentLog?.(entry);
  };

  const session = createSession(prdText);
  const { sessionId } = session;

  try {
    // Agent 1: PRD Analyzer
    options?.onProgress?.("analyzing", "PRD Analyzer agent is reading your maritime requirements...");
    const analysis = await runPRDAnalyzer(sessionId, prdText, log);

    const sess = getSession(sessionId);
    if (sess) sess.analysis = analysis;

    // Handoff → Agent 2: UI Architect
    options?.onProgress?.("architecting", "UI Architect agent is designing the component tree...");
    const componentTree = await runUIArchitect(sessionId, analysis, log);

    if (sess) sess.componentTree = componentTree;

    // Handoff → Agent 3: Code Generator
    options?.onProgress?.("generating", "Code Generator agent is writing production React components...");
    const components = await runCodeGenerator(sessionId, componentTree, log);

    if (sess) sess.components = components;

    const previewHtml = buildPreviewFromTree(componentTree, analysis.title);
    persistSession(sessionId);

    options?.onProgress?.("complete", "Pipeline complete! Your maritime UI is ready.");

    return {
      sessionId,
      analysis,
      componentTree,
      components,
      previewHtml,
      agentLog,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown pipeline error";
    log({
      agent: "Orchestrator",
      action: "Pipeline failed",
      timestamp: new Date().toISOString(),
      details: message,
    });
    options?.onProgress?.("error", message);
    throw error;
  }
}
