"use client";

import { Fragment, useEffect, useState } from "react";
import { Search, Layout, Code2, CheckCircle2, Loader2, Circle } from "lucide-react";
import type { PipelineStage } from "@/types";

const AGENTS = [
  {
    name: "PRD Analyzer",
    icon: Search,
    stage: "analyzing" as PipelineStage,
    description: "Extracts requirements and maps key features from your PRD.",
  },
  {
    name: "UI Architect",
    icon: Layout,
    stage: "architecting" as PipelineStage,
    description: "Designs component tree and information architecture.",
  },
  {
    name: "Code Generator",
    icon: Code2,
    stage: "generating" as PipelineStage,
    description: "Generates production-ready React + Tailwind code.",
  },
];

const STAGE_ORDER: PipelineStage[] = ["idle", "analyzing", "architecting", "generating", "complete"];

function getStageIndex(stage: PipelineStage): number {
  return STAGE_ORDER.indexOf(stage);
}

function formatElapsed(ms: number): string {
  const seconds = Math.max(0, Math.floor(ms / 1000));
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  return `${minutes}m ${seconds % 60}s`;
}

function formatTime(ts?: number): string | null {
  if (!ts) return null;
  return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function useNowTicker(active: boolean): number {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [active]);
  return now;
}

function getAgentProgress(stage: PipelineStage, agentStage: PipelineStage): number {
  const idx = getStageIndex(stage);
  const agentIdx = getStageIndex(agentStage);
  if (stage === "complete") return 100;
  if (idx > agentIdx) return 100;
  if (stage !== agentStage) return 0;
  if (agentStage === "analyzing") return 85;
  if (agentStage === "architecting") return 80;
  if (agentStage === "generating") return 75;
  return 0;
}

type AgentStatus = "completed" | "running" | "waiting";

function getAgentStatus(stage: PipelineStage, agentStage: PipelineStage): AgentStatus {
  const idx = getStageIndex(stage);
  const agentIdx = getStageIndex(agentStage);
  if (stage === "complete" || idx > agentIdx) return "completed";
  if (stage === agentStage) return "running";
  return "waiting";
}

interface AgentPipelineProps {
  stage: PipelineStage;
  progressMessage?: string;
  pipelineStartedAt?: number | null;
  stageStartedAt?: Partial<Record<PipelineStage, number>>;
  compact?: boolean;
}

export default function AgentPipeline({
  stage,
  progressMessage,
  stageStartedAt = {},
  compact = false,
}: AgentPipelineProps) {
  const isRunning = stage !== "idle" && stage !== "complete" && stage !== "error";
  useNowTicker(isRunning);

  const statusBadge = (status: AgentStatus) => {
    if (status === "completed")
      return <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full badge-success">Completed</span>;
    if (status === "running")
      return <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full badge-progress">In Progress</span>;
    return <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full badge-waiting">Waiting</span>;
  };

  return (
    <div className={compact ? "space-y-0" : "panel p-4 w-full"}>
      {!compact && isRunning && progressMessage && (
        <p className="text-xs text-maritime-600 dark:text-maritime-300 mb-3 flex items-center gap-2">
          <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
          {progressMessage}
        </p>
      )}

      <div className="flex flex-col">
        {AGENTS.map((agent, i) => {
          const status = getAgentStatus(stage, agent.stage);
          const progress = getAgentProgress(stage, agent.stage);
          const Icon = agent.icon;
          const startedAt = stageStartedAt[agent.stage];
          const timeLabel = formatTime(startedAt);

          return (
            <Fragment key={agent.name}>
              {i > 0 && (
                <div className="flex h-3" aria-hidden>
                  <div className="w-10 shrink-0 flex justify-center">
                    <div
                      className={`w-0.5 h-full transition-colors duration-300 ${
                        status !== "waiting" ? "bg-[var(--brand)]" : "bg-[var(--border)]"
                      }`}
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-3 items-center">
                <div className="w-10 shrink-0 flex justify-center">
                  <div
                    className={`relative z-10 shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ring-4 ring-[var(--column-bg)] ${
                      status === "completed"
                        ? "bg-[var(--success-bg)] text-[var(--success-text)]"
                        : status === "running"
                          ? "bg-[var(--progress-bg)] text-[var(--brand)]"
                          : "bg-[var(--card-bg-muted)] text-[var(--text-muted)]"
                    }`}
                  >
                    {status === "completed" ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : status === "running" ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </div>
                </div>

                <div
                  className={`flex-1 min-w-0 p-3 rounded-xl border transition-all shadow-[var(--shadow-sm)] ${
                  status === "running"
                    ? "border-[var(--progress-border)] bg-[var(--card-bg)] ring-1 ring-[var(--brand-light)]"
                    : status === "completed"
                      ? "border-[var(--success-border)] bg-[var(--card-bg)]"
                      : "border-[var(--border)] bg-[var(--card-bg)]"
                }`}
              >
                <div className="flex items-center justify-between gap-2 flex-wrap mb-1">
                  <div className="flex items-center gap-2 min-w-0">
                    <Icon className="w-4 h-4 text-[var(--text-muted)] shrink-0" />
                    <span className="text-sm font-semibold text-[var(--text-primary)]">{agent.name}</span>
                  </div>
                  {statusBadge(status)}
                </div>
                {timeLabel && (
                  <p className="text-[10px] text-[var(--text-muted)] mb-1.5">{timeLabel}</p>
                )}
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">{agent.description}</p>
                {status === "running" && (
                  <div className="mt-3">
                    <div className="flex justify-between text-[10px] text-[var(--text-muted)] mb-1">
                      <span>Progress</span>
                      <span className="font-mono">{progress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-[var(--card-bg-muted)] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[var(--brand)] rounded-full transition-all duration-700"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                )}
                </div>
              </div>
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}
