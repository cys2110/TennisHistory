<script setup lang="ts">
import { NAVIGATION_LINKS, RELATED_LINKS } from '@/utils/variables'
import { Menu } from 'primevue'
import { useRoute } from 'vue-router'

const route = useRoute()

const menuItems = [{ label: 'Navigation', items: NAVIGATION_LINKS }, { separator: true }, { label: 'Related websites', items: RELATED_LINKS }]
</script>

<template>
  <aside class="sticky top-0 h-[70vh]">
    <Menu class="bg-transparent" :model="menuItems">
      <template #start>
        <span class="header text-2xl">TennisHistory</span>
      </template>
      <template #item="{ item, props }">
        <a v-if="item.url" :href="item.url" target="_blank" v-bind="props.action">
          {{ item.label }}
        </a>
        <template v-else>
          <router-link class="hover-link" :to="item.to">
            <fa-icon class="mr-3" :icon="item.faIcon" />
            <span :class="{ '!text-emerald-600 font-bold': route.path === item.to }">{{ item.label }}</span>
          </router-link>
        </template>
      </template>
      <template #end>
        <span class="text-sm">
          Built by
          <a class="text-emerald-600" href="https://www.claire-sheridan.com" target="_blank"> Claire Sheridan </a>
          using Vue, TypeScript, PrimeVue and TailwindCSS
        </span>
      </template>
    </Menu>
  </aside>
</template>

<style>
.header {
  font-family: 'Petit Formal Script', cursive;
}

.p-menu-start,
.p-menu-end {
  @apply text-center;
}

.p-menu-submenu-label {
  @apply text-slate-400;
}

.p-menu-end {
  @apply mt-auto;
}
</style>
