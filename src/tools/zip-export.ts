import JSZip from "jszip";
import type { ComponentNode, GeneratedComponent } from "@/types";
import { buildStackBlitzProject, type StackBlitzProjectOptions } from "@/tools/stackblitz-export";

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "maritime-dashboard";
}

export async function downloadProjectZip(
  components: GeneratedComponent[],
  projectName: string,
  options?: StackBlitzProjectOptions
): Promise<void> {
  const project = buildStackBlitzProject(components, projectName, options);
  const zip = new JSZip();

  for (const [path, content] of Object.entries(project.files)) {
    zip.file(path, content);
  }

  const blob = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${slugify(projectName)}.zip`;
  link.click();
  URL.revokeObjectURL(url);
}
