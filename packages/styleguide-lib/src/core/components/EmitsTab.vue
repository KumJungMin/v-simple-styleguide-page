<template>
  <div class="tab-content emits-tab">
    <table class="props-table" aria-label="Component emits">
      <thead>
        <tr>
          <th>이벤트</th>
          <th>페이로드</th>
          <th>설명</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="emit in props.emits" :key="emit.name">
          <td><code>{{ emit.name }}</code></td>
          <td><code>{{ emit.payload }}</code></td>
          <td>{{ emit.description }}</td>
        </tr>
      </tbody>
    </table>

    <div class="emits-log" v-if="props.emitLogs.length">
      <h3>이벤트 로그</h3>
      <div class="log-container">
        <div v-for="(log, idx) in emitLogs" :key="idx" class="log-entry">
          <span class="timestamp">{{ formatTimestamp(log.timestamp) }}</span>
          <span class="event-name">{{ log.event }}</span>
          <pre class="event-payload">{{ JSON.stringify(log.payload, null, 2) }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { EmitDefinition } from '../../type/component-docs'
import { formatTimestamp } from '../utils/dateUtils'

interface Props {
  emits: EmitDefinition[]
  emitLogs: Array<{
    timestamp: number
    event: string
    payload: any
  }>
}

const props = defineProps<Props>()
</script> 