<script setup lang="ts">
defineProps<{ coach: { labels: string[]; id: string; name: string | null } }>()
</script>

<template>
  <u-link
    class="hover-link w-fit"
    :to="{ name: 'coach', params: { id: encodeName(coach.id) } }"
  >
    {{ coach.name ?? coach.id }}
  </u-link>
</template>
