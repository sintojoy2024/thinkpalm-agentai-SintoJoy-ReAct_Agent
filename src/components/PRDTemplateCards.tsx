"use client";

import { Anchor, Compass, Ship, Users } from "lucide-react";
import { PRD_TEMPLATES, type PRDTemplate } from "@/data/prd-templates";

const TEMPLATE_ICONS: Record<string, typeof Ship> = {
  "vessel-monitoring": Ship,
  "crew-welfare": Users,
  navigation: Compass,
};

const TEMPLATE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  "vessel-monitoring": { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-100" },
  "crew-welfare": { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-100" },
  navigation: { bg: "bg-violet-50", text: "text-violet-600", border: "border-violet-100" },
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
        <Anchor className="w-3.5 h-3.5 text-[var(--brand)]" />
        <p className="text-[10.8px] font-semibold text-[var(--text-secondary)]">
          Sample PRD Templates or Paste Your Requirements
        </p>
      </div>
      <div className={`grid gap-2 ${compact ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-3"}`}>
        {PRD_TEMPLATES.map((template) => {
          const Icon = TEMPLATE_ICONS[template.id] ?? Ship;
          const colors = TEMPLATE_COLORS[template.id] ?? TEMPLATE_COLORS["vessel-monitoring"];
          const isSelected = selectedId === template.id;

          return (
            <button
              key={template.id}
              type="button"
              onClick={() => onSelect(template)}
              disabled={disabled}
              className={`text-left p-3 rounded-xl border transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[var(--shadow-sm)] ${
                isSelected
                  ? "border-[var(--brand)] bg-[var(--brand-muted)] ring-1 ring-[var(--brand-light)]"
                  : "border-[var(--border)] bg-[var(--card-bg)] hover:border-[var(--brand-light)]"
              }`}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <div
                  className={`p-1.5 rounded-lg shrink-0 border ${colors.bg} ${colors.text} ${colors.border} dark:opacity-90`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-semibold text-[var(--text-primary)]">{template.title}</span>
              </div>
              <p className="text-[10px] text-[var(--text-muted)] leading-relaxed mb-2 line-clamp-2">
                {template.description}
              </p>
              <span className="text-[9px] font-medium text-[var(--brand)]">
                {template.widgets.length} components · Use template
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
