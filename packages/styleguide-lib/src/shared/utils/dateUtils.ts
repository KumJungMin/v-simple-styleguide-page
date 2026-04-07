/**
 * Flow:
 * 1. Receive a numeric timestamp from the event log.
 * 2. Convert it into a Date object.
 * 3. Return a local time string that is easy to scan in the UI.
 */
export function formatTimestamp(timestamp: number): string {
  const eventDate = new Date(timestamp)

  return eventDate.toLocaleTimeString()
}
