<template>
  <div class="device-controls">
    <button @click="emit('select', 'mobile')">mobile</button>
    <button @click="emit('select', 'tablet')">tablet</button>
    <button @click="emit('select', 'desktop')">desktop</button>
    <span class="label">custom:</span>
    <input type="number" :value="props.customWidth" @input="handleCustomWidthChange" />
    <button @click="emit('apply')">apply</button>
    <span class="px">{{ props.previewWidth }}px</span>
  </div>
</template>

<script lang="ts" setup>
import { withDefaults, defineProps, defineEmits } from 'vue';
import type { Device } from '../composables/useDevicePreview';

const props = withDefaults(defineProps<{
  previewWidth: number;
  customWidth: number;
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
