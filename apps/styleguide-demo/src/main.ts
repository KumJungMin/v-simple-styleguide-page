import { createApp } from 'vue'
import App from './App.vue'
import { createStyleguide } from '../../../packages/styleguide-lib/src'

// Import docs using glob pattern (like Storybook)
const docs = import.meta.glob('./docs/*.doc.ts', { eager: true })

const app = createApp(App)

// Use the styleguide plugin
app.use(createStyleguide({ 
  docs: Object.values(docs).map((doc: any) => doc.default) as unknown as Record<string, unknown>
}))

app.mount('#app') 