<template>
  <div v-if="visible" class="modal-overlay" @click.self="handleOverlayClick">
    <div class="modal-content" :style="modalStyle">
      <button class="modal-close" @click="handleClose">×</button>
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  visible: boolean
  width?: string | number
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'overlayClick'): void
}>()

const modalStyle = computed(() => {
  let w = props.width
  if (!w) {
    // 기본값: 화면 크기에 따라 다르게
    if (window.innerWidth < 600) w = '90vw'
    else if (window.innerWidth < 1024) w = '60vw'
    else w = '400px'
  }
  return {
    width: typeof w === 'number' ? w + 'px' : w
  }
})

function handleClose() {
  emit('close')
}
function handleOverlayClick() {
  emit('overlayClick')
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-content {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 16px rgba(0,0,0,0.2);
  padding: 2rem 1.5rem 1.5rem 1.5rem;
  position: relative;
  transition: width 0.3s;
}
.modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
}
</style> 