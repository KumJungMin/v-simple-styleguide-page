import { h, createApp, ref, onMounted, onBeforeUnmount, type ComputedRef } from 'vue'
import type { Ref } from 'vue'
import type { EmitDefinition } from '../../type/component-docs'

interface RenderToIframeOptions {
  effectiveComponent: Ref<any>
  currentProps: Record<string, any>
  emitDefs: EmitDefinition[]
  slotContent?: string | (() => any) | Record<string, string> | ComputedRef<string | Record<string, string>>
}

interface EmitLog {
  event: string
  payload: any
  timestamp: number
}

export function useIframeRenderer(
  iframeRef: Ref<HTMLIFrameElement | null>,
  options: RenderToIframeOptions
) {
  const emitLogs = ref<EmitLog[]>([])

  onMounted(() => {
    window.addEventListener('message', handleIframeEvent)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('message', handleIframeEvent)
  })

  function clearEmitLogs() {
    emitLogs.value = []
  }

  // iframe에서 발생하는 이벤트를 처리하는 함수입니다.
  // 부모 window로부터 메시지를 수신하고, 'component-event' 타입의 메시지를 처리합니다.
  function handleIframeEvent(event: MessageEvent) {
    if (event.data?.type === 'component-event') {
      emitLogs.value.push({
        event: event.data.event,
        payload: event.data.payload,
        timestamp: event.data.timestamp,
      })
    }
  }

  async function renderToIframe() {
    const iframe = iframeRef.value
    if (!iframe) return

    const doc = iframe.contentDocument
    if (!doc) return

    // 1단계) iframe의 문서 객체를 초기화합니다.
    doc.open()
    doc.write(`<!DOCTYPE html><html><head></head><body><div id="app"></div></body></html>`)
    doc.close()

    // 2단계) 부모 문서의 스타일 시트를 복제하여 iframe의 문서 객체에 삽입합니다.
    cloneAndInjectParentStyles(doc)

    setTimeout(async () => {
      if (!iframe.contentWindow) return

      // 3단계) Vue 런타임이 필요하다면 동적으로 삽입합니다.
      if (injectVueRuntimeIfNeeded(iframe, doc, () => renderToIframe())) {
        return
      }

      // 4단계) Vue 앱을 생성하고, 현재 컴포넌트와 props, emit 핸들러를 설정합니다.
      const emitHandlers = buildEmitHandlers(options.emitDefs)

      // 5단계) 기존 Vue 앱이 있다면 언마운트합니다.
      if ((iframe.contentWindow as any).__vue_app__) {
        (iframe.contentWindow as any).__vue_app__.unmount()
      }

      // 6단계) Vue 앱을 마운트할 컴포넌트를 정의합니다.
      // 이 컴포넌트는 현재 컴포넌트와 props, emit 핸들러를 사용하여 렌더링됩니다.
      // 또한, 슬롯 콘텐츠를 처리하여 Vue 슬롯으로 변환합니다.
      const WrapperComponent = {
        setup() {
          return () => {
            // resolveSlots 함수를 사용하여 슬롯 콘텐츠를 Vue 슬롯 객체로 변환합니다.
            const slots = resolveSlots(options.slotContent)

            // h 함수를 사용하여 현재 컴포넌트를 렌더링합니다.
            return h(
              options.effectiveComponent.value, // 렌더링할 컴포넌트
              { ...options.currentProps, ...emitHandlers }, // 컴포넌트에 전달할 props와 이벤트 핸들러
              Object.keys(slots).length > 0 ? slots : undefined // 슬롯이 하나라도 있으면 슬롯을 전달하고, 없으면 undefined를 전달합니다
            )
          }
        }
      }

      // 7단계) Vue 앱을 생성하고, WrapperComponent를 마운트합니다.
      // 이 앱은 iframe의 #app 요소에 마운트됩니다.
      // 또한, 생성된 Vue 앱 인스턴스를 iframe의 contentWindow에 저장합니다.
      // 이를 통해 다른 곳에서 Vue 앱에 접근할 수 있습니다.
      const app = createApp(WrapperComponent)
      app.mount(doc.getElementById('app') as HTMLElement)
      ;(iframe.contentWindow as any).__vue_app__ = app
    }, 50)  // setTimeout을 사용하여 DOM이 완전히 준비된 후에 앱을 마운트합니다.
  }

  return {
    renderToIframe,
    emitLogs,
    clearEmitLogs
  }
}



/**
 * 부모 문서의 모든 스타일 시트(`link[rel="stylesheet"]`, `style:not([scoped])`)를
 * 주어진 문서(`doc`)의 `<head>`에 복제하여 삽입합니다.
 * 동일한 href 또는 동일한 스타일 텍스트가 중복 삽입되지 않도록 처리합니다.
 * 
 * @param doc 스타일을 복제하여 삽입할 대상 문서 객체
 */
function cloneAndInjectParentStyles(doc: Document) {
  const parentStyles = Array.from(document.querySelectorAll('link[rel="stylesheet"], style:not([scoped])'))
  const seenLinks = new Set<string>() // 중복된 링크를 추적하기 위한 Set
  const seenStyles = new Set<string>() // 중복된 스타일 텍스트를 추적하기 위한 Set
  const fragment = doc.createDocumentFragment()

  parentStyles.forEach(node => {
    // 링크 요소인 경우 href 속성을 확인하고, 스타일 요소인 경우 텍스트 내용을 확인합니다.
    if (node.tagName === 'LINK' && (node as HTMLLinkElement).href) {
      const href = (node as HTMLLinkElement).href
      if (!seenLinks.has(href)) {
        seenLinks.add(href)
        fragment.appendChild(node.cloneNode(true))
      }
    } else if (node.tagName === 'STYLE' && node.textContent) {
      const text = node.textContent
      if (!seenStyles.has(text)) {
        seenStyles.add(text)
        fragment.appendChild(node.cloneNode(true))
      }
    }
  })
  doc.head.appendChild(fragment)
}

/**
 * 주어진 iframe에 Vue 런타임이 주입되어 있는지 확인하고, 필요하다면 동적으로 Vue 런타임 스크립트를 삽입합니다.
 * iframe 내부에서 Vue 기반 컴포넌트나 앱을 실행할 수 있게 준비하는 목적입니다.
 * 
 * - 이미 Vue 런타임이 존재하면 아무 작업도 하지 않고 false를 반환합니다.
 * - Vue 런타임 스크립트가 이미 삽입 중이면 true를 반환합니다.
 * - 그렇지 않으면 Vue 런타임 스크립트를 head에 추가하고, 로드 완료 시 콜백을 호출합니다.
 * 
 * @param iframe Vue 런타임을 주입할 대상 iframe 엘리먼트
 * @param doc iframe의 document 객체
 * @param callback Vue 런타임이 로드된 후 실행할 콜백 함수
 * @returns Vue 런타임 스크립트가 삽입되었거나 삽입 중이면 true, 이미 존재하면 false
 */
function injectVueRuntimeIfNeeded(
  iframe: HTMLIFrameElement,
  doc: Document,
  callback: () => void
): boolean {
  const iframeWindow = iframe.contentWindow as any
  if (iframeWindow.Vue) return false
  if (doc.getElementById('vue-runtime-script')) return true

  // 현재 부모 window에서 Vue를 iframe window로 복사
  if ((window as any).Vue) {
    iframeWindow.Vue = (window as any).Vue
    setTimeout(callback, 0)
    return false
  }

  // Vue가 없으면 에러 처리 또는 안내
  console.warn('Vue runtime not found in parent window.')
  return false
}

/**
 * 주어진 emit 정의 배열을 기반으로 이벤트 핸들러 함수 집합을 생성합니다.
 * 각 핸들러는 호출 시 인자를 직렬화하여 부모 window로 메시지를 전송하며,
 * iframe 간 컴포넌트 이벤트 통신에 사용됩니다.
 *
 * @param emitDefs - 이벤트 이름을 포함하는 emit 정의 객체 배열
 * @returns 핸들러 이름(예: `onClick`)과 함수가 매핑된 객체.
 *          각 함수는 인자를 직렬화하여 부모 window로 메시지를 postMessage 합니다.
 */
function buildEmitHandlers(emitDefs: EmitDefinition[]) {
  if (!emitDefs || emitDefs.length === 0) return {}

  const handlers: Record<string, (...args: any[]) => void> = {}

  for (let i = 0; i < emitDefs.length; i++) {
    const eventName = emitDefs[i].name
    const customHandlerName = `on${eventName.charAt(0).toUpperCase()}${eventName.slice(1)}`
    
    handlers[customHandlerName] = (...args: any[]) => {
      const serializablePayload = args.map(getSerializablePayload)

      /**
       * 부모 window로 메시지를 전송
       * type: 'component-event'는 이벤트 핸들러임을 나타냄
       *  event: 이벤트 이름, payload: 직렬화된 인자, timestamp: 현재 시간
       * '*'는 모든 도메인에서 메시지를 수신할 수 있도록 허용
       * */ 
      window.parent.postMessage(
        {
          type: 'component-event',
          event: eventName,
          payload: serializablePayload,
          timestamp: Date.now(),
        },
        '*'
      )
    }
  }
  return handlers
}

/**
 * 주어진 인자를 직렬화 가능한 형태로 변환합니다.
 * - Event 객체는 type, eventType, target 정보를 포함하는 객체로 변환합니다.
 * - 일반 객체는 JSON.stringify가 가능한 형태로 반환합니다.
 * - 직렬화할 수 없는 객체는 NonSerializableObject 타입으로 변환합니다.
 *
 * @param arg - 직렬화할 인자
 * @returns 직렬화 가능한 형태의 인자
 */
function getSerializablePayload(arg: any) {
  const target = arg.target && (arg.target as any).tagName
  ? { tagName: (arg.target as any).tagName }
  : null

  if (arg instanceof Event) {
    return { type: 'Event', eventType: arg.type, target  }
  } else if (typeof arg === 'object' && arg !== null) {
    try {
      JSON.parse(JSON.stringify(arg))
      return arg
    } catch {
      return { type: 'NonSerializableObject', value: String(arg) }
    }
  }
  return arg
}

/**
 * 주어진 슬롯 콘텐츠를 Vue 슬롯 객체로 변환합니다.
 * - 문자열은 div로 감싸진 HTML로 변환됩니다.
 * - 함수는 호출되어 VNode로 변환됩니다.
 * - 객체는 named slots로 변환되며, 'default' 슬롯은 div로 감싸집니다.
 *
 * @param slotContent - 슬롯 콘텐츠 (문자열, 함수, 객체 등)
 * @returns Vue 슬롯 객체
 */
function resolveSlots(slotContent: any) {
  // slotContent가 ComputedRef 또는 Ref인 경우, 내부 값을 가져옵니다.
  if (slotContent && typeof slotContent === 'object' && 'value' in slotContent) {
    slotContent = slotContent.value
  }

  // slotContent가 함수인 경우, Vue 슬롯 객체로 변환합니다.
  if (typeof slotContent === 'function') {
    return { default: slotContent }
  }

  // slotContent가 문자열인 경우, div로 감싸진 HTML로 변환합니다.
  // innerHTML을 사용하여 HTML 문자열을 삽입합니다.
  if (typeof slotContent === 'string') {
    return { default: () => h('div', { innerHTML: slotContent }) }
  }

  // slotContent가 객체인 경우, named slots로 변환합니다.
  // 각 키는 슬롯 이름이 되고, 값은 해당 슬롯의 콘텐츠가 됩니다.
  // 값이 함수인 경우 호출하여 VNode로 변환하고, 문자열인 경우
  // div로 감싸진 HTML로 변환합니다.
  if (slotContent && typeof slotContent === 'object') {
    const slots: Record<string, () => any> = {}
    for (const [name, content] of Object.entries(slotContent)) {
      slots[name] = () => typeof content === 'function' ? content() : h('div', { innerHTML: content })
    }
    return slots
  }
  
  return {}
}
