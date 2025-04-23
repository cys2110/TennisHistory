<script setup lang="ts">
defineProps<{ supervisor: string }>()
</script>

<template>
  <u-link
    class="hover-link w-fit"
    :to="{ name: 'supervisor', params: { id: encodeName(supervisor) } }"
  >
    {{ supervisor }}
  </u-link>
</template>
