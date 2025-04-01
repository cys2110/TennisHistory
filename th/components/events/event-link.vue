<script setup lang="ts">
defineProps<{ name: string; tid: string; eid: string; year: string }>()
</script>

<template>
  <u-link
    class="hover-link w-fit"
    :to="{ name: 'event', params: { name: encodeName(name), eid, id: tid, year } }"
  >
    <slot />
  </u-link>
</template>
