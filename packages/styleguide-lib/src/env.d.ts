/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'highlight.js' {
  const value: any
  export default value
}

declare module 'highlight.js/lib/languages/*' {
  const value: any
  export default value
}

declare module '*.css?inline' {
  const content: string
  export default content
} 