"use client";

import { useState } from "react";
import EmptyState from "@/components/EmptyState";
import { Copy, Check, Code2 } from "lucide-react";
import type { GeneratedComponent } from "@/types";

interface CodeExportProps {
  components: GeneratedComponent[] | null;
  onLoadSample?: () => void;
}

export default function CodeExport({ components, onLoadSample }: CodeExportProps) {
  const [selectedFile, setSelectedFile] = useState(0);
  const [copied, setCopied] = useState(false);

  if (!components || components.length === 0) {
    return (
      <EmptyState
        icon={Code2}
        title="React code will appear here"
        description="Production-ready TypeScript and Tailwind components will be generated after the pipeline completes."
        actionLabel="Load sample PRD to see it in action"
        onAction={onLoadSample}
      />
    );
  }

  const current = components[selectedFile] ?? components[0];

  const handleCopy = async () => {
    await navigator.clipboard.writeText(current.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="flex items-center gap-2 mb-2 flex-wrap shrink-0">
        <div className="flex gap-1 flex-wrap flex-1">
          {components.map((comp, i) => (
            <button
              key={comp.filename}
              onClick={() => setSelectedFile(i)}
              className={`px-2 py-1 text-[10px] rounded-md font-mono transition-colors ${
                i === selectedFile
                  ? "bg-maritime-600 text-white"
                  : "bg-[var(--card-bg-muted)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              }`}
            >
              {comp.filename}
            </button>
          ))}
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 px-2 py-1 text-[10px] border border-[var(--border)] bg-[var(--card-bg-muted)] rounded-md hover:text-[var(--text-primary)] transition-colors shrink-0"
        >
          {copied ? <Check className="w-3 h-3 text-accent-success" /> : <Copy className="w-3 h-3" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      <pre className="flex-1 overflow-auto bg-slate-950 text-slate-100 p-3 rounded-lg text-[10px] font-mono leading-relaxed scrollbar-thin min-h-0">
        <code>{current.code}</code>
      </pre>
    </div>
  );
}
