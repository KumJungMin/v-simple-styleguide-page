import type { App, Plugin } from 'vue'
import type { ComponentDocsSource } from '../type/component-docs'

import { StyleguideDocsKey } from './symbols'

import StyleguideContainer from './components/StyleguideContainer.vue'
import WidgetComponentDoc from './components/ComponentDoc.vue'

import './styles/styleguide-container.css'
import hljsCSS from 'highlight.js/styles/github.css?inline'
import { normalizeDocs } from '../shared/docs/normalizeDocs'
import { injectInlineStyle, injectStylesheet } from '../shared/styles/styleInjector'

export interface StyleguideStyles {
  links?: string[]
  inline?: string[]
}

export interface StyleguideOptions {
  docs: ComponentDocsSource
  styles?: StyleguideStyles
}

export function createStyleguide({ docs, styles }: StyleguideOptions): Plugin {
  return {
    install(app: App) {
      const docsArr = normalizeDocs(docs)

      app.provide(StyleguideDocsKey, docsArr)
      app.component('StyleguideContainer', StyleguideContainer)
      app.component('WidgetComponentDoc', WidgetComponentDoc)

      if (typeof window !== 'undefined') {
        installStyleguideStyles(styles)
      }
    },
  }
}

function installStyleguideStyles(styles?: StyleguideStyles) {
  const defaultStyleHref = new URL('./styles/styleguide-container.css', import.meta.url).href

  injectStylesheet(defaultStyleHref)
  styles?.links?.forEach(link => injectStylesheet(link))

  if (hljsCSS) {
    injectInlineStyle('__sg_hljs_css', hljsCSS as string)
  }

  styles?.inline?.forEach((css, idx) => {
    injectInlineStyle(`__sg_custom_css_${idx}`, css)
  })
}
