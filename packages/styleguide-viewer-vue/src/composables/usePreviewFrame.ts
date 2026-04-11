import { onBeforeUnmount, ref, shallowRef, type Ref } from 'vue'
import type { NormalizedComponentDoc } from 'styleguide-schema'
import {
  bootstrapPreviewDocument,
  cloneAndInjectParentStyles,
  type ResolvedCompositionContent,
  type StyleguideEventLogEntry,
  type StyleguideRendererInstance,
  type StyleguideRendererRegistry,
} from 'styleguide-core'

export interface PreviewFrameOptions {
  getDoc: () => NormalizedComponentDoc | undefined
  getProps: () => Record<string, unknown>
  getComposition?: () => ResolvedCompositionContent
  rendererRegistry: StyleguideRendererRegistry
}

export function usePreviewFrame(
  iframeRef: Ref<HTMLIFrameElement | null>,
  options: PreviewFrameOptions
) {
  const eventLogs = ref<StyleguideEventLogEntry[]>([])
  const mountedRenderer = shallowRef<StyleguideRendererInstance | null>(null)

  onBeforeUnmount(() => {
    cleanupMountedRenderer()
  })

  function clearEventLogs() {
    eventLogs.value = []
  }

  function cleanupMountedRenderer() {
    if (!mountedRenderer.value) {
      return
    }

    mountedRenderer.value.unmount()
    mountedRenderer.value = null
  }

  function renderToIframe() {
    const iframe = iframeRef.value
    const componentDoc = options.getDoc()

    if (!iframe || !componentDoc?.component) {
      cleanupMountedRenderer()
      return
    }

    const targetDocument = iframe.contentDocument
    if (!targetDocument) {
      return
    }

    const rendererAdapter = options.rendererRegistry.getRendererForDoc(componentDoc)
    if (!rendererAdapter) {
      throw new Error(`No renderer registered for framework "${componentDoc.framework}".`)
    }

    bootstrapPreviewDocument(targetDocument)
    cloneAndInjectParentStyles(targetDocument)

    const mountTarget = targetDocument.getElementById('app')
    if (!mountTarget) {
      return
    }

    cleanupMountedRenderer()

    mountedRenderer.value = rendererAdapter.mount({
      doc: componentDoc,
      component: componentDoc.component,
      mountTarget,
      props: options.getProps(),
      compositionContent: options.getComposition?.(),
      onEvent(eventLogEntry) {
        eventLogs.value.push(eventLogEntry)
      },
    })
  }

  return {
    renderToIframe,
    eventLogs,
    clearEventLogs,
  }
}
