<script setup lang="ts">
definePageMeta({ name: "player", layout: "player-layout" })
const formatName = useFormatName()
const id = useRouteParams<string>("id")
const toast = useToast()

// API call
const { data: player } = await useFetch<Omit<PlayerType, "id" | "name" | "wl_pc" | "pro">>("/api/playerDetails", {
  query: { id },
  onResponseError: error => {
    toast.add({
      title: `Error fetching ${formatName.capitaliseName.value}'s details`,
      icon: ICONS.error,
      description: error.error?.message
    })
  }
})
</script>

<template>
  <u-container v-if="player">
    <u-page-section
      :headline="player.active_years.endsWith('present') ? 'Active' : 'Retired'"
      :title="formatName.capitaliseName.value"
      :icon="`flag:${player.country.alpha2}-4x3`"
      :description="`Years active: ${player.active_years} (${player.years_total} years)`"
      orientation="horizontal"
      reverse
    >
      <nuxt-img
        v-if="player.gladiator"
        :src="`https://www.atptour.com/-/media/alias/player-gladiator-headshot/${id}`"
        :alt="formatName.capitaliseName.value"
        loading="lazy"
      />
      <nuxt-img
        v-else
        :src="`https://www.atptour.com/-/media/alias/player-headshot/${id}`"
        :alt="formatName.capitaliseName.value"
        class="border border-slate-500 rounded-full"
        loading="lazy"
      />
    </u-page-section>
    <player-overview :player />
    <major-results />
  </u-container>
  <error-message
    v-else
    :icon="ICONS['no-person']"
    :title="`No details found for ${formatName.capitaliseName.value}`"
  />
</template>
