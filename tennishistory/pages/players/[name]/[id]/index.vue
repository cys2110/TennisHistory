<script setup lang="ts">
definePageMeta({ name: "player" })
const route = useRoute()
const toast = useToast()

const { data: player } = useFetch<PlayerName>("/api/playerName", {
  query: { id: route.params.id },
  onResponseError: async () => {
    toast.add({
      title: "Error fetching data",
      icon: ICONS.error
    })
    await navigateTo("/players")
  }
})

useHead({ title: `${player.value?.name ?? useChangeCase(route.params.name as string, "capitalCase").value}` })
</script>

<template>
  <u-page-hero
    v-if="player"
    headline="Players"
    :title="player.name"
    orientation="horizontal"
    reverse
    :links="PLAYER_PAGES"
  >
    <template #description>
      <u-badge v-if="player.years_active?.endsWith('present')">Active</u-badge>
      <div class="flex items-center gap-2">
        <flag-icon :country="player.country" />
        {{ player.years_active ?? "" }}
        <span v-if="player.active_years">({{ player.active_years }} years)</span>
      </div>
    </template>
    <nuxt-img
      v-if="player.gladiator"
      :src="`https://www.atptour.com/-/media/alias/player-gladiator-headshot/${route.params.id}`"
      :alt="player.name"
    />
  </u-page-hero>
</template>
