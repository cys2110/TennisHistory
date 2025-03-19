<script setup lang="ts">
definePageMeta({
  name: "player",
  layout: "dashboard-layout"
})
const id = useRouteParams<string>("id")
const toast = useToast()
const formatName = useFormatName()

// API call
const { data: player } = await useFetch<PlayerDetailsType>("/api/player-details", {
  query: { id },
  onResponseError: () => {
    toast.add({
      title: `Error fetching ${formatName.name.value}'s details`,
      icon: ICONS.error,
      color: "error"
    })
  }
})
</script>

<template>
  <player-wrapper>
    <u-page-section
      v-if="player"
      :headline="player.active_years && player.active_years.endsWith('present') ? 'Active' : 'Retired'"
      :icon="`flag:${player.country.alpha2}-4x3`"
      :description="`Years active: ${player.active_years} (${player.years_total} years)`"
      orientation="horizontal"
      reverse
    >
      <nuxt-img
        v-if="player.gladiator"
        :src="`https://www.atptour.com/-/media/alias/player-gladiator-headshot/${id}`"
        :alt="player.name"
      />
      <nuxt-img
        v-else
        :src="`https://www.atptour.com/-/media/alias/player-headshot/${id}`"
        :alt="player.name"
        class="border border-neutral-500 rounded-full"
      />
    </u-page-section>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
      <player-details
        v-if="player"
        :player
      />
      <error-message
        v-else
        :icon="ICONS['no-person']"
        :title="`No details found for ${formatName.name.value}`"
      />
      <major-results />
    </div>
  </player-wrapper>
</template>
