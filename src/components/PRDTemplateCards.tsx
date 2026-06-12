"use client";

import { Anchor, Compass, Ship, Users } from "lucide-react";
import { PRD_TEMPLATES, type PRDTemplate } from "@/data/prd-templates";

const TEMPLATE_ICONS: Record<string, typeof Ship> = {
  "vessel-monitoring": Ship,
  "crew-welfare": Users,
  navigation: Compass,
};

interface PRDTemplateCardsProps {
  selectedId?: string;
  onSelect: (template: PRDTemplate) => void;
  disabled?: boolean;
  compact?: boolean;
}

export default function PRDTemplateCards({
  selectedId,
  onSelect,
  disabled,
  compact = false,
}: PRDTemplateCardsProps) {
  return (
    <div className="mb-3">
      <div className="flex items-center gap-2 mb-2">
        <Anchor className="w-3.5 h-3.5 text-maritime-600" />
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
          Sample PRD Templates
        </p>
      </div>
      <div className={`grid gap-2 ${compact ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-3"}`}>
        {PRD_TEMPLATES.map((template) => {
          const Icon = TEMPLATE_ICONS[template.id] ?? Ship;
          const isSelected = selectedId === template.id;

          return (
            <button
              key={template.id}
              type="button"
              onClick={() => onSelect(template)}
              disabled={disabled}
              className={`text-left p-3 rounded-xl border transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                isSelected
                  ? "border-maritime-500 bg-maritime-950/30 shadow-sm"
                  : "border-[var(--border)] bg-[var(--card-bg-muted)]/50 hover:border-maritime-400/50"
              }`}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <div
                  className={`p-1 rounded-md shrink-0 ${
                    isSelected ? "bg-maritime-600 text-white" : "bg-[var(--card-bg)] text-maritime-500 border border-[var(--border)]"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-semibold text-[var(--text-primary)]">{template.title}</span>
              </div>
              <p className="text-[10px] text-[var(--text-muted)] leading-relaxed mb-2 line-clamp-2">
                {template.description}
              </p>
              <span className="text-[9px] font-medium text-maritime-500">
                {template.widgets.length} components · Use template
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
