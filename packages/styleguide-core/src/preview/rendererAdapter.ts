import type { NormalizedComponentDoc } from 'styleguide-schema'
import type { ResolvedCompositionContent } from '../composition/compositionState'
import type { StyleguideEventLogEntry } from '../events/eventBridge'

export interface StyleguideRenderRequest {
  doc: NormalizedComponentDoc
  component: unknown
  mountTarget: HTMLElement
  props: Record<string, unknown>
  compositionContent?: ResolvedCompositionContent
  onEvent: (eventLogEntry: StyleguideEventLogEntry) => void
}

export interface StyleguideRendererInstance {
  unmount: () => void
}

export interface StyleguideRendererAdapter {
  framework: NormalizedComponentDoc['framework']
  canRender: (doc: NormalizedComponentDoc) => boolean
  mount: (request: StyleguideRenderRequest) => StyleguideRendererInstance
}
