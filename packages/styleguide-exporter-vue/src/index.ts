import type { ComponentDoc, ComponentDocsSource, ProjectManifest } from 'styleguide-schema'
import { normalizeDocs } from 'styleguide-core'

export function defineVueComponentDoc<TComponent = unknown>(
  componentDoc: Omit<ComponentDoc<TComponent>, 'framework'>
): ComponentDoc<TComponent> {
  return {
    framework: 'vue',
    ...componentDoc,
  }
}

export function collectVueStyleguideDocs<TComponent = unknown>(docsSource: ComponentDocsSource<TComponent>) {
  return normalizeDocs(docsSource).filter(componentDoc => componentDoc.framework === 'vue')
}

export function buildVueProjectManifest<TComponent = unknown>(
  projectId: string,
  docsSource: ComponentDocsSource<TComponent>,
  previewBaseUrl?: string
): ProjectManifest {
  const docs = collectVueStyleguideDocs(docsSource)

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
