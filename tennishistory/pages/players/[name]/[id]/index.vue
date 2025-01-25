<script setup lang="ts">
// @ts-nocheck
definePageMeta({ name: "player" }) // Page name for routing
const id = useRouteParams<string>("id")
const name = useRouteParams<string>("name")
const toast = useToast()

// API call
const { data: player, error } = useFetch<PlayerName>("/api/playerName", { query: { id } })

useHead({ title: `${player.value?.name ?? useChangeCase(name.value, "capitalCase").value}` }) // Title for tab

whenever(error, () => {
  toast.add({
    title: `Error fetching ${useChangeCase(name.value, "capitalCase").value}'s data`,
    icon: ICONS.error
  })
})
</script>

<template>
  <div>
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
        loading="lazy"
      />
      <nuxt-img
        v-else
        :src="`https://www.atptour.com/-/media/alias/player-headshot/${id}`"
        :alt="player.name"
        class="border border-slate-500 rounded-full"
        loading="lazy"
      />
    </u-page-hero>
  </div>
</template>
