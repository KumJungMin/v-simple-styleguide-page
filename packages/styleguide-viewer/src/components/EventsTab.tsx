import type { EventDefinition } from 'styleguide-schema'
import { formatTimestamp, type StyleguideEventLogEntry } from 'styleguide-core'

interface EventsTabProps {
  events: EventDefinition[]
  eventLogs: StyleguideEventLogEntry[]
}

export function EventsTab({ events, eventLogs }: EventsTabProps) {
  return (
    <div className="tab-content events-tab">
      <table className="props-table" aria-label="Component events">
        <thead>
          <tr>
            <th>event</th>
            <th>payload</th>
            <th>description</th>
          </tr>
        </thead>
        <tbody>
          {events.map(eventDefinition => (
            <tr key={eventDefinition.name}>
              <td>
                <code>{eventDefinition.name}</code>
              </td>
              <td>
                <code>{eventDefinition.payload}</code>
              </td>
              <td>{eventDefinition.description}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {eventLogs.length > 0 && (
        <div className="events-log">
          <h3>event log</h3>
          <div className="log-container">
            {eventLogs.map((log, index) => (
              <div key={`${log.event}-${log.timestamp}-${index}`} className="log-entry">
                <span className="timestamp">{formatTimestamp(log.timestamp)}</span>
                <span className="event-name">{log.event}</span>
                <pre className="event-payload">{JSON.stringify(log.payload, null, 2)}</pre>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
