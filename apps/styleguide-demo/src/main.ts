import { createApp } from 'vue'
import { createReactRendererAdapter } from 'styleguide-runtime-react'
import App from './App.vue'
import './style.css'
import { createStyleguideViewer } from 'styleguide-viewer-vue'
import { componentDocs } from './docs'
import { reactRendererBridge } from './react/rendererBridge'

const app = createApp(App)

app.use(createStyleguideViewer({
  docs: componentDocs,
  renderers: [createReactRendererAdapter(reactRendererBridge)],
}))

app.mount('#app')
