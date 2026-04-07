import { createApp, h, onBeforeUnmount, onMounted, ref, shallowRef, type App as VueApp } from 'vue'
import type { Ref } from 'vue'
import type { EmitDefinition } from '../../type/component-docs'
import { cloneAndInjectParentStyles } from '../../shared/dom/styleSync'
import { buildEmitHandlers, isComponentEventMessage } from '../../shared/events/emitBridge'

interface RenderToIframeOptions {
  getComponent: () => unknown
  getProps: () => Record<string, any>
  getEmitDefs: () => EmitDefinition[] | undefined
  getSlotContent?: () => string | (() => unknown) | Record<string, string | (() => unknown)> | undefined
}

interface EmitLog {
  event: string
  payload: unknown
  timestamp: number
}

const IFRAME_BOOTSTRAP_HTML = `
<!DOCTYPE html>
<html>
  <head>
    <style>
      html, body {
        margin: 0;
        min-height: 100%;
        background: #2f2d28;
      }

      body {
        box-sizing: border-box;
        min-height: 100vh;
        padding: 40px 24px;
      }

      #app {
        min-height: calc(100vh - 80px);
        display: flex;
        align-items: center;
        justify-content: center;
      }

      #app > * {
        max-width: 100%;
      }
    </style>
  </head>
  <body>
    <div id="app"></div>
  </body>
</html>
`

export function useIframeRenderer(iframeRef: Ref<HTMLIFrameElement | null>, options: RenderToIframeOptions) {
  const emitLogs = ref<EmitLog[]>([])
  const mountedApp = shallowRef<VueApp | null>(null)

  onMounted(() => {
    window.addEventListener('message', handleIframeEvent)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('message', handleIframeEvent)
    cleanupMountedApp()
  })

  function clearEmitLogs() {
    emitLogs.value = []
  }

  function handleIframeEvent(event: MessageEvent) {
    const iframeWindow = iframeRef.value?.contentWindow

    if (event.source !== iframeWindow) return
    if (!isComponentEventMessage(event.data)) return

    emitLogs.value.push({
      event: event.data.event,
      payload: event.data.payload,
      timestamp: event.data.timestamp,
    })
  }

  function cleanupMountedApp() {
    if (!mountedApp.value) return

    mountedApp.value.unmount()
    mountedApp.value = null
  }

  function renderToIframe() {
    const iframe = iframeRef.value
    if (!iframe) return

    const doc = iframe.contentDocument
    if (!doc) return

    const component = options.getComponent()
    if (!component) {
      cleanupMountedApp()
      return
    }

    bootstrapIframeDocument(doc)
    cloneAndInjectParentStyles(doc)

    const mountTarget = doc.getElementById('app')
    if (!mountTarget) return

    cleanupMountedApp()

    const emitHandlers = buildEmitHandlers(options.getEmitDefs() ?? [])

    const wrapperComponent = {
      setup() {
        return () => {
          const slots = resolveSlots(options.getSlotContent?.())
          return h(
            component as never,
            { ...options.getProps(), ...emitHandlers },
            Object.keys(slots).length > 0 ? slots : undefined
          )
        }
      },
    }

    const app = createApp(wrapperComponent)
    app.mount(mountTarget)
    mountedApp.value = app
  }

  return {
    renderToIframe,
    emitLogs,
    clearEmitLogs,
  }
}

function bootstrapIframeDocument(doc: Document) {
  doc.open()
  doc.write(IFRAME_BOOTSTRAP_HTML)
  doc.close()
}

function resolveSlots(slotContent: string | (() => unknown) | Record<string, string | (() => unknown)> | undefined) {
  if (typeof slotContent === 'function') {
    return { default: slotContent }
  }

  if (typeof slotContent === 'string') {
    return { default: () => h('div', { innerHTML: slotContent }) }
  }

  if (slotContent && typeof slotContent === 'object') {
    const slots: Record<string, () => unknown> = {}

    Object.entries(slotContent).forEach(([name, content]) => {
      slots[name] = () => (typeof content === 'function' ? content() : h('div', { innerHTML: content }))
    })

    return slots
  }

  return {}
}
