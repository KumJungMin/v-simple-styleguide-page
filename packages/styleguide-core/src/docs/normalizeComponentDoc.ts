import type {
  ComponentDoc,
  NormalizedComponentDoc,
} from 'styleguide-schema'

export function normalizeComponentDoc<TComponent = unknown>(
  componentDoc: ComponentDoc<TComponent>
): NormalizedComponentDoc<TComponent> {
  const componentId = componentDoc.id ?? slugify(componentDoc.title)
  const props = componentDoc.props ?? []
  const events = componentDoc.events ?? []
  const compositionExamples = componentDoc.compositionExamples ?? {}

  return {
    ...componentDoc,
    id: componentId,
    props,
    events,
    compositionExamples,
  }
}

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
