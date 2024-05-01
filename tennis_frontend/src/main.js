import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { aliases, fa } from 'vuetify/iconsets/fa-svg'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fad } from '@fortawesome/pro-duotone-svg-icons'
import { fas } from '@fortawesome/pro-solid-svg-icons'
import { far } from '@fortawesome/pro-regular-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { mdi } from 'vuetify/iconsets/mdi'
import { VCard, VImg, VSheet } from 'vuetify/lib/components/index.mjs'

const vuetify = createVuetify({
    theme: {
      defaultTheme: 'dark'
    },
    icons: {
      defaultSet: 'fa',
      aliases,
      sets: {
        fa,
        mdi
      }
    },
    date: {
      locale: {
        en: 'en-GB'
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
        variant: 'elevated',
        color: 'indigo-darken-4',
        rounded: 'xl'
      },
      VAvatar: {
        variant: 'outlined'
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
library.add(fab)
library.add(far)
library.add(fad)

app.use(createPinia())
app.use(router)
app.use(vuetify)

app.mount('#app')
