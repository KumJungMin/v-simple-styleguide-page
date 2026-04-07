import type {
  ComponentDoc,
  ComponentDocModule,
  ComponentDocsSource,
} from '../../type/component-docs'

/**
 * Flow:
 * 1. Accept docs from either an array or a record.
 * 2. Unwrap `default` exports when docs come from dynamic imports.
 * 3. Keep only values that match the ComponentDoc shape.
 */
export function normalizeDocs<TComponent = unknown>(
  docsSource: ComponentDocsSource<TComponent>
): ComponentDoc<TComponent>[] {
  const docCandidates = Array.isArray(docsSource) ? docsSource : Object.values(docsSource)

  return docCandidates.flatMap(docCandidate => {
    const normalizedDoc = extractComponentDoc<TComponent>(docCandidate)

    return normalizedDoc ? [normalizedDoc] : []
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
