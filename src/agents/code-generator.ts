import type { ComponentNode, GeneratedComponent, AgentLogEntry } from "@/types";
import { chatWithGroq, extractJsonFromResponse } from "@/lib/groq";
import { normalizeGeneratedComponents } from "@/lib/normalize";
import { getContextForAgent, remember } from "@/memory/session-memory";

const AGENT_NAME = "Code Generator";

const SYSTEM_PROMPT = `You are the Code Generator agent for BridgeView AI.

Your role:
1. Receive a component tree from the UI Architect agent.
2. Generate production-ready React components with TypeScript and Tailwind CSS.
3. Create separate files for each major component plus a main Dashboard file.
4. Use functional components, proper TypeScript interfaces for props.
5. Include realistic mock maritime data (vessel names, coordinates, fuel levels, crew certs).

Return JSON array:
\`\`\`json
[
  {
    "filename": "VesselMonitoringDashboard.tsx",
    "code": "full component code as string"
  }
]
\`\`\`

Rules:
- Use Tailwind classes from the component tree
- Export default each component
- Main dashboard imports and composes child components
- Include mock data constants
- No external chart libraries — use Tailwind for visualizations
- Maritime color palette: maritime-*, ocean-*`;

export async function runCodeGenerator(
  sessionId: string,
  tree: ComponentNode,
  onLog?: (entry: AgentLogEntry) => void
): Promise<GeneratedComponent[]> {
  const log = (action: string, details?: string) => {
    onLog?.({ agent: AGENT_NAME, action, timestamp: new Date().toISOString(), details });
  };

  log("Started code generation", `Generating code for: ${tree.name}`);

  const context = getContextForAgent(sessionId, AGENT_NAME);

  const userMessage = `Generate production-ready React/TypeScript/Tailwind components for this tree:

\`\`\`json
${JSON.stringify(tree, null, 2)}
\`\`\`

${context ? `Memory context:\n${context}` : ""}

Generate complete, runnable component files. Include a main ${tree.name}.tsx that composes all children.`;

  const text = await chatWithGroq(SYSTEM_PROMPT, userMessage, { maxTokens: 8192 });

  let components: GeneratedComponent[];
  try {
    if (!text?.trim()) throw new Error("Empty response from model");
    components = normalizeGeneratedComponents(extractJsonFromResponse<unknown>(text));
    if (components.length === 0) throw new Error("No valid components in response");
  } catch {
    components = generateFallbackComponents(tree);
    log("Fallback code used", "JSON parse failed, using template components");
  }

  remember(sessionId, "generated_components", components, AGENT_NAME);
  log("Code generation complete", `Generated ${components.length} files`);

  return components;
}

function generateFallbackComponents(tree: ComponentNode): GeneratedComponent[] {
  const treeChildren = Array.isArray(tree.children) ? tree.children : [];
  const childImports = treeChildren
    .filter((c) => c.type !== "layout" || c.children.length > 0)
    .map((c) => `import ${c.name} from './${c.name}';`)
    .join("\n");

  const childRenders = treeChildren
    .map((c) => `      <${c.name} />`)
    .join("\n");

  const dashboard: GeneratedComponent = {
    filename: `${tree.name}.tsx`,
    code: `import React from 'react';
${childImports}

export default function ${tree.name}() {
  return (
    <div className="${tree.tailwindClasses}">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-maritime-900">{/* ${tree.props.title ?? tree.name} */}</h1>
        <p className="text-maritime-600 mt-1">Maritime Monitoring Dashboard</p>
      </header>
      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
${childRenders}
      </main>
    </div>
  );
}
`,
  };

  const childComponents = treeChildren.map((child) => generateChildComponent(child));
  return [dashboard, ...childComponents];
}

function generateChildComponent(node: ComponentNode): GeneratedComponent {
  const mockData = getMockDataForWidget(node.name);

  return {
    filename: `${node.name}.tsx`,
    code: `import React from 'react';

interface ${node.name}Props {
  className?: string;
}

export default function ${node.name}({ className = '' }: ${node.name}Props) {
  return (
    <div className={\`${node.tailwindClasses} \${className}\`}>
      <h3 className="text-lg font-semibold text-maritime-800 mb-3">${node.name.replace(/([A-Z])/g, " $1").trim()}</h3>
      ${mockData}
    </div>
  );
}
`,
  };
}

function getMockDataForWidget(name: string): string {
  if (name.includes("Voyage") || name.includes("Progress")) {
    return `<div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Singapore → Rotterdam</span>
          <span>ETA: 14 Jun 2026</span>
        </div>
        <div className="w-full bg-maritime-100 rounded-full h-3">
          <div className="bg-gradient-to-r from-maritime-500 to-maritime-400 h-3 rounded-full" style={{ width: '62%' }} />
        </div>
        <p className="text-xs text-gray-500">3,420 / 5,500 nm remaining</p>
      </div>`;
  }
  if (name.includes("Fuel")) {
    return `<div className="flex items-center gap-4">
        <div className="relative w-20 h-20">
          <svg className="w-20 h-20 -rotate-90" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e0f2fe" strokeWidth="3" />
            <circle cx="18" cy="18" r="15.9" fill="none" stroke="#0ea5e9" strokeWidth="3" strokeDasharray="75, 100" />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-maritime-700">75%</span>
        </div>
        <div>
          <p className="text-sm text-gray-600">HFO Tank 1</p>
          <p className="text-lg font-semibold">1,875 / 2,500 MT</p>
          <p className="text-xs text-amber-600">Consumption: 42 MT/day</p>
        </div>
      </div>`;
  }
  if (name.includes("Crew") || name.includes("Certification")) {
    return `<table className="w-full text-sm">
        <thead><tr className="text-left text-gray-500 border-b"><th className="pb-2">Crew</th><th className="pb-2">Cert</th><th className="pb-2">Status</th></tr></thead>
        <tbody>
          <tr className="border-b border-gray-100"><td className="py-2">Capt. Hansen</td><td>Master License</td><td><span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs">Valid</span></td></tr>
          <tr className="border-b border-gray-100"><td className="py-2">Eng. Patel</td><td>STCW III/2</td><td><span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full text-xs">Exp. 30d</span></td></tr>
          <tr><td className="py-2">Off. Kim</td><td>GMDSS</td><td><span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs">Valid</span></td></tr>
        </tbody>
      </table>`;
  }
  if (name.includes("Alert")) {
    return `<div className="space-y-2">
        <div className="flex items-start gap-2 p-2 bg-red-50 rounded-lg border-l-4 border-red-500">
          <span className="text-red-600 font-bold text-xs">CRITICAL</span>
          <p className="text-sm">Main engine oil pressure below threshold</p>
        </div>
        <div className="flex items-start gap-2 p-2 bg-amber-50 rounded-lg border-l-4 border-amber-500">
          <span className="text-amber-600 font-bold text-xs">WARNING</span>
          <p className="text-sm">Heavy weather advisory — Bay of Biscay</p>
        </div>
      </div>`;
  }
  if (name.includes("Position") || name.includes("Map")) {
    return `<div className="bg-ocean-deep text-white rounded-lg p-4 font-mono text-sm">
        <p>Lat: 48°22.5' N</p>
        <p>Lon: 004°51.2' W</p>
        <p className="mt-2 text-maritime-300">HDG: 285° | SOG: 14.2 kn</p>
      </div>`;
  }
  if (name.includes("Engine")) {
    return `<div className="grid grid-cols-3 gap-2 text-center">
        <div><p className="text-2xl font-bold text-maritime-700">82</p><p className="text-xs text-gray-500">RPM</p></div>
        <div><p className="text-2xl font-bold text-maritime-700">78°C</p><p className="text-xs text-gray-500">Temp</p></div>
        <div><p className="text-2xl font-bold text-maritime-700">4.2</p><p className="text-xs text-gray-500">Bar</p></div>
      </div>`;
  }
  if (name.includes("Weather")) {
    return `<div className="flex items-center gap-4">
        <span className="text-4xl">🌊</span>
        <div>
          <p className="text-2xl font-bold">NW 24 kn</p>
          <p className="text-sm text-gray-600">Wave: 3.5m | Sea State 5</p>
        </div>
      </div>`;
  }
  return `<p className="text-gray-500 text-sm">Widget content</p>`;
}
