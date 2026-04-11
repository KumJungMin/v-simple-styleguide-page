import type { ComponentDoc, ComponentDocModule, ComponentDocsSource, NormalizedComponentDoc } from 'styleguide-schema'
import { normalizeComponentDoc } from './normalizeComponentDoc'

export function normalizeDocs<TComponent = unknown>(
  docsSource: ComponentDocsSource<TComponent>
): NormalizedComponentDoc<TComponent>[] {
  const docCandidates = Array.isArray(docsSource) ? docsSource : Object.values(docsSource)

  return docCandidates.flatMap(docCandidate => {
    const componentDoc = extractComponentDoc<TComponent>(docCandidate)

    return componentDoc ? [normalizeComponentDoc(componentDoc)] : []
  })
}

function extractComponentDoc<TComponent>(value: unknown): ComponentDoc<TComponent> | null {
  if (hasDefaultExportedComponentDoc<TComponent>(value)) {
    return value.default
  }

  if (isComponentDoc<TComponent>(value)) {
    return value
  }

  return null
}

function hasDefaultExportedComponentDoc<TComponent>(
  value: unknown
): value is ComponentDocModule<TComponent> {
  return isRecord(value) && 'default' in value && isComponentDoc<TComponent>(value.default)
}

function isComponentDoc<TComponent>(value: unknown): value is ComponentDoc<TComponent> {
  return isRecord(value) && typeof value.title === 'string'
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}
