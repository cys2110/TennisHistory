<script setup lang="ts">
import { FilterTableHeader, SortTableHeader, UButton } from "#components"
import type { TableColumn, TableRow } from "@nuxt/ui"
import {
  type Column,
  getFacetedRowModel,
  getFacetedMinMaxValues,
  getFacetedUniqueValues,
  getGroupedRowModel,
  type GroupingOptions
} from "@tanstack/vue-table"

definePageMeta({ name: "wl-index" })
const {
  params: { id }
} = useRoute("wl-index")
const {
  icons,
  ui: { icons: uIcons }
} = useAppConfig()

// API call
const { data, status } = await useFetch<WLIndexInterface[]>("/api/players/wl-index", {
  key: `wl-index-${id}`,
  query: { id },
  default: () => [],
  server: false
})

const columns = computed<TableColumn<WLIndexInterface>[]>(() => [
  {
    accessorKey: "category",
    filterFn: (row, columnId, filterValue) => filterIncludesString(row, columnId, filterValue),
    header: ({ column }) =>
      h(
        "div",
        {
          class: "flex items-center gap-1 w-fit"
        },
        [
          h(UButton, {
            icon: column.getIsGrouped() ? icons.ungroup : icons.group,
            size: "xs",
            variant: "link",
            color: "neutral",
            onClick: () => column.toggleGrouping()
          }),
          h(FilterTableHeader, {
            column: column as Column<unknown>,
            label: "Category",
            type: "alpha"
          })
        ]
      )
  },
  {
    accessorKey: "stat",
    filterFn: (row, columnId, filterValue) => filterIncludesString(row, columnId, filterValue),
    header: ({ column }) =>
      h(
        "div",
        {
          class: "flex items-center gap-1 w-fit"
        },
        [
          h(UButton, {
            icon: column.getIsGrouped() ? icons.ungroup : icons.group,
            size: "xs",
            variant: "link",
            color: "neutral",
            onClick: () => column.toggleGrouping()
          }),
          h(FilterTableHeader, {
            column: column as Column<unknown>,
            label: "Stat",
            type: "alpha"
          })
        ]
      )
  },
  {
    accessorKey: "level",
    filterFn: (row, columnId, filterValue) => filterIncludesString(row, columnId, filterValue),
    header: ({ column }) =>
      h(
        "div",
        {
          class: "flex items-center gap-1 w-fit"
        },
        [
          h(UButton, {
            icon: column.getIsGrouped() ? icons.ungroup : icons.group,
            size: "xs",
            variant: "link",
            color: "neutral",
            onClick: () => column.toggleGrouping()
          }),
          h(FilterTableHeader, {
            column: column as Column<unknown>,
            label: "Level",
            type: "alpha"
          })
        ]
      )
  },
  {
    accessorKey: "wins",
    aggregationFn: "mean",
    header: ({ column }) => h(SortTableHeader, { column: column as Column<unknown>, label: "Wins", type: "number" }),
    cell: ({ row }) => {
      if (row.getIsGrouped()) {
        if (row.original.category === "Match Record") {
          return `Overall: ${data.value?.[0]?.wins.toFixed(3)}`
        } else {
          return `Avg: ${(row.getValue("wins") as number).toFixed(3)}`
        }
      } else {
        return (row.getValue("wins") as number).toFixed(3)
      }
    }
  },
  {
    accessorKey: "losses",
    aggregationFn: "mean",
    header: ({ column }) => h(SortTableHeader, { column: column as Column<unknown>, label: "Losses", type: "number" }),
    cell: ({ row }) => {
      if (row.getIsGrouped()) {
        if (row.original.category === "Match Record") {
          return `Overall: ${data.value?.[0]?.losses.toFixed(3)}`
        } else {
          return `Avg: ${(row.getValue("losses") as number).toFixed(3)}`
        }
      } else {
        return (row.getValue("losses") as number).toFixed(3)
      }
    }
  },
  {
    accessorKey: "value",
    aggregationFn: "mean",
    header: ({ column }) => h(SortTableHeader, { column: column as Column<unknown>, label: "Value", type: "number" }),
    cell: ({ row }) => {
      if (row.getIsGrouped()) {
        if (row.original.category === "Match Record") {
          return `Overall: ${data.value?.[0]?.value.toFixed(3)}`
        } else {
          return `Avg: ${(row.getValue("value") as number).toFixed(3)}`
        }
      } else {
        return (row.getValue("value") as number).toFixed(3)
      }
    }
  },
  {
    accessorKey: "titles",
    aggregationFn: "mean",
    header: ({ column }) => h(SortTableHeader, { column: column as Column<unknown>, label: "Titles", type: "number" }),
    cell: ({ row }) => {
      if (row.getIsGrouped()) {
        if (row.original.category === "Match Record") {
          return `Overall: ${data.value?.[0]?.titles ?? 0}`
        } else if (row.original.category === "Environment") {
          return `Avg: ${Math.round(row.getValue("titles"))}`
        }
      } else {
        return row.getValue("titles") ? Math.round(row.getValue("titles") as number) : undefined
      }
    }
  },
  {
    accessorKey: "ytd_wins",
    aggregationFn: "mean",
    header: ({ column }) => h(SortTableHeader, { column: column as Column<unknown>, label: "YTD Wins", type: "number" }),
    cell: ({ row }) => {
      if (row.getIsGrouped()) {
        if (row.original.category === "Match Record") {
          return `Overall: ${data.value?.[0]?.ytd_wins.toFixed(3)}`
        } else {
          return `Avg: ${(row.getValue("ytd_wins") as number).toFixed(3)}`
        }
      } else {
        return (row.getValue("ytd_wins") as number).toFixed(3)
      }
    }
  },
  {
    accessorKey: "ytd_losses",
    aggregationFn: "mean",
    header: ({ column }) => h(SortTableHeader, { column: column as Column<unknown>, label: "YTD Losses", type: "number" }),
    cell: ({ row }) => {
      if (row.getIsGrouped()) {
        if (row.original.category === "Match Record") {
          return `Overall: ${data.value?.[0]?.ytd_losses.toFixed(3)}`
        } else {
          return `Avg: ${(row.getValue("ytd_losses") as number).toFixed(3)}`
        }
      } else {
        return (row.getValue("ytd_losses") as number).toFixed(3)
      }
    }
  },
  {
    accessorKey: "ytd_value",
    aggregationFn: "mean",
    header: ({ column }) => h(SortTableHeader, { column: column as Column<unknown>, label: "YTD Value", type: "number" }),
    cell: ({ row }) => {
      if (row.getIsGrouped()) {
        if (row.original.category === "Match Record") {
          return `Overall: ${data.value?.[0]?.ytd_value.toFixed(3)}`
        } else {
          return `Avg: ${(row.getValue("ytd_value") as number).toFixed(3)}`
        }
      } else {
        return (row.getValue("ytd_value") as number).toFixed(3)
      }
    }
  },
  {
    accessorKey: "ytd_titles",
    aggregationFn: "mean",
    header: ({ column }) => h(SortTableHeader, { column: column as Column<unknown>, label: "YTD Titles", type: "number" }),
    cell: ({ row }) => {
      if (row.getIsGrouped()) {
        if (row.original.category === "Match Record") {
          return `Overall: ${(data.value?.[0]?.ytd_titles ?? 0).toFixed(3)}`
        } else if (row.original.category === "Environment") {
          return `Avg: ${Math.round(row.getValue("ytd_titles"))}`
        }
      } else {
        return row.getValue("ytd_titles") ? Math.round(row.getValue("ytd_titles") as number) : undefined
      }
    }
  }
])

const columnFilters = ref([])

const grouping = ref<string[]>([])

const grouping_options = ref<GroupingOptions>({
  getGroupedRowModel: getGroupedRowModel()
})

const table = useTemplateRef("table")
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

      <player-wl-index-chart
        v-if="data"
        :index="data"
      />

      <u-button
        label="Reset Grouping"
        :icon="icons.ungroup"
        @click="table?.tableApi.resetGrouping()"
        size="sm"
      />
    </template>

    <u-table
      ref="table"
      :data
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
      v-on:update:grouping="grouping = $event"
      :grouping-options="grouping_options"
      :ui="{ root: 'w-fit min-w-1/3 mx-auto', td: 'empty:p-0' }"
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
            :name="icons.noChart"
            class="text-base"
          />
          No win-loss index found
        </div>
      </template>

      <template #category-cell="{ row }">
        <div class="flex items-center gap-2">
          <u-button
            v-if="row.getIsGrouped() && grouping[0] === 'category'"
            :icon="uIcons.chevronDoubleRight"
            size="xs"
            variant="link"
            color="neutral"
            @click="row.toggleExpanded()"
            :ui="{ leadingIcon: row.getIsExpanded() ? 'rotate-90 transition-transform duration-200' : 'transition-transform duration-200' }"
          />
          <div v-if="(row.getIsGrouped() && row.groupingColumnId === 'category') || (!grouping.includes('category') && !row.getIsGrouped())">
            {{ row.getValue("category") }}
          </div>
        </div>
      </template>

      <template #stat-cell="{ row }">
        <div class="flex items-center gap-2">
          <u-button
            v-if="row.getIsGrouped() && grouping[0] === 'stat'"
            :icon="uIcons.chevronDoubleRight"
            size="xs"
            variant="link"
            color="neutral"
            @click="row.toggleExpanded()"
            :ui="{ leadingIcon: row.getIsExpanded() ? 'rotate-90 transition-transform duration-200' : 'transition-transform duration-200' }"
          />
          <div v-if="(row.getIsGrouped() && row.groupingColumnId === 'stat') || (!grouping.includes('stat') && !row.getIsGrouped())">
            {{ row.getValue("stat") }}
          </div>
        </div>
      </template>

      <template #level-cell="{ row }">
        <div class="flex items-center gap-2">
          <u-button
            v-if="row.getIsGrouped() && grouping[0] === 'level'"
            :icon="uIcons.chevronDoubleRight"
            size="xs"
            variant="link"
            color="neutral"
            @click="row.toggleExpanded()"
            :ui="{ leadingIcon: row.getIsExpanded() ? 'rotate-90 transition-transform duration-200' : 'transition-transform duration-200' }"
          />
          <coloured-badge
            v-if="(row.getIsGrouped() && row.groupingColumnId === 'level') || (!grouping.includes('level') && !row.getIsGrouped())"
            :label="row.getValue('level')"
            class="mx-auto"
          />
        </div>
      </template>
    </u-table>
  </player-wrapper>
</template>
