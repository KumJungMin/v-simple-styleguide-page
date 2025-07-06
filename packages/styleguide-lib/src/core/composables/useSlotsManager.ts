import { reactive, ref, watch, computed } from 'vue'
import type { ComponentDoc } from '../../type/component-docs'

export interface SlotsManagerOptions {
  doc: ComponentDoc | (() => ComponentDoc)
  onUpdate?: () => void
}

export function useSlotsManager(options: SlotsManagerOptions) {
  const { doc, onUpdate } = options

  const slotEdits = reactive<Record<string, string>>({})
  const editingSlot = ref<string | null>(null)
  const currentSlotEdit = ref('')

  const currentDoc = computed(() =>  typeof doc === 'function' ? doc() : doc)

  watch(currentDoc, () => {
    initializeSlotEdits()
    editingSlot.value = null
    currentSlotEdit.value = ''
  }, { immediate: true })

  function initializeSlotEdits() {
    Object.keys(slotEdits).forEach(key => delete slotEdits[key])
    
    const doc = currentDoc.value
    if (doc.namedSlots) {
      Object.entries(doc.namedSlots).forEach(([name, content]) => {
        slotEdits[name] = content
      })
    }
    if (doc.slots) {
      doc.slots.forEach(slot => {
        if (!slotEdits[slot.name]) {
          slotEdits[slot.name] = ''
        }
      })
    }
  }

  function getSlotContent(): string | Record<string, string> {
    const editedSlots = getEditedSlots()
    if (Object.keys(editedSlots).length > 0) {
      return editedSlots
    }
    const namedSlots = getNamedSlots()
    if (Object.keys(namedSlots).length > 0) {
      return namedSlots
    }
    return ''
  }

  function getEditedSlots(): Record<string, string> {
    const editedSlots: Record<string, string> = {}
    
    Object.entries(slotEdits).forEach(([name, content]) => {
      if (content && content.trim()) {
        editedSlots[name] = content
      }
    })
    
    return editedSlots
  }

  function getNamedSlots(): Record<string, string> {
    const namedSlots: Record<string, string> = {}
    const doc = currentDoc.value
    
    if (doc.namedSlots) {
      Object.entries(doc.namedSlots).forEach(([name, content]) => {
        if (content && content.trim()) {
          namedSlots[name] = content
        }
      })
    }
    
    return namedSlots
  }

  function startEditSlot(slotName: string) {
    editingSlot.value = slotName
    const currentValue = slotEdits[slotName] || getDefaultSlotValue(slotName)
    currentSlotEdit.value = currentValue
  }

  function getDefaultSlotValue(slotName: string): string {
    const doc = currentDoc.value
    if (doc.namedSlots && doc.namedSlots[slotName]) {
      return doc.namedSlots[slotName]
    }
    return ''
  }

  function applySlotEdit() {
    if (editingSlot.value) {
      slotEdits[editingSlot.value] = currentSlotEdit.value
      editingSlot.value = null
      currentSlotEdit.value = ''
      onUpdate?.()
    }
  }

  function cancelSlotEdit() {
    editingSlot.value = null
    currentSlotEdit.value = ''
  }

  function resetSlotEdits() {
    Object.keys(slotEdits).forEach(key => delete slotEdits[key])
    editingSlot.value = null
    currentSlotEdit.value = ''
    initializeSlotEdits()
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
    resetSlotEdits
  }
} 