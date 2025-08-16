<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui"
import { getFacetedRowModel, getFacetedMinMaxValues, getFacetedUniqueValues, getGroupedRowModel, type GroupingOptions } from "@tanstack/vue-table"

const { tournaments } = defineProps<{
  tournaments: TournamentInterface[]
  status: APIStatusType
}>()
const {
  ui: { icons }
} = useAppConfig()

type NewTournamentType = Omit<TournamentInterface, "tours"> & { tour: TourType }

// Need one tournament per tour
const flattenedTournaments = computed<NewTournamentType[]>(() => {
  const newTournaments: NewTournamentType[] = []
  for (const tournament of tournaments) {
    if (tournament.tours.length === 1) {
      newTournaments.push({
        id: tournament.id,
        name: tournament.name,
        established: tournament.established,
        abolished: tournament.abolished,
        tour: tournament.tours[0]?.replace("Men", "ITF (M)").replace("Women", "ITF (W)") as TourType
      })
    } else {
      for (const tour of tournament.tours) {
        newTournaments.push({
          id: tournament.id,
          name: tournament.name,
          established: tournament.established,
          abolished: tournament.abolished,
          tour: tour.replace("Men", "ITF (M)").replace("Women", "ITF (W)") as TourType
        })
      }
    }
  }
  return newTournaments
})

const columns: TableColumn<NewTournamentType>[] = [
  { accessorKey: "tour", header: "Tour" },
  {
    accessorKey: "name",
    filterFn: "includesString",
    aggregationFn: "count"
  },
  {
    accessorKey: "established",
    sortUndefined: "last",
    cell: ({ row, cell }) => !row.getIsGrouped() && cell.getValue()
  },
  {
    accessorKey: "abolished",
    sortUndefined: "last",
    cell: ({ row, cell }) => !row.getIsGrouped() && cell.getValue()
  }
]

const columnFilters = ref([])
const grouping_options = ref<GroupingOptions>({
  groupedColumnMode: false,
  getGroupedRowModel: getGroupedRowModel()
})
</script>

<template>
  <u-table
    :data="flattenedTournaments"
    :columns
    :loading="status === 'pending'"
    sticky
    empty="No tournaments found"
    :faceted-options="{
      getFacetedRowModel: getFacetedRowModel(),
      getFacetedMinMaxValues: getFacetedMinMaxValues(),
      getFacetedUniqueValues: getFacetedUniqueValues()
    }"
    v-model:columnFilters="columnFilters"
    :grouping="['tour']"
    :grouping-options="grouping_options"
    :ui="{
      root: 'scrollbar-thin scrollbar-thumb-primary-600 scrollbar-track-transparent',
      td: 'empty:p-0' // helps with the colspaned row added for expand slot
    }"
  >
    <template #tour-cell="{ row, cell }">
      <div
        v-if="row.getIsGrouped()"
        class="flex items-center"
      >
        <span
          class="inline-block"
          :style="{ width: `calc(${row.depth} * 1rem)` }"
        />

        <u-button
          variant="link"
          color="neutral"
          class="mr-2"
          size="xs"
          :icon="icons.chevronDoubleRight"
          :ui="{ leadingIcon: row.getIsExpanded() ? 'rotate-90 transition-transform duration-200' : 'transition-transform duration-200' }"
          @click="row.toggleExpanded()"
        />

        <u-badge
          :color="getTourColor([row.original.tour.replace('ITF (M)', 'Men').replace('ITF (W)', 'Women') as TourType])"
          :label="cell.getValue() as string"
          class="mx-1"
        />
      </div>
      <template v-else>{{ " " }}</template>
    </template>

    <template #name-header="{ column }">
      <input-table-header
        :column
        label="Tournaments"
        type="alpha"
      />
    </template>

    <template #name-cell="{ row, cell }">
      <u-link
        v-if="!row.getIsGrouped()"
        class="hover-link"
        :to="{ name: 'tournament', params: { id: row.original.id, name: kebabCase(cell.getValue() as string) } }"
      >
        {{ cell.getValue() }}
      </u-link>
    </template>

    <template #established-header="{ column }">
      <range-table-header
        :column
        label="Established"
      />
    </template>

    <template #abolished-header="{ column }">
      <range-table-header
        :column
        label="Abolished"
      />
    </template>
  </u-table>
</template>
