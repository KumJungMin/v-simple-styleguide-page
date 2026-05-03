export function getPreviewDocumentMarkup() {
  return `
<!DOCTYPE html>
<html>
  <head>
    <style>
      html, body {
        margin: 0;
        min-height: 100%;
        background: #2f2d28;
      }

      body {
        box-sizing: border-box;
        min-height: 100vh;
        padding: 40px 24px;
      }

      #app {
        min-height: calc(100vh - 80px);
        display: flex;
        align-items: center;
        justify-content: center;
      }

      #app > * {
        max-width: 100%;
      }
    </style>
  </head>
  <body>
    <div id="app"></div>
  </body>
</html>
`
}

export function bootstrapPreviewDocument(targetDocument: Document) {
  targetDocument.open()
  targetDocument.write(getPreviewDocumentMarkup())
  targetDocument.close()
}
