import type { PropControl, PropDefinition } from '../../type/component-docs'
import {
  extractStringLiteralOptions,
  isBooleanType,
  isNumberType,
} from '../utils/typeUtils'

export type InputMode = PropControl

/**
 * Flow:
 * 1. Read prop metadata declared in the component doc.
 * 2. Infer default values and input modes for the playground controls.
 * 3. Fall back to string literal options when a select list can be derived.
 */
export function getDefaultPropsFromDefinitions(
  propDefinitions: PropDefinition[] = []
): Record<string, unknown> {
  const defaultProps: Record<string, unknown> = {}

  propDefinitions.forEach(propDefinition => {
    const defaultValue = getDefaultPropValue(propDefinition)

    if (defaultValue !== undefined) {
      defaultProps[propDefinition.name] = defaultValue
    }
  })

  return defaultProps
}

export function getInputMode(propDefinition: PropDefinition): InputMode {
  if (propDefinition.control) {
    return propDefinition.control
  }

  if (isBooleanType(propDefinition.type)) {
    return 'boolean'
  }

  if (isNumberType(propDefinition.type)) {
    return 'number'
  }

  if (extractStringLiteralOptions(propDefinition.type).length > 0) {
    return 'select'
  }

  return 'string'
}

export function getSelectOptions(propDefinition: PropDefinition): string[] {
  if (propDefinition.options?.length) {
    return propDefinition.options
  }

  return extractStringLiteralOptions(propDefinition.type)
}

function getDefaultPropValue(propDefinition: PropDefinition): unknown {
  if (propDefinition.default !== undefined) {
    return propDefinition.default
  }

  if (!propDefinition.required) {
    return undefined
  }

  // Required props need a predictable starter value so the preview can render immediately.
  if (isBooleanType(propDefinition.type)) {
    return false
  }

  if (isNumberType(propDefinition.type)) {
    return 0
  }

  return ''
}
