<script setup lang="ts">
import { FilterTableHeader, RangeTableHeader, UBadge, UButton } from "#components"
import type { TableColumn } from "@nuxt/ui"
import {
  type Column,
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
const { data: awards, status } = await useFetch<RoundInterface[]>("/api/events/awards", {
  key: `event-awards-${eid}`,
  query: { id: eid },
  default: () => []
})

const groupedAwards = computed(() => {
  const grouped = []
  const usedTours = new Set<string>()

  for (const award of awards.value) {
    if (!usedTours.has(award.tour)) {
      const singlesAwards = awards.value.filter(a => a.tour === award.tour && a.type === "Singles")
      const doublesAwards = awards.value.filter(a => a.tour === award.tour && a.type === "Doubles")

      grouped.push({
        tour: award.tour,
        singles: singlesAwards,
        doubles: doublesAwards
      })

      usedTours.add(award.tour)
    }
  }

  return grouped
})

const columns = computed<TableColumn<RoundInterface>[]>(() => [
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
        label: "S/D",
        type: "alpha"
      }),
    cell: ({ row }) => {
      if (tableMode.value === "ungrouped" || (row.getIsGrouped() && tours.length > 1 && row.depth === 1) || row.depth === 0) {
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
    cell: ({ cell }) => (isDefined(cell.getValue()) ? (cell.getValue() as number).toLocaleString() : undefined),
    aggregationFn: "max",
    sortUndefined: "last",
    header: ({ column }) =>
      h(RangeTableHeader, {
        column: column as Column<unknown>,
        label: "Points"
      })
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
  <dashboard-subpanel
    id="awards"
    title="Awards"
    :icon="icons.awards"
  >
    <template #right>
      <event-awards-chart
        v-if="awards.length && mdAndUp"
        :awards
      />
    </template>

    <u-table
      v-if="viewMode === 'list'"
      :data="awards"
      :columns
      :loading="status === 'pending'"
      sticky
      :empty="`No awards found for ${tournament?.name} ${year}`"
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

    <div
      v-else-if="awards.length || status === 'pending'"
      class="grid grid-cols-1 lg:grid-cols-2 gap-5"
    >
      <u-card
        v-if="groupedAwards.length"
        v-for="group in groupedAwards"
        :key="group.tour"
        :class="`ring-${getTourColour([group.tour])}`"
      >
        <template
          #header
          v-if="groupedAwards.length > 1"
        >
          <u-badge
            :label="group.tour.replace('Men', 'ITF (M)').replace('Women', 'ITF (W)')"
            :color="getTourColour([group.tour])"
            size="lg"
          />
        </template>
        <table class="mx-auto">
          <thead class="[&>tr>th]:px-2 text-center text-muted">
            <tr>
              <th></th>
              <th colspan="2">Singles</th>
              <th colspan="2">Doubles</th>
            </tr>
            <tr>
              <th>Round</th>
              <th>Prize Money</th>
              <th>Points</th>
              <th>Prize Money</th>
              <th>Points</th>
            </tr>
          </thead>
          <tbody class="[&>tr>td]:px-2 text-center">
            <tr
              v-for="(award, index) in group.singles.length > group.doubles.length ? group.singles : group.doubles"
              :key="index"
            >
              <td class="text-muted">{{ award.round }}</td>
              <td>{{
                award.currency && isDefined(award.pm) ? award.pm.toLocaleString("en-GB", { style: "currency", currency: award.currency }) : "—"
              }}</td>
              <td>{{ isDefined(award.points) ? award.points : "—" }}</td>
              <td>
                {{
                  award.currency && isDefined(group.doubles[index]) && isDefined(group.doubles[index].pm) ?
                    group.doubles[index].pm.toLocaleString("en-GB", { style: "currency", currency: award.currency })
                  : "—"
                }}
              </td>
              <td>{{ isDefined(group.doubles[index]?.points) ? group.doubles[index].points : "—" }}</td>
            </tr>
          </tbody>
        </table>
      </u-card>
      <loading-base
        v-else
        v-for="_ in 10"
        :key="_"
      />
    </div>
    <error-message
      v-else
      :message="`No awards found for ${tournament?.name} ${year}`"
      :icon="icons.noAwards"
    />
  </dashboard-subpanel>
</template>
