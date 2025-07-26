<script setup lang="ts">
import { SortTableHeader } from "#components"
import type { TableColumn } from "@nuxt/ui"
import { type Column, getGroupedRowModel, type GroupingOptions } from "@tanstack/vue-table"

const {
  ui: { icons }
} = useAppConfig()
const letter = defineModel<string | undefined>()

type NewTournamentType = Omit<TournamentInterface, "tours"> & { tour: TourType }

const { data: tournaments, status } = await useFetch<NewTournamentType[]>("/api/tournaments/grouped", {
  key: `tournaments-${letter}`,
  query: { letter },
  default: () => [],
  transform: (response: any): NewTournamentType[] => {
    const tournaments: NewTournamentType[] = []
    for (const tournament of response) {
      tournament.tours.forEach((tour: TourType) => {
        tournaments.push({
          ...tournament,
          tour
        })
      })
    }
    return tournaments
  }
})

const columns: TableColumn<NewTournamentType>[] = [
  { accessorKey: "tour", header: "Tour" },
  {
    accessorKey: "name",
    header: ({ column }) =>
      h(SortTableHeader, {
        column: column as Column<unknown>,
        label: "Tournament",
        type: "alpha"
      })
  },
  {
    accessorKey: "established",
    header: ({ column }) =>
      h(SortTableHeader, {
        column: column as Column<unknown>,
        label: "Established",
        type: "number"
      }),
    cell: ({ row }) => !row.getIsGrouped() && row.original.established
  },
  {
    accessorKey: "abolished",
    header: ({ column }) =>
      h(SortTableHeader, {
        column: column as Column<unknown>,
        label: "Abolished",
        type: "number"
      }),
    cell: ({ row }) => !row.getIsGrouped() && row.original.abolished
  }
]

const grouping_options = ref<GroupingOptions>({
  groupedColumnMode: false,
  getGroupedRowModel: getGroupedRowModel()
})
</script>

<template>
  <u-table
    :data="tournaments"
    :columns
    :loading="status === 'pending'"
    sticky
    empty="No tournaments found"
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

    <template #name-cell="{ row }">
      <u-link
        v-if="!row.getIsGrouped()"
        :to="{ name: 'tournament', params: { id: row.original.id, name: kebabCase(row.original.name) } }"
        class="hover-link"
      >
        {{ row.original.name }}
      </u-link>
    </template>
  </u-table>
</template>
