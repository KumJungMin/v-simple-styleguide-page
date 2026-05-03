import type { NormalizedComponentDoc } from '../../types'
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
  mount: (request: StyleguideRenderRequest) => StyleguideRendererInstance
}
