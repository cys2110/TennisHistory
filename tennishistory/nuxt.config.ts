// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  routeRules: {
    '/h2h': {redirect: '/h2h/jannik-sinner-v-alexander-zverev/s0ag-z355'},
  },
  css: ['~/assets/css/main.css'],
  ui: {
    theme: {
      colors: ['primary', 'secondary', 'neutral', 'warning', 'error']
    }
  },
  neo4j: {
    uri: process.env.NEO4J_URI,
    auth: {
      type: "basic",
      username: process.env.NEO4J_USERNAME || "neo4j",
      password: process.env.NEO4J_PASSWORD || "password"
    }
  },
  components: [
    {
      path: "~/components",
      pathPrefix: false
    }
  ],
  app: {
    pageTransition: { name: "page", mode: "out-in" }
  },
  router: {
    options: {
      scrollBehaviorType: "smooth"
    }
  },
  echarts: {
    renderer: "svg",
    charts: ["ScatterChart", "LineChart", "BarChart", "TreeChart", "GaugeChart", "PieChart"],
    components: ["DatasetComponent", "GridComponent", "TooltipComponent"]
  },
  modules: ["nuxt-neo4j", "@nuxt/image", "@vueuse/nuxt", "nuxt-echarts", '@nuxt/ui-pro'],
  imports: {
    dirs: [
      'utils'
    ],
    presets: [
      {
        from: '@vueuse/integrations/useChangeCase',
        imports: ['useChangeCase']
      },
      {
        from: '@vueuse/core',
        imports: ['breakpointsTailwind', 'useBreakpoints', 'watchArray']
      },
      {
        from: '@vueuse/router',
        imports: ['useRouteQuery', 'useRouteParams']
      },
      {
        from: 'convert',
        imports: ['convert']
      }
    ]
  }
})