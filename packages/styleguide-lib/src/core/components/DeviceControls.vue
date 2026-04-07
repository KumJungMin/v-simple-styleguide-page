<template>
  <div class="device-controls">
    <div class="device-controls__group">
      <button
        :class="['device-controls__button', { 'device-controls__button--active': props.selectedDevice === 'mobile' }]"
        @click="emit('select', 'mobile')"
      >mobile</button>
      <button
        :class="['device-controls__button', { 'device-controls__button--active': props.selectedDevice === 'tablet' }]"
        @click="emit('select', 'tablet')"
      >tablet</button>
      <button
        :class="['device-controls__button', { 'device-controls__button--active': props.selectedDevice === 'desktop' }]"
        @click="emit('select', 'desktop')"
      >desktop</button>
    </div>
    <span class="label">custom:</span>
    <input class="device-controls__input" type="number" :value="props.customWidth" @input="handleCustomWidthChange" />
    <button
      :class="['device-controls__button', { 'device-controls__button--active': props.selectedDevice === 'custom' }]"
      @click="emit('apply')"
    >apply</button>
    <span class="px">{{ props.previewWidth }}px</span>
  </div>
</template>

<script lang="ts" setup>
import { withDefaults, defineProps, defineEmits } from 'vue';
import type { Device } from '../composables/useDevicePreview';

const props = withDefaults(defineProps<{
  previewWidth: number;
  customWidth: number;
  selectedDevice: Device;
}>(), {});

const emit = defineEmits<{
  (e: 'select', device: Device): void;
  (e: 'update:customWidth', width: number): void;
  (e: 'apply'): void;
}>();

function handleCustomWidthChange(event: Event) {
  const target = event.target as HTMLInputElement;
  const value = Number(target.value);
  emit('update:customWidth', value);
}
</script>
