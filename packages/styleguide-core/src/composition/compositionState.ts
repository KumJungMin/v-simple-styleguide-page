import type { NormalizedComponentDoc } from 'styleguide-schema'

export type CompositionEditMap = Record<string, string>
export type ResolvedCompositionContent = string

export function createInitialCompositionEdits(componentDoc?: NormalizedComponentDoc): CompositionEditMap {
  const initialCompositionEdits: CompositionEditMap = {}

  Object.entries(componentDoc?.compositionExamples ?? {}).forEach(([entryName, entryContent]) => {
    initialCompositionEdits[entryName] = entryContent
  })

  componentDoc?.composition?.entries.forEach(entryDefinition => {
    if (!(entryDefinition.name in initialCompositionEdits)) {
      initialCompositionEdits[entryDefinition.name] = ''
    }
  })

  return initialCompositionEdits
}

export function getDefaultCompositionExample(
  componentDoc: NormalizedComponentDoc | undefined,
  entryName: string
): string {
  return componentDoc?.compositionExamples?.[entryName] ?? ''
}

export function getUsedCompositionEdits(compositionEdits: CompositionEditMap): CompositionEditMap {
  return Object.fromEntries(
    Object.entries(compositionEdits).filter(([, content]) => Boolean(content?.trim()))
  )
}

export function getResolvedCompositionContent(
  compositionEdits: CompositionEditMap
): ResolvedCompositionContent {
  const usedCompositionEdits = getUsedCompositionEdits(compositionEdits)

  return usedCompositionEdits.default ?? ''
}
