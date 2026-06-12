export interface OnboardingStep {
  id: string;
  target: string;
  title: string;
  description: string;
  placement: "top" | "bottom" | "left" | "right" | "center";
}

export const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: "prd-input",
    target: "[data-tour='prd-input']",
    title: "1 · Paste or pick a PRD",
    description:
      "Start here. Choose a sample maritime template (Vessel Monitoring, Crew Welfare, or Navigation) or paste your own product requirements into the text area.",
    placement: "right",
  },
  {
    id: "generate",
    target: "[data-tour='generate-btn']",
    title: "2 · Generate Dashboard UI",
    description:
      "When your PRD is ready (at least 50 characters), click this button. Three AI agents will analyze, architect, and code your maritime dashboard.",
    placement: "right",
  },
  {
    id: "agents",
    target: "[data-tour='agents']",
    title: "3 · Watch the agent pipeline",
    description:
      "Follow progress in real time: PRD Analyzer → UI Architect → Code Generator. Status badges, progress bars, and the live activity log show what each agent is doing.",
    placement: "bottom",
  },
  {
    id: "output-tabs",
    target: "[data-tour='output-tabs']",
    title: "4 · Review deliverables",
    description:
      "Switch between Preview (live dashboard), Components (widget tree), and React Code (production TypeScript + Tailwind files).",
    placement: "left",
  },
  {
    id: "export",
    target: "[data-tour='export-actions']",
    title: "5 · Export your project",
    description:
      "Download the full ZIP, open React in StackBlitz, export a Figma handoff file, or push to GitHub Gist — all from here after generation completes.",
    placement: "top",
  },
];

export const ONBOARDING_STORAGE_KEY = "bridgeview-onboarding-complete";
