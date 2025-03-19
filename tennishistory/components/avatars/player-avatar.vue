<script setup lang="ts">
defineProps<{ player: Pick<PlayerInterface, "id" | "name" | "country"> }>()
</script>

<template>
  <div class="flex items-center gap-2">
    <flag-icon :country="player.country" />
    <u-user
      :name="player.name"
      :avatar="{ src: `https://www.atptour.com/-/media/alias/player-headshot/${player.id}`, icon: ICONS.person }"
      :to="{ name: 'player', params: { id: player.id, name: useChangeCase(player.name, 'kebabCase').value } }"
      prefetch-on="interaction"
    />
  </div>
</template>
