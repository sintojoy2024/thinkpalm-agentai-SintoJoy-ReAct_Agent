import type { PRDAnalysis, ComponentNode, AgentLogEntry } from "@/types";
import { chatWithGroq, extractJsonFromResponse } from "@/lib/groq";
import { normalizeComponentNode } from "@/lib/normalize";
import { getContextForAgent, remember } from "@/memory/session-memory";
import {
  executeMaritimeWidgetSearch,
  MARITIME_WIDGET_CATALOG,
} from "@/tools/maritime-widget-catalog";
import { validateComponentTree } from "@/tools/component-validator";

const AGENT_NAME = "UI Architect";

const SYSTEM_PROMPT = `You are the UI Architect agent for BridgeView AI.

Your role:
1. Receive PRD analysis from the PRD Analyzer agent.
2. Design a hierarchical React component tree for a maritime dashboard.
3. Use the provided maritime widget catalog search results to pick standard patterns.
4. Each node needs: id, name, type, description, props, tailwindClasses, children.

Component types: layout, widget, container, chart, table, card, alert

Return ONLY a JSON block in this schema (no tool calls, no extra text):
\`\`\`json
{
  "id": "root",
  "name": "VesselMonitoringDashboard",
  "type": "layout",
  "description": "...",
  "props": {},
  "tailwindClasses": "min-h-screen bg-ocean-foam",
  "children": [...]
}
\`\`\`

Design for Tailwind CSS. Include maritime-specific widgets: voyage trackers, fuel gauges, crew panels, alert panels.`;

function prefetchWidgetCatalog(widgets: string[]): string {
  const queries = widgets.length > 0 ? widgets : ["voyage", "fuel", "alert", "crew", "engine"];
  const results = queries.map((query) => {
    const result = executeMaritimeWidgetSearch({ query });
    return `Query "${query}": ${result.matches.map((m) => m.name).join(", ") || "no matches"}`;
  });
  return results.join("\n");
}

export async function runUIArchitect(
  sessionId: string,
  analysis: PRDAnalysis,
  onLog?: (entry: AgentLogEntry) => void
): Promise<ComponentNode> {
  const log = (action: string, details?: string) => {
    onLog?.({ agent: AGENT_NAME, action, timestamp: new Date().toISOString(), details });
  };

  log("Started UI architecture", `Designing tree for: ${analysis.title}`);

  const priorContext = getContextForAgent(sessionId, AGENT_NAME);
  const catalogSummary = MARITIME_WIDGET_CATALOG.map((w) => `${w.name} (${w.category})`).join(", ");
  const widgetSearchResults = prefetchWidgetCatalog(analysis.widgets);

  log("Tool call: search_maritime_widgets", `Pre-fetched catalog for ${analysis.widgets.length} widgets`);
  remember(sessionId, "architect_widget_prefetch", widgetSearchResults, AGENT_NAME);

  const userMessage = `Design a component tree for this maritime dashboard:

Title: ${analysis.title}
Summary: ${analysis.summary}
Features: ${analysis.features.join(", ")}
Required widgets: ${analysis.widgets.join(", ")}
Data entities: ${analysis.dataEntities.join(", ")}
User roles: ${analysis.userRoles.join(", ")}
Constraints: ${analysis.constraints.join(", ")}

Available catalog widgets: ${catalogSummary}

Widget catalog search results:
${widgetSearchResults}

${priorContext ? `Memory context:\n${priorContext}` : ""}

Return the final JSON component tree only.`;

  let text: string;
  try {
    text = await chatWithGroq(SYSTEM_PROMPT, userMessage, { maxTokens: 4096 });
  } catch (error) {
    log("Model call failed", error instanceof Error ? error.message : "Unknown error");
    text = "";
  }

  let tree: ComponentNode;
  try {
    if (!text?.trim()) throw new Error("Empty response from model");
    tree = normalizeComponentNode(extractJsonFromResponse<Partial<ComponentNode>>(text));
    if (tree.children.length === 0) {
      tree = createFallbackTree(analysis);
      log("Fallback tree used", "Model returned empty component tree");
    }
  } catch {
    tree = createFallbackTree(analysis);
    log("Fallback tree used", "JSON parse failed, using template tree");
  }

  const validation = validateComponentTree(tree);
  remember(sessionId, "tree_validation", validation, AGENT_NAME);
  log("Tree validation (auto)", `valid=${validation.valid}, nodes=${validation.nodeCount}`);

  remember(sessionId, "component_tree", tree, AGENT_NAME);
  log("UI architecture complete", `Root: ${tree.name}, children: ${tree.children.length}`);

  return tree;
}

function createFallbackTree(analysis: PRDAnalysis): ComponentNode {
  const widgets = Array.isArray(analysis.widgets) ? analysis.widgets : [];
  const widgetNodes: ComponentNode[] = widgets.map((widget, i) => ({
    id: `widget-${i}`,
    name: widget,
    type: "widget" as const,
    description: `${widget} for ${analysis.title}`,
    props: { title: widget },
    tailwindClasses: "bg-white rounded-xl shadow-sm border border-maritime-100 p-4",
    children: [],
  }));

  return {
    id: "root",
    name: `${analysis.title.replace(/\s+/g, "")}Dashboard`,
    type: "layout",
    description: analysis.summary,
    props: { title: analysis.title },
    tailwindClasses: "min-h-screen bg-gradient-to-br from-ocean-foam to-maritime-50 p-6",
    children: [
      {
        id: "header",
        name: "DashboardHeader",
        type: "container",
        description: "Top navigation and vessel info",
        props: { vesselName: "MV BridgeView" },
        tailwindClasses: "flex items-center justify-between mb-6",
        children: [
          {
            id: "header-title",
            name: "HeaderTitle",
            type: "card",
            description: "Dashboard title",
            props: {},
            tailwindClasses: "text-2xl font-bold text-maritime-900",
            children: [],
          },
        ],
      },
      {
        id: "main-grid",
        name: "MainGrid",
        type: "layout",
        description: "Main widget grid",
        props: {},
        tailwindClasses: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
        children: widgetNodes,
      },
      {
        id: "alerts",
        name: "MaritimeAlertPanel",
        type: "alert",
        description: "Priority alerts panel",
        props: { maxAlerts: 5 },
        tailwindClasses: "mt-6 bg-white rounded-xl shadow-sm border-l-4 border-red-500 p-4",
        children: [],
      },
    ],
  };
}
