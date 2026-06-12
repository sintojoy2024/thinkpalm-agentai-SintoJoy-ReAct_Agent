import type { GeneratedComponent } from "@/types";

export interface GitHubGistResult {
  success: boolean;
  gistUrl?: string;
  gistId?: string;
  error?: string;
}

export async function exportToGitHubGist(
  components: GeneratedComponent[],
  description: string,
  token?: string
): Promise<GitHubGistResult> {
  if (!token) {
    return { success: false, error: "GITHUB_TOKEN not configured" };
  }

  const files: Record<string, { content: string }> = {};
  for (const comp of components) {
    files[comp.filename] = { content: comp.code };
  }

  try {
    const response = await fetch("https://api.github.com/gists", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "Content-Type": "application/json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
      body: JSON.stringify({
        description: `BridgeView AI: ${description}`,
        public: true,
        files,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return { success: false, error: `GitHub API error: ${response.status} ${err}` };
    }

    const data = (await response.json()) as { id: string; html_url: string };
    return { success: true, gistUrl: data.html_url, gistId: data.id };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Unknown error" };
  }
}
