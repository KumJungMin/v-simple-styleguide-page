import { buildEventHandlerProps, type StyleguideRendererAdapter } from 'styleguide-core'

export interface ReactRendererBridge {
  render(options: {
    component: unknown
    mountTarget: HTMLElement
    props: Record<string, unknown>
    children?: unknown
  }): { unmount: () => void }
}

export function createReactRendererAdapter(
  reactRendererBridge: ReactRendererBridge
): StyleguideRendererAdapter {
  return {
    framework: 'react',
    canRender(componentDoc) {
      return componentDoc.framework === 'react'
    },
    mount(request) {
      const eventHandlerProps = buildEventHandlerProps({
        framework: 'react',
        events: request.doc.events,
        onEvent: request.onEvent,
      })

      return reactRendererBridge.render({
        component: request.component,
        mountTarget: request.mountTarget,
        props: { ...request.props, ...eventHandlerProps },
        children: resolveReactChildren(request.compositionContent),
      })
    },
  }
}

function resolveReactChildren(compositionContent: string | Record<string, string> | undefined) {
  if (typeof compositionContent === 'string') {
    return compositionContent
  }

  if (compositionContent && typeof compositionContent === 'object') {
    return compositionContent.default ?? compositionContent
  }

  return undefined
}
