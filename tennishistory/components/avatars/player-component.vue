<script setup lang="ts">
defineProps<{ id: string; name: string; ui?: any }>()
</script>

<template>
  <u-user
    :name
    :avatar="{ src: `https://www.atptour.com/-/media/alias/player-headshot/${id}` }"
    :to="{ name: 'player', params: { id, name: useChangeCase(name, 'kebabCase').value } }"
    :ui="ui"
  />
</template>
