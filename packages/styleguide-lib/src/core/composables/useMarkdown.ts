import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import xmlLang from 'highlight.js/lib/languages/xml'


/**
 * useMarkdown 훅은 MarkdownIt을 사용하여 마크다운 문자열을 HTML로 변환하는 기능을 제공합니다.
 * 또한 코드 블록에 대한 하이라이트를 지원합니다.
 *
 * @returns {Object} md - MarkdownIt 인스턴스, renderMarkdown - 마크다운 문자열을 HTML로 변환하는 함수
 */
export function useMarkdown() {
  hljs.registerLanguage('vue', xmlLang)

  const md = new MarkdownIt({
    highlight: (str: string, lang: string) => {
      const validLang = lang && hljs.getLanguage(lang)
      if (validLang) {
        /**
         * hljs.highlight()는 주어진 문자열을 지정된 언어로 하이라이트합니다.
         * ignoreIllegals 옵션은 잘못된 문법을 무시하고 가능한 부분만 하이라이트합니다.
         * */
        return `<pre class="hljs"><code>${hljs.highlight(str, { language: lang, ignoreIllegals: true }).value}</code></pre>`
      } else {
        /**
         * 언어가 유효하지 않거나 지원되지 않는 경우, 기본적으로 HTML로 이스케이프된 문자열을 반환합니다.
         * 코드 블록은 하이라이트되지 않지만, HTML 특수 문자가 이스케이프되어 안전하게 표시됩니다.(XSS 방지)
         */
        const escapeHtml = MarkdownIt().utils.escapeHtml

        return `<pre class="hljs"><code>${escapeHtml(str)}</code></pre>`
      }
      
    }
  })

  function renderMarkdown(src?: string) {
    return md.render(src ?? '')
  }

  return { md, renderMarkdown }
} 