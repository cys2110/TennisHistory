<script setup lang="ts">
import { ArrayFilterTableHeader, ColouredBadge, FilterTableHeader, RangeTableHeader, UButton, ULink } from "#components"
import type { TableColumn } from "@nuxt/ui"
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
const { data: events, status } = await useFetch<EventInterface[]>("/api/countries/events", {
  query: { id },
  default: () => [],
  server: false
})

const columns = computed<TableColumn<EventInterface>[]>(() => [
  {
    accessorKey: "tours",
    filterFn: "arrIncludesSome",
    header: ({ column }) =>
      h(ArrayFilterTableHeader, {
        column: column as Column<unknown>,
        label: "Tour",
        type: "alpha"
      }),
    cell: ({ row }) => {
      if (!row.getIsGrouped() || grouping.value.length === 0) {
        return h(
          "div",
          {
            class: "flex items-center gap-2"
          },
          row.original.tours.map(tour =>
            h(ColouredBadge, {
              label: tour
            })
          )
        )
      }
    }
  },
  {
    accessorKey: "tournament.name",
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
            label: "Tournament",
            type: "alpha"
          })
        ]
      )
  },
  {
    accessorKey: "year",
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
          h(RangeTableHeader, {
            column: column as Column<unknown>,
            label: "Year",
            type: "alpha"
          })
        ]
      )
  },
  {
    id: "venues",
    accessorFn: row => row.venues.map(v => v.name ?? v.city),
    filterFn: "arrIncludesSome",
    header: ({ column }) =>
      h(ArrayFilterTableHeader, {
        column: column as Column<unknown>,
        label: "Venues"
      }),
    cell: ({ row }) => {
      if (!row.getIsGrouped() || grouping.value.length === 0) {
        return h(
          "div",
          {
            class: "flex flex-col items-center"
          },
          row.original.venues.map(venue =>
            h(
              ULink,
              {
                to: {
                  name: "venue",
                  params: {
                    id: venue.id
                  }
                },
                class: "hover-link default-link w-fit"
              },
              () => (venue.name ? `${venue.name} (${venue.city})` : venue.city)
            )
          )
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

const table = useTemplateRef("table")
</script>

<template>
  <dashboard-subpanel
    :title="`Events which took place in ${countryName || capitalCase(name as string)}`"
    :icon="icons.event"
    id="events"
  >
    <template #right>
      <u-button
        label="Reset Sorting"
        :icon="icons.sortAlpha"
        @click="table?.tableApi.resetSorting()"
        size="sm"
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
      :data="events"
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
            :name="icons.noPlayer"
            class="text-base"
          />
          No players found
        </div>
      </template>

      <template #tournament_name-cell="{ row }">
        <div class="flex items-center gap-2">
          <u-button
            v-if="row.getIsGrouped() && grouping[0] === 'tournament_name'"
            :icon="uIcons.chevronDoubleRight"
            size="xs"
            variant="link"
            color="neutral"
            @click="row.toggleExpanded()"
            :ui="{ leadingIcon: row.getIsExpanded() ? 'rotate-90 transition-transform duration-200' : 'transition-transform duration-200' }"
          />
          <u-link
            v-if="
              (row.getIsGrouped() && row.groupingColumnId === 'tournament_name') || (!grouping.includes('tournament_name') && !row.getIsGrouped())
            "
            :to="{ name: 'tournament', params: { id: row.original.tournament.id, name: kebabCase(row.original.tournament.name) } }"
            class="hover-link default-link w-fit mx-auto"
          >
            {{ row.getValue("tournament_name") }}
          </u-link>
        </div>
      </template>

      <template #year-cell="{ row }">
        <div class="flex items-center gap-2">
          <u-button
            v-if="row.getIsGrouped() && grouping[0] === 'year'"
            :icon="uIcons.chevronDoubleRight"
            size="xs"
            variant="link"
            color="neutral"
            @click="row.toggleExpanded()"
            :ui="{ leadingIcon: row.getIsExpanded() ? 'rotate-90 transition-transform duration-200' : 'transition-transform duration-200' }"
          />
          <u-link
            v-if="(row.getIsGrouped() && row.groupingColumnId === 'year') || (!grouping.includes('year') && !row.getIsGrouped())"
            :to="{
              name: 'event',
              params: { id: row.original.tournament.id, year: row.original.year, name: kebabCase(row.original.tournament.name), eid: row.original.id }
            }"
            class="hover-link default-link w-fit mx-auto"
          >
            {{ row.getValue("year") }}
          </u-link>
        </div>
      </template>
    </u-table>
  </dashboard-subpanel>
</template>
