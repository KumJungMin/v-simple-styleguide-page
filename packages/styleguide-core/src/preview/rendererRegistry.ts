import type { NormalizedComponentDoc } from 'styleguide-schema'
import type { StyleguideRendererAdapter } from './rendererAdapter'

export interface StyleguideRendererRegistry {
  getRendererForDoc: (doc: NormalizedComponentDoc) => StyleguideRendererAdapter | undefined
  list: () => StyleguideRendererAdapter[]
}

export function createRendererRegistry(
  rendererAdapters: StyleguideRendererAdapter[]
): StyleguideRendererRegistry {
  return {
    getRendererForDoc(_doc) {
      return rendererAdapters[0]
    },
    list() {
      return [...rendererAdapters]
    },
  }
}
