import { NextRequest, NextResponse } from "next/server";
import { exportToGitHubGist } from "@/tools/github-export";
import type { GeneratedComponent } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const components = body.components as GeneratedComponent[];
    const description = (body.description as string) || "Maritime UI Components";

    if (!components || components.length === 0) {
      return NextResponse.json({ error: "No components to export" }, { status: 400 });
    }

    const result = await exportToGitHubGist(
      components,
      description,
      process.env.GITHUB_TOKEN
    );

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: result.error?.includes("not configured") ? 501 : 500 });
    }

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "GitHub export failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
