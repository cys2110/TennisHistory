<script setup lang="ts">
import { CountryLink, FilterTableHeader, RangeTableHeader, UBadge, UButton, ULink } from "#components"
import type { TableColumn } from "@nuxt/ui"
import {
  type Column,
  getFacetedRowModel,
  getFacetedMinMaxValues,
  getFacetedUniqueValues,
  getGroupedRowModel,
  type GroupingOptions
} from "@tanstack/vue-table"

const { viewMode } = useDefaults()
const {
  //@ts-ignore
  params: { id, name }
} = useRoute()
const {
  icons,
  ui: { icons: uIcons }
} = useAppConfig()
const { tableMode } = useDefaults()
const tours = inject<TourType[]>("tours", [])
const tournamentName = inject<string>("tournamentName", "")

// API call
const { data: rounds, status } = await useFetch<TournamentPmType[]>("/api/tournaments/pm", {
  key: `tournament-pm-${id}`,
  query: { id },
  default: () => []
})

const groupedRounds = computed(() => {
  const years = []
  const usedYears = new Set<number>()

  for (const round of rounds.value) {
    if (!usedYears.has(round.year)) {
      const yearRounds = rounds.value.filter(r => r.year === round.year)

      const tourRounds = []

      for (const tour of tours) {
        const tourSinglesRounds = yearRounds.filter(
          r => r.tour === (tour.replace("Men", "ITF (M)").replace("Women", "ITF (W)") as TourType) && r.type === "Singles"
        )
        const tourDoublesRounds = yearRounds.filter(
          r => r.tour === (tour.replace("Men", "ITF (M)").replace("Women", "ITF (W)") as TourType) && r.type === "Doubles"
        )

        tourRounds.push({
          tour,
          singles: tourSinglesRounds,
          doubles: tourDoublesRounds
        })
      }

      years.push({
        id: round.id,
        year: round.year,
        rounds: tourRounds
      })

      usedYears.add(round.year)
    }
  }

  return years.sort((a, b) => b.year - a.year)
})

const columns = computed<TableColumn<TournamentPmType>[]>(() => [
  ...(tableMode.value === "grouped" ?
    [
      {
        id: "expand",
        cell: ({ row }: { row: any }) => {
          if (row.getIsGrouped()) {
            return h(UButton, {
              variant: "link",
              color: "neutral",
              class: "mr-2",
              size: "xs",
              icon: uIcons.chevronDoubleRight,
              ui: {
                leadingIcon: row.getIsExpanded() ? "rotate-90 transition-transform duration-200" : "transition-transform duration-200"
              },
              onClick: () => row.toggleExpanded()
            })
          }
        }
      }
    ]
  : []),
  {
    accessorKey: "year",
    header: ({ column }) =>
      h(RangeTableHeader, {
        column: column as Column<unknown>,
        label: "Year"
      }),
    cell: ({ row }) => {
      if (tableMode.value === "ungrouped" || (row.getIsGrouped() && row.depth === 0)) {
        return h(
          ULink,
          {
            to: { name: "event", params: { id, name, year: row.original.year, eid: row.original.id } },
            class: "hover-link font-semibold"
          },
          () => row.original.year
        )
      }
    }
  },
  {
    accessorKey: "tour",
    header: ({ column }) =>
      h(FilterTableHeader, {
        column: column as Column<unknown>,
        label: "Tour",
        type: "alpha"
      }),
    cell: ({ row }) => {
      if (tableMode.value === "ungrouped" || (row.getIsGrouped() && row.depth === 1)) {
        return h(UBadge, {
          label: row.original.tour,
          color: getTourColour([row.original.tour]),
          class: "font-semibold"
        })
      }
    }
  },
  {
    accessorKey: "type",
    header: ({ column }) =>
      h(FilterTableHeader, {
        column: column as Column<unknown>,
        label: "S/D",
        type: "alpha"
      }),
    cell: ({ row }) => {
      if (tableMode.value === "ungrouped" || (row.getIsGrouped() && row.depth === 2)) {
        return h(UBadge, {
          label: row.original.type,
          color: row.original.type === "Singles" ? "singles" : "doubles",
          class: "font-semibold"
        })
      }
    }
  },
  {
    accessorKey: "round",
    header: ({ column }) =>
      h(FilterTableHeader, {
        column: column as Column<unknown>,
        label: "Round",
        type: "alpha"
      })
  },
  {
    accessorKey: "pm",
    cell: ({ row, cell }) =>
      isDefined(cell.getValue()) && row.original.currency ?
        (cell.getValue() as number).toLocaleString("en-GB", { style: "currency", currency: row.original.currency })
      : undefined,
    aggregationFn: "max",
    sortUndefined: "last",
    header: ({ column }) =>
      h(RangeTableHeader, {
        column: column as Column<unknown>,
        label: "Prize Money"
      })
  },
  {
    accessorKey: "points",
    header: ({ column }) =>
      h(RangeTableHeader, {
        column: column as Column<unknown>,
        label: "Points"
      }),
    cell: ({ cell }) => (isDefined(cell.getValue()) ? (cell.getValue() as number).toLocaleString() : undefined),
    aggregationFn: "max",
    sortUndefined: "last"
  }
])

const columnVisibility = ref({
  tour: tours.length > 1
})
const columnFilters = ref([])
const grouping = computed(() =>
  tableMode.value === "grouped" ?
    tours.length > 1 ?
      ["year", "tour", "type"]
    : ["year", "type"]
  : []
)
const grouping_options = ref<GroupingOptions>({
  groupedColumnMode: false,
  getGroupedRowModel: getGroupedRowModel()
})
</script>

<template>
  <div v-if="viewMode === 'cards'">
    <u-page-grid
      v-if="groupedRounds.length || status === 'pending'"
      class="md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-2"
    >
      <u-card
        v-if="groupedRounds.length"
        v-for="round in groupedRounds"
        :key="round.id"
        :ui="{
          root: `ring-${getTourColour(tours)}`,
          footer: 'mx-auto w-fit'
        }"
      >
        <template #header>
          <u-link
            :to="{ name: 'event', params: { id, name, eid: round.id, year: round.year } }"
            class="hover-link font-semibold"
          >
            {{ round.year }}
          </u-link>
        </template>

        <div class="text-sm">
          <dashboard-subpanel
            v-for="tour in round.rounds"
            :key="tour.tour"
          >
            <template #title>
              <u-badge
                :label="tour.tour"
                :color="getTourColour([tour.tour])"
              />
            </template>

            <div class="text-center text-sm">
              <div class="grid grid-cols-5 text-muted">
                <div></div>
                <div class="col-span-2">Singles</div>
                <div class="col-span-2">Doubles</div>
              </div>
              <div class="grid grid-cols-5 text-muted">
                <div></div>
                <div>Prize Money</div>
                <div>Points</div>
                <div>Prize Money</div>
                <div>Points</div>
              </div>
              <div
                v-for="(x, index) in tour.singles.length > tour.doubles.length ? tour.singles : tour.doubles"
                :key="index"
                class="grid grid-cols-5"
              >
                <div class="text-muted">{{ x.round }}</div>
                <div class="font-semibold">{{
                  isDefined(x.pm) && x.currency ? x.pm.toLocaleString("en-GB", { style: "currency", currency: x.currency }) : "—"
                }}</div>
                <div class="font-semibold">{{ isDefined(x.points) ? x.points.toLocaleString() : "—" }}</div>
                <div class="font-semibold">{{
                  isDefined(tour.doubles[index]?.pm) && tour.doubles[index]?.currency ?
                    tour.doubles[index].pm.toLocaleString("en-GB", { style: "currency", currency: tour.doubles[index].currency })
                  : "—"
                }}</div>
                <div class="font-semibold">{{ isDefined(tour.doubles[index]?.points) ? tour.doubles[index].points.toLocaleString() : "—" }}</div>
              </div>
            </div>
          </dashboard-subpanel>
        </div>
      </u-card>

      <loading-base
        v-else
        v-for="_ in 10"
        :key="_"
      />
    </u-page-grid>
    <error-message
      v-else
      :icon="icons.noAwards"
      :message="`No prize money found for ${tournamentName}`"
    />
  </div>
  <u-table
    v-else
    :data="rounds"
    :columns
    :loading="status === 'pending'"
    sticky
    :empty="`No prize money found for ${tournamentName}`"
    :faceted-options="{
      getFacetedRowModel: getFacetedRowModel(),
      getFacetedMinMaxValues: getFacetedMinMaxValues(),
      getFacetedUniqueValues: getFacetedUniqueValues()
    }"
    :grouping
    :grouping-options="grouping_options"
    v-model:columnFilters="columnFilters"
    v-model:column-visibility="columnVisibility"
    :ui="{ root: 'scrollbar-thin scrollbar-thumb-primary-600 scrollbar-track-transparent max-h-165', td: 'empty:p-0' }"
  />
</template>
