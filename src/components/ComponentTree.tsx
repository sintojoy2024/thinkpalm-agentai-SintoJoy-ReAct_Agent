"use client";

import { useState } from "react";
import {
  ChevronRight,
  ChevronDown,
  Layout,
  Box,
  AlertTriangle,
  BarChart3,
  Table,
  CreditCard,
  GitBranch,
} from "lucide-react";
import EmptyState from "@/components/EmptyState";
import type { ComponentNode } from "@/types";

const typeIcons: Record<ComponentNode["type"], React.ReactNode> = {
  layout: <Layout className="w-4 h-4 text-maritime-600" />,
  widget: <Box className="w-4 h-4 text-blue-600" />,
  container: <Box className="w-4 h-4 text-purple-600" />,
  chart: <BarChart3 className="w-4 h-4 text-green-600" />,
  table: <Table className="w-4 h-4 text-orange-600" />,
  card: <CreditCard className="w-4 h-4 text-teal-600" />,
  alert: <AlertTriangle className="w-4 h-4 text-red-600" />,
};

function TreeNode({ node, depth = 0 }: { node: ComponentNode; depth?: number }) {
  const [expanded, setExpanded] = useState(depth < 2);
  const children = Array.isArray(node.children) ? node.children : [];
  const hasChildren = children.length > 0;

  return (
    <div>
      <button
        onClick={() => hasChildren && setExpanded(!expanded)}
        className="flex items-center gap-2 w-full text-left py-1.5 px-2 rounded-lg hover:bg-maritime-50 dark:hover:bg-maritime-950/40 transition-colors"
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
      >
        {hasChildren ? (
          expanded ? <ChevronDown className="w-3.5 h-3.5 text-[var(--text-muted)]" /> : <ChevronRight className="w-3.5 h-3.5 text-[var(--text-muted)]" />
        ) : (
          <span className="w-3.5" />
        )}
        {typeIcons[node.type]}
        <span className="font-medium text-sm text-[var(--text-primary)]">{node.name}</span>
        <span className="text-xs text-[var(--text-muted)] ml-auto font-mono">{node.type}</span>
      </button>
      {expanded && hasChildren && (
        <div>
          {children.map((child) => (
            <TreeNode key={child.id} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

interface ComponentTreeProps {
  tree: ComponentNode | null;
  onLoadSample?: () => void;
}

export default function ComponentTree({ tree, onLoadSample }: ComponentTreeProps) {
  if (!tree) {
    return (
      <EmptyState
        icon={GitBranch}
        title="Component tree not generated yet"
        description="Your widget hierarchy will appear here after the UI Architect agent designs the dashboard structure from your PRD."
        actionLabel="Load sample PRD to see it in action"
        onAction={onLoadSample}
      />
    );
  }

  return (
    <div className="h-full overflow-auto scrollbar-thin">
      <TreeNode node={tree} />
    </div>
  );
}
