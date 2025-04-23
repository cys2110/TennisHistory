<script setup lang="ts">
defineProps<{ name: string; id: string }>()
</script>

<template>
  <u-link
    class="hover-link w-fit"
    :to="{ name: 'tournament', params: { name: encodeName(name), id } }"
  >
    {{ name }}
  </u-link>
</template>
