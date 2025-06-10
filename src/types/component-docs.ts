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

export interface ComponentDoc {
  title: string
  description: string
  props: PropDefinition[]
  emits: EmitDefinition[]
  examples: ComponentExample[]
}

export interface ComponentExample {
  title: string
  description: string
  code: string
  props: Record<string, any>
  emits?: Record<string, any>
} 