<script setup lang="ts">
defineProps<{ name: string; tid: string; eid: string; year: string }>()
</script>

<template>
  <u-link
    class="hover-link w-fit"
    :to="{ name: 'event', params: { name: useChangeCase(name, 'kebabCase').value, eid, tid, year } }"
  >
    <slot />
  </u-link>
</template>
