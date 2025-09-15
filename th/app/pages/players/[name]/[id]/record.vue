<script setup lang="ts">
import { RangeTableHeader, SortTableHeader, UButton } from "#components"
import type { TableColumn, TableRow } from "@nuxt/ui"
import {
  type Column,
  getFacetedRowModel,
  getFacetedMinMaxValues,
  getFacetedUniqueValues,
  getGroupedRowModel,
  type GroupingOptions
} from "@tanstack/vue-table"

definePageMeta({ name: "record" })
const {
  params: { id }
} = useRoute("record")
const {
  icons,
  ui: { icons: uIcons }
} = useAppConfig()

// API call
const { data: results, status } = await useFetch<RecordInterface[]>("/api/players/record", {
  key: `record-${id}`,
  query: { id },
  default: () => [],
  server: false
})

const columns: TableColumn<RecordInterface>[] = [
  {
    id: "expand",
    cell: ({ row }) =>
      h(UButton, {
        variant: "link",
        color: "neutral",
        class: "mr-2",
        size: "xs",
        icon: uIcons.chevronDoubleRight,
        onClick: () => row.toggleExpanded(),
        ui: {
          leadingIcon: row.getIsExpanded() ? "rotate-90 transition-transform duration-200" : "transition-transform duration-200"
        }
      })
  },
  {
    accessorKey: "tournament.name",
    header: ({ column }) =>
      h(SortTableHeader, {
        column: column as Column<unknown>,
        label: "Tournament",
        type: "alpha"
      }),
    cell: ({ row, cell }) => {
      if (row.getIsGrouped()) {
        return cell.getValue()
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
    cell: ({ row, cell }) => {
      if (!row.getIsGrouped()) {
        return cell.getValue()
      }
    }
  },
  {
    accessorKey: "singles.number",
    header: ({ column }) =>
      h(SortTableHeader, {
        column: column as Column<unknown>,
        label: "Singles",
        type: "number"
      }),
    cell: ({ row }) => {
      if (!row.getIsGrouped()) {
        return h(
          "span",
          {
            class: row.original.singles?.number === 0 ? "text-success uppercase" : ""
          },
          row.original.singles?.round
        )
      }
    }
  },
  {
    accessorKey: "doubles.number",
    header: ({ column }) =>
      h(SortTableHeader, {
        column: column as Column<unknown>,
        label: "Doubles",
        type: "number"
      }),
    cell: ({ row }) => {
      if (!row.getIsGrouped()) {
        return h(
          "span",
          {
            class: row.original.doubles?.number === 0 ? "text-success uppercase" : ""
          },
          row.original.doubles?.round
        )
      }
    }
  }
]

const columnFilters = ref([])

const grouping = ref<string[]>(["tournament_name"])

const grouping_options = ref<GroupingOptions>({
  groupedColumnMode: false,
  getGroupedRowModel: getGroupedRowModel()
})

const table = useTemplateRef("table")

const handleSelectRow = async (row: TableRow<EventInterface>) => {
  if (row.getIsGrouped()) {
    await navigateTo({
      name: "tournament",
      params: { id: row.original.tournament.id, name: kebabCase(row.original.tournament.name) }
    })
  } else {
    await navigateTo({
      name: "event",
      params: { id: row.original.tournament.id, name: kebabCase(row.original.tournament.name), year: row.original.year, eid: row.original.id }
    })
  }
}
</script>

<template>
  <player-wrapper>
    <template #toolbar>
      <u-button
        label="Reset Sorting"
        :icon="icons.sortAlpha"
        @click="table?.tableApi.resetSorting()"
        size="sm"
      />
    </template>

    <u-table
      ref="table"
      :data="results"
      :columns
      :loading="['idle', 'pending'].includes(status)"
      sticky
      v-model:column-filters="columnFilters"
      :faceted-options="{
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedMinMaxValues: getFacetedMinMaxValues(),
        getFacetedUniqueValues: getFacetedUniqueValues()
      }"
      :grouping="grouping"
      :grouping-options="grouping_options"
      @select="handleSelectRow"
      :ui="{ root: 'w-fit min-w-1/3 mx-auto', tbody: '[&>tr]:cursor-pointer', td: 'empty:p-0' }"
    >
      <template #loading>
        <u-icon
          :name="uIcons.loading"
          class="size-8"
        />
      </template>

      <template #empty>
        <div class="flex justify-center items-center w-full gap-2 text-error">
          <u-icon
            :name="icons.noTournament"
            class="text-base"
          />
          No results found
        </div>
      </template>
    </u-table>
  </player-wrapper>
</template>
