/// <reference types="vite/client" />

declare module 'highlight.js' {
  const value: any
  export default value
}

declare module 'highlight.js/lib/languages/*' {
  const value: any
  export default value
}

declare module '*.css' {
  const content: string
  export default content
}
