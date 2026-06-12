"use client";

import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  secondaryLabel,
  onSecondary,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[320px] px-6 py-10 text-center">
      <div className="p-4 rounded-2xl bg-maritime-50 dark:bg-maritime-950/50 border border-maritime-100 dark:border-maritime-800 mb-4">
        <Icon className="w-10 h-10 text-maritime-500" strokeWidth={1.5} />
      </div>
      <h3 className="text-base font-display font-semibold text-[var(--text-primary)] mb-2">{title}</h3>
      <p className="text-sm text-[var(--text-muted)] max-w-sm leading-relaxed mb-6">{description}</p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        {actionLabel && onAction && (
          <button
            type="button"
            onClick={onAction}
            className="px-5 py-2.5 bg-maritime-600 text-white text-sm font-medium rounded-lg hover:bg-maritime-700 transition-colors shadow-sm"
          >
            {actionLabel}
          </button>
        )}
        {secondaryLabel && onSecondary && (
          <button
            type="button"
            onClick={onSecondary}
            className="px-5 py-2.5 text-sm font-medium text-maritime-700 bg-maritime-50 border border-maritime-200 rounded-lg hover:bg-maritime-100 transition-colors"
          >
            {secondaryLabel}
          </button>
        )}
      </div>
    </div>
  );
}
