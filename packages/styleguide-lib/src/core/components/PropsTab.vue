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
        <tr v-for="prop in componentProps.props" :key="prop.name">
          <td>{{ prop.name }}</td>
          <td><code>{{ prop.type }}</code></td>
          <td class="text-center">{{ prop.required ? '✓' : '' }}</td>
          <td>{{ prop?.description }}</td>
          <td>
            <div class="flex flex-col gap-1">
              <template v-if="getMode(prop)==='select'">
                <select 
                  class="prop-input" 
                  v-model="componentProps.currentProps[prop.name]" 
                  :id="'prop-' + prop.name"
                  @change="$emit('update:currentProps', { ...componentProps.currentProps })"
                >
                  <option v-for="val in getSelectOptions(prop)" :key="val" :value="val">{{ val }}</option>
                </select>
              </template>
              <template v-else-if="getMode(prop)==='boolean'">
                <input 
                  type="checkbox" 
                  :id="'prop-' + prop.name" 
                  v-model="componentProps.currentProps[prop.name]"
                  @change="$emit('update:currentProps', { ...currentProps })"
                />
              </template>
              <template v-else-if="getMode(prop)==='number'">
                <input 
                  type="number" 
                  class="prop-input" 
                  v-model.number="componentProps.currentProps[prop.name]" 
                  :id="'prop-' + prop.name"
                  @input="$emit('update:currentProps', { ...componentProps.currentProps })"
                />
              </template>
              <template v-else>
                <input 
                  type="text" 
                  class="prop-input" 
                  v-model="currentProps[prop.name]" 
                  :id="'prop-' + prop.name"
                  @input="$emit('update:currentProps', { ...currentProps })"
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
import { isBoolean, isNumber, enumValues } from '../utils/typeUtils'

interface Props {
  props: PropDefinition[]
  currentProps: Record<string, any>
}

interface Emits {
  'update:currentProps': [props: Record<string, any>]
}

const componentProps = defineProps<Props>()
defineEmits<Emits>()

type InputMode = 'string' | 'number' | 'select' | 'boolean'

function getMode(prop: PropDefinition): InputMode {
  const ctrl = (prop as any).control as InputMode | undefined

  if (ctrl) return ctrl
  if (isBoolean(prop.type)) return 'boolean'
  if (isNumber(prop.type)) return 'number'
  if (enumValues(prop.type).length) return 'select'
  return 'string'
}

function getSelectOptions(prop: PropDefinition): string[] {
  const explicit = (prop as any).options as string[] | undefined
  
  if (explicit?.length) return explicit
  return enumValues(prop.type)
}
</script> 