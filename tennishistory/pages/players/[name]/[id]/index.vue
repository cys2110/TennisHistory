<script setup lang="ts">
definePageMeta({ name: "player" })
const id = useRouteParams<string>("id")
const name = useRouteParams<string>("name")
const toast = useToast()

const { data: player } = useFetch<PlayerName>("/api/playerName", {
  query: { id: id.value },
  onResponseError: async () => {
    toast.add({
      title: "Error fetching data",
      icon: ICONS.error
    })
  }
})

useHead({ title: `${player.value?.name ?? useChangeCase(name.value, "capitalCase").value}` })
</script>

<template>
  <u-page-hero
    v-if="player"
    :title="player.name"
    orientation="horizontal"
    reverse
    :links="PLAYER_PAGES"
    class="w-5/6 mx-auto"
  >
    <template #headline>
      <div class="flex gap-10">
        <span>Players</span>
        <u-badge
          v-if="player.years_active?.endsWith('present')"
          label="Active"
          variant="outline"
        />
      </div>
    </template>
    <template #description>
      <div class="flex items-center gap-2">
        <flag-icon :country="player.country" />
        {{ player.years_active ?? "" }}
        <span v-if="player.active_years">({{ player.active_years }} years)</span>
      </div>
    </template>
    <nuxt-img
      v-if="player.gladiator"
      :src="`https://www.atptour.com/-/media/alias/player-gladiator-headshot/${id}`"
      :alt="player.name"
    />
  </u-page-hero>
</template>
