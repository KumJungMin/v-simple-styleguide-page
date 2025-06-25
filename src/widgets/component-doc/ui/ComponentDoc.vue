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

    <section v-for="example in doc.examples" :key="example.title" class="example-section">
      <h2>{{ example.title }}</h2>
      <div class="description" v-html="renderMarkdown(example.description)"></div>
      
      <div class="preview">
        <component 
          :is="component" 
          v-bind="example.props"
          v-on="getEventHandlers(example)"
        />
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
import { computed, ref } from 'vue'
import MarkdownIt from 'markdown-it'
import type { ComponentDoc, ComponentExample } from '@/entities/component/model/types'

const md = new MarkdownIt()

const props = defineProps<{
  doc: ComponentDoc
  component: any
}>()

const eventLogs = ref<Record<string, Array<{ event: string; payload: any; timestamp: number }>>>({})

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
  border: 1px solid var(--border-color);
  text-align: left;
}

.props-table th {
  background-color: var(--bg-light);
}

.example-section {
  margin: 3rem 0;
  padding: 2rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
}

.preview {
  margin: 1rem 0;
  padding: 2rem;
  background: var(--bg-light);
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
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.code-header button:hover {
  background: var(--primary-dark);
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
  background: var(--bg-light);
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

.log-container {
  margin-top: 1rem;
  padding: 1rem;
  background: var(--bg-light);
  border-radius: 4px;
  max-height: 300px;
  overflow-y: auto;
}

.log-entry {
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  background: white;
  border-radius: 4px;
}

.timestamp {
  color: #666;
  font-size: 0.9em;
  margin-right: 1rem;
}

.event-name {
  color: var(--primary-color);
  font-weight: bold;
  margin-right: 1rem;
}

.event-payload {
  margin: 0.5rem 0;
  padding: 0.5rem;
  background: #2d2d2d;
  color: #fff;
  border-radius: 4px;
  font-size: 0.9em;
}

.no-events {
  color: #666;
  font-style: italic;
}
</style> 