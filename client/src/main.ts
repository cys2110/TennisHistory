import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import { Tooltip } from 'primevue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { fad } from '@fortawesome/pro-duotone-svg-icons'

import App from './App.vue'
import router from './router'

library.add(fad)
const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(PrimeVue, { theme: 'none' })
app.component('fa-icon', FontAwesomeIcon)
app.directive('tooltip', Tooltip)

app.mount('#app')
