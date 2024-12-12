import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { provideApolloClient } from '@vue/apollo-composable'
import PrimeVue from 'primevue/config'
import { definePreset } from '@primevue/themes'
import Aura from '@primevue/themes/aura'
import Tooltip from 'primevue/tooltip'

import apolloClient from './apollo'

const app = createApp(App)

provideApolloClient(apolloClient)

const MyPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '{violet.50}',
      100: '{violet.100}',
      200: '{violet.200}',
      300: '{violet.300}',
      400: '{violet.400}',
      500: '{violet.500}',
      600: '{violet.600}',
      700: '{violet.700}',
      800: '{violet.800}',
      900: '{violet.900}',
      950: '{violet.950}',
    },
  },
  components: {
    // used in header
    menubar: {
      background: 'transparent',
      borderColor: 'none',
      itemColor: '{zinc.400}',
      itemGap: '1rem',
      itemIconColor: '{zinc.400}',
      itemFocusBackground: 'transparent',
      mobileButtonHoverBackground: 'transparent',
      submenuBackground: '{violet.800}',
    },
    // used in player details
    card: {
      background: '{violet.800}',
      color: '{zinc.300}',
    },
    button: {
      smPaddingY: '.1rem',
    },
    select: {
      borderColor: '{violet.800}',
      smPaddingY: '.1rem',
      smPaddingX: '.2rem',
    },
    // Used in tournament & player breadcrumbs
    breadcrumb: {
      itemColor: '{emerald.600}',
      itemIconColor: '{emerald.500}',
      separatorColor: '{zinc.300}',
    },
    // Used in event & loading cards
    // dt: tournament card
    divider: {
      borderColor: '{zinc.500}',
      contentBackground: '{violet.800}',
      horizontalMargin: '0.5rem',
    },
    fieldset: {
      borderColor: '{violet.700}',
    },
    datatable: {
      rowBackground: '{zinc.700}',
    },
    toolbar: {
      borderColor: 'transparent',
    },
    progressbar: {
      height: '0.5rem',
      background: '{violet.800}',
      valueBackground: '{cyan.700}',
    },
    // Used in event, tournament, & loading cards
    panel: {
      borderColor: '{violet.800}',
    },
  },
})

app.use(router)
app.use(PrimeVue, {
  theme: {
    preset: MyPreset,
    options: {
      darkModeSelector: '.dark-mode',
    },
  },
})
app.directive('tooltip', Tooltip)

app.mount('#app')
