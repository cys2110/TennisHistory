<script setup lang="ts">
defineProps<{ player: PlayerInterface }>()
</script>

<template>
  <div class="flex items-center gap-2">
    <country-link :country="player.country" />
    <u-link
      :to="{ name: 'player', params: { id: player.id, name: kebabCase(`${player.first_name} ${player.last_name}`) } }"
      class="hover-link"
    >
      {{ player.first_name }} {{ player.last_name }}
    </u-link>
  </div>
</template>
