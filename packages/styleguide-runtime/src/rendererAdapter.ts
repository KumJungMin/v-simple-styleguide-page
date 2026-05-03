import { buildEventHandlerProps, type StyleguideRendererAdapter } from 'styleguide-core'

export interface RendererBridge {
  render(options: {
    component: unknown
    mountTarget: HTMLElement
    props: Record<string, unknown>
    children?: unknown
  }): { unmount: () => void }
}

export function createRendererAdapter(
  rendererBridge: RendererBridge
): StyleguideRendererAdapter {
  return {
    mount(request) {
      const eventHandlerProps = buildEventHandlerProps({
        events: request.doc.events,
        onEvent: request.onEvent,
      })

      return rendererBridge.render({
        component: request.component,
        mountTarget: request.mountTarget,
        props: { ...request.props, ...eventHandlerProps },
        children: resolveChildren(request.compositionContent),
      })
    },
  }
}

function resolveChildren(compositionContent: string | undefined) {
  if (typeof compositionContent === 'string') {
    return compositionContent
  }

  return undefined
}
