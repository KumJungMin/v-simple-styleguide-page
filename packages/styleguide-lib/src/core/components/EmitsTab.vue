<template>
  <div class="tab-content emits-tab">
    <table class="props-table" aria-label="Component emits">
      <thead>
        <tr>
          <th>event</th>
          <th>payload</th>
          <th>description</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="emitDef in props.emits" :key="emitDef.name">
          <td><code>{{ emitDef.name }}</code></td>
          <td><code>{{ emitDef.payload }}</code></td>
          <td>{{ emitDef.description }}</td>
        </tr>
      </tbody>
    </table>

    <div v-if="props.emitLogs.length" class="emits-log">
      <h3>event log</h3>
      <div class="log-container">
        <div v-for="(log, idx) in props.emitLogs" :key="idx" class="log-entry">
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
import { formatTimestamp } from '../../shared/utils/dateUtils'

interface Props {
  emits: EmitDefinition[]
  emitLogs: Array<{
    timestamp: number
    event: string
    payload: unknown
  }>
}

const props = defineProps<Props>()
</script>
