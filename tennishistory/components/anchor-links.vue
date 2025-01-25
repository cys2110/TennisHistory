<script setup lang="ts">
defineProps<{ links: { label: string; to: string }[] }>()
const scroll = useScroll()
</script>

<template>
  <u-page-list class="gap-2 ml-5">
    <div
      v-for="link in links"
      :key="link.label"
      class="hover-link cursor-pointer text-sm"
      :class="scroll.hash.value === link.to ? 'text-emerald-600' : 'text-slate-600 dark:text-slate-400'"
      @click="scroll.scroll(link.to)"
    >
      {{ link.label }}
    </div>
  </u-page-list>
</template>
