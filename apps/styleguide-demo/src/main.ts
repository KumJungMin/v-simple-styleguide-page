import { createApp } from 'vue'
import App from './App.vue'
import { createStyleguide } from 'v-simple-styleguide'

// Import docs using glob pattern (like Storybook)
const docs = import.meta.glob('./docs/*.doc.ts', { eager: true })

const app = createApp(App)

// Use the styleguide plugin
app.use(createStyleguide({ 
  docs
}))

app.mount('#app') 