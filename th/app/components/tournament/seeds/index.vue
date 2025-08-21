<script setup lang="ts">
import { FilterTableHeader, RangeTableHeader, UBadge, ULink } from "#components"
import type { TableColumn } from "@nuxt/ui"
import { type Column, getFacetedRowModel, getFacetedMinMaxValues, getFacetedUniqueValues } from "@tanstack/vue-table"

const { viewMode } = useDefaults()
const {
  //@ts-ignore
  params: { id, name }
} = useRoute()
const {
  icons,
  ui: { icons: uIcons }
} = useAppConfig()
const tours = inject<TourType[]>("tours", [])
const tournamentName = inject<string>("tournamentName", "")

// API call
const { data: results, status } = await useFetch("/api/tournaments/seeds", {
  key: `tournament-seeds-${id}`,
  query: { id },
  default: () => []
})

const sortedResults = computed(() => {
  return results.value.sort((a, b) => a.year - b.year)
})

// Group results by year
const groupedResults = computed(() => {
  const years: Record<number, TournamentSeedType[]> = {}
  sortedResults.value.forEach(result => {
    if (!years[result.year]) {
      years[result.year] = []
    }
    years[result.year]!.push(result)
  })

  return years
})

const gridColumns: TableColumn<TournamentSeedType["teams"][number]>[] = [
  { accessorKey: "seed", header: "Seed" },
  { id: "players", header: "Players(s)" }
]

const columns: TableColumn<TournamentSeedType>[] = [
  {
    accessorKey: "year",
    header: ({ column }) =>
      h(RangeTableHeader, {
        column: column as Column<unknown>,
        label: "Year"
      })
  },
  {
    accessorKey: "tour",
    header: ({ column }) =>
      h(FilterTableHeader, {
        column: column as Column<unknown>,
        label: "Tour",
        type: "alpha"
      }),
    cell: ({ row }) =>
      h(UBadge, {
        label: row.original.tour.replace("Men", "ITF (M)").replace("Women", "ITF (W)"),
        color: getTourColour([row.original.tour])
      })
  },
  {
    accessorKey: "type",
    header: ({ column }) =>
      h(FilterTableHeader, {
        column: column as Column<unknown>,
        label: "S/D",
        type: "alpha"
      }),
    cell: ({ row }) =>
      h(UBadge, {
        label: row.original.type,
        color: row.original.type === "Singles" ? "singles" : "doubles"
      })
  },
  {
    accessorKey: "round",
    header: ({ column }) =>
      h(FilterTableHeader, {
        column: column as Column<unknown>,
        label: "Round",
        type: "alpha"
      })
  }
]

const expanded = ref({})
const columnVisibility = ref({
  tour: tours.length > 1
})
const columnFilters = ref([])
</script>

<template>
  <div v-if="viewMode === 'cards'">
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
            :to="{ name: 'event', params: { id, name, year: year[0], eid: year[1][0]?.id as number } }"
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
                :color="getTourColour([round.tour])"
              />
              <u-badge
                :label="round.type"
                :color="round.type === 'Singles' ? 'singles' : 'doubles'"
              />
            </div>
          </template>

          <u-table
            :data="round.teams"
            :columns="gridColumns"
            class="w-fit mx-auto"
          >
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
  </div>
  <u-table
    v-else
    :data="sortedResults"
    :columns
    :loading="status === 'pending'"
    sticky
    :empty="`No years when the top seeds reached the later rounds of ${tournamentName}`"
    :faceted-options="{
      getFacetedRowModel: getFacetedRowModel(),
      getFacetedMinMaxValues: getFacetedMinMaxValues(),
      getFacetedUniqueValues: getFacetedUniqueValues()
    }"
    v-model:columnFilters="columnFilters"
    v-model:expanded="expanded"
    v-model:column-visibility="columnVisibility"
    :ui="{ root: 'scrollbar-thin scrollbar-thumb-primary-600 scrollbar-track-transparent max-h-165', td: 'empty:p-0' }"
  >
    <template #year-cell="{ row }">
      <div class="flex justify-center items-center gap-2">
        <u-button
          variant="link"
          color="neutral"
          class="mr-2"
          size="xs"
          :icon="uIcons.chevronDoubleRight"
          :ui="{
            leadingIcon: row.getIsExpanded() ? 'rotate-90 transition-transform duration-200' : 'transition-transform duration-200',
            label: 'font-semibold'
          }"
          @click="row.toggleExpanded()"
        />

        <u-link
          :to="{ name: 'event', params: { id, name, year: row.original.year, eid: row.original.id } }"
          class="hover-link font-semibold"
        >
          {{ row.original.year }}</u-link
        >
      </div>
    </template>

    <template #expanded="{ row }">
      <u-table
        :data="row.original.teams"
        :columns="gridColumns"
        class="w-fit mx-auto"
      >
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
    </template>
  </u-table>
</template>
