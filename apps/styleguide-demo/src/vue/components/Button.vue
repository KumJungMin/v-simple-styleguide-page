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
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  block?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
  block: false,
})

const emit = defineEmits<{
  click: []
}>()

const buttonClasses = computed(() => [
  'button',
  `button--${props.variant}`,
  `button--${props.size}`,
  {
    'button--disabled': props.disabled,
    'button--block': props.block,
  },
])

function handleClick() {
  if (!props.disabled) {
    emit('click')
  }
}

function handleKeyDown(event: KeyboardEvent) {
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
  min-width: 118px;
  border: 1px solid #6d675d;
  border-radius: 16px;
  background: #2c2a25;
  color: #f6f0e6;
  cursor: pointer;
  font-weight: 700;
  letter-spacing: -0.02em;
  transition: transform 160ms ease, border-color 160ms ease, background-color 160ms ease, color 160ms ease;
}

.button:hover:not(:disabled) {
  transform: translateY(-1px);
  border-color: #f6f0e6;
}

.button:focus-visible {
  outline: 2px solid #f6f0e6;
  outline-offset: 2px;
}

.button--sm {
  min-height: 2.25rem;
  padding: 0.4rem 0.9rem;
  font-size: 0.9rem;
}

.button--md {
  min-height: 2.75rem;
  padding: 0.6rem 1.15rem;
  font-size: 1rem;
}

.button--lg {
  min-height: 3.25rem;
  padding: 0.78rem 1.3rem;
  font-size: 1.05rem;
}

.button--primary {
  background: #f5efe3;
  border-color: #f5efe3;
  color: #161513;
}

.button--secondary {
  background: #393731;
}

.button--danger {
  background: rgba(226, 75, 74, 0.14);
  border-color: rgba(226, 75, 74, 0.54);
  color: #ffb4ab;
}

.button--ghost {
  background: transparent;
}

.button--disabled,
.button:disabled {
  opacity: 0.38;
  cursor: not-allowed;
  transform: none;
}

.button--block {
  width: 100%;
}
</style>
