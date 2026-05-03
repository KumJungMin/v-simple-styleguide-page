import type {
  CompositionDefinition,
  EventDefinition,
  PropDefinition,
} from '../docs/component-docs'

export interface ComponentManifestEntry {
  projectId: string
  componentId: string
  title: string
  description?: string
  props: PropDefinition[]
  events: EventDefinition[]
  composition?: CompositionDefinition
  previewUrl?: string
}

export interface ProjectManifest {
  projectId: string
  generatedAt: string
  components: ComponentManifestEntry[]
}

export interface WorkspaceManifest {
  generatedAt: string
  projects: ProjectManifest[]
}
