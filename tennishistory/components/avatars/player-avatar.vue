<script setup lang="ts">
defineProps<{ id: string; name: string }>()
</script>

<template>
  <u-avatar
    :src="`https://www.atptour.com/-/media/alias/player-headshot/${id}`"
    :alt="name"
    :icon="ICONS.person"
    size="sm"
    class="border border-slate-500"
  />
</template>
