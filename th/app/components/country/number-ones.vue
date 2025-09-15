<script setup lang="ts">
import { FilterTableHeader, NameTableHeader, UButton } from "#components"
import type { TableColumn, TableRow } from "@nuxt/ui"
import { type Column, getFacetedRowModel, getFacetedUniqueValues, getGroupedRowModel, type GroupingOptions } from "@tanstack/vue-table"

const {
  icons,
  ui: { icons: uIcons }
} = useAppConfig()
const {
  params: { id, name }
} = useRoute("country")

const countryName = useState<string>("country-name")

// API call
const { data: players, status } = await useFetch<PlayerInterface[]>("/api/countries/number-ones", {
  query: { id },
  default: () => [],
  server: false
})

const columns = computed<TableColumn<PlayerInterface>[]>(() => [
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
    id: "country",
    accessorFn: row => row.country.name,
    filterFn: (row, columnId, filterValue) => filterIncludesString(row, columnId, filterValue),
    header: ({ column }) =>
      h(FilterTableHeader, {
        column: column as Column<unknown>,
        label: "Country",
        type: "alpha"
      })
  },
  {
    id: "name",
    accessorFn: row => `${row.last_name}, ${row.first_name}`,
    filterFn: (row, columnId, filterValue) => filterIncludesNameString(row, columnId, filterValue),
    header: ({ column }) =>
      h(NameTableHeader, {
        column: column as Column<unknown>,
        label: "Name"
      }),
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
        return h(
          "div",
          {
            class: "text-center"
          },
          [h("div", row.original.ch_singles ?? "—"), h("div", dateTimeFormat.format(getDate(row.original.singles_ch_date!)))]
        )
      }
    }
  },
  {
    accessorKey: "ch_doubles",
    header: "Career High (Doubles)",
    cell: ({ row }) => {
      if (row.original.ch_doubles && (!row.getIsGrouped() || grouping.value.length === 0)) {
        return h(
          "div",
          {
            class: "text-center"
          },
          [h("div", row.original.ch_doubles ?? "—"), h("div", dateTimeFormat.format(getDate(row.original.doubles_ch_date!)))]
        )
      }
    }
  }
])

const columnFilters = ref([])

const grouping = ref<string[]>([])

const grouping_options = ref<GroupingOptions>({
  getGroupedRowModel: getGroupedRowModel()
})

const handleSelectRow = async (row: TableRow<PlayerInterface>) => {
  if (!row.getIsGrouped()) {
    await navigateTo({ name: "player", params: { id: row.original.id, name: kebabCase(`${row.original.first_name}-${row.original.last_name}`) } })
  }
}
</script>

<template>
  <dashboard-subpanel
    :title="`Players who have achieved No. 1 ranking representing ${countryName || capitalCase(name as string)}`"
    :icon="icons.one"
    id="number-ones"
  >
    <u-table
      :data="players"
      :columns
      :loading="['idle', 'pending'].includes(status)"
      sticky
      v-model:column-filters="columnFilters"
      :faceted-options="{
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues()
      }"
      :grouping="grouping"
      v-on:update:grouping="grouping = $event"
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
            :name="icons.noPlayer"
            class="text-base"
          />
          No players found
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
            v-if="(row.getIsGrouped() && row.groupingColumnId === 'tour') || (!grouping.includes('tour') && !row.getIsGrouped())"
            :label="row.getValue('tour')"
            class="mx-auto"
          />
        </div>
      </template>
    </u-table>
  </dashboard-subpanel>
</template>
