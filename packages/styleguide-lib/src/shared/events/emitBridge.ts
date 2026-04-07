import type { EmitDefinition } from '../../type/component-docs'

export interface ComponentEventMessage {
  type: 'component-event'
  event: string
  payload: unknown[]
  timestamp: number
}

export function buildEmitHandlers(emitDefs: EmitDefinition[] = []) {
  const handlers: Record<string, (...args: unknown[]) => void> = {}

  emitDefs.forEach(({ name }) => {
    handlers[toEventHandlerKey(name)] = (...args: unknown[]) => {
      const payload = args.map(getSerializablePayload)

      window.parent.postMessage(
        {
          type: 'component-event',
          event: name,
          payload,
          timestamp: Date.now(),
        } satisfies ComponentEventMessage,
        '*'
      )
    }
  })

  return handlers
}

export function getSerializablePayload(arg: unknown) {
  if (arg instanceof Event) {
    const eventTarget = arg.target
    const target = typeof eventTarget === 'object' && eventTarget !== null && 'tagName' in eventTarget
      ? { tagName: String((eventTarget as { tagName?: unknown }).tagName ?? '') }
      : null

    return { type: 'Event', eventType: arg.type, target }
  }

  if (typeof arg === 'object' && arg !== null) {
    try {
      JSON.parse(JSON.stringify(arg))
      return arg
    } catch {
      return { type: 'NonSerializableObject', value: String(arg) }
    }
  }

  return arg
}

export function isComponentEventMessage(value: unknown): value is ComponentEventMessage {
  return (
    typeof value === 'object' &&
    value !== null &&
    'type' in value &&
    (value as { type?: unknown }).type === 'component-event' &&
    'event' in value &&
    'payload' in value &&
    'timestamp' in value
  )
}

function toEventHandlerKey(eventName: string) {
  return `on${camelize(eventName).replace(/^./, char => char.toUpperCase())}`
}

function camelize(value: string) {
  return value.replace(/-(\w)/g, (_, char: string) => char.toUpperCase())
}
