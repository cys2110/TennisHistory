import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { provideApolloClient } from '@vue/apollo-composable'
import PrimeVue from 'primevue/config'
import Tooltip from 'primevue/tooltip'

import apolloClient from './apollo'

const app = createApp(App)

provideApolloClient(apolloClient)

app.use(router)
app.use(PrimeVue, { theme: 'none' })
app.directive('tooltip', Tooltip)

app.mount('#app')
