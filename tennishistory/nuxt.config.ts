// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: "2024-11-01",
    devtools: { enabled: true },
    imports: {
        autoImport: true
    },
    modules: ["@nuxtjs/tailwindcss", "@primevue/nuxt-module", "nuxt-neo4j", "@vueuse/nuxt", "@nuxtjs/google-fonts", "@nuxtjs/color-mode", "@nuxt/icon", "nuxt-time", "@nuxt/image", "nuxt-echarts", "nuxt-lodash", "shadcn-nuxt", "nuxt-anchorscroll", "@nuxt/eslint"],
    app: {
        pageTransition: { name: "page", mode: "out-in" }
    },
    router: {
        options: {
            scrollBehaviorType: "smooth"
        }
    },
    shadcn: {
        prefix: "shadcn",
        componentDir: "./components/ui"
    },
    css: ["~/assets/css/tailwind.css"],
    tailwindcss: {
        cssPath: ["~/assets/css/tailwind.css", { injectPosition: "first" }],
        configPath: "tailwind.config",
        exposeConfig: {
            level: 2
        },
        config: {},
        viewer: true
    },
    primevue: {
        options: {
            theme: "none"
        },
        components: {
            prefix: "Prime",
            include: ["DataTable", "Fieldset", "FloatLabel", "MultiSelect", "ProgressBar", "ScrollTop", "Select", "SelectButton", "Stepper", "Timeline", "Toolbar"]
        },
        composables: {
            exclude: ["useToast"]
        }
    },
    postcss: {
        plugins: {
            "postcss-import": {},
            tailwindcss: {},
            autoprefixer: {}
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
    googleFonts: {
        families: {
            "Petit Formal Script": true,
            "Source Sans 3": true
        }
    },
    colorMode: {
        preference: "system",
        fallback: "dark"
    },
    echarts: {
        renderer: "svg",
        charts: ["ScatterChart", "LineChart", "BarChart", "TreeChart", "GaugeChart", "PieChart"],
        components: ["DatasetComponent", "GridComponent", "TooltipComponent"]
    }
});
