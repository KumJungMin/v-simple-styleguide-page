import type { ComponentDoc } from '../../type/component-docs'

/**
 * Flow:
 * 1. Build editable slot state from the doc metadata.
 * 2. Let the UI read defaults for a single slot when editing starts.
 * 3. Return only the slot content that the user actually entered.
 */
export type SlotEditMap = Record<string, string>

export function createInitialSlotEdits(componentDoc?: ComponentDoc): SlotEditMap {
  const initialSlotEdits: SlotEditMap = {}

  Object.entries(componentDoc?.slotExamples ?? {}).forEach(([slotName, slotContent]) => {
    initialSlotEdits[slotName] = slotContent
  })

  componentDoc?.slots?.forEach(slotDefinition => {
    if (!(slotDefinition.name in initialSlotEdits)) {
      initialSlotEdits[slotDefinition.name] = ''
    }
  })

  return initialSlotEdits
}

export function getDefaultSlotExample(
  componentDoc: ComponentDoc | undefined,
  slotName: string
): string {
  return componentDoc?.slotExamples?.[slotName] ?? ''
}

export function getUsedSlotEdits(slotEdits: SlotEditMap): SlotEditMap {
  return Object.fromEntries(
    Object.entries(slotEdits).filter(([, content]) => Boolean(content?.trim()))
  )
}

export function getResolvedSlotContent(slotEdits: SlotEditMap): string | SlotEditMap {
  const usedSlotEdits = getUsedSlotEdits(slotEdits)

  if (Object.keys(usedSlotEdits).length > 0) {
    return usedSlotEdits
  }

  return ''
}
