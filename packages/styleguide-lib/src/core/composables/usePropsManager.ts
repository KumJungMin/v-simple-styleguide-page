import { reactive } from 'vue'
import type { PropDefinition } from '../../type/component-docs'
import { isBoolean, isNumber, enumValues } from '../utils/typeUtils'

export interface PropsManagerOptions {
  props?: PropDefinition[]
}
type InputMode = 'string' | 'number' | 'select' | 'boolean'

export function usePropsManager(options: PropsManagerOptions) {
  const { props = [] } = options

  const currentProps = reactive<Record<string, any>>(getDefaultPropsFromDefinitions(props))

  function getDefaultPropsFromDefinitions(props: PropDefinition[]): Record<string, any> {
    const out: Record<string, any> = {}
    for (const p of props) {
      if (p.default !== undefined) {
        out[p.name] = p.default
      } else if (p.required) {
        if (isBoolean(p.type)) {
          out[p.name] = false
        } else if (isNumber(p.type)) {
          out[p.name] = 0
        } else if (p.type.includes('string') || p.type.includes('String')) {
          out[p.name] = ''
        } else {
          out[p.name] = ''
        }
      }
    }
    return out
  }

  function getMode(prop: PropDefinition): InputMode {
    const ctrl = (prop as any).control as InputMode | undefined

    if (ctrl) return ctrl
    if (isBoolean(prop.type)) return 'boolean'
    if (isNumber(prop.type)) return 'number'
    if (enumValues(prop.type).length) return 'select'
    return 'string'
  }

  function getSelectOptions(prop: PropDefinition): string[] {
    const explicit = (prop as any).options as string[] | undefined
    if (explicit?.length) return explicit
    return enumValues(prop.type)
  }

  function resetProps() {
    const defaults = getDefaultPropsFromDefinitions(props)
    Object.keys(currentProps).forEach(key => {
      delete currentProps[key]
    })
    Object.assign(currentProps, defaults)
  }

  return {
    currentProps,
    getMode,
    getSelectOptions,
    resetProps
  }
} 