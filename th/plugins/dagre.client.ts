import dagre from '@dagrejs/dagre'

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.component('dagre', dagre)
})