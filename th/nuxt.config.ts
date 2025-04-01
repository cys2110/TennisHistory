// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-03-31",
  devtools: { enabled: true },
  modules: ["@nuxt/eslint", "@nuxt/image", "@vueuse/nuxt", "nuxt-echarts", "nuxt-neo4j", "@nuxt/ui-pro"],
  app: {
    layoutTransition: { name: "layout", mode: "out-in" },
    pageTransition: { name: "page", mode: "out-in" }
  },
  router: {
    options: { scrollBehaviorType: "smooth" }
  },
  routeRules: {
    "/h2h": { redirect: "/h2h/Jannik_Sinner-v-Alexander_Zverev/s0ag-z355" }
  },
  components: [
    {
      path: "~/components",
      pathPrefix: false
    }
  ],
  css: ["~/assets/css/main.css"],
  vite: {
    vue: {
      features: { propsDestructure: true }
    }
  },
  imports: {
    presets: [
      {
        from: "@vueuse/core",
        imports: ["breakpointsTailwind", "useBreakpoints", "watchArray", "whenever", "useCssVar"]
      },
      {
        from: "@vueuse/router",
        imports: ["useRouteQuery", "useRouteParams"]
      },
      {
        from: "convert",
        imports: ["convert"]
      }
    ]
  },
  neo4j: {
    uri: process.env.NEO4J_URI,
    auth: {
      type: "basic",
      username: process.env.NEO4J_USERNAME || "neo4j",
      password: process.env.NEO4J_PASSWORD || "password"
    }
  },
  echarts: {
    renderer: "canvas",
    charts: ["ScatterChart", "LineChart", "BarChart", "TreeChart", "GaugeChart", "PieChart"],
    components: ["DatasetComponent", "GridComponent", "TooltipComponent"]
  },
  ui: {
    theme: {
      colors: ["primary", "secondary", "neutral", "warning", "error", "success", "info"]
    }
  }
})
