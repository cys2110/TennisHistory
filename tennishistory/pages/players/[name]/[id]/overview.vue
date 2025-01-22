<script setup lang="ts">
definePageMeta({ name: "player-overview", layout: "player-layout" })
const route = useRoute()
const toast = useToast()

const { data: player, status } = await useFetch<PlayerDetails>("/api/playerDetails", {
  query: { id: route.params.id },
  onResponseError: () => {
    toast.add({
      title: "Error fetching data",
      icon: ICONS.error
    })
  }
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
      No details about {{ useChangeCase(route.params.name as string, "capitalCase").value }} available
    </error-message>

    <!--Major results-->
    <major-results />
  </u-container>
</template>
