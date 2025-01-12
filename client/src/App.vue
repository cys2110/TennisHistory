<script setup lang="ts">
import { RouterView } from 'vue-router'
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'
import Sidebar from '@/components/layout/SidebarNav.vue'
import { ScrollTop } from 'primevue'

const breakpoints = useBreakpoints(breakpointsTailwind)
const lgAndUp = breakpoints.greaterOrEqual('lg')
</script>

<template>
  <div class="flex">
    <Sidebar v-if="lgAndUp" />
    <main>
      <router-view />
      <scroll-top />
    </main>
  </div>
</template>

<style scoped>
.header {
  font-family: 'Petit Formal Script', cursive;
}
</style>
