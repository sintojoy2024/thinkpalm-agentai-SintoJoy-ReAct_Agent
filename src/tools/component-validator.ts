import type { ComponentNode } from "@/types";
import { normalizeComponentNode } from "@/lib/normalize";

export interface ValidationIssue {
  severity: "error" | "warning" | "info";
  nodeId: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  issues: ValidationIssue[];
  nodeCount: number;
  maxDepth: number;
}

function getChildren(node: ComponentNode): ComponentNode[] {
  return Array.isArray(node.children) ? node.children : [];
}

function countNodes(node: ComponentNode): number {
  return 1 + getChildren(node).reduce((sum, child) => sum + countNodes(child), 0);
}

function getMaxDepth(node: ComponentNode, depth = 1): number {
  const children = getChildren(node);
  if (children.length === 0) return depth;
  return Math.max(...children.map((c) => getMaxDepth(c, depth + 1)));
}

function collectIds(node: ComponentNode, ids: Set<string> = new Set()): Set<string> {
  if (ids.has(node.id)) {
    ids.add(`DUPLICATE:${node.id}`);
  }
  ids.add(node.id);
  getChildren(node).forEach((c) => collectIds(c, ids));
  return ids;
}

export function validateComponentTree(tree: ComponentNode): ValidationResult {
  const issues: ValidationIssue[] = [];
  const nodeCount = countNodes(tree);
  const maxDepth = getMaxDepth(tree);
  const ids = collectIds(tree);

  for (const id of ids) {
    if (id.startsWith("DUPLICATE:")) {
      issues.push({
        severity: "error",
        nodeId: id.replace("DUPLICATE:", ""),
        message: "Duplicate component ID detected",
      });
    }
  }

  if (!tree.name || tree.name.trim() === "") {
    issues.push({ severity: "error", nodeId: tree.id, message: "Root component must have a name" });
  }

  if (maxDepth > 8) {
    issues.push({
      severity: "warning",
      nodeId: tree.id,
      message: `Component tree depth (${maxDepth}) exceeds recommended maximum of 8`,
    });
  }

  if (nodeCount < 3) {
    issues.push({
      severity: "warning",
      nodeId: tree.id,
      message: "Component tree has fewer than 3 nodes; consider adding more widgets",
    });
  }

  function walk(node: ComponentNode) {
    if (!node.tailwindClasses || node.tailwindClasses.trim() === "") {
      issues.push({
        severity: "warning",
        nodeId: node.id,
        message: `Component "${node.name}" has no Tailwind classes`,
      });
    }
    getChildren(node).forEach(walk);
  }
  walk(tree);

  return {
    valid: !issues.some((i) => i.severity === "error"),
    issues,
    nodeCount,
    maxDepth,
  };
}

export const componentValidatorTool = {
  name: "validate_component_tree",
  description: "Validate a component tree structure for completeness, unique IDs, and Tailwind class coverage.",
  input_schema: {
    type: "object" as const,
    properties: {
      treeJson: { type: "string", description: "JSON string of the ComponentNode tree" },
    },
    required: ["treeJson"],
  },
};

export function executeComponentValidation(input: { treeJson: string }): ValidationResult {
  try {
    const parsed = JSON.parse(input.treeJson) as Partial<ComponentNode>;
    const tree = normalizeComponentNode(parsed);
    return validateComponentTree(tree);
  } catch {
    return {
      valid: false,
      issues: [{ severity: "error", nodeId: "root", message: "Invalid component tree JSON" }],
      nodeCount: 0,
      maxDepth: 0,
    };
  }
}
