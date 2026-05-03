export function cloneAndInjectParentStyles(targetDocument: Document, sourceDocument: Document = document) {
  const parentStyles = Array.from(
    sourceDocument.querySelectorAll('link[rel="stylesheet"], style:not([scoped])')
  )
  const seenLinks = new Set<string>()
  const seenStyles = new Set<string>()
  const fragment = targetDocument.createDocumentFragment()

  parentStyles.forEach(node => {
    if (node.tagName === 'LINK' && (node as HTMLLinkElement).href) {
      const href = (node as HTMLLinkElement).href

      if (!seenLinks.has(href)) {
        seenLinks.add(href)
        fragment.appendChild(node.cloneNode(true))
      }

      return
    }

    if (node.tagName === 'STYLE' && node.textContent) {
      const text = node.textContent

      if (!seenStyles.has(text)) {
        seenStyles.add(text)
        fragment.appendChild(node.cloneNode(true))
      }
    }
  })

  targetDocument.head.appendChild(fragment)
}
