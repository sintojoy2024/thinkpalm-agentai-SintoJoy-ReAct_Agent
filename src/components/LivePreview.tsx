"use client";

import { useMemo, useRef, useState } from "react";
import EmptyState from "@/components/EmptyState";
import {
  ExternalLink,
  Maximize2,
  Monitor,
  RefreshCw,
  Smartphone,
  Tablet,
} from "lucide-react";
import type { ComponentNode } from "@/types";
import { buildPreviewFromTree } from "@/tools/preview-builder";

interface LivePreviewProps {
  previewHtml: string | null;
  componentTree: ComponentNode | null;
  title?: string;
  onLoadSample?: () => void;
}

type Viewport = "mobile" | "tablet" | "desktop";

const VIEWPORT_WIDTH: Record<Viewport, string> = {
  mobile: "375px",
  tablet: "768px",
  desktop: "100%",
};

const VIEWPORT_LABEL: Record<Viewport, string> = {
  mobile: "375 × 812",
  tablet: "768 × 1024",
  desktop: "Full width",
};

export default function LivePreview({
  previewHtml,
  componentTree,
  title,
  onLoadSample,
}: LivePreviewProps) {
  const [viewport, setViewport] = useState<Viewport>("desktop");
  const [iframeLoading, setIframeLoading] = useState(true);
  const [iframeKey, setIframeKey] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const html = useMemo(() => {
    if (previewHtml?.trim()) return previewHtml;
    if (componentTree) return buildPreviewFromTree(componentTree, title);
    return null;
  }, [previewHtml, componentTree, title]);

  const openHtmlPreviewInNewTab = () => {
    if (!html) return;
    const tab = window.open("", "_blank", "noopener,noreferrer");
    if (!tab) return;
    tab.document.open();
    tab.document.write(html);
    tab.document.close();
  };

  const handleFullscreen = () => {
    containerRef.current?.requestFullscreen?.();
  };

  const handleRefresh = () => {
    setIframeLoading(true);
    setIframeKey((k) => k + 1);
  };

  if (!html) {
    return (
      <EmptyState
        icon={Monitor}
        title="Live preview will render here"
        description="Once you generate a UI, your full maritime dashboard — voyage trackers, fuel gauges, crew panels, and alerts — will appear in this panel."
        actionLabel="Load sample PRD to see it in action"
        onAction={onLoadSample}
      />
    );
  }

  return (
    <div className="h-full flex flex-col min-h-[360px] gap-2">
      <div className="flex items-center justify-between gap-2 flex-wrap shrink-0">
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent-success/10 text-accent-success border border-accent-success/20 font-medium">
          Live · Matches export
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={openHtmlPreviewInNewTab}
            className="flex items-center gap-1 px-2 py-1 text-[10px] rounded-md border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          >
            <ExternalLink className="w-3 h-3" />
            New tab
          </button>
          <button
            type="button"
            onClick={handleRefresh}
            className="p-1 rounded-md border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
            title="Refresh preview"
          >
            <RefreshCw className="w-3 h-3" />
          </button>
          <button
            type="button"
            onClick={handleFullscreen}
            className="p-1 rounded-md border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
            title="Fullscreen preview"
          >
            <Maximize2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-1 bg-[var(--card-bg-muted)] rounded-lg p-1 border border-[var(--border-subtle)]">
          {(
            [
              { id: "mobile" as const, icon: Smartphone, label: "Mobile" },
              { id: "tablet" as const, icon: Tablet, label: "Tablet" },
              { id: "desktop" as const, icon: Monitor, label: "Desktop" },
            ] as const
          ).map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => setViewport(id)}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs rounded-md transition-colors ${
                viewport === id
                  ? "bg-[var(--card-bg)] shadow-sm text-maritime-700 dark:text-maritime-300 font-medium"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </div>
        <span className="text-[10px] font-mono text-[var(--text-muted)]">{VIEWPORT_LABEL[viewport]}</span>
      </div>

      <div
        ref={containerRef}
        className="flex-1 flex justify-center rounded-xl overflow-hidden border border-[var(--border)] min-h-[280px] bg-[var(--preview-chrome)] shadow-inner"
      >
        <div
          className="relative h-full transition-all duration-300 ease-in-out shrink-0 p-3 sm:p-4"
          style={{ width: VIEWPORT_WIDTH[viewport], maxWidth: "100%" }}
        >
          {viewport !== "desktop" && (
            <div className="mx-auto mb-2 w-16 h-1 rounded-full bg-[var(--border)]" />
          )}
          <div className="relative h-[calc(100%-1rem)]">
            {iframeLoading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[var(--card-bg)] rounded-lg z-10">
                <div className="w-8 h-8 border-2 border-maritime-200 border-t-maritime-600 rounded-full animate-spin" />
                <p className="text-xs text-[var(--text-muted)]">Rendering dashboard…</p>
              </div>
            )}
            <iframe
              key={iframeKey}
              title="Maritime UI Preview"
              className="w-full h-full min-h-[380px] border border-[var(--border)] rounded-lg bg-white shadow-lg"
              sandbox="allow-scripts allow-same-origin"
              srcDoc={html}
              onLoad={() => setIframeLoading(false)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
