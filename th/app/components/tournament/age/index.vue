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
const { data: winners, status } = await useFetch<TournamentAgeType[]>("/api/tournaments/winners-by-age", {
  key: `tournament-age-${id}`,
  query: { id },
  default: () => []
})

const getAge = (age: { months: number; days: number }) => {
  const years = Math.floor(age.months / 12)
  const months = age.months % 12
  const days = age.days
  return `${years} years, ${months} months, ${days} days`
}

const columnHelper = createColumnHelper<TournamentAgeType>()

const columns = computed<TableColumn<TournamentAgeType>[]>(() => [
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
    accessorKey: "player.tour",
    header: ({ column }) =>
      h(FilterTableHeader, {
        column: column as Column<unknown>,
        label: "Tour",
        type: "alpha"
      }),
    cell: ({ row, cell }) => {
      if (tableMode.value === "ungrouped" || (row.getIsGrouped() && row.depth === 0)) {
        return h(UBadge, {
          label: cell.getValue() as string,
          color: getTourColour([cell.getValue() as TourType]),
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
        label: "Tour",
        type: "alpha"
      }),
    cell: ({ row, cell }) => {
      if (tableMode.value === "ungrouped" || (row.getIsGrouped() && row.depth === 1)) {
        return h(UBadge, {
          label: cell.getValue() as string,
          color: (cell.getValue() as string).toLowerCase() as "singles" | "doubles",
          class: "font-semibold"
        })
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
            to: { name: "event", params: { id, name, year: row.original.year, eid: row.original.id } },
            class: "hover-link"
          },
          () => row.original.year
        )
      }
    }
  },
  {
    id: "age",
    accessorFn: row => (row.age ? Math.floor(row.age?.months / 12) : undefined),
    sortingFn: (rowA, rowB) => {
      const ageA = rowA.original.age
      const ageB = rowB.original.age

      if (!ageA) return 1
      if (!ageB) return -1

      if (ageA.months === ageB.months) {
        return ageA.days < ageB.days ? -1 : 1
      } else {
        return ageA.months < ageB.months ? -1 : 1
      }
    },
    aggregationFn: (leafRows, childRows) => {
      const totalDays = childRows
        .filter(row => row.original.age)
        .reduce((sum, row) => sum + row.original.age!.months * 30.4375 + (row.original.age?.days || 0), 0)
      const count = childRows.filter(row => row.original.age).length
      const averageDays = totalDays / count

      const years = Math.floor(averageDays / 365.25)
      const months = Math.floor((averageDays % 365.25) / 30.4375)
      const days = Math.floor((averageDays % 365.25) % 30.4375)

      return `Avg: ${years} years, ${months} months, ${days} days`
    },
    header: ({ column }) =>
      h(RangeTableHeader, {
        column: column as Column<unknown>,
        label: "Age"
      }),
    cell: ({ row }) => {
      if (tableMode.value === "ungrouped" || !row.getIsGrouped()) {
        return row.original.age ?
            `${Math.floor(row.original.age.months / 12)} years, ${row.original.age.months % 12} months, ${row.original.age.days} days`
          : "—"
      }
    }
  },
  columnHelper.group({
    header: "Player",
    columns: [
      {
        accessorKey: "player.country.name",
        header: ({ column }) =>
          h(FilterTableHeader, {
            column: column as Column<unknown>,
            label: "Country",
            type: "alpha"
          }),
        cell: ({ row }) => {
          if (tableMode.value === "ungrouped" || !row.getIsGrouped()) {
            return h(CountryLink, {
              country: row.original.player.country,
              class: "mx-auto"
            })
          }
        }
      },
      {
        accessorKey: "player.first_name",
        header: ({ column }) =>
          h(FilterTableHeader, {
            column: column as Column<unknown>,
            label: "First Name",
            type: "alpha"
          }),
        cell: ({ row, cell }) => {
          if (tableMode.value === "ungrouped" || !row.getIsGrouped()) {
            return h(
              ULink,
              {
                to: {
                  name: "player",
                  params: { id: row.original.player.id, name: kebabCase(`${row.original.player.first_name} ${row.original.player.last_name}`) }
                },
                class: "hover-link"
              },
              () => cell.getValue()
            )
          }
        }
      },
      {
        accessorKey: "player.last_name",
        header: ({ column }) =>
          h(FilterTableHeader, {
            column: column as Column<unknown>,
            label: "Last Name",
            type: "alpha"
          }),
        cell: ({ row, cell }) => {
          if (tableMode.value === "ungrouped" || !row.getIsGrouped()) {
            return h(
              ULink,
              {
                to: {
                  name: "player",
                  params: { id: row.original.player.id, name: kebabCase(`${row.original.player.first_name} ${row.original.player.last_name}`) }
                },
                class: "hover-link"
              },
              () => cell.getValue()
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
const grouping = computed(() =>
  tableMode.value === "grouped" ?
    tours.length === 1 ?
      ["type"]
    : ["player_tour", "type"]
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
      v-if="winners.length || status === 'pending'"
      class="2xl:grid-cols-4 max-h-165 overflow-y-auto p-5 scrollbar-thin scrollbar-thumb-primary-600 scrollbar-track-transparent"
    >
      <template
        v-if="winners.length"
        v-for="winner in winners"
        :key="winner.id"
      >
        <u-card
          v-if="winner.age"
          :ui="{ root: `ring-${getTourColour([winner.player.tour])}`, body: 'text-center' }"
        >
          <template #header>
            <div class="flex justify-between items-center font-semibold">
              <player-link :player="winner.player" />
              <div class="flex items-center gap-1">
                <u-badge
                  :label="winner.player.tour"
                  :color="getTourColour([winner.player.tour])"
                />

                <u-badge
                  :label="winner.type"
                  :color="winner.type === 'Singles' ? 'singles' : 'doubles'"
                />
              </div>
            </div>
          </template>

          {{ getAge(winner.age) }}
        </u-card>
      </template>

      <loading-base
        v-else
        v-for="_ in 10"
        :key="_"
      />
    </u-page-grid>
    <error-message
      v-else
      :icon="icons.noCalendar"
      :message="`No winners found for ${tournamentName}`"
    />
  </div>
  <u-table
    v-else
    :data="winners"
    :columns
    :loading="status === 'pending'"
    sticky
    :empty="`No winners found for ${tournamentName}`"
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
