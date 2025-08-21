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

const { eid, year } = useRoute().params as { eid: string; year: string }
const {
  icons,
  ui: { icons: uIcons }
} = useAppConfig()
const { viewMode, tableMode } = useDefaults()
const breakpoints = useBreakpoints(breakpointsTailwind, { ssrWidth: 1024 })
const mdAndUp = breakpoints.greaterOrEqual("md")
const tours = inject<TourType[]>("tours", [])
const tournament = inject<TournamentInterface>("tournament")

// API call
const { data: teams, status } = await useFetch<EntryInfoInterface[]>("/api/events/entry-info", {
  key: `event-entry-info-${eid}`,
  query: { id: eid },
  default: () => []
})

const groupedTeams = computed(() => {
  if (teams.value.length) {
    const relationships = useArrayUnique(teams.value.map(team => team.label))

    return relationships.value.map(label => ({
      label,
      teams: teams.value.filter(team => team.label === label)
    }))
  }

  return []
})

const columnHelper = createColumnHelper<EntryInfoInterface>()

const arraySorting = (rowA: any, rowB: any, columnId: string) => {
  return useSorted(rowA.getValue(columnId)).value[0] < useSorted(rowB.getValue(columnId)).value[0] ? -1 : 1
}

const columns = computed<TableColumn<EntryInfoInterface>[]>(() => [
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
    accessorKey: "label",
    header: ({ column }) =>
      h(FilterTableHeader, {
        column: column as Column<unknown>,
        label: "Entry Info",
        type: "alpha"
      }),
    cell: ({ row, cell }) => {
      if (tableMode.value === "ungrouped" || (row.getIsGrouped() && row.depth === 0)) {
        return cell.getValue()
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
      if (
        tableMode.value === "ungrouped" ||
        (row.getIsGrouped() && ((tours.length > 1 && row.depth === 2) || (tours.length < 2 && row.depth === 1)))
      ) {
        return h(UBadge, {
          label: row.original.type,
          color: row.original.type === "Singles" ? "singles" : "doubles",
          class: "font-semibold"
        })
      }
    }
  },
  {
    accessorKey: "draw",
    header: ({ column }) =>
      h(FilterTableHeader, {
        column: column as Column<unknown>,
        label: "Draw",
        type: "alpha"
      }),
    cell: ({ row }) => {
      if (
        tableMode.value === "ungrouped" ||
        (row.getIsGrouped() && ((tours.length > 1 && row.depth === 3) || (tours.length < 2 && row.depth === 2)))
      ) {
        return h(UBadge, {
          label: row.original.draw,
          color: row.original.draw === "Main" ? "main" : "qualifying",
          class: "font-semibold"
        })
      }
    }
  },
  columnHelper.group({
    header: "Player(s)",
    columns: [
      {
        id: "country",
        accessorFn: row => row.team.map(player => player.country.name),
        sortingFn: (rowA, rowB, columnId) => arraySorting(rowA, rowB, columnId),
        header: ({ column }) =>
          h(FilterTableHeader, {
            column: column as Column<unknown>,
            label: "Country",
            type: "alpha"
          }),
        cell: ({ row }) => {
          if (tableMode.value === "ungrouped" || !row.getIsGrouped()) {
            return row.original.team.map(player =>
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
        accessorFn: row => row.team.map(player => player.first_name),
        sortingFn: (rowA, rowB, columnId) => arraySorting(rowA, rowB, columnId),
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
                class: "flex flex-col items-center"
              },
              row.original.team.map(player =>
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
        accessorFn: row => row.team.map(player => player.last_name),
        sortingFn: (rowA, rowB, columnId) => arraySorting(rowA, rowB, columnId),
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
                class: "flex flex-col items-center"
              },
              row.original.team.map(player =>
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
      }
    ]
  }),
  {
    id: "reason",
    header: "Rank/Reason",
    accessorFn: row => {
      if (row.rank) {
        if (row.status === "PR") return `P${row.rank}`
        return row.rank
      }

      if (row.team[0]?.reason && row.team[0].reason !== "teammate")
        return `${row.type === "Singles" ? "" : `${row.team[0].last_name} - `} ${row.team[0].reason}`
      if (row.team[1]?.reason && row.team[1].reason !== "teammate") return `${row.team[1].last_name} - ${row.team[1].reason}`
      if (row.team_reason) return row.team_reason
    }
  }
])

const columnFilters = ref([])
const columnVisibility = ref({
  tour: tours.length > 1
})
const grouping = computed(() => {
  return (
    tableMode.value === "grouped" ?
      tours.length > 1 ?
        ["label", "tour", "type", "draw"]
      : ["label", "type", "draw"]
    : []
  )
})
const grouping_options = ref<GroupingOptions>({
  groupedColumnMode: false,
  getGroupedRowModel: getGroupedRowModel()
})
</script>

<template>
  <dashboard-subpanel
    id="entry-info"
    title="Entry Information"
    :icon="uIcons.info"
  >
    <template #right>
      <event-entry-info-chart
        v-if="teams.length && mdAndUp"
        :teams
      />
    </template>

    <u-table
      v-if="viewMode === 'list'"
      :data="teams"
      :columns
      :loading="status === 'pending'"
      sticky
      :empty="`No entry information available for ${tournament?.name} ${year}`"
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

    <u-collapsible
      v-else-if="groupedTeams.length"
      v-for="item in groupedTeams"
      :key="item.label"
    >
      <u-button
        class="group my-2"
        :label="`${item.label}s`"
        color="neutral"
        :ui="{ trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200' }"
        block
        :trailing-icon="uIcons.chevronDown"
      />

      <template #content>
        <div
          v-for="(team, index) in item.teams"
          :key="`${item.label}-${index}`"
          class="flex justify-between items-center text-sm gap-3"
        >
          <div class="flex items-center gap-2">
            <u-badge
              :color="getTourColour([team.tour])"
              :label="team.tour"
            />
            <u-badge
              :color="team.type === 'Singles' ? 'singles' : 'doubles'"
              :label="team.type"
            />
            <u-badge
              :color="team.draw === 'Main' ? 'main' : 'qualifying'"
              :label="team.draw"
            />
            <template
              v-for="(player, idx) in team.team"
              :key="player.id"
            >
              <u-separator
                v-if="idx > 0"
                orientation="vertical"
                class="h-4"
              />
              <player-link :player />
            </template>
          </div>

          <div>
            <span v-if="item.label === 'Last Direct Acceptance'">{{ team.status === "PR" ? "P" : "" }}{{ team.rank }}</span>
            <span v-else-if="['Withdrawal', 'Retirement', 'Walkover'].includes(item.label)">
              {{
                team.team[0]?.reason && team.team[0].reason !== "teammate" ?
                  `${team.type === "Singles" ? "" : `${team.team[0].last_name} - `} ${team.team[0].reason}`
                : team.team[1]?.reason && team.team[1].reason !== "teammate" ? `${team.team[1].last_name} - ${team.team[1].reason}`
                : team.team_reason
              }}
            </span>
          </div>
        </div>
      </template>
    </u-collapsible>
    <error-message
      v-else
      :message="`No entry information available for ${tournament?.name} ${year}`"
    />
  </dashboard-subpanel>
</template>
