"use client";

import { useEffect, useState } from "react";
import { Eye, GitBranch, Code, Loader2, Sparkles, ChevronRight } from "lucide-react";
import Logo from "@/components/Logo";
import PRDInput, { getGenerateLabel } from "@/components/PRDInput";
import AgentPipeline from "@/components/AgentPipeline";
import AgentActivityLog from "@/components/AgentActivityLog";
import ComponentTree from "@/components/ComponentTree";
import LivePreview from "@/components/LivePreview";
import CodeExport from "@/components/CodeExport";
import ExportActions from "@/components/ExportActions";
import ThemeToggle from "@/components/ThemeToggle";
import StatusBar from "@/components/StatusBar";
import PipelineColumn from "@/components/PipelineColumn";
import OnboardingWalkthrough, { restartOnboarding } from "@/components/OnboardingWalkthrough";
import TourButton from "@/components/TourButton";
import { ONBOARDING_STORAGE_KEY } from "@/data/onboarding-steps";
import type { AgentLogEntry, PipelineResult, PipelineStage } from "@/types";
import { PRD_TEMPLATES, type PRDTemplate } from "@/data/prd-templates";
import { runPipelineStream } from "@/lib/pipeline-client";

type Tab = "preview" | "tree" | "code";

export default function Home() {
  const [prdText, setPrdText] = useState("");
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | undefined>();
  const [stage, setStage] = useState<PipelineStage>("idle");
  const [result, setResult] = useState<PipelineResult | null>(null);
  const [agentLog, setAgentLog] = useState<AgentLogEntry[]>([]);
  const [progressMessage, setProgressMessage] = useState("");
  const [pipelineStartedAt, setPipelineStartedAt] = useState<number | null>(null);
  const [stageStartedAt, setStageStartedAt] = useState<Partial<Record<PipelineStage, number>>>({});
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("preview");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [showTour, setShowTour] = useState(false);

  useEffect(() => {
    setSessionId(crypto.randomUUID());
    const completed = localStorage.getItem(ONBOARDING_STORAGE_KEY);
    if (!completed) {
      const t = setTimeout(() => setShowTour(true), 800);
      return () => clearTimeout(t);
    }
  }, []);

  const startTour = () => {
    restartOnboarding();
    setShowTour(true);
  };

  const isLoading = stage !== "idle" && stage !== "complete" && stage !== "error";

  const loadTemplate = (template: PRDTemplate) => {
    setPrdText(template.content);
    setSelectedTemplateId(template.id);
    setActiveTab("preview");
  };

  const loadDefaultSample = () => {
    loadTemplate(PRD_TEMPLATES[0]);
  };

  const handleGenerate = async () => {
    setError(null);
    setResult(null);
    setAgentLog([]);
    setProgressMessage("PRD Analyzer agent is reading your maritime requirements...");
    const started = Date.now();
    setPipelineStartedAt(started);
    setStageStartedAt({ analyzing: started });
    setStage("analyzing");

    try {
      const data = await runPipelineStream(prdText, {
        onProgress: (nextStage, message) => {
          setStage(nextStage);
          setProgressMessage(message);
          setStageStartedAt((prev) => ({ ...prev, [nextStage]: Date.now() }));
        },
        onLog: (entry) => {
          setAgentLog((prev) => [...prev, entry]);
        },
      });

      setResult(data);
      setSessionId(data.sessionId);
      setAgentLog(data.agentLog);
      setStage("complete");
      setProgressMessage("Pipeline complete! Your maritime UI is ready.");
      setActiveTab("preview");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
      setStage("error");
    }
  };

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "preview", label: "Preview", icon: <Eye className="w-3.5 h-3.5" /> },
    { id: "tree", label: "Components", icon: <GitBranch className="w-3.5 h-3.5" /> },
    { id: "code", label: "React Code", icon: <Code className="w-3.5 h-3.5" /> },
  ];

  const generateFooter = (
    <div className="p-4" data-tour="generate-btn">
      <button
        onClick={handleGenerate}
        disabled={isLoading || prdText.trim().length < 50}
        className="flex flex-col items-center justify-center gap-1 w-full px-4 py-3.5 btn-brand rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[var(--shadow-md)]"
      >
        <span className="flex items-center gap-2">
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          {getGenerateLabel(stage)}
        </span>
        {!isLoading && (
          <span className="text-[10px] font-normal opacity-80">Our agents will analyze and build your UI</span>
        )}
      </button>
    </div>
  );

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-[var(--background)]">
      <header className="shrink-0 border-b border-[var(--border)] bg-[var(--status-bar-bg)] backdrop-blur-sm z-20">
        <div className="px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Logo size={36} className="shadow-sm shadow-maritime-900/20 rounded-lg shrink-0" />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 text-[10px] text-[var(--text-muted)] mb-0.5">
                <span className="font-medium text-[var(--brand)]">BridgeView AI</span>
                <ChevronRight className="w-3 h-3" />
                <span>Dashboard Generator</span>
              </div>
              <h1 className="text-sm sm:text-base font-display font-bold text-[var(--text-primary)] truncate">
                Maritime PRD → React UI Agent Pipeline
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <TourButton onStart={startTour} />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-[minmax(240px,25%)_minmax(280px,35%)_1fr] divide-y lg:divide-y-0 lg:divide-x divide-[var(--border)]">
        {/* Column 1 — INPUT */}
        <PipelineColumn
          number="1"
          title="Input"
          subtitle="Requirements & templates"
          className="lg:max-h-full"
          bodyClassName="p-4"
          footer={generateFooter}
        >
          <div data-tour="prd-input">
            <PRDInput
            value={prdText}
            onChange={(text) => {
              setPrdText(text);
              if (selectedTemplateId) {
                const match = PRD_TEMPLATES.find((t) => t.id === selectedTemplateId);
                if (match && text !== match.content) setSelectedTemplateId(undefined);
              }
            }}
            onGenerate={handleGenerate}
            isLoading={isLoading}
            stage={stage}
            selectedTemplateId={selectedTemplateId}
            onSelectTemplate={loadTemplate}
            compact
            hideGenerateButton
          />
          </div>
        </PipelineColumn>

        {/* Column 2 — AGENTS */}
        <PipelineColumn
          number="2"
          title="Agents"
          subtitle="Orchestration & activity"
          bodyClassName="p-4"
        >
          <div data-tour="agents">
          <AgentPipeline
            stage={stage}
            progressMessage={progressMessage}
            pipelineStartedAt={pipelineStartedAt}
            stageStartedAt={stageStartedAt}
            compact
          />
          <AgentActivityLog agentLog={agentLog} stage={stage} compact />
          {error && (
            <div className="mt-3 bg-accent-amber/10 border border-accent-amber/30 text-amber-700 dark:text-accent-amber px-3 py-2 rounded-lg text-xs">
              {error}
            </div>
          )}
          </div>
        </PipelineColumn>

        {/* Column 3 — OUTPUT */}
        <div className="flex flex-col min-h-0 min-w-0 column-surface">
          <div className="shrink-0 px-4 py-3 border-b border-[var(--border)] bg-[var(--background)]">
            <div className="flex items-center gap-2 mb-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-md bg-[var(--brand-muted)] text-[var(--brand)] text-xs font-bold">
                3
              </span>
              <div>
                <h2 className="text-xs font-bold uppercase tracking-widest text-[var(--text-primary)]">Output</h2>
                <p className="text-[10px] text-[var(--text-muted)]">Deliverables & export</p>
              </div>
            </div>
            <div className="flex border-b border-[var(--border)]" data-tour="output-tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-medium transition-colors border-b-2 -mb-px ${
                    activeTab === tab.id
                      ? "text-[var(--brand)] border-[var(--brand)] bg-[var(--background)]"
                      : "text-[var(--text-muted)] border-transparent hover:text-[var(--text-primary)]"
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto scrollbar-thin p-4">
            {activeTab === "preview" && (
              <LivePreview
                previewHtml={result?.previewHtml ?? null}
                componentTree={result?.componentTree ?? null}
                title={result?.analysis?.title}
                onLoadSample={loadDefaultSample}
              />
            )}
            {activeTab === "tree" && (
              <ComponentTree tree={result?.componentTree ?? null} onLoadSample={loadDefaultSample} />
            )}
            {activeTab === "code" && (
              <CodeExport components={result?.components ?? null} onLoadSample={loadDefaultSample} />
            )}
          </div>

          <ExportActions
            components={result?.components ?? null}
            projectName={result?.analysis?.title ?? "Maritime Dashboard"}
            previewHtml={result?.previewHtml ?? null}
            componentTree={result?.componentTree ?? null}
            analysis={result?.analysis ?? null}
            disabled={!result?.components?.length}
          />
        </div>
      </main>

      <StatusBar sessionId={sessionId} stage={stage} />

      <OnboardingWalkthrough open={showTour} onClose={() => setShowTour(false)} />
    </div>
  );
}
