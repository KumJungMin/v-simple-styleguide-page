<template>
  <div class="tab-content slots-tab">
    <h3>Slots</h3>
    <div v-if="props.slots && props.slots.length">
      <table class="slot-table" aria-label="Component slots">
        <thead>
          <tr>
            <th>name</th>
            <th>description</th>
            <th class="action-cell">action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="slot in props.slots" :key="slot.name">
            <td><code>{{ slot.name }}</code></td>
            <td>{{ slot.description || '-' }}</td>
            <td>
              <button 
                @click="emit('editSlot', slot.name)"
                class="edit-btn"
              >
                edit
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      
      <div v-if="props.editingSlot" class="slot-editor">
        <div class="editor-container">
          <div class="editor-header">
            <div class="editor-title">
              <div class="editor-indicator"></div>
              <h4>{{ editingSlot }} slot edit</h4>
            </div>
            <div class="editor-actions">
              <button 
                @click="emit('applySlotEdit')"
                class="btn btn-apply"
              >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                apply
              </button>
              <button 
                @click="emit('cancelSlotEdit')"
                class="btn btn-cancel"
              >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
                cancel
              </button>
            </div>
          </div>
          <div class="textarea-container">
            <textarea 
              :value="props.currentSlotEdit"
              @input="emit('update:currentSlotEdit', ($event.target as HTMLTextAreaElement).value)"
              class="slot-textarea"
              :placeholder="`${editingSlot} slot content...`"
            ></textarea>
            <div class="char-counter">
              {{ props.currentSlotEdit.length }} chars
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <p class="no-slots">This component does not support slots.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SlotDefinition } from '../../type/component-docs'

interface Props {
  slots?: SlotDefinition[]
  editingSlot: string | null
  currentSlotEdit: string
}

interface Emits {
  editSlot: [slotName: string]
  applySlotEdit: []
  cancelSlotEdit: []
  'update:currentSlotEdit': [value: string]
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
</script> 