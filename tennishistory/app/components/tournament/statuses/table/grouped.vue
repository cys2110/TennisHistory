<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui"
import {
  createColumnHelper,
  getFacetedRowModel,
  getFacetedMinMaxValues,
  getFacetedUniqueValues,
  getGroupedRowModel,
  type GroupingOptions
} from "@tanstack/vue-table"

defineProps<{
  players: EntryInterface[]
  status: APIStatusType
}>()
const {
  params: { id, name }
} = useRoute()
const {
  ui: { icons }
} = useAppConfig()
const tournamentName = inject<string>("tournamentName", "")

const columnHelper = createColumnHelper<EntryInterface>()

const arraySorting = (rowA: any, rowB: any, columnId: string) => {
  return useSorted(rowA.getValue(columnId)).value[0] < useSorted(rowB.getValue(columnId)).value[0] ? -1 : 1
}

const columns: TableColumn<EntryInterface>[] = [
  {
    id: "status",
    accessorFn: row => STATUSES[row.status as keyof typeof STATUSES].longName
  },
  {
    accessorKey: "year",
    footer: ({ column }) => "Events: " + column.getFacetedUniqueValues().size
  },
  {
    accessorKey: "tour",
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
        filterFn: "arrIncludes"
      }
    ]
  })
]

const columnFilters = ref([])
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
    :empty="`No qualifiers, lucky losers, alternates or wild cards have won ${tournamentName}`"
    :faceted-options="{
      getFacetedRowModel: getFacetedRowModel(),
      getFacetedMinMaxValues: getFacetedMinMaxValues(),
      getFacetedUniqueValues: getFacetedUniqueValues()
    }"
    :grouping="['status']"
    :grouping-options="grouping_options"
    v-model:columnFilters="columnFilters"
    :ui="{ root: 'scrollbar-thin scrollbar-thumb-primary-600 scrollbar-track-transparent', td: 'empty:p-0' }"
  >
    <template #status-header="{ column }">
      <filter-table-header
        :column
        label="Status"
        type="alpha"
      />
    </template>

    <template #status-cell="{ row }">
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
          :ui="{
            leadingIcon: row.getIsExpanded() ? 'rotate-90 transition-transform duration-200' : 'transition-transform duration-200',
            label: 'font-semibold'
          }"
          @click="row.toggleExpanded()"
          :label="row.original.status"
        />
      </div>
      <template v-else>{{ " " }}</template>
    </template>

    <template #year-header="{ column }">
      <range-table-header
        :column
        label="Year"
      />
    </template>

    <template #year-cell="{ row, cell }">
      <u-link
        v-if="!row.getIsGrouped()"
        :to="{ name: 'event', params: { id, name, year: row.original.year, eid: row.original.eid } }"
        class="hover-link font-semibold"
      >
        {{ cell.getValue() }}
      </u-link>
      <template v-else>{{ "" }}</template>
    </template>

    <template #tour-header="{ column }">
      <filter-table-header
        :column
        label="Tour"
        type="alpha"
      />
    </template>

    <template #tour-cell="{ row }">
      <u-badge
        v-if="!row.getIsGrouped()"
        class="font-semibold"
        :label="row.original.tour"
        :color="getTourColor([row.original.tour])"
      />
    </template>

    <template #type-header="{ column }">
      <filter-table-header
        :column
        label="S/D"
        type="alpha"
      />
    </template>

    <template #type-cell="{ row }">
      <u-badge
        v-if="!row.getIsGrouped()"
        class="font-semibold"
        :label="row.original.type"
        :color="row.original.type === 'Singles' ? 'singles' : 'doubles'"
      />
    </template>

    <template #country-header="{ column }">
      <filter-table-header
        :column
        label="Country"
        type="alpha"
      />
    </template>

    <template #country-cell="{ row }">
      <country-link
        v-if="!row.getIsGrouped()"
        v-for="player in row.original.players"
        :key="player.id"
        :country="player.country"
        class="mx-auto"
      />
    </template>

    <template #first_name-header="{ column }">
      <filter-table-header
        :column
        label="First Name"
        type="alpha"
      />
    </template>

    <template #first_name-cell="{ row }">
      <div
        v-if="!row.getIsGrouped()"
        class="flex flex-col items-center"
      >
        <u-link
          v-for="player in row.original.players"
          :key="player.id"
          :to="{ name: 'player', params: { id: player.id, name: kebabCase(`${player.first_name}-${player.last_name}`) } }"
          class="hover-link mx-auto w-fit"
        >
          {{ player.first_name }}
        </u-link>
      </div>
    </template>

    <template #last_name-header="{ column }">
      <filter-table-header
        :column
        label="Last Name"
        type="alpha"
      />
    </template>

    <template #last_name-cell="{ row }">
      <div
        v-if="!row.getIsGrouped()"
        class="flex flex-col items-center"
      >
        <u-link
          v-for="player in row.original.players"
          :key="player.id"
          :to="{ name: 'player', params: { id: player.id, name: kebabCase(`${player.first_name}-${player.last_name}`) } }"
          class="hover-link mx-auto w-fit"
        >
          {{ player.last_name }}
        </u-link>
      </div>
    </template>
  </u-table>
</template>
