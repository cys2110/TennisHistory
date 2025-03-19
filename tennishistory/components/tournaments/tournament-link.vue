<script setup lang="ts">
defineProps<{ name: string; tid: string }>()
</script>

<template>
  <u-link
    class="hover-link"
    :to="{ name: 'tournament', params: { name: useChangeCase(name, 'kebabCase').value, tid } }"
    prefetch-on="interaction"
  >
    {{ name }}
  </u-link>
</template>
