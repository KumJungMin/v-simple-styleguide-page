import type { ComponentDoc, ComponentDocsSource, ProjectManifest } from 'styleguide-schema'
import { normalizeDocs } from 'styleguide-core'

export function defineReactComponentDoc<TComponent = unknown>(
  componentDoc: Omit<ComponentDoc<TComponent>, 'framework'>
): ComponentDoc<TComponent> {
  return {
    framework: 'react',
    ...componentDoc,
  }
}

export function collectReactStyleguideDocs<TComponent = unknown>(docsSource: ComponentDocsSource<TComponent>) {
  return normalizeDocs(docsSource).filter(componentDoc => componentDoc.framework === 'react')
}

export function buildReactProjectManifest<TComponent = unknown>(
  projectId: string,
  docsSource: ComponentDocsSource<TComponent>,
  previewBaseUrl?: string
): ProjectManifest {
  const docs = collectReactStyleguideDocs(docsSource)

  return {
    projectId,
    generatedAt: new Date().toISOString(),
    components: docs.map(componentDoc => ({
      projectId,
      componentId: componentDoc.id,
      framework: componentDoc.framework,
      title: componentDoc.title,
      description: componentDoc.description,
      props: componentDoc.props,
      events: componentDoc.events,
      composition: componentDoc.composition,
      previewUrl: previewBaseUrl ? `${previewBaseUrl}/${componentDoc.id}.html` : undefined,
    })),
  }
}
