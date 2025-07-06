import type { App, Plugin } from 'vue'
import type { ComponentDoc } from '../type/component-docs'

import { StyleguideDocsKey } from './symbols'

import StyleguideContainer from './components/StyleguideContainer.vue'
import WidgetComponentDoc from './components/ComponentDoc.vue'

import './styles/styleguide-container.css'
import hljsCSS from 'highlight.js/styles/github.css?inline'

interface StyleguideStyles {
  links?: string[]
  inline?: string[]
}

interface StyleguideOptions {
  docs: Record<string, unknown>
  visibilityProps?: string[]
  styles?: StyleguideStyles
}

/**
 * Styleguide 플러그인을 생성합니다.
 *
 * @param docs - 스타일가이드에 사용할 컴포넌트 문서 객체입니다.
 * @returns Vue 플러그인 객체를 반환합니다.
 *
 * @remarks
 * - 앱에 StyleguideDocsKey로 컴포넌트 문서 배열을 provide합니다.
 * - 'StyleguideContainer' 컴포넌트를 전역 등록합니다.
 * - 브라우저 환경에서 styleguide-container.css와 highlight.js 스타일을 동적으로 주입합니다.
 */
export function createStyleguide({
  docs
}: StyleguideOptions): Plugin {
  return {
    install(app: App) {
      const docsArr: ComponentDoc[] = Object.values(docs).map((m: any) => 'default' in m ? m.default : m ) as ComponentDoc[]

      app.provide(StyleguideDocsKey, docsArr)
      app.component('StyleguideContainer', StyleguideContainer)
      app.component('WidgetComponentDoc', WidgetComponentDoc)

      if (typeof window !== 'undefined') {
        // styleguide-container.css 주입
        const href = new URL('./styles/styleguide-container.css', import.meta.url).href
        injectStylesheet(href)

        // highlight.js 스타일 주입
        if (hljsCSS)  injectInlineStyle('__sg_hljs_css', hljsCSS as string)
      }
    },
  }
}

function injectStylesheet(href: string) {
  if (!document.querySelector(`link[href="${href}"]`)) {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = href
    document.head.appendChild(link)
  }
}

function injectInlineStyle(id: string, css: string) {
  if (!document.getElementById(id)) {
    const style = document.createElement('style')
    style.id = id
    style.textContent = css
    document.head.appendChild(style)
  }
}
