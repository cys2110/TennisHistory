import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import 'vuetify/styles'
import './assets/main.css'
import { createVuetify } from 'vuetify'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { aliases, fa } from 'vuetify/iconsets/fa-svg'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fad } from '@fortawesome/pro-duotone-svg-icons'
import { fas } from '@fortawesome/pro-solid-svg-icons'
import { far } from '@fortawesome/pro-regular-svg-icons'
import { mdi } from 'vuetify/iconsets/mdi'
import { VCard, VImg, VSheet } from 'vuetify/lib/components/index.mjs'

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
        ViewSheet: VSheet,
        ShortCard: VCard,
        FlagImg: VImg
    },
      defaults: {
        ViewSheet: {
          class: 'bg-transparent my-10 pa-3 w-75 mx-auto'
        },
        ShortCard: {
          variant: 'text',
          class: 'bg-indigo-800',
          rounded: 'xl'
        },
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

app.mount('#app')
