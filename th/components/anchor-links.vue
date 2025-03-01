<script setup lang="ts">
defineProps<{ links: { label: string; to: string }[] }>()
const anchorScroll = useScrollTo()
</script>

<template>
  <u-page-list>
    <div
      v-for="link in links"
      :key="link.label"
      class="hover-link cursor-pointer text-sm"
      :class="anchorScroll.hash.value === link.to ? 'text-emerald-600' : 'text-slate-600 dark:text-slate-300'"
      @click="anchorScroll.scroll(link.to)"
    >
      {{ link.label }}
    </div>
  </u-page-list>
</template>
