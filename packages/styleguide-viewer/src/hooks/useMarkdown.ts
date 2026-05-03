import hljs from 'highlight.js'
import MarkdownIt from 'markdown-it'

const markdownRenderer = new MarkdownIt({
  highlight: (str: string, lang: string): string => {
    const validLang = lang && hljs.getLanguage(lang)

    if (validLang) {
      return `<pre class="hljs"><code>${hljs.highlight(str, { language: lang, ignoreIllegals: true }).value}</code></pre>`
    }

    return `<pre class="hljs"><code>${escapeHtml(str)}</code></pre>`
  },
})

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export function renderMarkdown(src?: string) {
  return markdownRenderer.render(src ?? '')
}
