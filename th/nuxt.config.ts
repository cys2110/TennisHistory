// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  modules: ["@nuxt/eslint", "@nuxt/image", "@vueuse/nuxt", "nuxt-echarts", "nuxt-neo4j", "@nuxt/ui-pro", "@nuxt/content"],
  // Set page transitions
  app: {
    layoutTransition: { name: "layout", mode: "out-in" },
    pageTransition: { name: "page", mode: "out-in" }
  },
  // Set scroll behaviour
  router: {
    options: { scrollBehaviorType: "smooth" }
  },
  // Route rules
  routeRules: {
    "/h2h": { redirect: "/h2h/Jannik_Sinner-v-Alexander_Zverev/s0ag-z355" }
  },
  // Enable non-prefixed components
  components: [
    {
      path: "~/components",
      pathPrefix: false
    }
  ],
  // Css path
  css: ["~/assets/css/main.css"],
  // Enable props destructuring
  vite: {
    vue: {
      features: { propsDestructure: true }
    }
  },
  // Imports not required
  imports: {
    presets: [
      {
        from: "@vueuse/core",
        imports: ["breakpointsTailwind", "useBreakpoints", "useInfiniteScroll", "useResizeObserver"]
      },
      {
        from: "@vueuse/router",
        imports: ["useRouteQuery"]
      },
      {
        from: "convert",
        imports: ["convert"]
      }
    ]
  },
  // neo4j configuration
  neo4j: {
    uri: process.env.NEO4J_URI,
    auth: {
      type: "basic",
      username: process.env.NEO4J_USERNAME || "neo4j",
      password: process.env.NEO4J_PASSWORD || "password"
    }
  },
  // Echarts configuration
  echarts: {
    renderer: "canvas",
    charts: ["ScatterChart", "LineChart", "BarChart", "TreeChart", "GaugeChart", "PieChart"],
    components: ["DatasetComponent", "GridComponent", "TooltipComponent", "LegendComponent", "PolarComponent", "TransformComponent"],
    features: ["UniversalTransition", "LabelLayout"]
  },
  // Nuxt ui configuration
  ui: {
    theme: {
      colors: ["primary", "secondary", "neutral", "warning", "error", "success", "info"]
    }
  },
  // Custom icons
  icon: {
    customCollections: [
      {
        prefix: "flags",
        dir: "./assets/flags",
        normalizeIconName: false
      }
    ]
  }
})
