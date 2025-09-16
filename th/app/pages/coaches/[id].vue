<script setup lang="ts">
import { ColouredBadge, CountryLink, FilterTableHeader, GroupedCell, GroupFilterTableHeader, NameTableHeader, UButton, ULink } from "#components"
import type { TableColumn, TableRow } from "@nuxt/ui"
import {
  type Column,
  getFacetedRowModel,
  getFacetedMinMaxValues,
  getFacetedUniqueValues,
  getGroupedRowModel,
  type GroupingOptions
} from "@tanstack/vue-table"

definePageMeta({ name: "coach" })
const {
  params: { id }
} = useRoute("coach")
const {
  icons,
  ui: { icons: uIcons }
} = useAppConfig()

interface APIResponse extends PlayerInterface {
  start_date?: DateType
  end_date?: DateType
  gs: EventInterface[]
}

// API call
const { data: coach } = await useFetch<PersonInterface>("/api/coaches/overview", {
  key: `coach-overview-${id}`,
  query: { id },
  server: false
})

const { data: players, status } = await useFetch<APIResponse[]>("/api/coaches/details", {
  query: { id },
  default: () => [],
  server: false
})

useHead({
  title: () => `${coach.value ? `${coach.value.first_name} ${coach.value.last_name}` : capitalCase(id as string)} | Coaches`
})
useJsonld(() => ({
  "@context": "https://schema.org",
  "@type": "Person",
  name: coach.value ? `${coach.value.first_name} ${coach.value.last_name}` : capitalCase(id as string),
  description: `Profile of tennis coach ${coach.value ? `${coach.value.first_name} ${coach.value.last_name}` : capitalCase(id as string)}`
}))

const columns = computed<TableColumn<APIResponse>[]>(() => [
  {
    accessorKey: "tour",
    filterFn: (row, columnId, filterValue) => filterIncludesString(row, columnId, filterValue),
    header: ({ column }) => h(GroupFilterTableHeader, { column: column as Column<unknown>, label: "Tour", type: "alpha" }),
    cell: ({ row }) =>
      h(GroupedCell, { row: row as TableRow<unknown>, grouping: get(grouping), groupingColumnId: "tour" }, () =>
        h(ColouredBadge, { label: row.getValue("tour") as string, class: "mx-auto" })
      )
  },
  {
    id: "country",
    accessorFn: row => row.country.name,
    filterFn: (row, columnId, filterValue) => filterIncludesString(row, columnId, filterValue),
    header: ({ column }) => h(GroupFilterTableHeader, { column: column as Column<unknown>, label: "Country", type: "alpha" }),
    cell: ({ row }) =>
      h(GroupedCell, { row: row as TableRow<unknown>, grouping: get(grouping), groupingColumnId: "country" }, () =>
        h(CountryLink, { country: row.original.country, class: "mx-auto" })
      )
  },
  {
    id: "name",
    accessorFn: row => `${row.last_name}, ${row.first_name}`,
    filterFn: (row, columnId, filterValue) => filterIncludesNameString(row, columnId, filterValue),
    header: ({ column }) => h(NameTableHeader, { column: column as Column<unknown>, label: "Name" }),
    cell: ({ row }) => {
      if (!row.getIsGrouped() || grouping.value.length === 0) {
        return `${row.original.first_name} ${row.original.last_name}`
      }
    }
  },
  {
    accessorKey: "ch_singles",
    header: "Career High (Singles)",
    cell: ({ row }) => {
      if (row.original.ch_singles && (!row.getIsGrouped() || grouping.value.length === 0)) {
        return h("div", { class: "text-center" }, [
          h("div", row.original.ch_singles ?? "—"),
          h("div", dateTimeFormat.format(getDate(row.original.singles_ch_date!)))
        ])
      }
    }
  },
  {
    accessorKey: "ch_doubles",
    header: "Career High (Doubles)",
    cell: ({ row }) => {
      if (row.original.ch_doubles && (!row.getIsGrouped() || grouping.value.length === 0)) {
        return h("div", { class: "text-center" }, [
          h("div", row.original.ch_doubles ?? "—"),
          h("div", dateTimeFormat.format(getDate(row.original.doubles_ch_date!)))
        ])
      }
    }
  },
  {
    id: "start_date",
    accessorFn: row => (row.start_date ? row.start_date.year : undefined),
    sortUndefined: "last",
    header: ({ column }) => h(FilterTableHeader, { column: column as Column<unknown>, label: "Start", type: "number" })
  },
  {
    id: "end_date",
    accessorFn: row => (row.end_date ? row.end_date.year : undefined),
    sortUndefined: "last",
    header: ({ column }) => h(FilterTableHeader, { column: column as Column<unknown>, label: "End", type: "number" })
  },
  {
    id: "gs",
    header: "Grand Slam Titles",
    cell: ({ row }) => {
      if (!row.getIsGrouped() || grouping.value.length === 0) {
        return h(
          "div",
          { class: "flex flex-col items-center" },
          row.original.gs.map(g =>
            h(
              ULink,
              {
                to: { name: "event", params: { id: g.tournament.id, name: kebabCase(g.tournament.name), year: g.year, eid: g.id } },
                class: "hover-link default-link w-fit"
              },
              () => `${g.tournament.name} ${g.year}`
            )
          )
        )
      }
    }
  }
])

const grouping = ref<string[]>([])

const grouping_options = ref<GroupingOptions>({
  getGroupedRowModel: getGroupedRowModel()
})

const table = useTemplateRef("table")

const handleSelectRow = async (row: TableRow<APIResponse>) => {
  if (row.getIsGrouped()) {
    row.toggleExpanded()
  } else {
    await navigateTo({ name: "player", params: { id: row.original.id, name: kebabCase(`${row.original.first_name}-${row.original.last_name}`) } })
  }
}
</script>

<template>
  <div class="w-full">
    <u-dashboard-panel>
      <template #header>
        <u-dashboard-navbar>
          <template #title>
            <page-title />
          </template>

          <template #right>
            <u-button
              v-if="coach?.labels.includes('Player')"
              :icon="icons.player"
              label="Player Profile"
              :to="{ name: 'player', params: { id, name: kebabCase(`${coach.first_name}-${coach.last_name}`) } }"
              size="sm"
            />
          </template>
        </u-dashboard-navbar>

        <u-dashboard-toolbar>
          <u-button
            label="Reset Sorting"
            :icon="icons.sortAlpha"
            @click="table?.tableApi.resetSorting()"
            size="sm"
          />
          <div
            v-if="coach"
            class="text-(--ui-text-muted) text-sm font-semibold mx-auto"
          >
            Players coached by {{ coach?.first_name }} {{ coach?.last_name }}
          </div>
          <u-button
            label="Reset Grouping"
            :icon="icons.ungroup"
            @click="table?.tableApi.resetGrouping()"
            size="sm"
          />
        </u-dashboard-toolbar>
      </template>

      <template #body>
        <u-table
          ref="table"
          :data="players"
          :columns
          :loading="['idle', 'pending'].includes(status)"
          sticky
          :faceted-options="{
            getFacetedRowModel: getFacetedRowModel(),
            getFacetedMinMaxValues: getFacetedMinMaxValues(),
            getFacetedUniqueValues: getFacetedUniqueValues()
          }"
          :grouping="grouping"
          v-on:update:grouping="grouping = $event"
          :grouping-options="grouping_options"
          @select="handleSelectRow"
          :ui="{ root: 'w-fit min-w-1/3 mx-auto', tbody: '[&>tr]:cursor-pointer', td: 'empty:p-0' }"
        >
          <template #loading>
            <loading-icon />
          </template>

          <template #empty>
            <empty-message
              :icon="icons.noPlayer"
              :message="`No players coached by ${coach?.first_name} ${coach?.last_name}`"
            />
          </template>
        </u-table>
      </template>
    </u-dashboard-panel>
  </div>
</template>
