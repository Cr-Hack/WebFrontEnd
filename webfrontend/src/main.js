import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.js'

import '@fortawesome/fontawesome-free/js/all'
import store from './store'

createApp(App).use(store).use(router).mount('#app')
