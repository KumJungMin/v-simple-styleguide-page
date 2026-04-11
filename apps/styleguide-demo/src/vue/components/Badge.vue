<template>
  <span :class="['badge', `badge--${tone}`, `badge--${size}`]">
    <slot>{{ label }}</slot>
  </span>
</template>

<script setup lang="ts">
interface Props {
  tone?: 'neutral' | 'success' | 'warning' | 'danger' | 'info'
  size?: 'sm' | 'md'
  label?: string
}

withDefaults(defineProps<Props>(), {
  tone: 'neutral',
  size: 'md',
  label: 'Stable',
})
</script>

<style scoped>
.badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  border: 1px solid transparent;
  font-weight: 700;
  letter-spacing: -0.01em;
}

.badge--sm {
  min-height: 1.8rem;
  padding: 0.25rem 0.7rem;
  font-size: 0.78rem;
}

.badge--md {
  min-height: 2rem;
  padding: 0.3rem 0.85rem;
  font-size: 0.85rem;
}

.badge--neutral {
  background: rgba(245, 240, 228, 0.08);
  border-color: rgba(245, 240, 228, 0.16);
  color: #e8e1d0;
}

.badge--success {
  background: rgba(65, 178, 131, 0.14);
  border-color: rgba(65, 178, 131, 0.24);
  color: #8fe0b7;
}

.badge--warning {
  background: rgba(239, 159, 39, 0.14);
  border-color: rgba(239, 159, 39, 0.24);
  color: #f7c26a;
}

.badge--danger {
  background: rgba(226, 75, 74, 0.14);
  border-color: rgba(226, 75, 74, 0.24);
  color: #ff9f98;
}

.badge--info {
  background: rgba(55, 138, 221, 0.14);
  border-color: rgba(55, 138, 221, 0.24);
  color: #92c4ff;
}
</style>
