<script setup lang="ts">
import { Avatar } from 'primevue'

defineProps<{ id: string; name: string }>()
</script>

<template>
  <Avatar :image="`https://www.atptour.com/-/media/alias/player-headshot/${id}`" :alt="name" shape="circle" />
</template>
