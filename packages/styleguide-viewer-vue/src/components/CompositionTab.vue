<template>
  <div class="tab-content composition-tab">
    <h3>{{ headingLabel }}</h3>
    <div v-if="props.entries?.length">
      <table class="slot-table" aria-label="Component composition">
        <thead>
          <tr>
            <th>name</th>
            <th>description</th>
            <th class="action-cell">action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="entry in props.entries" :key="entry.name">
            <td><code>{{ entry.name }}</code></td>
            <td>{{ entry.description || '-' }}</td>
            <td>
              <button
                @click="emit('editEntry', entry.name)"
                class="edit-btn"
              >
                edit
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="props.activeEntry" class="slot-editor">
        <div class="editor-container">
          <div class="editor-header">
            <div class="editor-title">
              <div class="editor-indicator"></div>
              <h4>{{ props.activeEntry }} {{ entryLabel }} edit</h4>
            </div>
            <div class="editor-actions">
              <button @click="emit('applyEntryEdit')" class="btn btn-apply">apply</button>
              <button @click="emit('cancelEntryEdit')" class="btn btn-cancel">cancel</button>
            </div>
          </div>
          <div class="textarea-container">
            <textarea
              :value="props.currentEntryEdit"
              @input="emit('update:currentEntryEdit', ($event.target as HTMLTextAreaElement).value)"
              class="slot-textarea"
              :placeholder="`${props.activeEntry} ${entryLabel} content...`"
            ></textarea>
            <div class="char-counter">{{ props.currentEntryEdit.length }} chars</div>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <p class="no-slots">This component does not expose editable composition content.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { CompositionDefinition, CompositionEntryDefinition } from 'styleguide-schema'

const props = defineProps<{
  composition?: CompositionDefinition
  entries?: CompositionEntryDefinition[]
  activeEntry: string | null
  currentEntryEdit: string
}>()

const emit = defineEmits<{
  editEntry: [entryName: string]
  applyEntryEdit: []
  cancelEntryEdit: []
  'update:currentEntryEdit': [value: string]
}>()

const entryLabel = computed(() => props.composition?.kind === 'children' ? 'children' : 'slot')
const headingLabel = computed(() => props.composition?.kind === 'children' ? 'Children' : 'Slots')
</script>
