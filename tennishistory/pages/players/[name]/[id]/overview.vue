<script setup lang="ts">
definePageMeta({ name: "player-overview", layout: "player-layout" }) // Page name for routing
const id = useRouteParams<string>("id")
const name = useRouteParams<string>("name")
const toast = useToast()

// API call
const { data: player, status, error } = await useFetch<PlayerDetails>("/api/playerDetails", { query: { id } })

// Error handling
whenever(error, () => {
  toast.add({
    title: "Error fetching player details",
    icon: ICONS.error,
    description: `${error.value}`
  })
})
</script>

<template>
  <u-container>
    <player-overview
      v-if="player"
      :player
    />

    <loading-page-cards v-else-if="status === 'pending'" />
    <error-message
      v-else
      :icon="ICONS['no-person']"
    >
      No details about {{ useChangeCase(name, "capitalCase").value }} available
    </error-message>

    <major-results />
  </u-container>
</template>
