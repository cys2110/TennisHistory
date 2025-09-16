// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@nuxt/eslint", "@nuxt/image", "nuxt-echarts", "nuxt-neo4j", "@vueuse/nuxt", "@nuxt/ui", "@nuxt/content", "nuxt-jsonld"],
  // Set page transitions
  app: { pageTransition: { name: "page", mode: "out-in" } },
  // Set scroll behaviour
  router: { options: { scrollBehaviorType: "smooth" } },
  // CSS path
  css: ["~/assets/css/main.css"],
  // Turn on typed router
  experimental: { typedPages: true },
  // Imports not required
  imports: {
    presets: [
      {
        from: "@vueuse/core",
        imports: [
          "breakpointsTailwind",
          "useBreakpoints",
          "useInfiniteScroll",
          "useResizeObserver",
          "useArrayUnique",
          "useDateFormat",
          "isDefined",
          "useSorted",
          "get",
          "set",
          "useArrayFilter",
          "useArrayMap",
          "useArrayJoin",
          "useArrayFindLast",
          "useArraySome"
        ]
      },
      {
        from: "@vueuse/router",
        imports: ["useRouteQuery"]
      },
      {
        from: "@vueuse/math",
        imports: ["useAverage"]
      },
      {
        from: "convert",
        imports: ["convert"]
      },
      {
        from: "change-case",
        imports: ["kebabCase", "capitalCase", "sentenceCase"]
      },
      {
        from: "kmh-to-mph",
        imports: [{ name: "default", as: "kmhToMph" }]
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
  // Nuxt UI configuration
  ui: {
    theme: {
      colors: [
        "primary",
        "neutral",
        "warning",
        "error",
        "success",
        "atp",
        "wta",
        "men",
        "women",
        "info",
        "singles",
        "doubles",
        "active",
        "inactive",
        "tour",
        "challenger",
        "itf",
        "main",
        "qualifying"
      ]
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
