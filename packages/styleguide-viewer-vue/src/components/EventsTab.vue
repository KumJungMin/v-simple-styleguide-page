<template>
  <div class="tab-content events-tab">
    <table class="props-table" aria-label="Component events">
      <thead>
        <tr>
          <th>event</th>
          <th>payload</th>
          <th>description</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="eventDefinition in props.events" :key="eventDefinition.name">
          <td><code>{{ eventDefinition.name }}</code></td>
          <td><code>{{ eventDefinition.payload }}</code></td>
          <td>{{ eventDefinition.description }}</td>
        </tr>
      </tbody>
    </table>

    <div v-if="props.eventLogs.length" class="events-log">
      <h3>event log</h3>
      <div class="log-container">
        <div v-for="(log, idx) in props.eventLogs" :key="idx" class="log-entry">
          <span class="timestamp">{{ formatTimestamp(log.timestamp) }}</span>
          <span class="event-name">{{ log.event }}</span>
          <pre class="event-payload">{{ JSON.stringify(log.payload, null, 2) }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { EventDefinition } from 'styleguide-schema'
import type { StyleguideEventLogEntry } from 'styleguide-core'
import { formatTimestamp } from 'styleguide-core'

const props = defineProps<{
  events: EventDefinition[]
  eventLogs: StyleguideEventLogEntry[]
}>()
</script>
