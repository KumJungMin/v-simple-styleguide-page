import type {
  ComponentDoc,
  CompositionDefinition,
  FrameworkKind,
  NormalizedComponentDoc,
} from 'styleguide-schema'

export function normalizeComponentDoc<TComponent = unknown>(
  componentDoc: ComponentDoc<TComponent>
): NormalizedComponentDoc<TComponent> {
  const framework = componentDoc.framework ?? inferFramework(componentDoc)
  const componentId = componentDoc.id ?? slugify(componentDoc.title)
  const props = componentDoc.props ?? []
  const events = componentDoc.events ?? componentDoc.emits ?? []
  const composition = componentDoc.composition ?? normalizeLegacyComposition(componentDoc)
  const compositionExamples = componentDoc.compositionExamples ?? componentDoc.slotExamples ?? {}

  return {
    ...componentDoc,
    id: componentId,
    framework,
    props,
    events,
    composition,
    compositionExamples,
  }
}

function inferFramework(componentDoc: ComponentDoc): FrameworkKind {
  return componentDoc.slots || componentDoc.slotExamples || componentDoc.emits ? 'vue' : 'vue'
}

function normalizeLegacyComposition(componentDoc: ComponentDoc): CompositionDefinition | undefined {
  if (!componentDoc.slots?.length) {
    return undefined
  }

  return {
    kind: 'slots',
    entries: componentDoc.slots,
  }
}

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
