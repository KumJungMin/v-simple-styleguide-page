<template>
  <div v-if="effectiveDoc" class="component-doc">
    <header class="component-doc-header">
      <p class="component-doc-eyebrow">{{ effectiveDoc.framework }} component</p>
      <h2 class="component-doc-title">{{ effectiveDoc.title }}</h2>
      <div class="component-doc-meta">
        <span class="component-doc-badge">props {{ effectiveDoc.props.length }}</span>
        <span class="component-doc-badge">events {{ effectiveDoc.events.length }}</span>
        <span class="component-doc-badge">
          {{ effectiveDoc.composition?.kind === 'children' ? 'children' : 'slots' }}
          {{ effectiveDoc.composition?.entries.length ?? 0 }}
        </span>
      </div>
    </header>

    <div class="description" v-html="renderedDescription"></div>

    <section class="playground-section">
      <h2 class="sr-only">Playground</h2>
      <DeviceControls
        :custom-width="customWidth"
        :preview-width="previewWidth"
        :selected-device="selectedDevice"
        @apply="onApply"
        @select="onSelect"
        @update:custom-width="updateCustomWidth"
      />
      <iframe
        ref="iframeRef"
        :style="{ width: `${previewWidth}px`, height: `${iframeHeight}px` }"
        class="playground-iframe"
      ></iframe>
    </section>

    <section class="doc-tabs-section">
      <div class="tabs">
        <button :class="tabManager.tabClass('props')" @click="tabManager.setActiveTab('props')">Props</button>
        <button :class="tabManager.tabClass('events')" @click="tabManager.setActiveTab('events')">Events</button>
        <button :class="tabManager.tabClass('composition')" @click="tabManager.setActiveTab('composition')">
          {{ compositionTabLabel }}
        </button>
      </div>

      <PropsTab
        v-if="tabManager.activeTab.value === 'props'"
        :current-props="propsManager.currentProps"
        :props="effectiveDoc.props"
        @update:current-props="handlePropsUpdate"
      />
      <EventsTab
        v-else-if="tabManager.activeTab.value === 'events'"
        :event-logs="eventLogs"
        :events="effectiveDoc.events"
      />
      <CompositionTab
        v-else
        :active-entry="compositionManager.activeEntry.value"
        :composition="effectiveDoc.composition"
        :current-entry-edit="compositionManager.currentEntryEdit.value"
        :entries="effectiveDoc.composition?.entries"
        @apply-entry-edit="compositionManager.applyEntryEdit"
        @cancel-entry-edit="compositionManager.cancelEntryEdit"
        @edit-entry="compositionManager.startEditEntry"
        @update:current-entry-edit="value => (compositionManager.currentEntryEdit.value = value)"
      />
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, nextTick, onMounted, ref, watch } from 'vue'
import type { ComponentDoc, NormalizedComponentDoc } from 'styleguide-schema'
import { createRendererRegistry, normalizeComponentDoc, type StyleguideRendererRegistry } from 'styleguide-core'
import { createVueRendererAdapter } from 'styleguide-runtime-vue'
import { StyleguideDocsKey, StyleguideRendererRegistryKey } from '../symbols'
import { useCompositionManager } from '../composables/useCompositionManager'
import { type Device, type DeviceBreakpoints, useDevicePreview } from '../composables/useDevicePreview'
import { useMarkdown } from '../composables/useMarkdown'
import { usePreviewFrame } from '../composables/usePreviewFrame'
import { usePropsManager } from '../composables/usePropsManager'
import { useTabManager } from '../composables/useTabManager'
import CompositionTab from './CompositionTab.vue'
import DeviceControls from './DeviceControls.vue'
import EventsTab from './EventsTab.vue'
import PropsTab from './PropsTab.vue'

const DEFAULT_BREAKPOINTS: DeviceBreakpoints = {
  custom: 375,
  mobile: 375,
  tablet: 768,
  desktop: 1200,
}

const props = defineProps<{
  doc?: ComponentDoc | NormalizedComponentDoc
  component?: unknown
  deviceBreakpoints?: Record<Exclude<Device, 'custom'>, number>
}>()

const injectedDocs = inject<NormalizedComponentDoc[]>(StyleguideDocsKey, [])
const rendererRegistry = inject<StyleguideRendererRegistry>(
  StyleguideRendererRegistryKey,
  createRendererRegistry([createVueRendererAdapter()])
)

const iframeRef = ref<HTMLIFrameElement | null>(null)
const isMounted = ref(false)
const iframeHeight = 500

const { renderMarkdown } = useMarkdown()

const effectiveDoc = computed(() => {
  const selectedDoc = props.doc ?? injectedDocs[0]

  return selectedDoc ? normalizeComponentDoc(selectedDoc as ComponentDoc) : undefined
})

const effectiveComponent = computed(() => props.component ?? effectiveDoc.value?.component)
const renderedDescription = computed(() => renderMarkdown(effectiveDoc.value?.description))
const compositionTabLabel = computed(() => effectiveDoc.value?.composition?.kind === 'children' ? 'Children' : 'Slots')
const resolvedBreakpoints = computed<DeviceBreakpoints>(() => {
  const merged = {
    mobile: DEFAULT_BREAKPOINTS.mobile,
    tablet: DEFAULT_BREAKPOINTS.tablet,
    desktop: DEFAULT_BREAKPOINTS.desktop,
    ...props.deviceBreakpoints,
  }

  return {
    ...merged,
    custom: merged.mobile,
  }
})

const { previewWidth, customWidth, selectedDevice, setPreviewWidth, updateCustomWidth, applyCustomWidth } = useDevicePreview({
  getBreakpoints: () => resolvedBreakpoints.value,
})

const propsManager = usePropsManager({
  getProps: () => effectiveDoc.value?.props,
})

const compositionManager = useCompositionManager({
  getDoc: () => effectiveDoc.value,
  onUpdate: scheduleRender,
})

const tabManager = useTabManager({
  onCompositionTabLeave: () => {
    compositionManager.activeEntry.value = null
    compositionManager.currentEntryEdit.value = ''
  },
})

const { renderToIframe, eventLogs, clearEventLogs } = usePreviewFrame(iframeRef, {
  getDoc: () => {
    if (!effectiveDoc.value || !effectiveComponent.value) {
      return undefined
    }

    return {
      ...effectiveDoc.value,
      component: effectiveComponent.value,
    }
  },
  getProps: () => propsManager.currentProps,
  getComposition: () => compositionManager.getCompositionContent(),
  rendererRegistry,
})

onMounted(() => {
  isMounted.value = true
  scheduleRender()
})

watch([effectiveDoc, effectiveComponent], () => {
  clearEventLogs()
  scheduleRender()
})

watch(
  () => propsManager.currentProps,
  () => {
    scheduleRender()
  },
  { deep: true }
)

function handlePropsUpdate(newProps: Record<string, any>) {
  propsManager.patchProps(newProps)
}

function onSelect(device: Device) {
  setPreviewWidth(device)
  scheduleRender()
}

function onApply() {
  applyCustomWidth()
  scheduleRender()
}

function scheduleRender() {
  if (!isMounted.value || !effectiveDoc.value || !effectiveComponent.value) {
    return
  }

  nextTick(() => {
    renderToIframe()
  })
}
</script>
