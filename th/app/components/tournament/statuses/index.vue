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
const { data: players, status } = await useFetch<EntryInterface[]>("/api/tournaments/statuses", {
  key: `tournament-statuses-${id}`,
  query: { id },
  default: () => []
})

const columnHelper = createColumnHelper<EntryInterface>()

const arraySorting = (rowA: any, rowB: any, columnId: string) => {
  return useSorted(rowA.getValue(columnId)).value[0] < useSorted(rowB.getValue(columnId)).value[0] ? -1 : 1
}

const columns = computed<TableColumn<EntryInterface>[]>(() => [
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
    id: "status",
    accessorFn: row => STATUSES[row.status as keyof typeof STATUSES].longName,
    meta: { class: { td: "font-semibold" } },
    header: ({ column }) =>
      h(FilterTableHeader, {
        column: column as Column<unknown>,
        label: "Status",
        type: "alpha"
      }),
    cell: ({ cell, row }) => {
      if (tableMode.value === "ungrouped" || row.getIsGrouped()) {
        return cell.getValue()
      }
    }
  },
  {
    accessorKey: "year",
    header: ({ column }) =>
      h(RangeTableHeader, {
        column: column as Column<unknown>,
        label: "Year"
      }),
    cell: ({ row }) => {
      if (tableMode.value === "ungrouped" || !row.getIsGrouped()) {
        return h(
          ULink,
          {
            to: { name: "event", params: { id, name, year: row.original.year, eid: row.original.eid } },
            class: "hover-link font-semibold"
          },
          () => row.original.year
        )
      }
    },
    footer: ({ column }) => "Events: " + column.getFacetedUniqueValues().size
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
      if (tableMode.value === "ungrouped" || !row.getIsGrouped()) {
        return h(UBadge, {
          label: row.original.tour,
          color: getTourColour([row.original.tour])
        })
      }
    },
    footer: ({ table }) => {
      const uniqueStatuses = Array.from(table.getColumn("status")!.getFacetedUniqueValues().keys())
      if (uniqueStatuses.length > 0) {
        const count = table.getFilteredRowModel().rows.filter(row => row.getValue("status") === uniqueStatuses[0]).length
        return `${uniqueStatuses[0]}s: ${count}`
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
      if (tableMode.value === "ungrouped" || !row.getIsGrouped()) {
        return h(UBadge, {
          label: row.original.type,
          color: row.original.type === "Singles" ? "singles" : "doubles"
        })
      }
    },
    footer: ({ table }) => {
      const uniqueStatuses = Array.from(table.getColumn("status")!.getFacetedUniqueValues().keys())
      if (uniqueStatuses.length > 1) {
        const count = table.getFilteredRowModel().rows.filter(row => row.getValue("status") === uniqueStatuses[1]).length
        return `${uniqueStatuses[1]}s: ${count}`
      }
    }
  },
  columnHelper.group({
    header: "Player(s)",
    columns: [
      {
        id: "country",
        accessorFn: row => row.players.map(player => player.country.name),
        sortingFn: (rowA, rowB, columnId) => arraySorting(rowA, rowB, columnId),
        filterFn: "arrIncludes",
        header: ({ column }) =>
          h(FilterTableHeader, {
            column: column as Column<unknown>,
            label: "Country",
            type: "alpha"
          }),
        cell: ({ row }) => {
          if (tableMode.value === "ungrouped" || !row.getIsGrouped()) {
            return row.original.players.map(player =>
              h(CountryLink, {
                country: player.country,
                key: player.id,
                class: "mx-auto"
              })
            )
          }
        },
        footer: ({ table }) => {
          const uniqueStatuses = Array.from(table.getColumn("status")!.getFacetedUniqueValues().keys())
          if (uniqueStatuses.length > 2) {
            const count = table.getFilteredRowModel().rows.filter(row => row.getValue("status") === uniqueStatuses[2]).length
            return `${uniqueStatuses[2]}s: ${count}`
          }
        }
      },
      {
        id: "first_name",
        accessorFn: row => row.players.map(player => player.first_name),
        sortingFn: (rowA, rowB, columnId) => arraySorting(rowA, rowB, columnId),
        filterFn: "arrIncludes",
        header: ({ column }) =>
          h(FilterTableHeader, {
            column: column as Column<unknown>,
            label: "First Name",
            type: "alpha"
          }),
        cell: ({ row }) => {
          if (tableMode.value === "ungrouped" || !row.getIsGrouped()) {
            return h(
              "div",
              {
                class: "flex flex-col"
              },
              row.original.players.map(player =>
                h(
                  ULink,
                  {
                    key: player.id,
                    to: { name: "player", params: { id: player.id, name: kebabCase(`${player.first_name} ${player.last_name}`) } },
                    class: "hover-link w-fit"
                  },
                  () => player.first_name
                )
              )
            )
          }
        },
        footer: ({ table }) => {
          const uniqueStatuses = Array.from(table.getColumn("status")!.getFacetedUniqueValues().keys())
          if (uniqueStatuses.length > 3) {
            const count = table.getFilteredRowModel().rows.filter(row => row.getValue("status") === uniqueStatuses[3]).length
            return `${uniqueStatuses[3]}s: ${count}`
          }
        }
      },
      {
        id: "last_name",
        accessorFn: row => row.players.map(player => player.last_name),
        sortingFn: (rowA, rowB, columnId) => arraySorting(rowA, rowB, columnId),
        filterFn: "arrIncludes",
        header: ({ column }) =>
          h(FilterTableHeader, {
            column: column as Column<unknown>,
            label: "Last Name",
            type: "alpha"
          }),
        cell: ({ row }) => {
          if (tableMode.value === "ungrouped" || !row.getIsGrouped()) {
            return h(
              "div",
              {
                class: "flex flex-col"
              },
              row.original.players.map(player =>
                h(
                  ULink,
                  {
                    key: player.id,
                    to: { name: "player", params: { id: player.id, name: kebabCase(`${player.first_name} ${player.last_name}`) } },
                    class: "hover-link w-fit"
                  },
                  () => player.last_name
                )
              )
            )
          }
        }
      }
    ]
  })
])

const columnVisibility = ref({
  tour: tours.length > 1
})
const columnFilters = ref([])
const grouping = computed(() => (tableMode.value === "grouped" ? ["status"] : []))
const grouping_options = ref<GroupingOptions>({
  groupedColumnMode: false,
  getGroupedRowModel: getGroupedRowModel()
})
</script>

<template>
  <div v-if="viewMode === 'cards'">
    <u-page-grid
      class="xl:grid-cols-4 2xl:grid-cols-5"
      v-if="players.length || status === 'pending'"
    >
      <u-card
        v-if="players.length"
        v-for="(team, index) in players"
        :key="index"
        :ui="{
          root: `ring-${getTourColour([team.tour])}`,
          header: 'flex items-center justify-between',
          footer: 'mx-auto w-fit'
        }"
      >
        <template #header>
          <player-link
            v-for="player in team.players"
            :key="player.id + index"
            :player
            class="font-semibold"
          />

          <u-link
            :to="{ name: 'event', params: { id, name, year: team.year, eid: team.eid } }"
            class="hover-link font-semibold"
          >
            {{ team.year }}
          </u-link>
        </template>

        <div class="flex items-center gap-2 justify-center">
          <u-badge
            :label="team.tour"
            :color="getTourColour([team.tour])"
          />
          <u-badge
            :label="team.type"
            :color="team.type === 'Singles' ? 'singles' : 'doubles'"
          />
          <u-badge
            :label="team.status"
            color="primary"
          />
        </div>
      </u-card>

      <loading-player
        v-else
        v-for="_ in 4"
        :key="_"
      />
    </u-page-grid>
    <error-message
      v-else
      :icon="icons.noTournament"
      :message="`No qualifiers, lucky losers, alternates or wild cards have won ${tournamentName}`"
    />
  </div>
  <u-table
    v-else
    :data="players"
    :columns
    :loading="status === 'pending'"
    sticky
    :empty="`No qualifiers, lucky losers, alternates or wild cards have won ${tournamentName}`"
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
