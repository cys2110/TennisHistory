<script setup lang="ts">
import { CountryLink, FilterTableHeader, RangeTableHeader, UBadge, UButton, ULink } from "#components"
import type { TableColumn } from "@nuxt/ui"
import {
  type Column,
  createColumnHelper,
  getFacetedRowModel,
  getFacetedMinMaxValues,
  getFacetedUniqueValues,
  getGroupedRowModel,
  type GroupingOptions
} from "@tanstack/vue-table"

defineProps<{
  entries: ConsolidatedEntryTeam[]
  status: APIStatusType
}>()
const { year } = useRoute().params as { year: string }
const { viewMode, tableMode } = useDefaults()
const {
  icons,
  ui: { icons: uIcons }
} = useAppConfig()
const tours = inject<TourType[]>("tours", [])
const tournament = inject<TournamentInterface>("tournament")

const columnHelper = createColumnHelper<ConsolidatedEntryTeam>()

const arraySorting = (rowA: any, rowB: any, columnId: string) => {
  return useSorted(rowA.getValue(columnId)).value[0] < useSorted(rowB.getValue(columnId)).value[0] ? -1 : 1
}

const columns = computed<TableColumn<ConsolidatedEntryTeam>[]>(() => [
  ...(tableMode.value === "grouped" && tours.length > 1 ?
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
    accessorKey: "tour",
    header: ({ column }) =>
      h(FilterTableHeader, {
        column: column as Column<unknown>,
        label: "Tour",
        type: "alpha"
      }),
    cell: ({ row }) => {
      if (tableMode.value === "ungrouped" || (row.getIsGrouped() && row.depth === 0)) {
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
        label: "Type",
        type: "alpha"
      }),
    cell: ({ row }) => {
      if (tableMode.value === "ungrouped" || (row.getIsGrouped() && tours.length > 1 && row.depth === 1) || (tours.length === 1 && row.depth === 0)) {
        return h(UBadge, {
          label: row.original.type,
          color: row.original.type === "Singles" ? "singles" : "doubles",
          class: "font-semibold"
        })
      }
    }
  },
  {
    id: "draw",
    accessorFn: row => row.draw.map(draw => draw),
    sortingFn: (rowA, rowB, columnId) => arraySorting(rowA, rowB, columnId),
    header: ({ column }) =>
      h(FilterTableHeader, {
        column: column as Column<unknown>,
        label: "Draw",
        type: "alpha"
      }),
    cell: ({ row }) => {
      if (tableMode.value === "ungrouped" || !row.getIsGrouped()) {
        return h(
          "div",
          {
            class: "flex items-center gap-2 justify-center"
          },
          row.original.draw.map(draw =>
            h(UBadge, {
              label: draw,
              color: draw === "Main" ? "main" : "qualifying"
            })
          )
        )
      }
    }
  },
  {
    accessorKey: "seed",
    accessorFn: row => row.seed?.toString() ?? (row.q_seed ? `Q-${row.q_seed}` : undefined),
    header: ({ column }) =>
      h(FilterTableHeader, {
        column: column as Column<unknown>,
        label: "Seed",
        type: "alpha"
      })
  },
  {
    id: "status",
    accessorFn: row =>
      row.status && row.q_status ? [row.status, `Q-${row.q_status}`]
      : row.status || row.q_status ? [row.status ?? `Q-${row.q_status}`]
      : undefined,
    header: ({ column }) =>
      h(FilterTableHeader, {
        column: column as Column<unknown>,
        label: "Status",
        type: "alpha"
      })
  },
  columnHelper.group({
    header: "Player(s)",
    columns: [
      {
        id: "country",
        accessorFn: row => row.players.map(player => player.country.name),
        sortingFn: (rowA, rowB, columnId) => arraySorting(rowA, rowB, columnId),
        header: ({ column }) =>
          h(FilterTableHeader, {
            column: column as Column<unknown>,
            label: "Country",
            type: "alpha"
          }),
        cell: ({ row }) => {
          if (tableMode.value === "grouped" && tours.length > 1 && row.getIsGrouped()) {
            return undefined
          } else {
            return row.original.players.map(player =>
              h(CountryLink, {
                country: player.country,
                key: `${player.id}-${player.country.id}`,
                class: "mx-auto"
              })
            )
          }
        }
      },
      {
        id: "first_name",
        accessorFn: row => row.players.map(player => player.first_name),
        sortingFn: (rowA, rowB, columnId) => arraySorting(rowA, rowB, columnId),
        header: ({ column }) =>
          h(FilterTableHeader, {
            column: column as Column<unknown>,
            label: "First Name",
            type: "alpha"
          }),
        cell: ({ row, cell }) => {
          if (tableMode.value === "grouped" && tours.length > 1 && row.getIsGrouped()) {
            return undefined
          } else {
            return h(
              "div",
              {
                class: "flex flex-col items-center"
              },
              row.original.players.map(player =>
                h(
                  ULink,
                  {
                    key: player.id,
                    to: {
                      name: "player",
                      params: { id: player.id, name: kebabCase(`${player.first_name} ${player.last_name}`) }
                    },
                    class: "hover-link"
                  },
                  () => player.first_name
                )
              )
            )
          }
        }
      },
      {
        id: "last_name",
        accessorFn: row => row.players.map(player => player.last_name),
        sortingFn: (rowA, rowB, columnId) => arraySorting(rowA, rowB, columnId),
        header: ({ column }) =>
          h(FilterTableHeader, {
            column: column as Column<unknown>,
            label: "Last Name",
            type: "alpha"
          }),
        cell: ({ row, cell }) => {
          if (tableMode.value === "grouped" && tours.length > 1 && row.getIsGrouped()) {
            return undefined
          } else {
            return h(
              "div",
              {
                class: "flex flex-col items-center"
              },
              row.original.players.map(player =>
                h(
                  ULink,
                  {
                    key: player.id,
                    to: {
                      name: "player",
                      params: { id: player.id, name: kebabCase(`${player.first_name} ${player.last_name}`) }
                    },
                    class: "hover-link"
                  },
                  () => player.last_name
                )
              )
            )
          }
        }
      },
      {
        id: "rank",
        accessorFn: row => row.players.map(player => player.rank),
        sortingFn: (rowA, rowB, columnId) =>
          Math.min(...(rowA.getValue(columnId) as number[])) < Math.min(...(rowB.getValue(columnId) as number[])) ? -1 : 1,
        aggregationFn: (leafRows, childRows) => {
          const ranks = childRows.map(row => row.original.players.map(player => player.rank)).flat()
          if (ranks.length === 0) {
            return undefined
          } else {
            const sortedRanks = ranks.sort((a, b) => (a ?? 0) - (b ?? 0))
            return `${sortedRanks[0]}-${sortedRanks[sortedRanks.length - 1]}`
          }
        },
        header: ({ column }) =>
          h(RangeTableHeader, {
            column: column as Column<unknown>,
            label: "Rank"
          }),
        cell: ({ row, cell }) => {
          if (tableMode.value === "grouped" && tours.length > 1 && row.getIsGrouped()) {
            return cell.getValue()
          } else {
            return h(
              "div",
              {
                class: "flex flex-col"
              },
              row.original.players.map(player => h("div", {}, [player.rank]))
            )
          }
        }
      }
    ]
  })
])

const columnFilters = ref([])
const columnVisibility = ref({
  tour: tours.length > 1
})
const grouping = computed(() => {
  return (
    tableMode.value === "grouped" ?
      tours.length > 1 ?
        ["tour", "type"]
      : ["type"]
    : []
  )
})
const grouping_options = ref<GroupingOptions>({
  groupedColumnMode: false,
  getGroupedRowModel: getGroupedRowModel()
})
</script>

<template>
  <u-table
    v-if="viewMode === 'list'"
    :data="entries"
    :columns
    :loading="status === 'pending'"
    sticky
    :empty="`No entries found for ${tournament?.name} ${year}`"
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

  <u-page-columns v-else-if="entries.length || status === 'pending'">
    <u-page-card
      v-if="entries.length"
      v-for="(entry, index) in entries"
      :key="index"
      highlight
      :highlight-color="getTourColour([entry.tour])"
    >
      <template #leading>
        <div class="flex items-center gap-2">
          <u-badge
            :label="entry.tour"
            :color="getTourColour([entry.tour])"
          />
          <u-badge
            :label="entry.type"
            :color="entry.type === 'Singles' ? 'singles' : 'doubles'"
          />
          <u-badge
            v-for="draw in entry.draw"
            :key="`${index}-${draw}`"
            :label="draw"
            :color="draw === 'Main' ? 'main' : 'qualifying'"
          />
        </div>
      </template>

      <template #title>
        <div class="flex items-center gap-2">
          <player-link :player="entry.players[0]!" /> [{{ entry.players[0]!.rank }}]
          <u-separator
            v-if="entry.players[1]"
            orientation="vertical"
            class="h-4"
          />
          <player-link
            v-if="entry.players[1]"
            :player="entry.players[1]"
          />
          <template v-if="entry.players[1]">[{{ entry.players[1]!.rank }}]</template>
        </div>
      </template>

      <template #description>
        <div class="flex items-center gap-2 mt-3">
          <u-badge
            v-if="entry.seed || entry.q_seed"
            :label="`Seed: ${entry.seed ?? `Q-${entry.q_seed}`}`"
            color="success"
          />
          <u-badge
            v-if="entry.status"
            :label="STATUSES[entry.status as keyof typeof STATUSES].longName"
            color="warning"
          />
          <u-badge
            v-if="entry.q_status"
            :label="`Q-${STATUSES[entry.q_status as keyof typeof STATUSES].longName}`"
            color="info"
          />
        </div>
      </template>
    </u-page-card>

    <loading-player
      v-else
      v-for="_ in 10"
      :key="_"
    />
  </u-page-columns>
  <error-message
    v-else
    :message="`No entries found for ${tournament?.name} ${year}`"
    :icon="icons.noPlayer"
  />
</template>
