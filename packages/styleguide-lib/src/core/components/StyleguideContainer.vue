<template>
  <div class="styleguide-container">
    <!-- Navigation Tabs -->
    <nav v-if="effectiveDocs && effectiveDocs.length > 0" class="styleguide-nav">
      <div class="nav-tabs">
        <button
          v-for="(doc, index) in effectiveDocs"
          :key="index"
          :class="navTabClass(index)"
          @click="activeDocIndex = index"
        >
          {{ doc.title }}
        </button>
      </div>
    </nav>

    <!-- Content Area -->
    <main class="styleguide-content">
      <div v-if="!effectiveDocs || effectiveDocs.length === 0" class="no-docs">
        <h2>문서가 없습니다</h2>
        <p>문서를 추가해주세요. (로드된 문서: {{ injectedDocs.length }}개)</p>
      </div>
      <WidgetComponentDoc 
        v-else-if="activeDoc"
        :doc="activeDoc" 
        :component="activeDoc.component"
        :device-breakpoints="deviceBreakpoints"
      />
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, inject } from 'vue'

import { Device } from '../composables/useDevicePreview'
import type { ComponentDoc } from '../../type/component-docs'

import { StyleguideDocsKey } from '../symbols'
import WidgetComponentDoc from './ComponentDoc.vue'

interface Props {
  docs?: ComponentDoc[]
  deviceBreakpoints?: Record<Exclude<Device, 'custom'>, number>
}

const props = withDefaults(defineProps<Props>(), {
  deviceBreakpoints: () => ({
    mobile: 375,
    tablet: 768,
    desktop: 1200
  })
})

const injectedDocs = inject<ComponentDoc[]>(StyleguideDocsKey, [])

const activeDocIndex = ref(0)

const effectiveDocs = computed(() => props.docs || injectedDocs)
const activeDoc = computed(() => {
  if (!effectiveDocs.value || effectiveDocs.value.length === 0) return undefined
  
  return effectiveDocs.value[activeDocIndex.value] || effectiveDocs.value[0]
})

const navTabClass = (index: number) => ['nav-tab', { 'nav-tab--active': activeDocIndex.value === index }]
</script>
