import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver, VueUseDirectiveResolver } from 'unplugin-vue-components/resolvers'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    AutoImport({
      resolvers: [ElementPlusResolver(), VueUseDirectiveResolver()],
      include: [
        /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
        /\.vue$/, // .vue files
        /\.vue\?vue/, // Vue files in Vite (with ?vue suffix)
      ],
      imports: [
        'vue',
        'vue-router',
        '@vueuse/core',
        {
          '@vueuse/router': ['useRouteParams'],
        },
        // {
        //   luxon: ['DateTime'],
        // },
        {
          from: 'vue-router',
          imports: ['RouteLocationRaw'],
          type: true,
        },
      ],
      dirsScanOptions: { types: true },
      dirs: [
        './src/composables/**',
        './src/utils/**',
        {
          glob: './src/types/**',
          types: true,
        },
        {
          glob: './src/api/**',
          types: true,
        },
        {
          glob: './src/utils/**',
          types: true,
        },
        {
          glob: './src/composables/**',
          types: true,
        },
      ],
      dts: './auto-imports.d.ts',
      vueTemplate: true,
      viteOptimizeDeps: true,
      injectAtEnd: false,
      eslintrc: {
        enabled: true,
        filepath: './.eslintrc-auto-import.json',
        globalsPropValue: true,
      },
      dumpUnimportItems: './auto-imports.json',
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
