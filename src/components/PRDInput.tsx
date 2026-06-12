"use client";

import { FileText, Loader2, Sparkles } from "lucide-react";
import PRDTemplateCards from "@/components/PRDTemplateCards";
import type { PRDTemplate } from "@/data/prd-templates";
import type { PipelineStage } from "@/types";

const MAX_CHARS = 5000;

function getGenerateLabel(stage: PipelineStage): string {
  switch (stage) {
    case "analyzing":
      return "Analyzing PRD…";
    case "architecting":
      return "Designing UI…";
    case "generating":
      return "Generating code…";
    default:
      return "Generate Dashboard UI";
  }
}

interface PRDInputProps {
  value: string;
  onChange: (value: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
  stage: PipelineStage;
  selectedTemplateId?: string;
  onSelectTemplate: (template: PRDTemplate) => void;
  compact?: boolean;
  hideGenerateButton?: boolean;
}

export default function PRDInput({
  value,
  onChange,
  onGenerate,
  isLoading,
  stage,
  selectedTemplateId,
  onSelectTemplate,
  compact = false,
  hideGenerateButton = false,
}: PRDInputProps) {
  const isEmpty = value.trim().length === 0;

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-3">
        <FileText className="w-4 h-4 text-maritime-600" />
        <h2 className="text-sm font-display font-semibold text-[var(--text-primary)]">Maritime PRD Input</h2>
      </div>

      <PRDTemplateCards
        selectedId={selectedTemplateId}
        onSelect={onSelectTemplate}
        disabled={isLoading}
        compact={compact}
      />

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, MAX_CHARS))}
        disabled={isLoading}
        placeholder="Paste your maritime product requirements document here..."
        className="flex-1 w-full p-3 border border-[var(--border)] rounded-xl resize-none focus:ring-2 focus:ring-maritime-500 focus:border-transparent disabled:opacity-60 font-mono text-xs leading-relaxed min-h-[120px] bg-[var(--input-bg)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
        rows={compact ? 8 : 12}
      />

      <div className="flex items-center justify-end mt-2">
        <span className="text-[10px] text-[var(--text-muted)] font-mono">
          {value.length.toLocaleString()} / {MAX_CHARS.toLocaleString()}
          {isEmpty && !compact && " · Select a template or paste your PRD"}
        </span>
      </div>

      {!hideGenerateButton && (
        <button
          onClick={onGenerate}
          disabled={isLoading || value.trim().length < 50}
          className="mt-3 flex items-center justify-center gap-2 w-full px-4 py-3 bg-gradient-to-r from-maritime-600 to-maritime-500 text-white rounded-xl font-semibold hover:from-maritime-700 hover:to-maritime-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-maritime-900/20"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
          {getGenerateLabel(stage)}
        </button>
      )}
    </div>
  );
}

export { getGenerateLabel, MAX_CHARS };
