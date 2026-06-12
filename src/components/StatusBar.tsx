"use client";

import { Bot, Cpu } from "lucide-react";

interface StatusBarProps {
  sessionId?: string | null;
  stage?: string;
}

export default function StatusBar({ sessionId, stage }: StatusBarProps) {
  const shortSession = sessionId ? sessionId.slice(0, 8) : "—";
  const isLive = stage && stage !== "idle" && stage !== "complete" && stage !== "error";

  return (
    <footer className="sticky bottom-0 z-10 border-t border-[var(--border)] bg-[var(--status-bar-bg)] backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 py-2 flex items-center justify-between gap-4 text-[11px] font-mono text-[var(--text-muted)]">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="flex items-center gap-1.5">
            <Cpu className="w-3 h-3 text-[var(--brand)]" />
            Groq
          </span>
          <span className="text-[var(--border)]">·</span>
          <span className="flex items-center gap-1.5">
            <Bot className="w-3 h-3 text-[var(--brand)]" />
            3 agents
          </span>
          <span className="text-[var(--border)]">·</span>
          <span>
            Session <span className="text-[var(--brand)]">#{shortSession}</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          {isLive && (
            <span className="flex items-center gap-1.5 text-accent-amber">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-amber animate-pulse" />
              Running
            </span>
          )}
          {stage === "complete" && (
            <span className="flex items-center gap-1.5 text-[var(--success-text)] font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)]" />
              Ready
            </span>
          )}
          <span className="hidden sm:inline text-[var(--text-muted)]">BridgeView AI</span>
        </div>
      </div>
    </footer>
  );
}
