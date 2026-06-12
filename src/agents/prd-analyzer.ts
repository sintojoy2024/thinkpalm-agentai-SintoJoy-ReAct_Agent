import type { PRDAnalysis, AgentLogEntry } from "@/types";
import { chatWithGroq, extractJsonFromResponse } from "@/lib/groq";
import { normalizePRDAnalysis } from "@/lib/normalize";
import { getContextForAgent, remember } from "@/memory/session-memory";
import { executeMaritimeWidgetSearch } from "@/tools/maritime-widget-catalog";

const AGENT_NAME = "PRD Analyzer";

const SYSTEM_PROMPT = `You are the PRD Analyzer agent for BridgeView AI, a maritime UI generation platform for ThinkPalm engineers.

Your role:
1. Read maritime product requirements documents (PRDs) for vessel monitoring, crew welfare, navigation, etc.
2. Extract structured requirements: features, widgets, data entities, user roles, constraints.
3. Use the provided maritime widget catalog search results to identify matching UI components.
4. Return a JSON analysis object.

Always respond with ONLY a JSON block in this exact schema:
\`\`\`json
{
  "title": "string",
  "summary": "string",
  "features": ["string"],
  "widgets": ["string - widget names needed"],
  "dataEntities": ["string"],
  "userRoles": ["string"],
  "constraints": ["string"]
}
\`\`\``;

const CATALOG_QUERIES = ["voyage", "fuel", "crew", "alert", "engine", "weather", "position", "cargo"];

function prefetchWidgetCatalog(prdText: string): string {
  const lower = prdText.toLowerCase();
  const queries = CATALOG_QUERIES.filter((q) => lower.includes(q));
  const searchQueries = queries.length > 0 ? queries : CATALOG_QUERIES.slice(0, 4);

  return searchQueries
    .map((query) => {
      const result = executeMaritimeWidgetSearch({ query });
      return `Query "${query}": ${result.matches.map((m) => `${m.name} — ${m.description}`).join("; ") || "no matches"}`;
    })
    .join("\n");
}

export async function runPRDAnalyzer(
  sessionId: string,
  prdText: string,
  onLog?: (entry: AgentLogEntry) => void
): Promise<PRDAnalysis> {
  const log = (action: string, details?: string) => {
    onLog?.({ agent: AGENT_NAME, action, timestamp: new Date().toISOString(), details });
  };

  log("Started PRD analysis", `Processing ${prdText.length} characters`);

  const context = getContextForAgent(sessionId, AGENT_NAME);
  const catalogResults = prefetchWidgetCatalog(prdText);

  log("Tool call: search_maritime_widgets", "Pre-fetched maritime widget catalog");
  remember(sessionId, "widget_catalog_prefetch", catalogResults, AGENT_NAME);

  const userMessage = `Analyze this maritime PRD and extract structured requirements:

---
${prdText}
---

Maritime widget catalog search results:
${catalogResults}

${context ? `Prior context:\n${context}` : ""}

Produce the JSON analysis only.`;

  let text: string;
  try {
    text = await chatWithGroq(SYSTEM_PROMPT, userMessage, { maxTokens: 2048 });
  } catch (error) {
    log("Model call failed", error instanceof Error ? error.message : "Unknown error");
    text = "";
  }

  let analysis: PRDAnalysis;
  try {
    if (!text?.trim()) throw new Error("Empty response from model");
    analysis = normalizePRDAnalysis(extractJsonFromResponse<Partial<PRDAnalysis>>(text));
    if (analysis.widgets.length === 0) {
      analysis = createFallbackAnalysis(prdText);
      log("Fallback analysis used", "Model returned no widgets");
    }
  } catch {
    analysis = createFallbackAnalysis(prdText);
    log("Fallback analysis used", "JSON parse failed, using heuristic extraction");
  }

  remember(sessionId, "prd_analysis", analysis, AGENT_NAME);
  log("PRD analysis complete", `Found ${analysis.widgets.length} widgets, ${analysis.features.length} features`);

  return analysis;
}

function createFallbackAnalysis(prdText: string): PRDAnalysis {
  const lower = prdText.toLowerCase();
  const widgets: string[] = [];
  if (lower.includes("voyage") || lower.includes("route")) widgets.push("VoyageProgressTracker");
  if (lower.includes("fuel")) widgets.push("FuelGaugeCard");
  if (lower.includes("crew") || lower.includes("certification")) widgets.push("CrewCertificationStatus");
  if (lower.includes("alert") || lower.includes("alarm")) widgets.push("MaritimeAlertPanel");
  if (lower.includes("position") || lower.includes("gps") || lower.includes("ais")) widgets.push("VesselPositionMap");
  if (lower.includes("engine")) widgets.push("EngineMonitoringDashboard");
  if (lower.includes("weather")) widgets.push("WeatherConditionsCard");
  if (widgets.length === 0) widgets.push("MaritimeDashboard", "AlertPanel", "StatusCards");

  return {
    title: "Maritime Dashboard",
    summary: prdText.slice(0, 200),
    features: ["Real-time monitoring", "Alert management", "Data visualization"],
    widgets,
    dataEntities: ["Vessel", "Voyage", "Crew", "Alerts"],
    userRoles: ["Captain", "Chief Engineer", "Fleet Manager"],
    constraints: ["Responsive layout", "Tailwind CSS styling"],
  };
}
