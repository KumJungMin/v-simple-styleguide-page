<template>
  <button 
    :class="buttonClasses"
    :disabled="disabled"
    @click="handleClick"
    @keydown="handleKeyDown"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'primary' | 'secondary' | 'outline'
  disabled?: boolean
  block?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  disabled: false,
  block: false
})

const emit = defineEmits<{
  click: []
}>()

const buttonClasses = computed(() => [
  'button',
  `button--${props.variant}`,
  {
    'button--disabled': props.disabled,
    'button--block': props.block
  }
])

const handleClick = (event: MouseEvent) => {
  if (!props.disabled) {
    emit('click')
  }
}

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    if (!props.disabled) {
      emit('click')
    }
  }
}
</script>

<style scoped>
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  border: 1px solid transparent;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.25rem;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.15s ease-in-out;
  min-height: 2.5rem;
}

.button:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

.button--primary {
  background-color: #3b82f6;
  color: white;
}

.button--primary:hover:not(:disabled) {
  background-color: #2563eb;
}

.button--secondary {
  background-color: #6b7280;
  color: white;
}

.button--secondary:hover:not(:disabled) {
  background-color: #4b5563;
}

.button--outline {
  background-color: transparent;
  color: #3b82f6;
  border-color: #3b82f6;
}

.button--outline:hover:not(:disabled) {
  background-color: #3b82f6;
  color: white;
}

.button--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.button--block {
  width: 100%;
}
</style> 