// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@nuxt/eslint", "nuxt-neo4j", "@nuxt/ui", "@vueuse/nuxt"],
  css: ["~/assets/css/main.css"],
  // neo4j configuration
  neo4j: {
    uri: process.env.NEO4J_URI,
    auth: {
      type: "basic",
      username: process.env.NEO4J_USERNAME || "neo4j",
      password: process.env.NEO4J_PASSWORD || "password"
    }
  },
  ui: {
    theme: {
      colors: ["primary", "Singles", "Doubles", "ATP", "WTA", "Men", "Women", "Main", "Qualifying", "error", "success"]
    }
  },
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
          "useArraySome",
          "useArrayEvery"
        ]
      }
      // {
      //   from: "@vueuse/router",
      //   imports: ["useRouteQuery"]
      // },
      // {
      //   from: "@vueuse/math",
      //   imports: ["useAverage"]
      // },
      // {
      //   from: "change-case",
      //   imports: ["kebabCase", "capitalCase", "sentenceCase"]
      // },
    ]
  }
})
