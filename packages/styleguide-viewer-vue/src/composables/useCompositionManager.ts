import { reactive, ref, watch } from 'vue'
import type { NormalizedComponentDoc } from 'styleguide-schema'
import {
  createInitialCompositionEdits,
  getDefaultCompositionExample,
  getResolvedCompositionContent,
  type CompositionEditMap,
} from 'styleguide-core'

export interface CompositionManagerOptions {
  getDoc: () => NormalizedComponentDoc | undefined
  onUpdate?: () => void
}

export function useCompositionManager(options: CompositionManagerOptions) {
  const compositionEdits = reactive<CompositionEditMap>({})
  const activeEntry = ref<string | null>(null)
  const currentEntryEdit = ref('')

  watch(
    () => options.getDoc(),
    () => {
      initializeCompositionEdits()
      activeEntry.value = null
      currentEntryEdit.value = ''
    },
    { immediate: true }
  )

  function initializeCompositionEdits() {
    replaceCompositionEdits(createInitialCompositionEdits(options.getDoc()))
  }

  function getCompositionContent() {
    return getResolvedCompositionContent(options.getDoc()?.composition?.kind, compositionEdits)
  }

  function startEditEntry(entryName: string) {
    activeEntry.value = entryName
    currentEntryEdit.value = compositionEdits[entryName] ?? getDefaultEntryValue(entryName)
  }

  function getDefaultEntryValue(entryName: string) {
    return getDefaultCompositionExample(options.getDoc(), entryName)
  }

  function applyEntryEdit() {
    if (!activeEntry.value) {
      return
    }

    compositionEdits[activeEntry.value] = currentEntryEdit.value
    activeEntry.value = null
    currentEntryEdit.value = ''
    options.onUpdate?.()
  }

  function cancelEntryEdit() {
    activeEntry.value = null
    currentEntryEdit.value = ''
  }

  function replaceCompositionEdits(nextEdits: CompositionEditMap) {
    Object.keys(compositionEdits).forEach(key => {
      delete compositionEdits[key]
    })

    Object.assign(compositionEdits, nextEdits)
  }

  return {
    compositionEdits,
    activeEntry,
    currentEntryEdit,
    getCompositionContent,
    initializeCompositionEdits,
    startEditEntry,
    applyEntryEdit,
    cancelEntryEdit,
  }
}
