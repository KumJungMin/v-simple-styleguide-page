import type { App, Plugin } from 'vue'
import type { ComponentDocsSource } from 'styleguide-schema'
import {
  createRendererRegistry,
  injectInlineStyle,
  injectStylesheet,
  normalizeDocs,
  type StyleguideRendererAdapter,
} from 'styleguide-core'
import { createVueRendererAdapter } from 'styleguide-runtime-vue'
import { StyleguideDocsKey, StyleguideRendererRegistryKey } from './symbols'
import StyleguideContainer from './components/StyleguideContainer.vue'
import WidgetComponentDoc from './components/ComponentDoc.vue'

import './styles/styleguide-viewer.css'
import hljsCSS from 'highlight.js/styles/github.css?inline'

export interface StyleguideViewerStyles {
  links?: string[]
  inline?: string[]
}

export interface StyleguideViewerOptions {
  docs: ComponentDocsSource
  renderers?: StyleguideRendererAdapter[]
  styles?: StyleguideViewerStyles
}

export function createStyleguideViewer({
  docs,
  renderers = [],
  styles,
}: StyleguideViewerOptions): Plugin {
  return {
    install(app: App) {
      const normalizedDocs = normalizeDocs(docs)
      const rendererRegistry = createRendererRegistry([createVueRendererAdapter(), ...renderers])

      app.provide(StyleguideDocsKey, normalizedDocs)
      app.provide(StyleguideRendererRegistryKey, rendererRegistry)
      app.component('StyleguideContainer', StyleguideContainer)
      app.component('WidgetComponentDoc', WidgetComponentDoc)

      if (typeof window !== 'undefined') {
        installViewerStyles(styles)
      }
    },
  }
}

function installViewerStyles(styles?: StyleguideViewerStyles) {
  const defaultStyleHref = new URL('./styles/styleguide-viewer.css', import.meta.url).href

  injectStylesheet(defaultStyleHref)
  styles?.links?.forEach(link => injectStylesheet(link))

  if (hljsCSS) {
    injectInlineStyle('__sg_hljs_css', hljsCSS as string)
  }

  styles?.inline?.forEach((css, idx) => {
    injectInlineStyle(`__sg_custom_css_${idx}`, css)
  })
}
