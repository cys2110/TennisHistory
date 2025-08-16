<script setup lang="ts">
import { UBadge } from "#components"
import type { TableColumn } from "@nuxt/ui"
import { createColumnHelper, getFacetedRowModel, getFacetedMinMaxValues, getFacetedUniqueValues } from "@tanstack/vue-table"

defineProps<{
  entries: any[]
  status: APIStatusType
}>()
const {
  params: { year }
} = useRoute()

const tours = inject<TourType[]>("tours", [])
const tournament = inject<TournamentInterface>("tournament")

const columnHelper = createColumnHelper<any>()

const columns: TableColumn<any>[] = [
  { accessorKey: "tour" },
  columnHelper.group({
    header: "Player",
    columns: [{ accessorKey: "country.name" }, { accessorKey: "first_name" }, { accessorKey: "last_name" }]
  }),
  columnHelper.group({
    id: "singles",
    header: () => h(UBadge, { label: "Singles", color: "singles", class: "font-semibold" }),
    columns: [
      { accessorKey: "singles.draw" },
      {
        id: "singles_seed",
        accessorFn: row => row.singles.seed ?? (row.singles.q_seed ? `Q-${row.singles.q_seed}` : undefined)
      },
      {
        id: "singles_status",
        accessorFn: row =>
          row.singles.status ? STATUSES[row.singles.status as keyof typeof STATUSES].longName
          : row.singles.q_status ? `Q-${STATUSES[row.singles.q_status as keyof typeof STATUSES].longName}`
          : undefined
      },
      {
        id: "singles_rank",
        accessorFn: row => row.singles.rank ?? undefined
      }
    ]
  }),
  columnHelper.group({
    id: "doubles",
    header: () => h(UBadge, { label: "Doubles", color: "doubles", class: "font-semibold" }),
    columns: [
      { accessorKey: "doubles.draw" },
      {
        id: "doubles_seed",
        accessorFn: row => row.doubles.seed ?? (row.doubles.q_seed ? `Q-${row.doubles.q_seed}` : undefined)
      },
      {
        id: "doubles_status",
        accessorFn: row =>
          row.doubles.status ? STATUSES[row.doubles.status as keyof typeof STATUSES].longName
          : row.doubles.q_status ? `Q-${STATUSES[row.doubles.q_status as keyof typeof STATUSES].longName}`
          : undefined
      },
      {
        id: "doubles_rank",
        accessorFn: row => row.doubles.rank ?? undefined
      }
    ]
  })
]

const columnFilters = ref([])
const columnVisibility = ref({
  tour: tours.length > 1
})
</script>

<template>
  <u-table
    :data="entries"
    :columns
    :loading="status === 'pending'"
    sticky
    :empty="`No seeds in ${tournament?.name} ${year}`"
    :faceted-options="{
      getFacetedRowModel: getFacetedRowModel(),
      getFacetedMinMaxValues: getFacetedMinMaxValues(),
      getFacetedUniqueValues: getFacetedUniqueValues()
    }"
    v-model:columnFilters="columnFilters"
    v-model:column-visibility="columnVisibility"
    :ui="{ root: 'scrollbar-thin scrollbar-thumb-primary-600 scrollbar-track-transparent max-h-160' }"
  >
    <template #tour-header="{ column }">
      <filter-table-header
        :column
        label="Tour"
        type="alpha"
      />
    </template>

    <template #tour-cell="{ row }">
      <u-badge
        class="font-semibold"
        :label="row.original.tour"
        :color="getTourColor([row.original.tour])"
      />
    </template>

    <template #country_name-header="{ column }">
      <filter-table-header
        :column
        label="Country"
        type="alpha"
      />
    </template>

    <template #country_name-cell="{ row }">
      <country-link
        :country="row.original.country"
        class="mx-auto"
      />
    </template>

    <template #first_name-header="{ column }">
      <input-table-header
        :column
        label="First Name"
        type="alpha"
      />
    </template>

    <template #first_name-cell="{ row }">
      <u-link
        class="hover-link"
        :to="{ name: 'player', params: { id: row.original.id, name: kebabCase(`${row.original.first_name} ${row.original.last_name}`) } }"
      >
        {{ row.original.first_name }}
      </u-link>
    </template>

    <template #last_name-header="{ column }">
      <input-table-header
        :column
        label="Last Name"
        type="alpha"
      />
    </template>

    <template #last_name-cell="{ row }">
      <u-link
        class="hover-link"
        :to="{ name: 'player', params: { id: row.original.id, name: kebabCase(`${row.original.first_name} ${row.original.last_name}`) } }"
      >
        {{ row.original.last_name }}
      </u-link>
    </template>

    <template #singles_draw-header="{ column }">
      <filter-table-header
        :column
        label="Draw"
        type="alpha"
      />
    </template>

    <template #singles_draw-cell="{ row }">
      <div class="flex justify-center items-center gap-2">
        <u-badge
          v-for="draw in row.original.singles.draw"
          :key="`singles-${draw}`"
          :label="draw"
          :color="draw === 'Main' ? 'main' : 'qualifying'"
          class="font-semibold"
        />
      </div>
    </template>

    <template #singles_seed-header="{ column }">
      <range-table-header
        :column
        label="Seed"
      />
    </template>

    <template #singles_status-header="{ column }">
      <filter-table-header
        :column
        label="Status"
        type="alpha"
      />
    </template>

    <template #singles_rank-header="{ column }">
      <range-table-header
        :column
        label="Rank"
      />
    </template>

    <template #doubles_draw-header="{ column }">
      <filter-table-header
        :column
        label="Draw"
        type="alpha"
      />
    </template>

    <template #doubles_draw-cell="{ row }">
      <div class="flex justify-center items-center gap-2">
        <u-badge
          v-for="draw in row.original.doubles.draw"
          :key="`doubles-${draw}`"
          :label="draw"
          :color="draw === 'Main' ? 'main' : 'qualifying'"
          class="font-semibold"
        />
      </div>
    </template>

    <template #doubles_seed-header="{ column }">
      <range-table-header
        :column
        label="Seed"
      />
    </template>

    <template #doubles_status-header="{ column }">
      <filter-table-header
        :column
        label="Status"
        type="alpha"
      />
    </template>

    <template #doubles_rank-header="{ column }">
      <range-table-header
        :column
        label="Rank"
      />
    </template>
  </u-table>
</template>
