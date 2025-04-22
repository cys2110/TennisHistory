<script setup lang="ts">
defineProps<{ surface: string }>()
</script>

<template>
  <u-link
    class="hover-link w-fit"
    :to="{ name: 'surface', params: { id: encodeName(surface) } }"
  >
    {{ surface }}
  </u-link>
</template>
