export interface PropDefinition {
  name: string
  type: string
  required?: boolean
  default?: any
  description?: string
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

export interface ComponentDoc {
  title: string
  description: string
  component?: any // Vue component to render
  props: PropDefinition[]
  emits: EmitDefinition[]
  examples?: ComponentExample[]
  slot?: string
  slots?: SlotDefinition[]
  defaultSlot?: string
  namedSlots?: Record<string, string>
}

export interface ComponentExample {
  title: string
  description: string
  code: string
  props: Record<string, any>
  emits?: Record<string, any>
  _customWidth?: number
  slotContent?: string
  slots?: Record<string, string>
} 