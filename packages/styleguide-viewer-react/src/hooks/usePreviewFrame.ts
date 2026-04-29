import { useCallback, useEffect, useRef, useState } from 'react'
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
  doc?: NormalizedComponentDoc
  props: Record<string, unknown>
  composition?: ResolvedCompositionContent
  rendererRegistry: StyleguideRendererRegistry
}

export function usePreviewFrame(options: PreviewFrameOptions) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null)
  const mountedRendererRef = useRef<StyleguideRendererInstance | null>(null)
  const [eventLogs, setEventLogs] = useState<StyleguideEventLogEntry[]>([])

  const cleanupMountedRenderer = useCallback(() => {
    mountedRendererRef.current?.unmount()
    mountedRendererRef.current = null
  }, [])

  const clearEventLogs = useCallback(() => {
    setEventLogs([])
  }, [])

  const renderToIframe = useCallback(() => {
    const iframe = iframeRef.current
    const componentDoc = options.doc

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

    mountedRendererRef.current = rendererAdapter.mount({
      doc: componentDoc,
      component: componentDoc.component,
      mountTarget,
      props: options.props,
      compositionContent: options.composition,
      onEvent(eventLogEntry) {
        setEventLogs(previousLogs => [...previousLogs, eventLogEntry])
      },
    })
  }, [cleanupMountedRenderer, options.composition, options.doc, options.props, options.rendererRegistry])

  useEffect(() => {
    return () => {
      cleanupMountedRenderer()
    }
  }, [cleanupMountedRenderer])

  return {
    iframeRef,
    renderToIframe,
    eventLogs,
    clearEventLogs,
  }
}
