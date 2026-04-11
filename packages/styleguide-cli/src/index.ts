import type { ProjectManifest, WorkspaceManifest } from 'styleguide-schema'

export function mergeProjectManifests(projectManifests: ProjectManifest[]): WorkspaceManifest {
  return {
    generatedAt: new Date().toISOString(),
    projects: projectManifests,
  }
}
