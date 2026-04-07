/**
 * Flow:
 * 1. Consumers describe a component with prop, emit, and slot metadata.
 * 2. Docs can be passed directly or wrapped in a module `default` export.
 * 3. `normalizeDocs` converts that mixed input into a flat ComponentDoc array.
 */
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

export interface EmitDefinition {
  name: string
  description?: string
  payload?: string
}

export interface SlotDefinition {
  name: string
  description?: string
}

export interface BaseComponentDoc {
  title: string
  description?: string
  props?: PropDefinition[]
  emits?: EmitDefinition[]
  slots?: SlotDefinition[]
  slotExamples?: Record<string, string>
}

export interface ComponentDoc<TComponent = unknown> extends BaseComponentDoc {
  component?: TComponent
}

export interface ComponentDocModule<TComponent = unknown> {
  default: ComponentDoc<TComponent>
}

export interface ComponentExample {
  title: string
  description: string
  code: string
  props: Record<string, unknown>
  emits?: Record<string, unknown>
  _customWidth?: number
  slotContent?: string
  slots?: Record<string, string>
}

export type ComponentDocsSource<TComponent = unknown> =
  | Record<string, unknown>
  | Array<ComponentDoc<TComponent> | ComponentDocModule<TComponent> | unknown>
