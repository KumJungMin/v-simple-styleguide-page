/**
 * Flow:
 * 1. Check whether a stylesheet or style block is already present.
 * 2. Create the missing DOM node.
 * 3. Append it to the document head exactly once.
 */
export function injectStylesheet(stylesheetUrl: string, targetDocument: Document = document): void {
  if (hasStylesheet(stylesheetUrl, targetDocument)) {
    return
  }

  const stylesheetElement = targetDocument.createElement('link')
  stylesheetElement.rel = 'stylesheet'
  stylesheetElement.href = stylesheetUrl
  targetDocument.head.appendChild(stylesheetElement)
}

export function injectInlineStyle(
  styleElementId: string,
  cssText: string,
  targetDocument: Document = document
): void {
  if (targetDocument.getElementById(styleElementId)) {
    return
  }

  const styleElement = targetDocument.createElement('style')
  styleElement.id = styleElementId
  styleElement.textContent = cssText
  targetDocument.head.appendChild(styleElement)
}

function hasStylesheet(stylesheetUrl: string, targetDocument: Document): boolean {
  return Boolean(targetDocument.querySelector(`link[href="${stylesheetUrl}"]`))
}
