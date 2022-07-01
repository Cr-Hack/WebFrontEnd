import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.js'
import store from '@/store' // short for @/store/index

import '@fortawesome/fontawesome-free/js/all'

createApp(App).use(store).use(router).mount('#app')