import type { FrameworkKind, NormalizedComponentDoc } from 'styleguide-schema'
import type { StyleguideRendererAdapter } from './rendererAdapter'

export interface StyleguideRendererRegistry {
  getRenderer: (framework: FrameworkKind) => StyleguideRendererAdapter | undefined
  getRendererForDoc: (doc: NormalizedComponentDoc) => StyleguideRendererAdapter | undefined
  list: () => StyleguideRendererAdapter[]
}

export function createRendererRegistry(
  rendererAdapters: StyleguideRendererAdapter[]
): StyleguideRendererRegistry {
  const renderersByFramework = new Map<FrameworkKind, StyleguideRendererAdapter>()

  rendererAdapters.forEach(rendererAdapter => {
    renderersByFramework.set(rendererAdapter.framework, rendererAdapter)
  })

  return {
    getRenderer(framework) {
      return renderersByFramework.get(framework)
    },
    getRendererForDoc(doc) {
      const renderer = renderersByFramework.get(doc.framework)

      if (renderer?.canRender(doc)) {
        return renderer
      }

      return undefined
    },
    list() {
      return Array.from(renderersByFramework.values())
    },
  }
}
