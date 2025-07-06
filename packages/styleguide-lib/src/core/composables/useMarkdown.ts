import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import xmlLang from 'highlight.js/lib/languages/xml'

// Register vue template highlighting using xml definition
hljs.registerLanguage('vue', xmlLang)

const escapeHtml = MarkdownIt().utils.escapeHtml

export function useMarkdown() {
  const md = new MarkdownIt({
    highlight: (str: string, lang: string) => {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return `<pre class="hljs"><code>${hljs.highlight(str, { language: lang, ignoreIllegals: true }).value}</code></pre>`
        } catch {}
      }
      return `<pre class="hljs"><code>${escapeHtml(str)}</code></pre>`
    }
  })

  function renderMarkdown(src?: string) {
    return md.render(src ?? '')
  }

  return { md, renderMarkdown }
} 