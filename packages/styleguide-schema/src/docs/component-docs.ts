export type FrameworkKind = 'vue' | 'react'
export type PropControl = 'string' | 'number' | 'select' | 'boolean'
export type CompositionKind = 'slots' | 'children'

export interface PropDefinition {
  name: string
  type: string
  required?: boolean
  default?: unknown
  description?: string
  control?: PropControl
  options?: string[]
}

export interface EventDefinition {
  name: string
  description?: string
  payload?: string
  handlerPropName?: string
}

export interface CompositionEntryDefinition {
  name: string
  description?: string
}

export interface CompositionDefinition {
  kind: CompositionKind
  entries: CompositionEntryDefinition[]
}

export interface ComponentExample {
  title: string
  description: string
  code: string
  props: Record<string, unknown>
  events?: Record<string, unknown>
  composition?: string | Record<string, string>
  _customWidth?: number
}

export interface BaseComponentDoc<TComponent = unknown> {
  id?: string
  framework?: FrameworkKind
  title: string
  description?: string
  component?: TComponent
  props?: PropDefinition[]
  events?: EventDefinition[]
  composition?: CompositionDefinition
  compositionExamples?: Record<string, string>
  examples?: ComponentExample[]
}

export interface LegacyComponentDocFields {
  emits?: EventDefinition[]
  slots?: CompositionEntryDefinition[]
  slotExamples?: Record<string, string>
}

export interface ComponentDoc<TComponent = unknown>
  extends BaseComponentDoc<TComponent>, LegacyComponentDocFields {}

export interface NormalizedComponentDoc<TComponent = unknown> extends BaseComponentDoc<TComponent> {
  id: string
  framework: FrameworkKind
  props: PropDefinition[]
  events: EventDefinition[]
  compositionExamples: Record<string, string>
}

export interface ComponentDocModule<TComponent = unknown> {
  default: ComponentDoc<TComponent>
}

export type ComponentDocsSource<TComponent = unknown> =
  | Record<string, unknown>
  | Array<ComponentDoc<TComponent> | ComponentDocModule<TComponent> | unknown>

export type EmitDefinition = EventDefinition
export type SlotDefinition = CompositionEntryDefinition
