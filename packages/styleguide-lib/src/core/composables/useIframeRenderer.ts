import { h, createApp, ref, onMounted, onBeforeUnmount, type ComputedRef } from 'vue'
import type { Ref } from 'vue'
import type { EmitDefinition } from '../../type/component-docs'

interface RenderToIframeOptions {
  effectiveComponent: Ref<any>
  currentProps: Record<string, any>
  emitDefs: EmitDefinition[]
  slotContent?: string | (() => any) | Record<string, string> | ComputedRef<string | Record<string, string>> // computed 지원
}

interface EmitLog {
  event: string
  payload: any
  timestamp: number
}

export function useIframeRenderer(iframeRef: Ref<HTMLIFrameElement | null>, options: RenderToIframeOptions) {
  const emitLogs = ref<EmitLog[]>([])

  function clearEmitLogs() {
    emitLogs.value = []
  }

  function handleIframeEvent(event: MessageEvent) {
    if (event.data?.type === 'component-event') {
      emitLogs.value.push({
        event: event.data.event,
        payload: event.data.payload,
        timestamp: event.data.timestamp,
      })
    }
  }

  async function renderToIframe(sfcTemplate?: string) {
    const iframe = iframeRef.value
    if (!iframe) return

    const doc = iframe.contentDocument
    if (!doc) return

    // HTML skeleton
    doc.open()
    doc.write(`<!DOCTYPE html><html><head></head><body><div id="app"></div></body></html>`)
    doc.close()

    // Clone and inject parent styles into iframe
    const parentStyles = [...document.querySelectorAll('link[rel="stylesheet"], style:not([scoped])')]
    parentStyles.forEach(node => {
      const clone = node.cloneNode(true) as HTMLElement
      doc.head.appendChild(clone)
    })

    setTimeout(async () => {
      if (!iframe.contentWindow) return

      // Vue 런타임이 없으면 head에 추가
      if (!(iframe.contentWindow as any).Vue) {
        const vueScript = doc.createElement('script')
        vueScript.src = 'https://unpkg.com/vue@3/dist/vue.global.prod.js'
        vueScript.onload = () => {
          (iframe.contentWindow as any).Vue = (iframe.contentWindow as any).Vue || (iframe.contentWindow as any).window.Vue
        }
        doc.head.appendChild(vueScript)
        // Vue가 로드될 때까지 대기 후 재호출
        vueScript.onload = () => setTimeout(() => renderToIframe(sfcTemplate), 50)
        return
      }

      // build emit handlers to postMessage
      const emitHandlers = (options.emitDefs ?? []).reduce<Record<string, (...args: any[]) => void>>(
        (handlers, def) => {
          const evtName = def.name
          handlers[`on${evtName.charAt(0).toUpperCase()}${evtName.slice(1)}`] = (
            ...args: any[]
          ) => {
            // Filter out non-serializable objects like Event instances
            const serializablePayload = args.map(arg => {
              if (arg instanceof Event) {
                return {
                  type: 'Event',
                  eventType: arg.type,
                  target: arg.target ? { tagName: (arg.target as any).tagName } : null
                }
              }
              if (typeof arg === 'object' && arg !== null) {
                try {
                  JSON.parse(JSON.stringify(arg))
                  return arg
                } catch {
                  return { type: 'NonSerializableObject', value: String(arg) }
                }
              }
              return arg
            })
            window.parent.postMessage(
              {
                type: 'component-event',
                event: evtName,
                payload: serializablePayload,
                timestamp: Date.now(),
              },
              '*'
            )
          }
          return handlers
        },
        {}
      )

      // unmount previous app if exists
      if ((iframe.contentWindow as any).__vue_app__) {
        ;(iframe.contentWindow as any).__vue_app__.unmount()
      }

      // SFC 템플릿이 있으면 단순 HTML로 렌더링 (동적 컴파일 대신)
      if (sfcTemplate) {
        const appDiv = doc.getElementById('app')
        if (appDiv) {
          appDiv.innerHTML = `<div style="padding: 20px; border: 1px solid #ccc; border-radius: 4px;">
            <h3>SFC Playground (미리보기)</h3>
            <p>동적 SFC 컴파일은 브라우저에서 지원되지 않습니다.</p>
            <p>대신 기본 컴포넌트와 props/slots를 사용하여 미리보기를 제공합니다.</p>
          </div>`
        }
        return
      }

      // 기존 방식: WrapperComponent
      const WrapperComponent = {
        setup() {
          return () => {
            // slot content 처리
            let defaultSlotVNode: any = undefined
            let namedSlots: Record<string, () => any> = {}
            
            // slotContent가 computed인지 확인하고 값을 가져오기
            let slotContent = options.slotContent
            if (slotContent && typeof slotContent === 'object' && 'value' in slotContent) {
              slotContent = slotContent.value
            }
            
            if (typeof slotContent === 'function') {
              defaultSlotVNode = slotContent()
            } else if (typeof slotContent === 'string') {
              defaultSlotVNode = h('div', { innerHTML: slotContent })
            } else if (typeof slotContent === 'object' && slotContent !== null) {
              // named slot 처리
              Object.entries(slotContent).forEach(([name, content]) => {
                if (name === 'default') {
                  defaultSlotVNode = h('div', { innerHTML: content })
                } else {
                  namedSlots[name] = () => h('div', { innerHTML: content })
                }
              })
            }

            // named slot이 있으면 default slot과 함께 전달
            const slots = defaultSlotVNode ? { default: () => defaultSlotVNode, ...namedSlots } : namedSlots
            
            return h(
              options.effectiveComponent.value,
              { ...options.currentProps, ...emitHandlers },
              Object.keys(slots).length > 0 ? slots : undefined
            )
          }
        }
      }

      // Create and mount Vue app
      const app = createApp(WrapperComponent)
      app.mount(doc.getElementById('app') as HTMLElement)
      ;(iframe.contentWindow as any).__vue_app__ = app
    }, 50)
  }

  onMounted(() => {
    window.addEventListener('message', handleIframeEvent)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('message', handleIframeEvent)
  })

  return { 
    renderToIframe,
    emitLogs,
    clearEmitLogs
  }
} 