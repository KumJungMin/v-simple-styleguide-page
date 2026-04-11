import type { PropControl, PropDefinition } from 'styleguide-schema'
import { enumValues, isBoolean, isNumber } from '../utils/typeUtils'

export type InputMode = PropControl

export function getDefaultPropsFromDefinitions(props: PropDefinition[] = []): Record<string, unknown> {
  const out: Record<string, unknown> = {}

  props.forEach(prop => {
    if (prop.default !== undefined) {
      out[prop.name] = prop.default
      return
    }

    if (!prop.required) {
      return
    }

    if (isBoolean(prop.type)) {
      out[prop.name] = false
      return
    }

    if (isNumber(prop.type)) {
      out[prop.name] = 0
      return
    }

    out[prop.name] = ''
  })

  return out
}

export function getInputMode(prop: PropDefinition): InputMode {
  if (prop.control) {
    return prop.control
  }

  if (isBoolean(prop.type)) {
    return 'boolean'
  }

  if (isNumber(prop.type)) {
    return 'number'
  }

  if (enumValues(prop.type).length > 0) {
    return 'select'
  }

  return 'string'
}

export function getSelectOptions(prop: PropDefinition): string[] {
  if (prop.options?.length) {
    return prop.options
  }

  return enumValues(prop.type)
}
