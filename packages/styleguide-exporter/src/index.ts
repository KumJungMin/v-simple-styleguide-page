import type { ComponentDoc, ComponentDocsSource, ProjectManifest } from 'styleguide-schema'
import { normalizeDocs } from 'styleguide-core'

export function defineComponentDoc<TComponent = unknown>(
  componentDoc: ComponentDoc<TComponent>
): ComponentDoc<TComponent> {
  return componentDoc
}

export function collectStyleguideDocs<TComponent = unknown>(docsSource: ComponentDocsSource<TComponent>) {
  return normalizeDocs(docsSource)
}

export function buildProjectManifest<TComponent = unknown>(
  projectId: string,
  docsSource: ComponentDocsSource<TComponent>,
  previewBaseUrl?: string
): ProjectManifest {
  const docs = collectStyleguideDocs(docsSource)

  return {
    projectId,
    generatedAt: new Date().toISOString(),
    components: docs.map(componentDoc => ({
      projectId,
      componentId: componentDoc.id,
      title: componentDoc.title,
      description: componentDoc.description,
      props: componentDoc.props,
      events: componentDoc.events,
      composition: componentDoc.composition,
      previewUrl: previewBaseUrl ? `${previewBaseUrl}/${componentDoc.id}.html` : undefined,
    })),
  }
}
