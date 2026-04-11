<template>
  <div class="styleguide-container">
    <nav v-if="effectiveDocs.length > 0" class="styleguide-nav">
      <p class="styleguide-nav-label">Components</p>
      <div class="nav-tabs">
        <button
          v-for="(doc, index) in effectiveDocs"
          :key="`${doc.id}-${index}`"
          :class="navTabClass(index)"
          @click="activeDocIndex = index"
        >
          <span class="nav-tab-dot" aria-hidden="true"></span>
          <span class="nav-tab-copy">
            <span class="nav-tab-title">{{ doc.title }}</span>
            <span class="nav-tab-framework">{{ doc.framework }}</span>
          </span>
        </button>
      </div>
    </nav>

    <main class="styleguide-content">
      <div v-if="effectiveDocs.length === 0" class="no-docs">
        <h2>문서가 없습니다</h2>
        <p>문서를 추가해주세요. (로드된 문서: {{ injectedDocs.length }}개)</p>
      </div>
      <WidgetComponentDoc
        v-else-if="activeDoc"
        :component="activeDoc.component"
        :device-breakpoints="deviceBreakpoints"
        :doc="activeDoc"
      />
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, ref, watch } from 'vue'
import type { ComponentDocsSource, NormalizedComponentDoc } from 'styleguide-schema'
import { normalizeDocs } from 'styleguide-core'
import { StyleguideDocsKey } from '../symbols'
import type { Device } from '../composables/useDevicePreview'
import WidgetComponentDoc from './ComponentDoc.vue'

interface Props {
  docs?: ComponentDocsSource
  deviceBreakpoints?: Record<Exclude<Device, 'custom'>, number>
}

const props = withDefaults(defineProps<Props>(), {
  deviceBreakpoints: () => ({
    mobile: 375,
    tablet: 768,
    desktop: 1200,
  }),
})

const injectedDocs = inject<NormalizedComponentDoc[]>(StyleguideDocsKey, [])
const activeDocIndex = ref(0)

const effectiveDocs = computed(() => {
  if (props.docs) {
    return normalizeDocs(props.docs)
  }

  return injectedDocs
})

const activeDoc = computed(() => effectiveDocs.value[activeDocIndex.value] ?? effectiveDocs.value[0])

watch(effectiveDocs, docs => {
  if (docs.length === 0) {
    activeDocIndex.value = 0
    return
  }

  if (activeDocIndex.value >= docs.length) {
    activeDocIndex.value = 0
  }
}, { immediate: true })

const navTabClass = (index: number) => ['nav-tab', { 'nav-tab--active': activeDocIndex.value === index }]
</script>
