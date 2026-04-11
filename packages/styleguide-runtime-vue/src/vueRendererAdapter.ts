import { createApp, h } from 'vue'
import { buildEventHandlerProps, type StyleguideRendererAdapter } from 'styleguide-core'

export function createVueRendererAdapter(): StyleguideRendererAdapter {
  return {
    framework: 'vue',
    canRender(componentDoc) {
      return componentDoc.framework === 'vue'
    },
    mount(request) {
      const eventHandlerProps = buildEventHandlerProps({
        framework: 'vue',
        events: request.doc.events,
        onEvent: request.onEvent,
      })

      const wrapperComponent = {
        setup() {
          return () => {
            const slots = resolveVueComposition(request.compositionContent)

            return h(
              request.component as never,
              { ...request.props, ...eventHandlerProps },
              Object.keys(slots).length > 0 ? slots : undefined
            )
          }
        },
      }

      const app = createApp(wrapperComponent)
      app.mount(request.mountTarget)

      return {
        unmount() {
          app.unmount()
        },
      }
    },
  }
}

function resolveVueComposition(
  compositionContent: string | Record<string, string> | undefined
): Record<string, () => unknown> {
  if (typeof compositionContent === 'string') {
    return compositionContent
      ? { default: () => h('div', { innerHTML: compositionContent }) }
      : {}
  }

  if (compositionContent && typeof compositionContent === 'object') {
    const slots: Record<string, () => unknown> = {}

    Object.entries(compositionContent).forEach(([entryName, entryContent]) => {
      slots[entryName] = () => h('div', { innerHTML: entryContent })
    })

    return slots
  }

  return {}
}
