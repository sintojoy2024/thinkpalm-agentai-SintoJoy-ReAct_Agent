# BridgeView AI

**Maritime PRD → Production React UI** — An end-to-end agentic pipeline for ThinkPalm engineers.

Paste a maritime product requirements document (vessel monitoring, crew welfare, navigation specs) and three collaborating AI agents generate a complete UI component tree, a polished live dashboard preview, and exportable production-ready React + Tailwind code.

![BridgeView AI](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=flat-square&logo=typescript)
![Groq](https://img.shields.io/badge/Groq-Llama%203.3%2070B-orange?style=flat-square)

## Features

- **3-agent pipeline** — PRD Analyzer → UI Architect → Code Generator with session memory handoffs
- **Streaming orchestration** — Real-time progress, per-agent timing, and activity log (NDJSON stream)
- **Sample PRD templates** — Vessel Monitoring, Crew Welfare, and Navigation specs built in
- **Live Preview** — Dark-mode maritime dashboard (sidebar, KPI cards, map, alerts, charts) rendered in-browser
- **Deliverables** — Component tree, analysis summary, and **Production Code** export
- **Export** — Download full project ZIP, open in StackBlitz (preview mode), or push to GitHub Gist
- **Professional UI** — Dark/light mode, maritime design system, compact status bar (`Groq · 3 agents · Session #…`)

## Agent Pipeline Architecture

```
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐
│ PRD Analyzer│ ──▶ │ UI Architect │ ──▶ │ Code Generator  │
│  (Agent 1)  │     │   (Agent 2)  │     │    (Agent 3)    │
└──────┬──────┘     └──────┬───────┘     └────────┬────────┘
       │                   │                       │
       ▼                   ▼                       ▼
  Session Memory ◀──────────────────────────────────┘
       │
       ▼
  Tools: Widget Catalog · Component Validator · Preview Builder · StackBlitz · GitHub
```

| Requirement | Implementation |
|---|---|
| **Memory** | Short-term session memory (`src/memory/session-memory.ts`) stores PRD text, agent outputs, and tool results. Long-term persistence across sessions. |
| **Tool Calling** | Maritime widget catalog and component validation run in code for reliability. StackBlitz + GitHub export for deliverables. |
| **2+ Agents** | Three agents with structured handoffs via session memory and streaming progress events. |
| **UI** | Next.js app with sectioned workflow: Requirements → Agent orchestration → Deliverables. |

## Application Workflow

The main page is organized into three sections:

1. **Requirements** — Paste a PRD or pick a sample template, then click **Generate UI**
2. **Agent orchestration** — Pipeline status cards and streaming activity log (page auto-scrolls here on generate)
3. **Deliverables** — Analysis summary, Live Preview, Component Tree, and Production Code (auto-scrolls here when complete)

### Live Preview

The iframe preview renders a full **dark maritime operations dashboard** — navigation sidebar, voyage/fuel/crew/engine KPIs, alert panel, vessel position map, weather, fuel trend chart, and quick actions. Preview HTML is built by `src/tools/preview-builder.ts` and matches the StackBlitz `index.html` export.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS, CSS variables for light/dark themes |
| Typography | DM Sans (headings), Inter (body), JetBrains Mono (code) |
| LLM | Groq API — `llama-3.3-70b-versatile` |
| Export | StackBlitz SDK, GitHub Gist API |
| Icons | Lucide React |

## Quick Start

### Prerequisites

- Node.js 18+
- Groq API key — [console.groq.com/keys](https://console.groq.com/keys)

### Setup

```bash
git clone https://github.com/sintojoy2024/thinkpalm-agentai-SintoJoy-ReAct_Agent
cd bridgeview-ai

npm install

cp .env.example .env.local
# Add your GROQ_API_KEY to .env.local

npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Optional: GitHub Export

Add `GITHUB_TOKEN` to `.env.local` to export generated components as a public GitHub Gist.

### Production build

```bash
npm run build
npm start
```

## Usage

1. **Choose a template or paste a PRD** — Vessel Monitoring, Crew Welfare, or Navigation samples are one click away.
2. **Click Generate UI** — The page scrolls to Agent orchestration while agents run:
   - **PRD Analyzer** — Extracts requirements and maps maritime widgets
   - **UI Architect** — Designs and validates the component tree
   - **Code Generator** — Writes TypeScript React components with Tailwind
3. **Review deliverables** — After completion, the page scrolls to:
   - **Live Preview** — Interactive dark maritime dashboard
   - **Component Tree** — Widget hierarchy from the UI Architect
   - **Production Code** — Copy, download ZIP, open in StackBlitz, or export to GitHub

## Sample PRDs

Built-in templates live in `src/data/prd-templates.ts`. A reference markdown spec is also included:

```
sample-prds/vessel-monitoring-dashboard.md
```

Templates cover voyage tracking, fuel gauges, engine monitoring, crew certification, alerts, vessel position, and weather widgets.

## Project Structure

```
src/
├── agents/
│   ├── orchestrator.ts         # Multi-agent pipeline coordinator
│   ├── prd-analyzer.ts         # Agent 1: PRD parsing
│   ├── ui-architect.ts         # Agent 2: Component tree design
│   └── code-generator.ts       # Agent 3: React code generation
├── memory/
│   └── session-memory.ts       # Short + long-term agent memory
├── tools/
│   ├── maritime-widget-catalog.ts  # Maritime widget lookup
│   ├── component-validator.ts      # Component tree validation
│   ├── preview-builder.ts          # Live Preview HTML dashboard
│   ├── stackblitz-export.ts        # StackBlitz project builder
│   ├── zip-export.ts               # Full project ZIP download
│   └── github-export.ts            # GitHub Gist export
├── components/
│   ├── AgentPipeline.tsx       # Pipeline status cards
│   ├── AgentActivityLog.tsx    # Streaming agent log
│   ├── LivePreview.tsx         # Iframe preview + viewport controls
│   ├── PRDInput.tsx            # PRD textarea + generate button
│   ├── CodeExport.tsx          # Production code export
│   └── …                       # Hero, templates, theme, status bar, etc.
├── lib/
│   ├── groq.ts                 # Groq API client
│   └── pipeline-client.ts      # Streaming pipeline client (NDJSON)
├── app/
│   ├── page.tsx                # Main application
│   ├── layout.tsx              # Fonts, theme provider
│   └── api/
│       ├── pipeline/route.ts   # Streaming agent pipeline
│       └── export/             # StackBlitz + GitHub routes
└── data/
    ├── prd-templates.ts        # Sample PRD templates
    └── sample-prd.ts           # Default vessel monitoring PRD
```

## API Endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/api/pipeline` | POST | Run the full agent pipeline; streams NDJSON progress, log, and complete events |
| `/api/export/stackblitz` | POST | Build a StackBlitz project from generated components |
| `/api/export/github` | POST | Export components to a GitHub Gist |

### Pipeline stream events

```json
{ "type": "progress", "stage": "analyzing", "message": "…" }
{ "type": "log", "entry": { "agent": "PRD Analyzer", "action": "…", "timestamp": "…" } }
{ "type": "complete", "result": { "sessionId", "analysis", "componentTree", "components", "previewHtml", "agentLog" } }
{ "type": "error", "message": "…" }
```

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `GROQ_API_KEY` | Yes | Groq API key for the agent pipeline |
| `GITHUB_TOKEN` | No | GitHub personal access token for Gist export |

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm start` | Serve production build |
| `npm run lint` | Run ESLint |

## License

MIT
