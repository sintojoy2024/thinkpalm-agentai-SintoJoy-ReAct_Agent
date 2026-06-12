import type { ComponentNode, PRDAnalysis } from "@/types";

export interface FigmaHandoffPayload {
  project: string;
  exportedAt: string;
  source: "BridgeView AI";
  analysis?: PRDAnalysis;
  componentTree?: ComponentNode;
  designTokens: {
    colors: Record<string, string>;
    typography: { display: string; body: string; mono: string };
  };
}

export function buildFigmaHandoffJson(
  projectName: string,
  componentTree?: ComponentNode | null,
  analysis?: PRDAnalysis | null
): string {
  const payload: FigmaHandoffPayload = {
    project: projectName,
    exportedAt: new Date().toISOString(),
    source: "BridgeView AI",
    analysis: analysis ?? undefined,
    componentTree: componentTree ?? undefined,
    designTokens: {
      colors: {
        maritime600: "#0284c7",
        maritime950: "#082f49",
        success: "#22c55e",
        warning: "#f59e0b",
        critical: "#ef4444",
        panel: "#1e293b",
        background: "#0f172a",
      },
      typography: {
        display: "DM Sans",
        body: "Inter",
        mono: "JetBrains Mono",
      },
    },
  };

  return JSON.stringify(payload, null, 2);
}

export function downloadFigmaHandoff(
  projectName: string,
  componentTree?: ComponentNode | null,
  analysis?: PRDAnalysis | null
): void {
  const json = buildFigmaHandoffJson(projectName, componentTree, analysis);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const slug = projectName.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "maritime-dashboard";
  const link = document.createElement("a");
  link.href = url;
  link.download = `${slug}-figma-handoff.json`;
  link.click();
  URL.revokeObjectURL(url);
}
