<script setup lang="ts">
const props = defineProps<{ loading: Boolean }>()
</script>

<template>
  <div v-if="loading">
    <slot name="loading" />
  </div>
  <div v-else class="text-zinc-400 text-2xl">
    <slot name="none" />
  </div>
</template>