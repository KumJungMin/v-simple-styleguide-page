import { createElement } from 'react'
import { createRoot } from 'react-dom/client'
import type { ReactRendererBridge } from 'styleguide-runtime-react'

function normalizeChildren(children?: unknown) {
  if (typeof children === 'string') {
    return createElement('div', {
      dangerouslySetInnerHTML: {
        __html: children,
      },
    })
  }

  return children
}

export const reactRendererBridge: ReactRendererBridge = {
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
