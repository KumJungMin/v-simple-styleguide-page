import type { EventDefinition, FrameworkKind } from 'styleguide-schema'

export interface StyleguideEventLogEntry {
  event: string
  payload: unknown
  timestamp: number
}

export interface EventHandlerPropsOptions {
  framework: FrameworkKind
  events?: EventDefinition[]
  onEvent: (eventLogEntry: StyleguideEventLogEntry) => void
}

export function buildEventHandlerProps({
  framework,
  events = [],
  onEvent,
}: EventHandlerPropsOptions): Record<string, (...args: unknown[]) => void> {
  const handlers: Record<string, (...args: unknown[]) => void> = {}

  events.forEach(eventDefinition => {
    const handlerPropName = resolveEventHandlerPropName(eventDefinition, framework)

    handlers[handlerPropName] = (...args: unknown[]) => {
      onEvent({
        event: eventDefinition.name,
        payload: args.map(getSerializablePayload),
        timestamp: Date.now(),
      })
    }
  })

  return handlers
}

export function resolveEventHandlerPropName(
  eventDefinition: EventDefinition,
  framework: FrameworkKind
): string {
  if (eventDefinition.handlerPropName) {
    return eventDefinition.handlerPropName
  }

  if (framework === 'react' && /^on[A-Z]/.test(eventDefinition.name)) {
    return eventDefinition.name
  }

  if (eventDefinition.name.includes(':')) {
    return `on${eventDefinition.name.charAt(0).toUpperCase()}${eventDefinition.name.slice(1)}`
  }

  return `on${camelize(eventDefinition.name).replace(/^./, char => char.toUpperCase())}`
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

function camelize(value: string) {
  return value.replace(/[-_](\w)/g, (_, char: string) => char.toUpperCase())
}
