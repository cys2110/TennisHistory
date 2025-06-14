<script setup lang="ts">
const { icons } = useAppConfig()
const page = ref(1)
const selectedLetter = defineModel<string>()

// API call
const { data, status } = await useFetch<APIPlayersResponseType>("/api/players", {
  query: { letter: selectedLetter, skip: computed(() => (page.value - 1) * 40) }
})

// Reset page when the selected letter changes
watch(selectedLetter, () => (page.value = 1))
</script>

<template>
  <u-page-grid
    v-if="(data && data.count) || ['pending', 'idle'].includes(status)"
    class="my-5"
  >
    <player-card
      v-if="data?.count"
      v-for="player in data.players"
      :key="player.id"
      :player
    />
    <loading-player
      v-else
      v-for="_ in 15"
      :key="_"
    />
  </u-page-grid>
  <error-message
    v-else
    :icon="icons.noPlayer"
    message="No players found"
  />
  <u-pagination
    v-if="data && data.count"
    v-model:page="page"
    :total="data.count"
    :items-per-page="40"
    variant="ghost"
    color="primary"
    active-variant="subtle"
    class="mx-auto mt-auto"
  />
</template>
