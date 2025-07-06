<template>
  <div class="component-doc">
    <!-- Description -->
    <div class="description" v-html="renderedDescription"></div>

    <!-- Playground -->
    <section class="playground-section">
      <h2 class="sr-only">Playground</h2>
      <DeviceControls
        :preview-width="previewWidth"
        :custom-width="customWidth"
        @select="onSelect"
        @update:custom-width="updateCustomWidth"
        @apply="onApply"
      />
      <iframe
        ref="iframeRef"
        class="playground-iframe"
        :style="{ width: previewWidth + 'px', height: iframeHeight + 'px' }"
      ></iframe>
    </section>

    <!-- Tabs -->
    <section class="doc-tabs-section">
      <div class="tabs">
        <button 
          :class="tabManager.tabClass('props')" 
          @click="tabManager.setActiveTab('props')"
        >Props</button>
        <button 
          :class="tabManager.tabClass('emits')" 
          @click="tabManager.setActiveTab('emits')"
        >Emits</button>
        <button 
          :class="tabManager.tabClass('slots')" 
          @click="tabManager.setActiveTab('slots')"
        >Slots</button>
      </div>

      <PropsTab 
        v-if="tabManager.activeTab.value === 'props'"
        :props="effectiveDoc?.props || []"
        :current-props="propsManager.currentProps"
        @update:current-props="handlePropsUpdate"
      />
      <EmitsTab 
        v-else-if="tabManager.activeTab.value === 'emits'"
        :emits="effectiveDoc?.emits || []"
        :emit-logs="emitLogs"
      />
      <SlotsTab 
        v-else
        :slots="effectiveDoc?.slots"
        :editing-slot="slotsManager.editingSlot.value"
        :current-slot-edit="slotsManager.currentSlotEdit.value"
        @edit-slot="slotsManager.startEditSlot"
        @apply-slot-edit="slotsManager.applySlotEdit"
        @cancel-slot-edit="slotsManager.cancelSlotEdit"
        @update:current-slot-edit="(value) => slotsManager.currentSlotEdit.value = value"
      />
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted, nextTick, inject, withDefaults } from 'vue'
import { useMarkdown } from '../composables/useMarkdown'
import type { ComponentDoc } from '../../type/component-docs'
import { StyleguideDocsKey } from '../symbols'
import { useDevicePreview, Device } from '../composables/useDevicePreview'
import { useIframeRenderer } from '../composables/useIframeRenderer'
import { usePropsManager } from '../composables/usePropsManager'
import { useSlotsManager } from '../composables/useSlotsManager'
import { useTabManager } from '../composables/useTabManager'

import DeviceControls from './DeviceControls.vue'
import PropsTab from './PropsTab.vue'
import EmitsTab from './EmitsTab.vue'
import SlotsTab from './SlotsTab.vue'

const defaultBreakpoints: Record<Device, number> = {
  custom: 375,
  mobile: 375,
  tablet: 768,
  desktop: 1200
}

const props = withDefaults(defineProps<{
  doc?: ComponentDoc
  component?: any
  deviceBreakpoints?: Record<Exclude<Device, 'custom'>, number>
}>(), {})

const injectedDocs = inject<ComponentDoc[]>(StyleguideDocsKey, [])

const iframeRef = ref<HTMLIFrameElement | null>(null)
const iframeHeight = 500

const { renderMarkdown } = useMarkdown()

const effectiveDoc = computed<ComponentDoc | undefined>(() => props.doc ?? injectedDocs[0])

if (!effectiveDoc.value) {
  throw new Error('No doc available for WidgetComponentDoc. Please pass `doc` prop or provide docs via createStyleguide().')
}

const effectiveComponent = computed<any>(() => props.component ?? (effectiveDoc.value as any)?.component)
const renderedDescription = computed(() => renderMarkdown(effectiveDoc.value?.description))
const deviceBreakpoints = computed(() => ({ ...defaultBreakpoints, ...props.deviceBreakpoints })) 

const { previewWidth, customWidth, setPreviewWidth, updateCustomWidth, applyCustomWidth } = useDevicePreview(deviceBreakpoints.value)

const propsManager = usePropsManager({ props: effectiveDoc.value?.props || [] })
const slotsManager = useSlotsManager({
  doc: () => effectiveDoc.value!,
  onUpdate: () => nextTick(renderToIframe)
})
const tabManager = useTabManager({
  onSlotsTabLeave: () => {
    slotsManager.editingSlot.value = null
    slotsManager.currentSlotEdit.value = ''
  }
})
const { renderToIframe, emitLogs, clearEmitLogs } = useIframeRenderer(iframeRef, {
  effectiveComponent,
  currentProps: propsManager.currentProps,
  emitDefs: effectiveDoc.value?.emits ?? [],
  slotContent: computed(() => slotsManager.getSlotContent())
})


onMounted(() => {
  slotsManager.initializeSlotEdits()
  nextTick(renderToIframe)
})

watch(
  effectiveDoc,
  () => {
    if (effectiveDoc.value) {
      slotsManager.initializeSlotEdits()
      clearEmitLogs()
    }
  }
)
watch(
  () => propsManager.currentProps,
  () => {
    nextTick(renderToIframe)
  },
  { deep: true }
)

function handlePropsUpdate(newProps: Record<string, any>) {
  Object.assign(propsManager.currentProps, newProps)
  nextTick(renderToIframe)
}

function onSelect(device: Device) {
  setPreviewWidth(device)
  nextTick(renderToIframe)
}

function onApply() {
  applyCustomWidth()
  nextTick(renderToIframe)
}

</script>