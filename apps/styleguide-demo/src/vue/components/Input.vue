<template>
  <label :class="['text-input', `text-input--${size}`, { 'text-input--disabled': disabled }]">
    <span v-if="label" class="text-input__label">{{ label }}</span>
    <input
      :disabled="disabled"
      :placeholder="placeholder"
      :value="modelValue"
      class="text-input__field"
      type="text"
      @focus="emit('focus')"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
  </label>
</template>

<script setup lang="ts">
interface Props {
  modelValue?: string
  placeholder?: string
  label?: string
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
}

withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: 'Search keyword',
  label: 'Field label',
  size: 'md',
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  focus: []
}>()
</script>

<style scoped>
.text-input {
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
  width: min(100%, 360px);
}

.text-input__label {
  color: #b7b1a6;
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.text-input__field {
  width: 100%;
  border: 1px solid #6d675d;
  border-radius: 16px;
  background: #21201d;
  color: #f6f0e6;
  font: inherit;
  outline: none;
  transition: border-color 160ms ease, box-shadow 160ms ease, transform 160ms ease;
}

.text-input__field::placeholder {
  color: #7d786c;
}

.text-input__field:focus {
  border-color: #f0e7d3;
  box-shadow: 0 0 0 4px rgba(240, 231, 211, 0.08);
  transform: translateY(-1px);
}

.text-input--sm .text-input__field {
  min-height: 2.5rem;
  padding: 0.65rem 0.95rem;
}

.text-input--md .text-input__field {
  min-height: 3rem;
  padding: 0.8rem 1rem;
}

.text-input--lg .text-input__field {
  min-height: 3.5rem;
  padding: 0.95rem 1.1rem;
}

.text-input--disabled .text-input__field {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
