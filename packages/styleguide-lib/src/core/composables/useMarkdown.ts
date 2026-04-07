import hljs from 'highlight.js'
import xmlLang from 'highlight.js/lib/languages/xml'
import MarkdownIt from 'markdown-it'

/**
 * Flow:
 * 1. Register the Vue syntax once for code highlighting.
 * 2. Build a shared Markdown renderer with a custom highlight hook.
 * 3. Render markdown strings into HTML wherever the component docs need it.
 */
export function useMarkdown() {
  function renderMarkdown(markdownSource?: string) {
    return markdownRenderer.render(markdownSource ?? '')
  }

  return {
    markdownRenderer,
    md: markdownRenderer,
    renderMarkdown,
  }
}

function createMarkdownRenderer(): MarkdownIt {
  const renderer = new MarkdownIt()

  renderer.set({
    highlight: (rawCode: string, languageName: string): string =>
      renderHighlightedCode(renderer, rawCode, languageName),
  })

  return renderer
}

function renderHighlightedCode(
  renderer: MarkdownIt,
  rawCode: string,
  languageName: string
): string {
  if (canHighlightLanguage(languageName)) {
    const highlightedCode = hljs.highlight(rawCode, {
      language: languageName,
      ignoreIllegals: true,
    }).value

    return `<pre class="hljs"><code>${highlightedCode}</code></pre>`
  }

  return `<pre class="hljs"><code>${renderer.utils.escapeHtml(rawCode)}</code></pre>`
}

function canHighlightLanguage(languageName: string): boolean {
  return Boolean(languageName) && Boolean(hljs.getLanguage(languageName))
}

function registerVueLanguage(): void {
  if (!hljs.getLanguage('vue')) {
    hljs.registerLanguage('vue', xmlLang)
  }
}

registerVueLanguage()

const markdownRenderer = createMarkdownRenderer()
