<script setup lang="ts">
import { CountryLink, FilterTableHeader, InputTableHeader, MatchScoreItem, RangeTableHeader, UBadge, UButton, ULink } from "#components"
import type { TableColumn } from "@nuxt/ui"
import {
  type Column,
  createColumnHelper,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getGroupedRowModel,
  type GroupingOptions
} from "@tanstack/vue-table"

const { events } = defineProps<{
  events: TournamentWinnerEventType[]
  status: APIStatusType
}>()
const {
  // @ts-ignore
  params: { id, name }
} = useRoute()
const { tableMode } = useDefaults()
const {
  ui: { icons }
} = useAppConfig()
const tours = inject<TourType[]>("tours", [])
const tournamentName = inject<string>("tournamentName", "")

const columnHelper = createColumnHelper<TournamentWinnerFlattenedType>()

const flattenedEvents = computed(() => {
  const newEvents: TournamentWinnerFlattenedType[] = []
  events.forEach(event => {
    if (event.country) {
      const score = event.country.score.split("-").map((s: string) => Number(s))
      newEvents.push({
        ...event,
        type: "Country",
        winner: score[0]! > score[1]! ? event.country.c1 : event.country.c2,
        loser: score[0]! > score[1]! ? event.country.c2 : event.country.c1,
        score: event.country.score
      })
    } else {
      if (event.singles) {
        event.singles.forEach(singles => {
          if (typeof singles.winner !== "string") {
            newEvents.push({
              id: event.id,
              year: event.year,
              tour: singles.tour,
              labels: singles.labels,
              sets: singles.sets,
              incomplete: singles.incomplete,
              stats: singles.stats,
              type: "Singles",
              winner: [singles.winner as PlayerInterface],
              loser: [singles.loser as PlayerInterface]
            })
          }
        })
      }

      if (event.doubles) {
        event.doubles.forEach(doubles => {
          if (doubles.loser) {
            newEvents.push({
              id: event.id,
              year: event.year,
              tour: doubles.tour,
              labels: doubles.labels,
              sets: doubles.sets,
              incomplete: doubles.incomplete,
              stats: doubles.stats,
              type: "Doubles",
              winner: doubles.winner as PlayerInterface[],
              loser: doubles.loser as PlayerInterface[]
            })
          }
        })
      }
    }
  })
  return newEvents
})

const arraySorting = (rowA: any, rowB: any, columnId: string) => {
  return useSorted(rowA.getValue(columnId)).value[0] < useSorted(rowB.getValue(columnId)).value[0] ? -1 : 1
}

//@ts-ignore
const columns = computed<TableColumn<TournamentWinnerFlattenedType>[]>(() => [
  ...(tableMode.value === "grouped" ?
    [
      {
        id: "expand",
        cell: ({ row }: { row: any }) => {
          if (row.getIsGrouped()) {
            return h(UButton, {
              icon: icons.chevronDoubleRight,
              size: "xs",
              variant: "link",
              color: "neutral",
              onClick: () => row.toggleExpanded(),
              ui: { leadingIcon: row.getIsExpanded() ? "rotate-90 transition-transform duration-200" : "transition-transform duration-200" }
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
    cell: ({ row, cell }) => {
      if (tableMode.value === "ungrouped" || COUNTRY_DRAWS.includes(id as string) || (row.getIsGrouped() && row.depth === 0)) {
        return h(
          ULink,
          {
            to: { name: "event", params: { id, name, year: row.original.year, eid: row.original.id } },
            class: "hover-link font-semibold"
          },
          () => cell.getValue()
        )
      }
    },
    footer: ({ table }) => `Total: ${table.getFilteredRowModel().rows.length}`
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
      if (tableMode.value === "ungrouped" || (tableMode.value === "grouped" && row.getIsGrouped() && row.depth === 1)) {
        return h(UBadge, {
          label: (row.original.tour as TourType).replace("Men", "ITF (M)").replace("Women", "ITF (W)"),
          color: getTourColour([row.original.tour as TourType])
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
      if (tableMode.value === "ungrouped" || (tableMode.value === "grouped" && !row.getIsGrouped())) {
        return h(UBadge, {
          label: row.original.type,
          color: row.original.type.toLowerCase() as "singles" | "doubles"
        })
      }
    }
  },
  ...(!COUNTRY_DRAWS.includes(id as string) ?
    [
      columnHelper.group({
        header: "Winner(s)",
        columns: [
          {
            id: "winner_country",
            accessorFn: row => (row.winner as PlayerInterface[]).map(player => player.country.name),
            sortingFn: (rowA, rowB, columnId) => arraySorting(rowA, rowB, columnId),
            filterFn: "arrIncludes",
            header: ({ column }) =>
              h(FilterTableHeader, {
                column: column as Column<unknown>,
                label: "Country",
                type: "alpha"
              }),
            cell: ({ row }: { row: any }) => {
              if (tableMode.value === "ungrouped" || !row.getIsGrouped()) {
                return row.original.winner.map((player: PlayerInterface) =>
                  h(CountryLink, {
                    key: player.country.id,
                    country: player.country,
                    class: "mx-auto"
                  })
                )
              }
            }
          },
          {
            id: "winner_first_name",
            accessorFn: row => (row.winner as PlayerInterface[]).map(player => player.first_name),
            sortingFn: (rowA, rowB, columnId) => arraySorting(rowA, rowB, columnId),
            filterFn: "arrIncludes",
            header: ({ column }) =>
              h(FilterTableHeader, {
                column: column as Column<unknown>,
                label: "First Name",
                type: "alpha"
              }),
            cell: ({ row }: { row: any }) => {
              if (tableMode.value === "ungrouped" || !row.getIsGrouped()) {
                return h(
                  "div",
                  {
                    class: "flex flex-col items-center"
                  },

                  row.original.winner.map((player: PlayerInterface) =>
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
            }
          },
          {
            id: "winner_last_name",
            accessorFn: row => (row.winner as PlayerInterface[]).map(player => player.last_name),
            sortingFn: (rowA, rowB, columnId) => arraySorting(rowA, rowB, columnId),
            filterFn: "arrIncludes",
            header: ({ column }) =>
              h(FilterTableHeader, {
                column: column as Column<unknown>,
                label: "Last Name",
                type: "alpha"
              }),
            cell: ({ row }: { row: any }) => {
              if (tableMode.value === "ungrouped" || !row.getIsGrouped()) {
                return h(
                  "div",
                  {
                    class: "flex flex-col items-center"
                  },

                  row.original.winner.map((player: PlayerInterface) =>
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
      }),
      columnHelper.group({
        header: "Finalist(s)",
        columns: [
          {
            id: "finalist_country",
            accessorFn: row => (row.loser as PlayerInterface[]).map(player => player.country.name),
            sortingFn: (rowA, rowB, columnId) => arraySorting(rowA, rowB, columnId),
            filterFn: "arrIncludes",
            header: ({ column }) =>
              h(FilterTableHeader, {
                column: column as Column<unknown>,
                label: "Country",
                type: "alpha"
              }),
            cell: ({ row }: { row: any }) => {
              if (tableMode.value === "ungrouped" || !row.getIsGrouped()) {
                return row.original.loser.map((player: PlayerInterface) =>
                  h(CountryLink, {
                    key: player.country.id,
                    country: player.country,
                    class: "mx-auto"
                  })
                )
              }
            }
          },
          {
            id: "finalist_first_name",
            accessorFn: row => (row.loser as PlayerInterface[]).map(player => player.first_name),
            sortingFn: (rowA, rowB, columnId) => arraySorting(rowA, rowB, columnId),
            filterFn: "arrIncludes",
            header: ({ column }) =>
              h(FilterTableHeader, {
                column: column as Column<unknown>,
                label: "First Name",
                type: "alpha"
              }),
            cell: ({ row }: { row: any }) => {
              if (tableMode.value === "ungrouped" || !row.getIsGrouped()) {
                return h(
                  "div",
                  {
                    class: "flex flex-col items-center"
                  },

                  row.original.loser.map((player: PlayerInterface) =>
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
            }
          },
          {
            id: "finalist_last_name",
            accessorFn: row => (row.loser as PlayerInterface[]).map(player => player.last_name),
            sortingFn: (rowA, rowB, columnId) => arraySorting(rowA, rowB, columnId),
            filterFn: "arrIncludes",
            header: ({ column }) =>
              h(FilterTableHeader, {
                column: column as Column<unknown>,
                label: "Last Name",
                type: "alpha"
              }),
            cell: ({ row }: { row: any }) => {
              if (tableMode.value === "ungrouped" || !row.getIsGrouped()) {
                return h(
                  "div",
                  {
                    class: "flex flex-col items-center"
                  },

                  row.original.loser.map((player: PlayerInterface) =>
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
      }),
      {
        id: "score",
        header: "Score",
        cell: ({ row }: { row: any }) => {
          if (tableMode.value === "ungrouped" || (tableMode.value === "grouped" && !row.getIsGrouped())) {
            return h(MatchScoreItem, {
              labels: row.original.labels as string[],
              sets: row.original.sets as number[][][],
              year: row.original.year,
              id: row.original.id,
              match_no: 1,
              tournament: { id: Number(id), name: name as string, tours },
              stats: row.original.stats,
              incomplete: row.original.incomplete,
              centred: true
            })
          }
        }
      }
    ]
  : []),
  ...(COUNTRY_DRAWS.includes(id as string) ?
    [
      {
        id: "winner",
        accessorFn: (row: any) => (row.winner as CountryInterface).name,
        header: ({ column }: { column: Column<unknown> }) =>
          h(FilterTableHeader, {
            column,
            label: "Winner",
            type: "alpha"
          }),
        cell: ({ row }: { row: any }) =>
          h(CountryLink, {
            country: row.original.winner,
            class: "mx-auto",
            iconOnly: false
          })
      },
      {
        id: "finalist",
        accessorFn: (row: any) => (row.loser as CountryInterface).name,
        header: ({ column }: { column: Column<unknown> }) =>
          h(FilterTableHeader, {
            column,
            label: "Finalist",
            type: "alpha"
          }),
        cell: ({ row }: { row: any }) =>
          h(CountryLink, {
            country: row.original.winner,
            class: "mx-auto",
            iconOnly: false
          })
      },
      {
        accessorKey: "score",
        header: "Score",
        cell: ({ row }: { row: any }) => {
          const scoreArray = row.original.score.split("-").map((s: string) => Number(s))
          if (scoreArray[0] > scoreArray[1]) {
            return row.original.score
          } else {
            return `${scoreArray[1]}-${scoreArray[0]}`
          }
        }
      }
    ]
  : [])
])

const columnFilters = ref([])
const grouping = computed(() =>
  tableMode.value === "grouped" || !COUNTRY_DRAWS.includes(id as string) ?
    tours.length === 1 ?
      ["year"]
    : ["year", "tour"]
  : []
)
const grouping_options = ref<GroupingOptions>({
  groupedColumnMode: false,
  getGroupedRowModel: getGroupedRowModel()
})
const columnVisibility = ref({
  tour: tours.length > 1 && !COUNTRY_DRAWS.includes(id as string),
  type: !COUNTRY_DRAWS.includes(id as string)
})
</script>

<template>
  <u-table
    :data="flattenedEvents"
    :columns
    :loading="status === 'pending'"
    sticky
    :empty="`No events found for ${tournamentName}`"
    v-model:columnFilters="columnFilters"
    v-model:column-visibility="columnVisibility"
    :faceted-options="{
      getFacetedRowModel: getFacetedRowModel(),
      getFacetedUniqueValues: getFacetedUniqueValues()
    }"
    :grouping="grouping"
    :grouping-options="grouping_options"
    :ui="{
      root: 'scrollbar-thin scrollbar-thumb-primary-600 scrollbar-track-transparent max-h-190',
      td: 'empty:p-0'
    }"
  />
</template>
