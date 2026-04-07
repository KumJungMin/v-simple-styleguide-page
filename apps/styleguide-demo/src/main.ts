import { createApp } from 'vue'
import App from './App.vue'
import './style.css'
import { createStyleguide } from '../../../packages/styleguide-lib/src'
import { componentDocs } from './docs'

const app = createApp(App)

app.use(createStyleguide({
  docs: componentDocs,
}))

app.mount('#app')
