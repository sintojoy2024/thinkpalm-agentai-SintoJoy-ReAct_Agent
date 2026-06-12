export interface MaritimeWidget {
  id: string;
  name: string;
  category: "navigation" | "monitoring" | "crew" | "alerts" | "fuel" | "voyage" | "general";
  description: string;
  suggestedProps: string[];
  tailwindPatterns: string[];
}

export interface PRDAnalysis {
  title: string;
  summary: string;
  features: string[];
  widgets: string[];
  dataEntities: string[];
  userRoles: string[];
  constraints: string[];
}

export interface ComponentNode {
  id: string;
  name: string;
  type: "layout" | "widget" | "container" | "chart" | "table" | "card" | "alert";
  description: string;
  props: Record<string, string | number | boolean>;
  tailwindClasses: string;
  children: ComponentNode[];
}

export interface GeneratedComponent {
  filename: string;
  code: string;
}

export interface PipelineResult {
  sessionId: string;
  analysis: PRDAnalysis;
  componentTree: ComponentNode;
  components: GeneratedComponent[];
  previewHtml: string;
  agentLog: AgentLogEntry[];
}

export interface AgentLogEntry {
  agent: string;
  action: string;
  timestamp: string;
  details?: string;
}

export interface MemoryEntry {
  key: string;
  value: unknown;
  timestamp: string;
  agent?: string;
}

export interface SessionMemory {
  sessionId: string;
  prdText: string;
  entries: MemoryEntry[];
  analysis?: PRDAnalysis;
  componentTree?: ComponentNode;
  components?: GeneratedComponent[];
  createdAt: string;
  updatedAt: string;
}

export type PipelineStage = "idle" | "analyzing" | "architecting" | "generating" | "complete" | "error";

export type PipelineStreamEvent =
  | { type: "progress"; stage: PipelineStage; message: string }
  | { type: "log"; entry: AgentLogEntry }
  | { type: "complete"; result: PipelineResult }
  | { type: "error"; message: string };

export interface PipelineProgress {
  stage: PipelineStage;
  message: string;
  agentLog: AgentLogEntry[];
}
