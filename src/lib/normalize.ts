import type { PRDAnalysis, ComponentNode, GeneratedComponent } from "@/types";

function asStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string");
  }
  if (typeof value === "string" && value.trim()) {
    return [value];
  }
  return [];
}

export function normalizePRDAnalysis(raw: Partial<PRDAnalysis>, fallbackTitle = "Maritime Dashboard"): PRDAnalysis {
  return {
    title: raw.title?.trim() || fallbackTitle,
    summary: raw.summary?.trim() || "",
    features: asStringArray(raw.features),
    widgets: asStringArray(raw.widgets),
    dataEntities: asStringArray(raw.dataEntities),
    userRoles: asStringArray(raw.userRoles),
    constraints: asStringArray(raw.constraints),
  };
}

export function normalizeComponentNode(raw: Partial<ComponentNode>, index = 0): ComponentNode {
  const children = Array.isArray(raw.children)
    ? raw.children.map((child, i) => normalizeComponentNode(child as Partial<ComponentNode>, i))
    : [];

  return {
    id: raw.id?.trim() || `node-${index}`,
    name: raw.name?.trim() || `Component${index}`,
    type: raw.type ?? "widget",
    description: raw.description?.trim() || "",
    props: raw.props && typeof raw.props === "object" ? raw.props : {},
    tailwindClasses: raw.tailwindClasses?.trim() || "bg-white rounded-xl p-4",
    children,
  };
}

export function normalizeGeneratedComponents(raw: unknown): GeneratedComponent[] {
  if (!Array.isArray(raw)) return [];

  return raw
    .filter((item): item is GeneratedComponent => {
      return (
        !!item &&
        typeof item === "object" &&
        typeof (item as GeneratedComponent).filename === "string" &&
        typeof (item as GeneratedComponent).code === "string"
      );
    })
    .map((item) => ({
      filename: item.filename,
      code: item.code,
    }));
}
