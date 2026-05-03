export type PropControl = 'string' | 'number' | 'select' | 'boolean'

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
  entries: CompositionEntryDefinition[]
}

export interface ComponentExample {
  title: string
  description: string
  code: string
  props: Record<string, unknown>
  events?: Record<string, unknown>
  composition?: string
  _customWidth?: number
}

export interface BaseComponentDoc<TComponent = unknown> {
  id?: string
  title: string
  description?: string
  component?: TComponent
  props?: PropDefinition[]
  events?: EventDefinition[]
  composition?: CompositionDefinition
  compositionExamples?: Record<string, string>
  examples?: ComponentExample[]
}

export interface ComponentDoc<TComponent = unknown> extends BaseComponentDoc<TComponent> {}

export interface NormalizedComponentDoc<TComponent = unknown> extends BaseComponentDoc<TComponent> {
  id: string
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
