import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { provideApolloClient } from '@vue/apollo-composable'

import App from './App.vue'
import router from './router'
import apolloClient from './apollo'

const app = createApp(App)

provideApolloClient(apolloClient)

app.use(createPinia())
app.use(router)

app.mount('#app')
