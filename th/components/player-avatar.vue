<script setup lang="ts">
defineProps<{ player: { id: string; name: string; country: { id: string; name: string; alpha2: string | null } }; ui?: any }>()
</script>

<template>
  <div class="flex items-center gap-2">
    <flag-icon :country="player.country" />
    <u-user
      :name="player.name"
      :avatar="{ src: `https://www.atptour.com/-/media/alias/player-headshot/${player.id}` }"
      :to="{ name: 'player', params: { id: player.id, name: useChangeCase(player.name, 'kebabCase').value } }"
      prefetch-on="interaction"
      :ui="ui"
    />
  </div>
</template>
