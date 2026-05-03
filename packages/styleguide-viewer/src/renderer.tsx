import { createElement } from 'react'
import type { ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import { createRendererAdapter, type RendererBridge } from 'styleguide-runtime'

function normalizeChildren(children?: unknown): ReactNode {
  if (typeof children === 'string') {
    return <div dangerouslySetInnerHTML={{ __html: children }} />
  }

  return children as ReactNode
}

export function createDefaultRendererAdapter() {
  const rendererBridge: RendererBridge = {
    render({ component, mountTarget, props, children }) {
      const root = createRoot(mountTarget)
      const normalizedChildren = normalizeChildren(children)

      root.render(createElement(component as never, props, normalizedChildren))

      return {
        unmount() {
          root.unmount()
        },
      }
    },
  }

  return createRendererAdapter(rendererBridge)
}
