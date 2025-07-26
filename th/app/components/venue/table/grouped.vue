<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui"
import { getGroupedRowModel, type GroupingOptions } from "@tanstack/vue-table"

const {
  ui: { icons }
} = useAppConfig()
const letter = defineModel<string | undefined>()

const { data: venues, status } = await useFetch<VenueInterface[]>("/api/venues/grouped", {
  key: `venues-${letter}`,
  query: { letter },
  default: () => []
})

const columns: TableColumn<VenueInterface>[] = [
  { id: "expand" },
  {
    id: "country",
    accessorFn: row => row.country.name
  },
  {
    accessorKey: "city",
    cell: ({ row }) => {
      if (row.getIsGrouped()) {
        if (row.depth === 0) {
          const uniqueCities = useArrayUnique(
            useArrayMap(
              useArrayFilter(venues, v => v.country.name === row.original.country.name),
              v => v.city
            )
          )
          return uniqueCities.value.length
        } else {
          return row.original.city
        }
      }
    }
  },
  {
    accessorKey: "name",
    aggregationFn: "count"
  }
]

const grouping_options = ref<GroupingOptions>({
  groupedColumnMode: false,
  getGroupedRowModel: getGroupedRowModel()
})
</script>

<template>
  <u-table
    :data="venues"
    :columns
    :loading="status === 'pending'"
    sticky
    empty="No venues found"
    :grouping="['country', 'city']"
    :grouping-options="grouping_options"
    :ui="{
      root: 'scrollbar-thin scrollbar-thumb-primary-600 scrollbar-track-transparent w-fit min-w-1/2 mx-auto',
      td: 'empty:p-0' // helps with the colspaned row added for expand slot
    }"
  >
    <template #expand-cell="{ row }">
      <u-button
        v-if="row.getIsGrouped()"
        variant="link"
        color="neutral"
        class="mr-2"
        size="xs"
        :icon="icons.chevronDoubleRight"
        :ui="{ leadingIcon: row.getIsExpanded() ? 'rotate-90 transition-transform duration-200' : 'transition-transform duration-200' }"
        @click="row.toggleExpanded()"
      />
    </template>

    <template #country-header="{ column }">
      <sort-table-header
        :column="column"
        label="Country"
        type="alpha"
      />
    </template>

    <template #country-cell="{ row }">
      <country-link
        v-if="row.getIsGrouped() && row.depth === 0"
        :country="row.original.country"
        :icon-only="false"
      />
      <template v-else>{{ " " }}</template>
    </template>

    <template #city-header="{ column }">
      <sort-table-header
        :column="column"
        label="City"
        type="alpha"
      />
    </template>

    <template #name-header="{ column }">
      <sort-table-header
        :column="column"
        label="Venue"
        type="alpha"
      />
    </template>

    <template #name-cell="{ row }">
      <u-link
        v-if="!row.getIsGrouped()"
        :to="{ name: 'venue', params: { id: kebabCase(row.original.id) } }"
        class="hover-link"
      >
        {{ row.original.name ?? row.original.city }}
      </u-link>
    </template>
  </u-table>
</template>
