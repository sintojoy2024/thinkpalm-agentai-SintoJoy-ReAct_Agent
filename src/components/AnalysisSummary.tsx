"use client";

import { Anchor } from "lucide-react";
import type { PRDAnalysis } from "@/types";

interface AnalysisSummaryProps {
  analysis: PRDAnalysis | null;
}

export default function AnalysisSummary({ analysis }: AnalysisSummaryProps) {
  if (!analysis) return null;

  return (
    <div className="panel p-4">
      <div className="flex items-center gap-2 mb-3">
        <Anchor className="w-5 h-5 text-maritime-600" />
        <h3 className="font-display font-semibold text-[var(--text-primary)]">{analysis.title}</h3>
      </div>
      <p className="text-sm text-[var(--text-secondary)] mb-3">{analysis.summary}</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        <div>
          <p className="font-medium text-[var(--text-muted)] mb-1">Widgets</p>
          <div className="flex flex-wrap gap-1">
            {(analysis.widgets ?? []).map((w) => (
              <span key={w} className="bg-maritime-50 dark:bg-maritime-950/50 text-maritime-700 dark:text-maritime-300 px-2 py-0.5 rounded-full">{w}</span>
            ))}
          </div>
        </div>
        <div>
          <p className="font-medium text-[var(--text-muted)] mb-1">Features</p>
          <ul className="text-[var(--text-secondary)] space-y-0.5">
            {(analysis.features ?? []).slice(0, 4).map((f) => (
              <li key={f}>• {f}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-medium text-[var(--text-muted)] mb-1">User Roles</p>
          <div className="flex flex-wrap gap-1">
            {(analysis.userRoles ?? []).map((r) => (
              <span key={r} className="bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded-full">{r}</span>
            ))}
          </div>
        </div>
        <div>
          <p className="font-medium text-[var(--text-muted)] mb-1">Data Entities</p>
          <div className="flex flex-wrap gap-1">
            {(analysis.dataEntities ?? []).map((e) => (
              <span key={e} className="bg-[var(--card-bg-muted)] text-[var(--text-secondary)] px-2 py-0.5 rounded-full">{e}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
