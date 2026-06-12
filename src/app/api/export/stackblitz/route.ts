import { NextRequest, NextResponse } from "next/server";
import { buildStackBlitzProject } from "@/tools/stackblitz-export";
import type { ComponentNode, GeneratedComponent } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const components = (body.components as GeneratedComponent[]) ?? [];
    const projectName = (body.projectName as string) || "Maritime Dashboard";
    const previewHtml = body.previewHtml as string | undefined;
    const componentTree = body.componentTree as ComponentNode | undefined;

    if (components.length === 0 && !previewHtml && !componentTree) {
      return NextResponse.json({ error: "No preview or components to export" }, { status: 400 });
    }

    const project = buildStackBlitzProject(components, projectName, {
      previewHtml,
      componentTree,
    });
    return NextResponse.json(project);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Export failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
