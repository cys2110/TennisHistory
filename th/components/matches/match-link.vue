<script setup lang="ts">
defineProps<{ name: string; id: string; eid: string; year: string; mid: string }>()
</script>

<template>
  <u-link
    class="flex justify-between items-center text-sm hover-link w-fit"
    :to="{ name: 'match', params: { name: encodeName(name), id, eid, year, mid } }"
  >
    <slot />
  </u-link>
</template>
