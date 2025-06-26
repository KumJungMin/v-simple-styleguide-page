<template>
  <div class="component-doc">
    <h1>{{ doc?.title }}</h1>
    <div class="description" v-html="renderedDescription"></div>

    <section class="props-section">
      <h2>Props</h2>
      <table class="props-table">
        <thead>
          <tr>
            <th>이름</th>
            <th>타입</th>
            <th>필수</th>
            <th>기본값</th>
            <th>설명</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="prop in doc.props" :key="prop.name">
            <td>{{ prop.name }}</td>
            <td><code>{{ prop.type }}</code></td>
            <td>{{ prop.required ? '✓' : '' }}</td>
            <td><code>{{ prop.default }}</code></td>
            <td>{{ prop?.description }}</td>
          </tr>
        </tbody>
      </table>
    </section>

    <section class="emits-section" v-if="doc.emits.length > 0">
      <h2>Emits</h2>
      <table class="props-table">
        <thead>
          <tr>
            <th>이벤트</th>
            <th>페이로드</th>
            <th>설명</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="emit in doc.emits" :key="emit.name">
            <td><code>{{ emit.name }}</code></td>
            <td><code>{{ emit.payload }}</code></td>
            <td>{{ emit.description }}</td>
          </tr>
        </tbody>
      </table>
    </section>

    <section v-for="example in localExamples" :key="example.title" class="example-section">
      <h2>{{ example.title }}</h2>
      <div class="description" v-html="renderMarkdown(example.description)"></div>
      
      <div class="preview">
        <div class="device-controls" style="margin-bottom: 1rem; display: flex; gap: 0.5rem; align-items: center;">
          <button @click="setPreviewWidth(example, 'mobile')">모바일</button>
          <button @click="setPreviewWidth(example, 'tablet')">태블릿</button>
          <button @click="setPreviewWidth(example, 'desktop')">데스크탑</button>
          <span>커스텀:</span>
          <input type="range" min="320" max="1920" v-model="example._customWidth" @input="setPreviewWidth(example, 'custom')" style="width:120px;" />
          <span>{{ getPreviewWidth(example) }}px</span>
        </div>
        <iframe
          :ref="el => setIframeRef(example, el as HTMLIFrameElement | null)"
          :style="{ width: getPreviewWidth(example) + 'px', height: '400px', border: '1px solid #ccc', background: '#fff' }"
        ></iframe>
      </div>

      <div class="code-section">
        <div class="code-header">
          <h3>코드</h3>
          <button @click="copyCode(example.code)">복사</button>
        </div>
        <pre><code>{{ example.code }}</code></pre>
      </div>

      <div class="props-controls" v-if="Object.keys(example.props).length > 0">
        <h3>Props 컨트롤</h3>
        <div class="prop-control" v-for="(value, key) in example.props" :key="key">
          <label :for="key">{{ key }}</label>
          <input 
            v-if="typeof value === 'string'"
            type="text"
            :id="key"
            v-model="example.props[key]"
          >
          <input 
            v-else-if="typeof value === 'boolean'"
            type="checkbox"
            :id="key"
            v-model="example.props[key]"
          >
          <input 
            v-else-if="typeof value === 'number'"
            type="number"
            :id="key"
            v-model.number="example.props[key]"
          >
        </div>
        <button class="rerender-btn" @click="rerenderExample(example)">리렌더링</button>
      </div>

      <div class="emits-log" v-if="example.emits">
        <h3>이벤트 로그</h3>
        <div class="log-container">
          <div v-for="(log, index) in eventLogs[example.title]" :key="index" class="log-entry">
            <span class="timestamp">{{ formatTimestamp(log.timestamp) }}</span>
            <span class="event-name">{{ log.event }}</span>
            <pre class="event-payload">{{ JSON.stringify(log.payload, null, 2) }}</pre>
          </div>
          <div v-if="!eventLogs[example.title]?.length" class="no-events">
            아직 발생한 이벤트가 없습니다.
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, nextTick, watch, onBeforeUnmount } from 'vue'
import MarkdownIt from 'markdown-it'
import type { ComponentDoc, ComponentExample } from '../types/component-docs'

const md = new MarkdownIt()

const props = defineProps<{
  doc: ComponentDoc
  component: any
}>()

const eventLogs = ref<Record<string, Array<{ event: string; payload: any; timestamp: number }>>>({})

const localExamples = ref(props.doc.examples.map(e => ({ ...e })))

watch(() => props.doc.examples, (newVal) => {
  localExamples.value = newVal.map(e => ({ ...e }))
}, { deep: true })

const renderedDescription = computed(() => {
  return md.render(props.doc.description)
})

const renderMarkdown = (text: string) => {
  return md.render(text)
}

const copyCode = (code: string) => {
  navigator.clipboard.writeText(code)
}

const getEventHandlers = (example: ComponentExample) => {
  if (!example.emits) return {}
  
  return Object.keys(example.emits).reduce((handlers, eventName) => {
    handlers[eventName] = (payload: any) => {
      if (!eventLogs.value[example.title]) {
        eventLogs.value[example.title] = []
      }
      eventLogs.value[example.title].push({
        event: eventName,
        payload,
        timestamp: Date.now()
      })
    }
    return handlers
  }, {} as Record<string, (payload: any) => void>)
}

const formatTimestamp = (timestamp: number) => {
  return new Date(timestamp).toLocaleTimeString()
}

// 각 example별로 iframe ref와 width 상태 관리
const iframeRefs = ref<Record<string, HTMLIFrameElement | null>>({})
const previewWidths = ref<Record<string, number>>({})

function setIframeRef(example: ComponentExample, el: HTMLIFrameElement | null) {
  if (el) {
    iframeRefs.value[example.title] = el
    nextTick(() => renderToIframe(example))
  }
}

function getPreviewWidth(example: ComponentExample) {
  if (previewWidths.value[example.title]) return previewWidths.value[example.title]
  return example._customWidth || 375
}

function setPreviewWidth(example: ComponentExample, type: 'mobile' | 'tablet' | 'desktop' | 'custom') {
  if (type === 'mobile') previewWidths.value[example.title] = 375
  else if (type === 'tablet') previewWidths.value[example.title] = 768
  else if (type === 'desktop') previewWidths.value[example.title] = 1200
  else if (type === 'custom') previewWidths.value[example.title] = example._customWidth || 375
  nextTick(() => renderToIframe(example))
}

// iframe에서 postMessage로 전달된 이벤트를 수신해 로그에 기록
function handleIframeEvent(event: MessageEvent) {
  if (event.data?.type === 'component-event') {
    const { exampleTitle, event: eventName, payload } = event.data;
    if (!eventLogs.value[exampleTitle]) {
      eventLogs.value[exampleTitle] = [];
    }
    eventLogs.value[exampleTitle].push({
      event: eventName,
      payload,
      timestamp: Date.now()
    });
  }
}

onMounted(() => {
  window.addEventListener('message', handleIframeEvent);
  props.doc.examples.forEach(ex => {
    if (ex._customWidth === undefined) ex._customWidth = 375
  })
})
onBeforeUnmount(() => {
  window.removeEventListener('message', handleIframeEvent);
})

// iframe에 컴포넌트 렌더링
function renderToIframe(example: ComponentExample) {
  const iframe = iframeRefs.value[example.title]
  if (!iframe) return
  // iframe 초기화
  const doc = iframe.contentDocument
  if (!doc) return
  doc.open()
  doc.write(`<!DOCTYPE html><html><head></head><body><div id='app'></div></body></html>`)
  doc.close()
  // 부모의 스타일을 iframe에 복사
  const parentHead = document.head;
  const iframeHead = doc.head;
  [...parentHead.querySelectorAll('style,link[rel="stylesheet"]')].forEach(node => {
    iframeHead.appendChild(node.cloneNode(true));
  });
  // Vue 앱 mount
  setTimeout(() => {
    if (!iframe.contentWindow) return
    const win: any = window.parent;
    const { createApp, h } = win.Vue;
    const comp = props.component;
    // 기존 앱이 있으면 unmount
    if ((iframe.contentWindow as any).__vue_app__) {
      (iframe.contentWindow as any).__vue_app__.unmount();
    }
    // emits를 postMessage로 부모에게 전달하는 핸들러 생성
    function serializeEvent(e: any) {
      if (!e || typeof e !== 'object') return e;
      if ('type' in e && 'target' in e) {
        return {
          type: e.type,
          clientX: e.clientX,
          clientY: e.clientY,
          altKey: e.altKey,
          ctrlKey: e.ctrlKey,
          shiftKey: e.shiftKey,
          metaKey: e.metaKey,
          button: e.button,
          buttons: e.buttons,
          detail: e.detail,
        };
      }
      return e;
    }
    const emitHandlers = Object.fromEntries(
      Object.keys(example.emits || {}).map(eventName => [
        'on' + eventName.charAt(0).toUpperCase() + eventName.slice(1),
        (payload: any) => {
          window.parent.postMessage(
            {
              type: 'component-event',
              exampleTitle: example.title,
              event: eventName,
              payload: serializeEvent(payload)
            },
            '*'
          );
        }
      ])
    );
    const app = createApp({
      render() {
        return h(comp, { ...example.props, ...emitHandlers })
      }
    })
    app.mount(iframe.contentDocument?.getElementById('app'));
    // 새 앱을 저장
    (iframe.contentWindow as any).__vue_app__ = app;
  }, 50)
}

// example props 변경 시 iframe 다시 렌더
watch(() => props.doc.examples.map(e => e.props), () => {
  props.doc.examples.forEach(ex => renderToIframe(ex))
}, { deep: true })

function propsToCodeString(props: Record<string, any>) {
  return Object.entries(props)
    .map(([key, value]) => {
      if (typeof value === 'string') {
        // 문자열이지만 true/false/숫자처럼 보이면 바인딩
        if (value === 'true' || value === 'false' || /^\d+$/.test(value)) {
          return `:${key}="${value}"`
        }
        return `${key}="${value}"`
      }
      if (typeof value === 'boolean') {
        return value ? key : ''
      }
      if (typeof value === 'number') {
        return `:${key}="${value}"`
      }
      return ''
    })
    .filter(Boolean)
    .join(' ')
}

function updateExampleCode(example: ComponentExample) {
  // 기존 코드에서 태그명, children 추출
  const match = example.code.match(/^<([A-Za-z0-9_]+)[^>]*>([\s\S]*)<\/[A-Za-z0-9_]+>$/)
  if (match) {
    const tag = match[1]
    const children = match[2]
    example.code = `<${tag} ${propsToCodeString({ ...example.props })}>${children}</${tag}>`
    console.log('example.code',  example.code)
  } else {
    // self-closing 태그 등은 단순 치환
    const tagMatch = example.code.match(/^<([A-Za-z0-9_]+)[^>]*\/>$/)
    if (tagMatch) {
      const tag = tagMatch[1]
      example.code = `<${tag} ${propsToCodeString(example.props)} />`
    }
  }
  // 배열 자체를 갱신하여 Vue 반응성 보장
  props.doc.examples = [...props.doc.examples]
}

function rerenderExample(example: ComponentExample) {
  updateExampleCode(example)
  renderToIframe(example)
}
</script>

<style scoped>
.component-doc {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.description {
  margin: 1rem 0;
  line-height: 1.6;
}

.props-section,
.emits-section {
  margin: 2rem 0;
}

.props-table {
  width: 100%;
  border-collapse: collapse;
  margin: 1rem 0;
}

.props-table th,
.props-table td {
  padding: 0.75rem;
  border: 1px solid #eee;
  text-align: left;
}

.props-table th {
  background-color: #f5f5f5;
}

.example-section {
  margin: 3rem 0;
  padding: 2rem;
  border: 1px solid #eee;
  border-radius: 8px;
}

.preview {
  margin: 1rem 0;
  padding: 2rem;
  background: #f5f5f5;
  border-radius: 4px;
}

.code-section {
  margin: 1rem 0;
}

.code-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.code-header button {
  padding: 0.5rem 1rem;
  background: #2196F3;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.code-header button:hover {
  background: #1976D2;
}

pre {
  background: #2d2d2d;
  color: #fff;
  padding: 1rem;
  border-radius: 4px;
  overflow-x: auto;
}

.props-controls {
  margin-top: 2rem;
  padding: 1rem;
  background: #f9f9f9;
  border-radius: 4px;
}

.prop-control {
  margin: 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.prop-control label {
  min-width: 100px;
}

.prop-control input {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.emits-log {
  margin-top: 2rem;
  padding: 1rem;
  background: #f9f9f9;
  border-radius: 4px;
}

.log-container {
  max-height: 300px;
  overflow-y: auto;
  background: #fff;
  border: 1px solid #eee;
  border-radius: 4px;
  padding: 1rem;
}

.log-entry {
  padding: 0.5rem;
  border-bottom: 1px solid #eee;
  font-family: monospace;
}

.log-entry:last-child {
  border-bottom: none;
}

.timestamp {
  color: #666;
  margin-right: 1rem;
}

.event-name {
  color: #2196F3;
  font-weight: bold;
  margin-right: 1rem;
}

.event-payload {
  margin: 0.5rem 0 0 0;
  padding: 0.5rem;
  background: #f5f5f5;
  border-radius: 4px;
  font-size: 0.9em;
}

.no-events {
  color: #666;
  text-align: center;
  padding: 1rem;
}

.rerender-btn {
  margin-top: 1rem;
  padding: 0.5rem 1.2rem;
  background: #2196F3;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}
.rerender-btn:hover {
  background: #1976D2;
}
</style> 