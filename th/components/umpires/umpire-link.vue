<script setup lang="ts">
defineProps<{ umpire: string }>()
</script>

<template>
  <u-link
    class="hover-link w-fit"
    :to="{ name: 'umpire', params: { id: encodeName(umpire) } }"
  >
    {{ umpire }}
  </u-link>
</template>
