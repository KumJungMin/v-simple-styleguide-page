<template>
  <div class="device-controls">
    <button @click="emit('select', 'mobile')">모바일</button>
    <button @click="emit('select', 'tablet')">태블릿</button>
    <button @click="emit('select', 'desktop')">데스크탑</button>
    <span class="label">커스텀:</span>
    <input type="number" :value="props.customWidth" @input="handleCustomWidthChange" />
    <button @click="emit('apply')">적용</button>
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
