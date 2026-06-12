"use client";

import { useState } from "react";
import { Download, Figma, Github, Loader2, Sparkles } from "lucide-react";
import sdk from "@stackblitz/sdk";
import type { ComponentNode, GeneratedComponent, PRDAnalysis } from "@/types";
import { buildStackBlitzProject } from "@/tools/stackblitz-export";
import { downloadProjectZip } from "@/tools/zip-export";
import { downloadFigmaHandoff } from "@/tools/figma-export";

interface ExportActionsProps {
  components: GeneratedComponent[] | null;
  projectName: string;
  previewHtml?: string | null;
  componentTree?: ComponentNode | null;
  analysis?: PRDAnalysis | null;
  disabled?: boolean;
}

export default function ExportActions({
  components,
  projectName,
  previewHtml,
  componentTree,
  analysis,
  disabled = false,
}: ExportActionsProps) {
  const [reactLoading, setReactLoading] = useState(false);
  const [figmaLoading, setFigmaLoading] = useState(false);
  const [zipLoading, setZipLoading] = useState(false);
  const [githubLoading, setGithubLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const hasOutput = !disabled && components && components.length > 0;

  const handleExportReact = () => {
    if (!components?.length) return;
    setReactLoading(true);
    setMessage(null);
    const newTab = window.open("about:blank", "_blank", "noopener,noreferrer");
    try {
      const project = buildStackBlitzProject(components, projectName, {
        previewHtml: previewHtml ?? undefined,
        componentTree: componentTree ?? undefined,
      });
      sdk.openProject(project, {
        newWindow: true,
        view: "editor",
        openFile: components[0]?.filename.startsWith("src/") ? components[0].filename : `src/${components[0]?.filename}`,
      });
      if (newTab && !newTab.closed) newTab.close();
      setMessage("Opened React project in StackBlitz");
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "React export failed");
    } finally {
      setReactLoading(false);
    }
  };

  const handleExportFigma = () => {
    setFigmaLoading(true);
    setMessage(null);
    try {
      downloadFigmaHandoff(projectName, componentTree, analysis);
      setMessage("Figma handoff file downloaded");
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Figma export failed");
    } finally {
      setFigmaLoading(false);
    }
  };

  const handleDownloadZip = async () => {
    if (!components?.length) return;
    setZipLoading(true);
    setMessage(null);
    try {
      await downloadProjectZip(components, projectName, {
        previewHtml: previewHtml ?? undefined,
        componentTree: componentTree ?? undefined,
      });
      setMessage("Full source ZIP downloaded");
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "ZIP download failed");
    } finally {
      setZipLoading(false);
    }
  };

  const handleGitHub = async () => {
    if (!components?.length) return;
    setGithubLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/export/github", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ components, description: projectName }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error);
      if (result.gistUrl) {
        window.open(result.gistUrl, "_blank", "noopener,noreferrer");
        setMessage("Exported to GitHub Gist");
      }
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "GitHub export failed");
    } finally {
      setGithubLoading(false);
    }
  };

  return (
    <div className="shrink-0 p-4 border-t border-[var(--border)] bg-[var(--background)]" data-tour="export-actions">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--text-muted)] mb-3">
        Export &amp; Integrate
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <button
          type="button"
          onClick={handleExportReact}
          disabled={!hasOutput || reactLoading}
          className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-[var(--border)] bg-[var(--card-bg)] shadow-[var(--shadow-sm)] hover:border-[var(--brand-light)] hover:bg-[var(--brand-muted)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-center"
        >
          {reactLoading ? (
            <Loader2 className="w-5 h-5 text-[var(--brand)] animate-spin" />
          ) : (
            <Sparkles className="w-5 h-5 text-[var(--brand)]" />
          )}
          <span className="text-[11px] font-medium text-[var(--text-primary)]">Export React</span>
          <span className="text-[9px] text-[var(--text-muted)]">Tailwind</span>
        </button>
        <button
          type="button"
          onClick={handleExportFigma}
          disabled={!hasOutput || figmaLoading}
          className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-[var(--border)] bg-[var(--card-bg)] shadow-[var(--shadow-sm)] hover:border-violet-200 hover:bg-violet-50 dark:hover:bg-violet-950/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-center"
        >
          {figmaLoading ? (
            <Loader2 className="w-5 h-5 text-purple-400 animate-spin" />
          ) : (
            <Figma className="w-5 h-5 text-purple-400" />
          )}
          <span className="text-[11px] font-medium text-[var(--text-primary)]">Export Figma</span>
          <span className="text-[9px] text-[var(--text-muted)]">Design file</span>
        </button>
        <button
          type="button"
          onClick={handleDownloadZip}
          disabled={!hasOutput || zipLoading}
          className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-[var(--border)] bg-[var(--card-bg)] shadow-[var(--shadow-sm)] hover:border-emerald-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-center"
        >
          {zipLoading ? (
            <Loader2 className="w-5 h-5 text-emerald-400 animate-spin" />
          ) : (
            <Download className="w-5 h-5 text-emerald-400" />
          )}
          <span className="text-[11px] font-medium text-[var(--text-primary)]">Download ZIP</span>
          <span className="text-[9px] text-[var(--text-muted)]">Full source</span>
        </button>
      </div>
      <button
        type="button"
        onClick={handleGitHub}
        disabled={!hasOutput || githubLoading}
        className="mt-2 w-full flex items-center justify-center gap-2 py-2.5 text-xs rounded-lg border border-[var(--border)] bg-[var(--card-bg)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] shadow-[var(--shadow-sm)] disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {githubLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Github className="w-3.5 h-3.5" />}
        {githubLoading ? "Exporting…" : "Push to GitHub Gist"}
      </button>
      {message && (
        <p className="text-[10px] text-[var(--success-text)] mt-2 text-center flex items-center justify-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)]" />
          {message}
        </p>
      )}
    </div>
  );
}
