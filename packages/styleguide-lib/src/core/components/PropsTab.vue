<template>
  <div class="tab-content props-tab">
    <table class="props-table" aria-label="Component props">
      <thead>
        <tr>
          <th>name</th>
          <th>type</th>
          <th>required</th>
          <th>description</th>
          <th>edit</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="prop in props.props" :key="prop.name">
          <td>{{ prop.name }}</td>
          <td><code>{{ prop.type }}</code></td>
          <td class="text-center">{{ prop.required ? '✓' : '' }}</td>
          <td>{{ prop.description }}</td>
          <td>
            <div class="flex flex-col gap-1">
              <template v-if="getMode(prop) === 'select'">
                <select
                  :id="`prop-${prop.name}`"
                  v-model="props.currentProps[prop.name]"
                  class="prop-input"
                  @change="emitCurrentProps"
                >
                  <option v-for="option in getSelectOptions(prop)" :key="option" :value="option">
                    {{ option }}
                  </option>
                </select>
              </template>
              <template v-else-if="getMode(prop) === 'boolean'">
                <input
                  :id="`prop-${prop.name}`"
                  v-model="props.currentProps[prop.name]"
                  type="checkbox"
                  @change="emitCurrentProps"
                />
              </template>
              <template v-else-if="getMode(prop) === 'number'">
                <input
                  :id="`prop-${prop.name}`"
                  v-model.number="props.currentProps[prop.name]"
                  class="prop-input"
                  type="number"
                  @input="emitCurrentProps"
                />
              </template>
              <template v-else>
                <input
                  :id="`prop-${prop.name}`"
                  v-model="props.currentProps[prop.name]"
                  class="prop-input"
                  type="text"
                  @input="emitCurrentProps"
                />
              </template>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import type { PropDefinition } from '../../type/component-docs'
import {
  getInputMode,
  getSelectOptions,
  type InputMode,
} from '../../shared/props/propSchema'

interface Props {
  props: PropDefinition[]
  currentProps: Record<string, any>
}

interface Emits {
  'update:currentProps': [props: Record<string, any>]
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

function emitCurrentProps() {
  emit('update:currentProps', { ...props.currentProps })
}

function getMode(prop: PropDefinition): InputMode {
  return getInputMode(prop)
}
</script>
