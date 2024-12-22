import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import Components from 'unplugin-vue-components/vite'
import { PrimeVueResolver } from 'unplugin-vue-components/resolvers'
import UnpluginUnused from 'unplugin-unused/vite'
import AutoImport from 'unplugin-auto-import/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    vueDevTools(),
    Components({
      resolvers: [PrimeVueResolver()],
    }),
    UnpluginUnused({
      include: [/\.([cm]?[jt]sx?|vue)$/],
      exclude: [/node_modules/],
      level: 'warning',
      ignore: {
        peerDependencies: ['vue'],
      },
      depKinds: ['dependencies', 'peerDependencies'],
    }),
    AutoImport({
      include: [
        /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
        /\.vue$/, // .vue files
        /\.vue\?vue/, // Vue files in Vite (with ?vue suffix)
      ],
      imports: [
        'vue',
        'vue-router',
        '@vueuse/core',
        // {
        //   '@vueuse/core': [
        //     'useMouse',
        //     ['useFetch', 'useMyFetch'],
        //   ],
        // },
        {
          '@vue/apollo-composable': ['useQuery'],
        },
        {
          '@vueuse/integrations': ['useChangeCase'],
        },
        {
          '@vueuse/router': ['useRouteParams'],
        },
        {
          luxon: ['DateTime'],
        },
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
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
