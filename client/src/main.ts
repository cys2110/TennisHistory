import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import 'vuetify/styles'
import './assets/main.css'
import apolloClient from './apollo'
import { createVuetify } from 'vuetify'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { aliases, fa } from 'vuetify/iconsets/fa-svg'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fad } from '@fortawesome/pro-duotone-svg-icons'
import { fas } from '@fortawesome/pro-solid-svg-icons'
import { far } from '@fortawesome/pro-regular-svg-icons'
import { mdi } from 'vuetify/iconsets/mdi'
import { VImg } from 'vuetify/lib/components/index.mjs'

const vuetify = createVuetify({
    theme: {
        defaultTheme: 'dark'
    },
    date: {
        locale: {
            en: 'en-GB'
        }
    },
    icons: {
        defaultSet: 'fa',
        aliases,
        sets: {
          fa,
          mdi
        }
    },
    aliases: {
        FlagImg: VImg
    },
      defaults: {
        VAvatar: {
          variant: 'outlined',
          class: 'border-zinc-400'
        },
        FlagImg: {
          rounded: 'lg',
          class: 'border-thin'
        }
    }
})

const app = createApp(App)
app.component('font-awesome-icon', FontAwesomeIcon)
library.add(fas)
library.add(far)
library.add(fad)

app.use(router)
app.use(vuetify)
app.provide('apollo', apolloClient)

app.mount('#app')
