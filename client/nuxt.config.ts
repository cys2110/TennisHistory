// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  imports: {
    autoImport: true,
  },
  modules: [
    "@nuxtjs/tailwindcss",
    "@primevue/nuxt-module",
    "nuxt-neo4j",
    "@vueuse/nuxt",
    "@nuxtjs/google-fonts",
    "@nuxtjs/color-mode",
    "@nuxt/icon",
    "@nuxt/ui",
    "nuxt-time",
    "@nuxt/image",
    "nuxt-echarts",
    "nuxt-lodash",
  ],
  app: {
    pageTransition: { name: "page", mode: "out-in" },
  },
  router: {
    options: {
      scrollBehaviorType: "smooth",
    },
  },
  css: ["~/assets/css/tailwind.css"],
  tailwindcss: {
    cssPath: ["~/assets/css/tailwind.css", { injectPosition: "first" }],
    configPath: "tailwind.config",
    exposeConfig: {
      level: 2,
    },
    config: {},
    viewer: true,
  },
  primevue: {
    options: {
      theme: "none",
    },
    components: {
      include: [
        "Accordion",
        "Avatar",
        "Button",
        "ButtonGroup",
        "Card",
        "DataTable",
        "Dialog",
        "Divider",
        "Fieldset",
        "FloatLabel",
        "InputText",
        "Message",
        "Popover",
        "Select",
        "SelectButton",
        "Stepper",
        "Tabs",
        "Timeline",
        "ToggleButton",
        "ToggleSwitch",
        "Toolbar",
      ],
    },
    composables: {
      exclude: ["useToast"],
    },
  },
  postcss: {
    plugins: {
      "postcss-import": {},
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  neo4j: {
    uri: process.env.NEO4J_URI,
    auth: {
      type: "basic",
      username: process.env.NEO4J_USERNAME || "neo4j",
      password: process.env.NEO4J_PASSWORD || "password",
    },
  },
  googleFonts: {
    families: {
      "Petit Formal Script": true,
      "Source Sans 3": true,
    },
  },
  colorMode: {
    preference: "system",
    fallback: "dark",
  },
  ui: {
    global: true,
    // disableGlobalStyles: true,
  },
  echarts: {
    renderer: "svg",
    charts: [
      "ScatterChart",
      "LineChart",
      "BarChart",
      "TreeChart",
      "GaugeChart",
      "PieChart",
    ],
    components: ["DatasetComponent", "GridComponent", "TooltipComponent"],
  },
});
