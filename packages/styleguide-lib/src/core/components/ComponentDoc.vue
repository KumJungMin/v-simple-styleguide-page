<template>
  <div v-if="effectiveDoc" class="component-doc">
    <header class="component-doc-header">
      <p class="component-doc-eyebrow">Component</p>
      <h2 class="component-doc-title">{{ effectiveDoc.title }}</h2>
      <div class="component-doc-meta">
        <span class="component-doc-badge">props {{ effectiveDoc.props?.length ?? 0 }}</span>
        <span class="component-doc-badge">events {{ effectiveDoc.emits?.length ?? 0 }}</span>
        <span class="component-doc-badge">slots {{ effectiveDoc.slots?.length ?? 0 }}</span>
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
        <button :class="tabManager.tabClass('emits')" @click="tabManager.setActiveTab('emits')">Emits</button>
        <button :class="tabManager.tabClass('slots')" @click="tabManager.setActiveTab('slots')">Slots</button>
      </div>

      <PropsTab
        v-if="tabManager.activeTab.value === 'props'"
        :current-props="propsManager.currentProps"
        :props="effectiveDoc.props ?? []"
        @update:current-props="handlePropsUpdate"
      />
      <EmitsTab
        v-else-if="tabManager.activeTab.value === 'emits'"
        :emit-logs="emitLogs"
        :emits="effectiveDoc.emits ?? []"
      />
      <SlotsTab
        v-else
        :current-slot-edit="slotsManager.currentSlotEdit.value"
        :editing-slot="slotsManager.editingSlot.value"
        :slots="effectiveDoc.slots"
        @apply-slot-edit="slotsManager.applySlotEdit"
        @cancel-slot-edit="slotsManager.cancelSlotEdit"
        @edit-slot="slotsManager.startEditSlot"
        @update:current-slot-edit="value => (slotsManager.currentSlotEdit.value = value)"
      />
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, nextTick, onMounted, ref, watch, withDefaults } from 'vue'
import type { ComponentDoc } from '../../type/component-docs'
import { useDevicePreview, type Device, type DeviceBreakpoints } from '../composables/useDevicePreview'
import { useIframeRenderer } from '../composables/useIframeRenderer'
import { useMarkdown } from '../composables/useMarkdown'
import { usePropsManager } from '../composables/usePropsManager'
import { useSlotsManager } from '../composables/useSlotsManager'
import { useTabManager } from '../composables/useTabManager'
import { StyleguideDocsKey } from '../symbols'
import DeviceControls from './DeviceControls.vue'
import EmitsTab from './EmitsTab.vue'
import PropsTab from './PropsTab.vue'
import SlotsTab from './SlotsTab.vue'

const DEFAULT_BREAKPOINTS: DeviceBreakpoints = {
  custom: 375,
  mobile: 375,
  tablet: 768,
  desktop: 1200,
}

const props = withDefaults(defineProps<{
  doc?: ComponentDoc
  component?: unknown
  deviceBreakpoints?: Record<Exclude<Device, 'custom'>, number>
}>(), {})

const injectedDocs = inject<ComponentDoc[]>(StyleguideDocsKey, [])
const iframeRef = ref<HTMLIFrameElement | null>(null)
const isMounted = ref(false)
const iframeHeight = 500

const { renderMarkdown } = useMarkdown()

const effectiveDoc = computed(() => props.doc ?? injectedDocs[0])
const effectiveComponent = computed(() => props.component ?? effectiveDoc.value?.component)
const renderedDescription = computed(() => renderMarkdown(effectiveDoc.value?.description))
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

const slotsManager = useSlotsManager({
  getDoc: () => effectiveDoc.value,
  onUpdate: scheduleRender,
})

const tabManager = useTabManager({
  onSlotsTabLeave: () => {
    slotsManager.editingSlot.value = null
    slotsManager.currentSlotEdit.value = ''
  },
})

const { renderToIframe, emitLogs, clearEmitLogs } = useIframeRenderer(iframeRef, {
  getComponent: () => effectiveComponent.value,
  getProps: () => propsManager.currentProps,
  getEmitDefs: () => effectiveDoc.value?.emits,
  getSlotContent: () => slotsManager.getSlotContent(),
})

onMounted(() => {
  isMounted.value = true
  scheduleRender()
})

watch([effectiveDoc, effectiveComponent], () => {
  clearEmitLogs()
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
  if (!isMounted.value || !effectiveDoc.value || !effectiveComponent.value) return

  nextTick(() => {
    renderToIframe()
  })
}
</script>
