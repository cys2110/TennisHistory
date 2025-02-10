<script setup lang="ts">
const { type, id, title } = defineProps<{ type: string; id: string; title: string }>()

const apiRoute = computed(() => {
  switch (type) {
    case "Coach":
      return "/api/coachSearch"
    default:
      return "/api/countrySearch"
  }
})

const { data: players } = await useFetch(apiRoute.value, { query: { id } })

const selectedArray = computed(() => {
  if (players.value) {
    switch (type) {
      case "Country":
        return players.value.players
      case "Coach":
        return players.value
      default:
        return null
    }
  }
  return null
})
</script>

<template>
  <u-modal
    :title
    :description="type"
  >
    <template #body>
      <u-page-grid v-if="selectedArray">
        <div
          v-if="type === 'countries'"
          class="col-span-3"
        >
          Current/Retired Players
        </div>
        <u-page-card
          v-for="player in selectedArray"
          :key="player.id"
          :to="{ name: 'player', params: { name: useChangeCase(player.name, 'kebabCase').value, id: player.id } }"
          :title="player.name"
          :icon="`flag:${player.country.alpha2}-4x3`"
          orientation="horizontal"
          highlight
        >
          <u-avatar
            :src="`https://www.atptour.com/-/media/alias/player-headshot/${player.id}`"
            :alt="player.name"
            icon="i-material-symbols-account-circle"
            size="sm"
            class="border border-slate-500"
          />
        </u-page-card>
        <div
          v-if="type === 'countries'"
          class="col-span-3"
        >
          Former players
        </div>
        <u-page-card
          v-if="type === 'countries'"
          v-for="player in players.former"
          :key="player.id"
          :to="{ name: 'player', params: { name: useChangeCase(player.name, 'kebabCase').value, id: player.id } }"
          :title="player.name"
          orientation="horizontal"
          highlight
        >
          <u-avatar
            :src="`https://www.atptour.com/-/media/alias/player-headshot/${player.id}`"
            :alt="player.name"
            icon="i-material-symbols-account-circle"
            size="sm"
            class="border border-slate-500"
          />
        </u-page-card>
      </u-page-grid>
      <error-message
        v-else
        :icon="ICONS['no-people']"
        :title="`No players found for ${id}`"
      />
    </template>
  </u-modal>
</template>
