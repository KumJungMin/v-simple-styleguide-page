import { createApp } from 'vue'
import App from './App.vue'
import { createStyleguide } from 'vue-styleguide-lib'

// Import docs using glob pattern (like Storybook)
const docs = import.meta.glob('./docs/*.doc.ts', { eager: true })

const app = createApp(App)

// Use the styleguide plugin
app.use(createStyleguide({ 
  docs: Object.values(docs).map((doc: any) => doc.default)
}))

app.mount('#app') 