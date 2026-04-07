/**
 * Clone the parent document styles into the iframe document without duplicates.
 */
export function cloneAndInjectParentStyles(doc: Document, sourceDoc: Document = document) {
  const parentStyles = Array.from(sourceDoc.querySelectorAll('link[rel="stylesheet"], style:not([scoped])'))
  const seenLinks = new Set<string>()
  const seenStyles = new Set<string>()
  const fragment = doc.createDocumentFragment()

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

  doc.head.appendChild(fragment)
}
