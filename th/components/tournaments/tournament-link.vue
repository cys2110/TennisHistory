<script setup lang="ts">
defineProps<{ name: string; id: string }>()
</script>

<template>
  <u-link
    class="hover-link"
    :to="{ name: 'tournament', params: { name: encodeName(name), id } }"
  >
    {{ name }}
  </u-link>
</template>
