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
  entries: ConsolidatedEntryType[]
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

const columnHelper = createColumnHelper<ConsolidatedEntryType>()

const arraySorting = (rowA: any, rowB: any, columnId: string) => {
  return useSorted(rowA.getValue(columnId)).value[0] < useSorted(rowB.getValue(columnId)).value[0] ? -1 : 1
}

const columns = computed<TableColumn<ConsolidatedEntryType>[]>(() => [
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
  columnHelper.group({
    header: "Player(s)",
    columns: [
      {
        accessorKey: "country.name",
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
            return h(CountryLink, {
              country: row.original.country,
              class: "mx-auto"
            })
          }
        }
      },
      {
        accessorKey: "first_name",
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
              ULink,
              {
                to: { name: "player", params: { id: row.original.id, name: kebabCase(`${row.original.first_name} ${row.original.last_name}`) } },
                class: "mx-auto hover-link w-fit"
              },
              () => cell.getValue()
            )
          }
        }
      },
      {
        accessorKey: "last_name",
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
              ULink,
              {
                to: { name: "player", params: { id: row.original.id, name: kebabCase(`${row.original.first_name} ${row.original.last_name}`) } },
                class: "mx-auto hover-link w-fit"
              },
              () => cell.getValue()
            )
          }
        }
      }
    ]
  }),
  columnHelper.group({
    header: "Singles",
    columns: [
      {
        id: "singles_draw",
        accessorFn: row => row.singles.draw.map(draw => draw),
        sortingFn: (rowA, rowB, columnId) => arraySorting(rowA, rowB, columnId),
        header: ({ column }) =>
          h(FilterTableHeader, {
            column: column as Column<unknown>,
            label: "Draw",
            type: "alpha"
          }),
        cell: ({ row }) => {
          if (tableMode.value === "grouped" && tours.length > 1 && row.getIsGrouped()) {
            return undefined
          } else {
            return h(
              "div",
              {
                class: "flex items-center gap-2 justify-center"
              },
              row.original.singles.draw.map(draw =>
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
        id: "singles_seed",
        accessorFn: row => row.singles.seed?.toString() ?? (row.singles.q_seed ? `Q-${row.singles.q_seed}` : undefined),
        header: ({ column }) =>
          h(FilterTableHeader, {
            column: column as Column<unknown>,
            label: "Seed",
            type: "alpha"
          })
      },
      {
        id: "singles_status",
        accessorFn: row =>
          row.singles.status && row.singles.q_status ? [row.singles.status, `Q-${row.singles.q_status}`]
          : row.singles.status || row.singles.q_status ? [row.singles.status ?? `Q-${row.singles.q_status}`]
          : undefined,
        header: ({ column }) =>
          h(FilterTableHeader, {
            column: column as Column<unknown>,
            label: "Status",
            type: "alpha"
          })
      },
      {
        accessorKey: "singles.rank",
        aggregationFn: "extent",
        header: ({ column }) =>
          h(RangeTableHeader, {
            column: column as Column<unknown>,
            label: "Rank"
          }),
        cell: ({ row, cell }) => {
          if (tableMode.value === "grouped" && tours.length > 1 && row.getIsGrouped()) {
            return `${(cell.getValue() as number[])[0]}-${(cell.getValue() as number[])[1]}`
          } else {
            return cell.getValue()
          }
        }
      }
    ]
  }),
  columnHelper.group({
    header: "Doubles",
    columns: [
      {
        id: "doubles_draw",
        accessorFn: row => row.doubles.draw.map(draw => draw),
        sortingFn: (rowA, rowB, columnId) => arraySorting(rowA, rowB, columnId),
        header: ({ column }) =>
          h(FilterTableHeader, {
            column: column as Column<unknown>,
            label: "Draw",
            type: "alpha"
          }),
        cell: ({ row }) => {
          if (tableMode.value === "grouped" && tours.length > 1 && row.getIsGrouped()) {
            return undefined
          } else {
            return h(
              "div",
              {
                class: "flex items-center gap-2 justify-center"
              },
              row.original.doubles.draw.map(draw =>
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
        id: "doubles_seed",
        accessorFn: row => row.doubles.seed?.toString() ?? (row.doubles.q_seed ? `Q-${row.doubles.q_seed}` : undefined),
        header: ({ column }) =>
          h(FilterTableHeader, {
            column: column as Column<unknown>,
            label: "Seed",
            type: "alpha"
          })
      },
      {
        id: "doubles_status",
        accessorFn: row =>
          row.doubles.status && row.doubles.q_status ? [row.doubles.status, `Q-${row.doubles.q_status}`]
          : row.doubles.status || row.doubles.q_status ? [row.doubles.status ?? `Q-${row.doubles.q_status}`]
          : undefined,
        header: ({ column }) =>
          h(FilterTableHeader, {
            column: column as Column<unknown>,
            label: "Status",
            type: "alpha"
          })
      },
      {
        accessorKey: "doubles.rank",
        aggregationFn: "extent",
        header: ({ column }) =>
          h(RangeTableHeader, {
            column: column as Column<unknown>,
            label: "Rank"
          }),
        cell: ({ row, cell }) => {
          if (tableMode.value === "grouped" && tours.length > 1 && row.getIsGrouped()) {
            return `${(cell.getValue() as number[])[0]}-${(cell.getValue() as number[])[1]}`
          } else {
            return cell.getValue()
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
  return tableMode.value === "grouped" && tours.length > 1 ? ["tour"] : []
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

  <u-page-columns
    v-else-if="entries.length || status === 'pending'"
    class="xl:columns-4 2xl:columns-5"
  >
    <u-page-card
      v-if="entries.length"
      v-for="entry in entries"
      :key="entry.id"
      highlight
      :highlight-color="getTourColour([entry.tour])"
      :to="{ name: 'player', params: { id: entry.id, name: kebabCase(`${entry.first_name}-${entry.last_name}`) } }"
      :title="`${entry.first_name} ${entry.last_name}`"
    >
      <template #leading>
        <div class="flex items-center gap-2">
          <u-icon
            :name="getFlagCode(entry.country)"
            class="text-2xl"
          />
          <u-badge
            :label="entry.tour"
            :color="getTourColour([entry.tour])"
          />
        </div>
      </template>

      <template #description>
        <div class="flex flex-col gap-3 mt-3">
          <div
            v-if="entry.singles.draw.length"
            class="flex flex-col gap-1"
          >
            <div class="flex items-center gap-2">
              <u-badge
                label="Singles"
                color="singles"
              />
              <u-badge
                v-for="draw in entry.singles.draw"
                :key="`Singles-${draw}`"
                :label="draw"
                :color="draw === 'Main' ? 'main' : 'qualifying'"
              />
            </div>
            <div class="flex items-center text-sm ml-2">
              <div v-if="entry.singles.seed || entry.singles.q_seed">
                Seed: {{ entry.singles.q_seed ? `Q-${entry.singles.q_seed}` : entry.singles.seed }} | &nbsp;
              </div>
              <div v-if="entry.singles.status || entry.singles.q_status">
                <span v-if="entry.singles.status">{{ entry.singles.status }}</span>
                <u-separator
                  v-if="entry.singles.status && entry.singles.q_status"
                  class="h-4"
                  orientation="vertical"
                />
                <span v-if="entry.singles.q_status">Q-{{ entry.singles.q_status }}</span>
                |&nbsp;
              </div>
              <div>Rank: {{ entry.singles.rank ?? 0 }}</div>
            </div>
          </div>
          <div
            v-if="entry.doubles.draw.length"
            class="flex flex-col gap-1"
          >
            <div class="flex items-center gap-2">
              <u-badge
                label="Doubles"
                color="doubles"
              />
              <u-badge
                v-for="draw in entry.doubles.draw"
                :key="`Doubles-${draw}`"
                :label="draw"
                :color="draw === 'Main' ? 'main' : 'qualifying'"
              />
            </div>
            <div class="flex items-center text-sm ml-2">
              <div v-if="entry.doubles.seed || entry.doubles.q_seed">
                Seed: {{ entry.doubles.q_seed ? `Q-${entry.doubles.q_seed}` : entry.doubles.seed }} | &nbsp;
              </div>
              <div v-if="entry.doubles.status || entry.doubles.q_status">
                <span v-if="entry.doubles.status">{{ entry.doubles.status }}</span>
                <u-separator
                  v-if="entry.doubles.status && entry.doubles.q_status"
                  class="h-4"
                  orientation="vertical"
                />
                <span v-if="entry.doubles.q_status">Q-{{ entry.doubles.q_status }}</span>
                |&nbsp;
              </div>
              <div>Rank: {{ entry.doubles.rank ?? 0 }}</div>
            </div>
          </div>
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
