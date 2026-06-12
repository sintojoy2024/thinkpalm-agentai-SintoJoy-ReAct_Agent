"use client";

import { useEffect, useRef } from "react";
import { Activity, CheckCircle2, Loader2 } from "lucide-react";
import type { AgentLogEntry, PipelineStage } from "@/types";

interface AgentActivityLogProps {
  agentLog: AgentLogEntry[];
  stage: PipelineStage;
  compact?: boolean;
}

export default function AgentActivityLog({ agentLog, stage, compact = false }: AgentActivityLogProps) {
  const isRunning = stage !== "idle" && stage !== "complete" && stage !== "error";
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [agentLog.length]);

  return (
    <div className={compact ? "mt-4" : "panel p-4 w-full"}>
      <div className="flex items-center gap-2 mb-2">
        <Activity className="w-4 h-4 text-maritime-500" />
        <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
          Agent Activity Log
        </h3>
        {isRunning && (
          <span className="ml-auto flex items-center gap-1 text-[10px] text-accent-amber">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-amber animate-pulse" />
            Live
          </span>
        )}
      </div>

      {agentLog.length === 0 ? (
        <p className="text-xs text-[var(--text-muted)] italic py-4 text-center rounded-lg border border-dashed border-[var(--border)]">
          {isRunning ? "Waiting for agent events…" : "Activity streams here during generation"}
        </p>
      ) : (
        <div className="max-h-48 overflow-y-auto space-y-2 scrollbar-thin rounded-lg border border-[var(--border-subtle)] bg-[var(--card-bg-muted)]/50 p-2">
          {agentLog.map((entry, i) => {
            const isLatest = i === agentLog.length - 1;
            const isActive = isLatest && isRunning;
            return (
              <div key={`${entry.timestamp}-${i}`} className="flex gap-2 text-xs leading-snug">
                <span className="shrink-0 mt-0.5">
                  {isActive ? (
                    <Loader2 className="w-3.5 h-3.5 text-maritime-400 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-3.5 h-3.5 text-accent-success/70" />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex gap-2 flex-wrap">
                    <span className="text-[10px] text-[var(--text-muted)] font-mono">
                      {new Date(entry.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                    <span className="text-[10px] font-semibold text-maritime-600 dark:text-maritime-400">
                      {entry.agent}
                    </span>
                  </div>
                  <p className={`text-[var(--text-secondary)] ${isActive ? "text-maritime-300" : ""}`}>
                    {entry.action}
                  </p>
                </div>
              </div>
            );
          })}
          <div ref={logEndRef} />
        </div>
      )}
    </div>
  );
}
