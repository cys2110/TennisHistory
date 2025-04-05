<script setup lang="ts">
const id = useRouteParams<string>("id")
const paramName = useRouteParams<string>("name")
const name = computed(() => decodeName(paramName.value))
const toast = useToast()

// API call
const { data: player, status } = await useFetch<PlayerDetailsType>("/api/player-details", {
  query: { id },
  onResponseError: () => {
    toast.add({
      title: `Error fetching ${name.value}'s details`,
      icon: ICONS.error,
      color: "error"
    })
  }
})

const playerDetails = computed(() => {
  if (player.value)
    return [
      { title: "Career High", value: player.value.ch ? `${player.value.ch} (${player.value.ch_date})` : "—" },
      { title: "Win-Loss", value: player.value.wl },
      { title: "Titles", value: player.value.titles },
      { title: "Prize Money", value: `$${player.value.pm}` },
      { title: "Age", value: player.value.age ? `${player.value.age} years (${player.value.dod ? `${player.value.dob} - ${player.value.dod}` : player.value.dob})` : "Unknown" },
      { title: "Height", value: player.value.height ? `${player.value.height} cm (${convertToFt(player.value.height)})` : "Unknown" },
      { title: "Plays", value: player.value.rh ? handedness(player.value.rh) : "Unknown" },
      { title: "Backhand", value: player.value.bh ? `${player.value.bh}-Handed` : "Unknown" },
      player.value.hof ? { title: "Hall of Fame Induction", value: player.value.hof } : null
    ].filter(Boolean)
})
</script>

<template>
  <dashboard-subpanel title="Details">
    <u-page-columns
      v-if="player"
      class="lg:columns-3 2xl:columns-3"
    >
      <u-page-card
        v-for="detail in playerDetails"
        :key="detail?.title"
        :title="detail?.title"
        :description="detail?.value"
        spotlight
        variant="outline"
      />
      <u-page-card
        :title="player.coaches.length === 1 ? 'Coach' : 'Coaches'"
        spotlight
        variant="outline"
      >
        <template #description>
          <template
            v-if="player.coaches.length > 0"
            v-for="coach in player.coaches"
            :key="coach.id"
          >
            <u-link
              v-if="coach.labels.includes('Player')"
              class="hover-link"
              :to="{ name: 'player', params: { name: encodeName(coach.name || ''), id: coach.id } }"
            >
              {{ coach.name }}
            </u-link>
            <template v-else>{{ coach.id }}</template>
          </template>
          <template v-else>—</template>
        </template>
      </u-page-card>
    </u-page-columns>
    <u-page-card
      v-if="player && player.countries.length > 0"
      class="col-span-2"
      title="Previous Representations"
      spotlight
      variant="outline"
    >
      <template #description>
        <div
          v-for="country in player.countries"
          :key="country.id"
          class="grid grid-cols-3 gap-2"
        >
          <flag-icon :country="country" />
          <span>{{ country.name }}</span>
          <span>{{ country.dates }}</span>
        </div>
      </template>
    </u-page-card>
    <error-message
      v-if="!player"
      :icon="ICONS.noPlayer"
      :title="`No details found for ${name}`"
      :status
    />
  </dashboard-subpanel>
</template>
