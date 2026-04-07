<template>
  <div class="styleguide-container">
    <nav v-if="effectiveDocs.length > 0" class="styleguide-nav">
      <div class="nav-tabs">
        <button
          v-for="(doc, index) in effectiveDocs"
          :key="`${doc.title}-${index}`"
          :class="navTabClass(index)"
          @click="activeDocIndex = index"
        >
          {{ doc.title }}
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
import type { ComponentDoc } from '../../type/component-docs'
import { type Device } from '../composables/useDevicePreview'
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
    desktop: 1200,
  }),
})

const injectedDocs = inject<ComponentDoc[]>(StyleguideDocsKey, [])
const activeDocIndex = ref(0)

const effectiveDocs = computed(() => props.docs?.length ? props.docs : injectedDocs)
const activeDoc = computed(() => effectiveDocs.value[activeDocIndex.value] ?? effectiveDocs.value[0])

watch(
  effectiveDocs,
  docs => {
    if (docs.length === 0) {
      activeDocIndex.value = 0
      return
    }

    if (activeDocIndex.value >= docs.length) {
      activeDocIndex.value = 0
    }
  },
  { immediate: true }
)

const navTabClass = (index: number) => ['nav-tab', { 'nav-tab--active': activeDocIndex.value === index }]
</script>
