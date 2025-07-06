import type { App, Plugin } from 'vue'
import type { ComponentDoc } from '../type/component-docs'
import { StyleguideDocsKey, StyleguideStylesKey } from './symbols'
import WidgetComponentDoc from './components/ComponentDoc.vue'
import StyleguideContainer from './components/StyleguideContainer.vue'
import './styles/styleguide-container.css'
import hljsCSS from 'highlight.js/styles/github.css?inline'

interface StyleguideStyles {
  links?: string[]       // external css links
  inline?: string[]      // raw css strings
}

interface StyleguideOptions {
  /**
   * Glob import result from import.meta.glob
   * Example: const docs = import.meta.glob('./data/docs/*.doc.ts', { eager: true })
   */
  docs: Record<string, unknown>
  visibilityProps?: string[]
  styles?: StyleguideStyles
}

export function createStyleguide({ docs, visibilityProps = ['visible','open','show','isOpen','isVisible','modelValue'], styles = {} }: StyleguideOptions): Plugin {
  // Normalize glob import result to ComponentDoc[]
  const docsArr: ComponentDoc[] = Object.values(docs).map((m:any)=>('default' in m? m.default:m)) as ComponentDoc[]

  return {
    install(app: App) {
      // Provide docs data
      app.provide(StyleguideDocsKey, docsArr)
      
      // Provide visibility props
      app.provide('styleguide-visibility-props', visibilityProps)
      
      // Provide styles
      app.provide(StyleguideStylesKey, styles)
      
      // Register global components
      app.component('WidgetComponentDoc', WidgetComponentDoc)
      app.component('StyleguideContainer', StyleguideContainer)

      // ---- Auto-inject global stylesheet once ----
      if (typeof window !== 'undefined') {
        const href = new URL('./styles/styleguide-container.css', import.meta.url).href
        if (!document.querySelector(`link[href="${href}"]`)) {
          const link = document.createElement('link')
          link.rel = 'stylesheet'
          link.href = href
          document.head.appendChild(link)
        }
      }

      // inject highlight.js style only once
      if (typeof window !== 'undefined' && hljsCSS) {
        if (!document.getElementById('__sg_hljs_css')) {
          const style = document.createElement('style')
          style.id = '__sg_hljs_css'
          style.textContent = hljsCSS as string
          document.head.appendChild(style)
        }
      }
    },
  }
} 