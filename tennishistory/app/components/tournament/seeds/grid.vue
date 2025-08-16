<script setup lang="ts">
const { results } = defineProps<{
  results: TournamentSeedType[]
  status: APIStatusType
}>()
const {
  params: { id, name }
} = useRoute()
const { icons } = useAppConfig()
const tournamentName = inject<string>("tournamentName", "")

// Group results by year
const groupedResults = computed(() => {
  const years: Record<number, TournamentSeedType[]> = {}
  results.forEach(result => {
    if (!years[result.year]) {
      years[result.year] = []
    }
    years[result.year]!.push(result)
  })

  return years
})
</script>

<template>
  <u-page-columns
    class="2xl:columns-4"
    v-if="Object.keys(groupedResults).length || status === 'pending'"
  >
    <u-card
      v-if="Object.keys(groupedResults).length"
      v-for="year in Object.entries(groupedResults)"
      :key="year[0]"
      class="ring-joint"
    >
      <template #header>
        <u-link
          :to="{ name: 'event', params: { id, name, year: year[0], eid: year[1][0]?.id } }"
          class="hover-link font-semibold"
        >
          {{ year[0] }}
        </u-link>
      </template>

      <dashboard-subpanel
        v-for="round in year[1]"
        :key="`${round.round}-${round.tour}-${round.type}`"
        :title="round.round"
      >
        <template #right>
          <div class="flex items-center gap-2">
            <u-badge
              :label="round.tour"
              :color="getTourColor([round.tour])"
            />
            <u-badge
              :label="round.type"
              :color="round.type === 'Singles' ? 'singles' : 'doubles'"
            />
          </div>
        </template>

        <tournament-seeds-player-table :teams="round.teams" />
      </dashboard-subpanel>
    </u-card>

    <loading-player
      v-else
      v-for="_ in 4"
      :key="_"
    />
  </u-page-columns>
  <error-message
    v-else
    :icon="icons.seeds"
    :message="`No years when the top seeds reached the later rounds of ${tournamentName}`"
  />
</template>
