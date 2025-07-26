<script setup lang="ts">
import { SortTableHeader } from "#components"
import type { TableColumn } from "@nuxt/ui"
import { type Column, getGroupedRowModel, type GroupingOptions } from "@tanstack/vue-table"

const {
  ui: { icons }
} = useAppConfig()
const letter = defineModel<string | undefined>()
const currentYear = new Date().getFullYear()

const { data: players, status } = await useFetch<PlayerInterface[]>("/api/players/grouped", {
  key: `players-${letter}`,
  query: { letter },
  default: () => []
})

const columns: TableColumn<PlayerInterface>[] = [
  { accessorKey: "tour", header: "Tour" },
  {
    id: "status",
    accessorFn: row => (row.max_year === currentYear ? "Active" : "Inactive")
  },
  {
    id: "country",
    accessorFn: row => row.country.name
  },
  { accessorKey: "last_name" },
  {
    accessorKey: "min_year",
    sortUndefined: "last",
    cell: ({ row }) => !row.getIsGrouped() && row.original.min_year
  },
  {
    accessorKey: "last_year",
    sortUndefined: "last",
    cell: ({ row }) => !row.getIsGrouped() && row.original.max_year
  }
]

const grouping_options = ref<GroupingOptions>({
  groupedColumnMode: false,
  getGroupedRowModel: getGroupedRowModel()
})
</script>

<template>
  <u-table
    :data="players"
    :columns
    :loading="status === 'pending'"
    sticky
    empty="No players found"
    :grouping="['tour']"
    :grouping-options="grouping_options"
    :ui="{
      root: 'scrollbar-thin scrollbar-thumb-primary-600 scrollbar-track-transparent w-fit min-w-1/2 mx-auto',
      td: 'empty:p-0' // helps with the colspaned row added for expand slot
    }"
  >
    <template #tour-cell="{ row }">
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
          :color="getTourColor([row.original.tour])"
          :label="row.original.tour"
        />
      </div>
      <template v-else>{{ " " }}</template>
    </template>

    <template #status-header="{ column }">
      <sort-table-header
        :column
        label="Status"
        type="alpha"
      />
    </template>

    <template #status-cell="{ row }">
      <u-badge
        v-if="!row.getIsGrouped()"
        :color="row.getValue('status') === 'Active' ? 'active' : 'inactive'"
        :label="row.getValue('status')"
      />
      <template v-else>{{ " " }}</template>
    </template>

    <template #country-header="{ column }">
      <sort-table-header
        :column
        label="Country"
        type="alpha"
      />
    </template>

    <template #country-cell="{ row }">
      <country-link
        v-if="!row.getIsGrouped()"
        :country="row.original.country"
        class="mx-auto w-fit"
      />
      <template v-else>{{ " " }}</template>
    </template>

    <template #last_name-header="{ column }">
      <sort-table-header
        :column
        label="Player"
        type="alpha"
      />
    </template>

    <template #last_name-cell="{ row }">
      <u-link
        v-if="!row.getIsGrouped()"
        :to="{ name: 'player', params: { id: row.original.id, name: kebabCase(`${row.original.first_name} ${row.original.last_name}`) } }"
        class="hover-link"
      >
        {{ row.original.first_name }} {{ row.original.last_name }}
      </u-link>
    </template>

    <template #min_year-header="{ column }">
      <sort-table-header
        :column
        label="First Year on Tour"
        type="number"
      />
    </template>

    <template #last_year-header="{ column }">
      <sort-table-header
        :column
        label="Last Year on Tour"
        type="number"
      />
    </template>
  </u-table>
</template>
