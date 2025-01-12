<script setup lang="ts">
import { useRouteHash } from '@vueuse/router'
defineProps<{ links: { label: string; to: string }[] }>()
const route = useRouteHash()
</script>

<template>
  <aside class="h-[50vh] sticky top-20 min-w-60 px-8 col-span-2">
    <div v-if="$slots.filters" class="flex flex-col gap-3 items-center my-10">
      <div class="text-slate-400 mb-5">Filters</div>
      <slot name="filters" />
    </div>
    <div class="text-center">
      <slot name="anchor-heading" />
    </div>
    <div class="flex flex-col gap-2 max-h-[500px] overflow-y-auto my-8 scrollbar scrollbar-thumb-emerald-600 scrollbar-track-transparent ml-2">
      <router-link v-for="link in links" :key="link.label" :to="link.to" class="text-sm text-slate-400 hover-link w-fit" :class="{ '!text-emerald-600': route === link.to }">
        {{ link.label }}
      </router-link>
    </div>
  </aside>
</template>
