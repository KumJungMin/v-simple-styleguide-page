import type {
  CompositionDefinition,
  EventDefinition,
  FrameworkKind,
  PropDefinition,
} from '../docs/component-docs'

export interface ComponentManifestEntry {
  projectId: string
  componentId: string
  framework: FrameworkKind
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
