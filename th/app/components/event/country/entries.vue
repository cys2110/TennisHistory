<script setup lang="ts">
import { CountryLink, FilterTableHeader, NameTableHeader, RangeTableHeader, UBadge, UButton, ULink } from "#components"
import type { TableColumn } from "@nuxt/ui"
import {
  type Column,
  createColumnHelper,
  getFacetedRowModel,
  getFacetedMinMaxValues,
  getFacetedUniqueValues,
  getGroupedRowModel,
  type GroupingOptions
} from "@tanstack/vue-table"

const {
  params: { eid, year }
} = useRoute("event")
const {
  icons,
  ui: { icons: uIcons }
} = useAppConfig()
const tours = useState<TourType[]>("tours")
const tournamentName = useState<string>("tournament-name")

interface APIResponse extends EntryInterface {
  singles_rank: number | null
  doubles_rank: number | null
}

// API call
const { data: entries, status } = await useFetch<APIResponse[]>("/api/events/country-entries", {
  key: `event-entries-${eid}`,
  query: { id: eid },
  default: () => [],
  server: false
})

const columnHelper = createColumnHelper<APIResponse>()

const columns = computed<TableColumn<APIResponse>[]>(() => [
  {
    accessorKey: "tour",
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
            label: "Tour",
            type: "alpha"
          })
        ]
      )
  },
  {
    accessorKey: "country.name",
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
            label: "Country",
            type: "alpha"
          })
        ]
      )
  },
  {
    id: "name",
    accessorFn: row => `${row.last_name}, ${row.first_name}`,
    filterFn: (row, columnId, filterValue) => filterIncludesNameString(row, columnId, filterValue),
    header: ({ column }) =>
      h(NameTableHeader, {
        column: column as Column<unknown>,
        label: "Name",
        type: "alpha"
      }),
    cell: ({ row }) => {
      if (!row.getIsGrouped() || grouping.value.length === 0) {
        return h(
          ULink,
          {
            key: row.original.id,
            to: {
              name: "player",
              params: { id: row.original.id, name: kebabCase(`${row.original.first_name} ${row.original.last_name}`) }
            },
            class: "hover-link default-link w-fit"
          },
          () => `${row.original.first_name} ${row.original.last_name}`
        )
      }
    }
  },
  {
    accessorKey: "singles_rank",
    aggregationFn: "min",
    header: ({ column }) =>
      h(RangeTableHeader, {
        column: column as Column<unknown>,
        label: "Singles Rank"
      })
  },
  {
    accessorKey: "doubles_rank",
    aggregationFn: "min",
    header: ({ column }) =>
      h(RangeTableHeader, {
        column: column as Column<unknown>,
        label: "Doubles Rank"
      })
  }
])

const columnFilters = ref([])
const columnVisibility = computed(() => ({
  tour: tours.value?.length > 1
}))
const grouping = ref<string[]>([])
const grouping_options = ref<GroupingOptions>({
  getGroupedRowModel: getGroupedRowModel()
})

const table = useTemplateRef("table")
</script>

<template>
  <u-table
    ref="table"
    :data="entries"
    :columns
    :loading="['idle', 'pending'].includes(status)"
    sticky
    :faceted-options="{
      getFacetedRowModel: getFacetedRowModel(),
      getFacetedMinMaxValues: getFacetedMinMaxValues(),
      getFacetedUniqueValues: getFacetedUniqueValues()
    }"
    :grouping
    :grouping-options="grouping_options"
    v-model:columnFilters="columnFilters"
    v-model:column-visibility="columnVisibility"
    :ui="{ td: 'empty:p-0' }"
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
          :name="icons.noPlayer"
          class="text-base"
        />
        No entries available for {{ tournamentName }} {{ year }}
      </div>
    </template>

    <template #country_name-cell="{ row }">
      <div class="flex items-center gap-2">
        <u-button
          v-if="row.getIsGrouped() && grouping[0] === 'country'"
          :icon="uIcons.chevronDoubleRight"
          size="xs"
          variant="link"
          color="neutral"
          @click="row.toggleExpanded()"
          :ui="{ leadingIcon: row.getIsExpanded() ? 'rotate-90 transition-transform duration-200' : 'transition-transform duration-200' }"
        />
        <country-link
          v-if="
            (row.getIsGrouped() && grouping.includes('country') && row.depth === grouping.findIndex(x => x === 'country')) ||
            (!grouping.includes('country') && !row.getIsGrouped())
          "
          :country="row.original.country"
          class="mx-auto"
          :icon-only="false"
        />
      </div>
    </template>

    <template #tour-cell="{ row }">
      <div class="flex items-center gap-2">
        <u-button
          v-if="row.getIsGrouped() && grouping[0] === 'tour'"
          :icon="uIcons.chevronDoubleRight"
          size="xs"
          variant="link"
          color="neutral"
          @click="row.toggleExpanded()"
          :ui="{ leadingIcon: row.getIsExpanded() ? 'rotate-90 transition-transform duration-200' : 'transition-transform duration-200' }"
        />
        <coloured-badge
          v-if="
            (row.getIsGrouped() && grouping.includes('tour') && row.depth === grouping.findIndex(x => x === 'tour')) ||
            (!grouping.includes('tour') && !row.getIsGrouped())
          "
          :label="row.getValue('tour')"
          class="mx-auto"
        />
      </div>
    </template>
  </u-table>
</template>
