/**
 * Shared utilities exposed by the library.
 * Import from here when you want the normalized public entry point.
 */
export { normalizeDocs } from './docs/normalizeDocs'
export { cloneAndInjectParentStyles } from './dom/styleSync'
export {
  buildEmitHandlers,
  getSerializablePayload,
  isComponentEventMessage,
  type ComponentEventMessage,
} from './events/emitBridge'
export {
  getDefaultPropsFromDefinitions,
  getInputMode,
  getSelectOptions,
  type InputMode,
} from './props/propSchema'
export { formatTimestamp } from './utils/dateUtils'
export {
  createInitialSlotEdits,
  getDefaultSlotExample,
  getResolvedSlotContent,
  getUsedSlotEdits,
  type SlotEditMap,
} from './slots/slotState'
export { injectInlineStyle, injectStylesheet } from './styles/styleInjector'
export {
  enumValues,
  extractStringLiteralOptions,
  isBoolean,
  isBooleanType,
  isNumber,
  isNumberType,
} from './utils/typeUtils'
