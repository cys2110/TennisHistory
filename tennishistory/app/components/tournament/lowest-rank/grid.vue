<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui"

const { results } = defineProps<{
  results: TournamentLowestRankedType[]
  status: APIStatusType
}>()
const {
  params: { id, name }
} = useRoute()
const { icons } = useAppConfig()
const tours = inject<TourType[]>("tours", [])
const tournamentName = inject<string>("tournamentName", "")

// Group results by round
const groupedResults = computed(() => {
  const rounds: Record<string, TournamentLowestRankedType[]> = {}
  results.forEach(result => {
    if (!rounds[result.round]) {
      rounds[result.round] = []
    }
    rounds[result.round]!.push(result)
  })

  return rounds
})

const columns: TableColumn<TournamentLowestRankedType>[] = [
  { accessorKey: "tour", header: "Tour" },
  { accessorKey: "type", header: "Type" },
  { accessorKey: "rank", header: "Rank" },
  { id: "year", header: "Year" },
  { id: "players", header: "Players" }
]
const columnVisibility = ref({
  tour: tours.length > 1
})
</script>

<template>
  <u-page-grid
    v-if="Object.keys(groupedResults).length || status === 'pending'"
    class="md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-2"
  >
    <u-card
      v-if="Object.keys(groupedResults).length"
      v-for="round in Object.entries(groupedResults)"
      :key="round[0]"
      :ui="{
        root: 'ring-joint',
        header: 'font-semibold'
      }"
    >
      <template #header>{{ round[0] }}</template>

      <u-table
        :data="round[1]"
        :columns="columns"
        v-model:column-visibility="columnVisibility"
        class="w-fit mx-auto"
      >
        <template #tour-cell="{ row }">
          <u-badge
            class="font-semibold"
            :label="row.original.tour"
            :color="getTourColor([row.original.tour])"
          />
        </template>

        <template #type-cell="{ row }">
          <u-badge
            class="font-semibold"
            :label="row.original.type"
            :color="row.original.type === 'Singles' ? 'singles' : 'doubles'"
          />
        </template>

        <template #year-cell="{ row }">
          <div class="flex flex-col items-center">
            <u-link
              v-for="player in row.original.players"
              :key="player.id"
              :to="{ name: 'event', params: { id, name, year: player.year, eid: player.eid } }"
              class="hover-link"
            >
              {{ player.year }}
            </u-link>
          </div>
        </template>

        <template #players-cell="{ row }">
          <div class="flex flex-col items-center mx-10">
            <player-link
              v-for="player in row.original.players"
              :key="player.id"
              :player
            />
          </div>
        </template>
      </u-table>
    </u-card>

    <loading-player
      v-else
      v-for="_ in 4"
      :key="_"
    />
  </u-page-grid>
  <error-message
    v-else
    :icon="icons.seeds"
    :message="`No players found for ${tournamentName}`"
  />
</template>
