import { reactive, ref, watch } from 'vue'
import type { ComponentDoc } from '../../type/component-docs'
import {
  createInitialSlotEdits,
  getDefaultSlotExample,
  getResolvedSlotContent,
  type SlotEditMap,
} from '../../shared/slots/slotState'

export interface SlotsManagerOptions {
  getDoc: () => ComponentDoc | undefined
  onUpdate?: () => void
}

export function useSlotsManager(options: SlotsManagerOptions) {
  const slotEdits = reactive<SlotEditMap>({})
  const editingSlot = ref<string | null>(null)
  const currentSlotEdit = ref('')

  watch(
    () => options.getDoc(),
    () => {
      initializeSlotEdits()
      editingSlot.value = null
      currentSlotEdit.value = ''
    },
    { immediate: true }
  )

  function initializeSlotEdits() {
    replaceSlotEdits(createInitialSlotEdits(options.getDoc()))
  }

  function getSlotContent(): string | Record<string, string> {
    return getResolvedSlotContent(slotEdits)
  }

  function startEditSlot(slotName: string) {
    editingSlot.value = slotName
    currentSlotEdit.value = slotEdits[slotName] ?? getDefaultSlotValue(slotName)
  }

  function getDefaultSlotValue(slotName: string): string {
    return getDefaultSlotExample(options.getDoc(), slotName)
  }

  function applySlotEdit() {
    if (!editingSlot.value) return

    slotEdits[editingSlot.value] = currentSlotEdit.value
    editingSlot.value = null
    currentSlotEdit.value = ''
    options.onUpdate?.()
  }

  function cancelSlotEdit() {
    editingSlot.value = null
    currentSlotEdit.value = ''
  }

  function resetSlotEdits() {
    editingSlot.value = null
    currentSlotEdit.value = ''
    initializeSlotEdits()
  }

  function replaceSlotEdits(nextEdits: SlotEditMap) {
    Object.keys(slotEdits).forEach(key => {
      delete slotEdits[key]
    })

    Object.assign(slotEdits, nextEdits)
  }

  return {
    slotEdits,
    editingSlot,
    currentSlotEdit,
    initializeSlotEdits,
    getSlotContent,
    startEditSlot,
    applySlotEdit,
    cancelSlotEdit,
    resetSlotEdits,
  }
}
