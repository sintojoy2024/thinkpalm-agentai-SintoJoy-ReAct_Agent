"use client";

import { HelpCircle } from "lucide-react";

interface TourButtonProps {
  onStart: () => void;
}

export default function TourButton({ onStart }: TourButtonProps) {
  return (
    <button
      type="button"
      onClick={onStart}
      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-[var(--border)] bg-[var(--card-bg)] text-[var(--text-muted)] hover:text-[var(--brand)] hover:border-[var(--brand-light)] transition-colors shadow-[var(--shadow-sm)]"
      title="Start product tour"
    >
      <HelpCircle className="w-3.5 h-3.5" />
      <span className="hidden sm:inline">Tour</span>
    </button>
  );
}
