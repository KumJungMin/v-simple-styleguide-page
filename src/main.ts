import { createApp, h } from 'vue'
import App from './App.vue'

const app = createApp(App)
app.mount('#app')

// iframe 미리보기를 위해 Vue를 window에 노출
window.Vue = { createApp, h } 