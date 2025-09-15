<script setup lang="ts">
import { CountryLink, FilterTableHeader, NameTableHeader, RangeTableHeader, UButton, ULink } from "#components"
import type { TableColumn } from "@nuxt/ui"
import { type Column, getFacetedRowModel, getFacetedUniqueValues, getGroupedRowModel, type GroupingOptions } from "@tanstack/vue-table"

const {
  icons,
  ui: { icons: uIcons, colors }
} = useAppConfig()
const {
  params: { id, name }
} = useRoute("country")

const levelBadgeMapping: Record<string, keyof typeof colors> = {
  "Grand Slam": "primary",
  Masters: "success",
  "Year End Finals": "itf",
  Olympics: "warning"
}

const countryName = useState<string>("country-name")

type APIResponseType = {
  event: EventInterface & { type: MatchType }
  player: PlayerInterface
}

// API call
const { data: results, status } = await useFetch<APIResponseType[]>("/api/countries/big-titles", {
  query: { id },
  default: () => [],
  server: false
})

const columns = computed<TableColumn<APIResponseType>[]>(() => [
  {
    accessorKey: "player.tour",
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
    accessorFn: row => row.player.country.name,
    filterFn: (row, columnId, filterValue) => filterIncludesString(row, columnId, filterValue),
    header: ({ column }) =>
      h(FilterTableHeader, {
        column: column as Column<unknown>,
        label: "Country",
        type: "alpha"
      }),
    cell: ({ row }) => {
      if (!row.getIsGrouped() || grouping.value.length === 0) {
        return h(CountryLink, {
          country: row.original.player.country,
          class: "mx-auto"
        })
      }
    }
  },
  {
    id: "name",
    accessorFn: row => `${row.player.last_name}, ${row.player.first_name}`,
    filterFn: (row, columnId, filterValue) => filterIncludesNameString(row, columnId, filterValue),
    header: ({ column }) =>
      h(NameTableHeader, {
        column: column as Column<unknown>,
        label: "Name"
      }),
    cell: ({ row }) => {
      if (!row.getIsGrouped() || grouping.value.length === 0) {
        return h(
          ULink,
          {
            to: {
              name: "player",
              params: { id: row.original.player.id, name: kebabCase(`${row.original.player.first_name} ${row.original.player.last_name}`) }
            },
            class: "hover-link default-link w-fit"
          },
          () => `${row.original.player.first_name} ${row.original.player.last_name}`
        )
      }
    }
  },
  {
    accessorKey: "event.type",
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
            label: "S/D",
            type: "alpha"
          })
        ]
      )
  },
  {
    id: "level",
    accessorFn: row =>
      row.event.category === "Grand Slam" ? "Grand Slam"
      : row.event.category === "Olympics" ? "Olympics"
      : (
        (row.event.atp_category && MASTERS_CATEGORIES.includes(row.event.atp_category)) ||
        (row.event.wta_category && MASTERS_CATEGORIES.includes(row.event.wta_category))
      ) ?
        "Masters"
      : "Year End Finals",
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
            label: "Tournament Type",
            type: "alpha"
          })
        ]
      )
  },
  {
    id: "category",
    accessorFn: row => row.event.category ?? (row.player.tour === "ATP" ? row.event.atp_category : row.event.wta_category),
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
    accessorKey: "event.tournament.name",
    filterFn: (row, columnId, filterValue) => filterIncludesString(row, columnId, filterValue),
    header: ({ column }) =>
      h(FilterTableHeader, {
        column: column as Column<unknown>,
        label: "Tournament",
        type: "alpha"
      }),
    cell: ({ row }) => {
      if (!row.getIsGrouped() || grouping.value.length === 0) {
        return h(
          ULink,
          {
            to: {
              name: "tournament",
              params: { id: row.original.event.tournament.id, name: kebabCase(row.original.event.tournament.name) }
            },
            class: "hover-link default-link w-fit"
          },
          () => row.original.event.tournament.name
        )
      }
    }
  },
  {
    accessorKey: "event.year",
    header: ({ column }) =>
      h(RangeTableHeader, {
        column: column as Column<unknown>,
        label: "Year"
      }),
    cell: ({ row }) => {
      if (!row.getIsGrouped() || grouping.value.length === 0) {
        return h(
          ULink,
          {
            to: {
              name: "event",
              params: {
                id: row.original.event.tournament.id,
                name: kebabCase(row.original.event.tournament.name),
                year: row.original.event.year,
                eid: row.original.event.id
              }
            },
            class: "hover-link default-link w-fit"
          },
          () => row.original.event.year
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
    :title="`Players who have won big titles representing ${countryName || capitalCase(name as string)}`"
    :icon="icons.tournament"
    id="big-titles"
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
      :data="results"
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

      <template #player_tour-cell="{ row }">
        <div class="flex items-center gap-2">
          <u-button
            v-if="row.getIsGrouped() && grouping[0] === 'player_tour'"
            :icon="uIcons.chevronDoubleRight"
            size="xs"
            variant="link"
            color="neutral"
            @click="row.toggleExpanded()"
            :ui="{ leadingIcon: row.getIsExpanded() ? 'rotate-90 transition-transform duration-200' : 'transition-transform duration-200' }"
          />
          <coloured-badge
            v-if="(row.getIsGrouped() && row.groupingColumnId === 'player_tour') || (!grouping.includes('player_tour') && !row.getIsGrouped())"
            :label="row.getValue('player_tour')"
            class="mx-auto"
          />
        </div>
      </template>

      <template #event_type-cell="{ row }">
        <div class="flex items-center gap-2">
          <u-button
            v-if="row.getIsGrouped() && grouping[0] === 'event_type'"
            :icon="uIcons.chevronDoubleRight"
            size="xs"
            variant="link"
            color="neutral"
            @click="row.toggleExpanded()"
            :ui="{ leadingIcon: row.getIsExpanded() ? 'rotate-90 transition-transform duration-200' : 'transition-transform duration-200' }"
          />
          <coloured-badge
            v-if="(row.getIsGrouped() && row.groupingColumnId === 'event_type') || (!grouping.includes('event_type') && !row.getIsGrouped())"
            :label="row.getValue('event_type')"
            class="mx-auto"
          />
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
          <u-badge
            v-if="(row.getIsGrouped() && row.groupingColumnId === 'level') || (!grouping.includes('level') && !row.getIsGrouped())"
            :label="row.getValue('level')"
            :color="levelBadgeMapping[row.getValue('level') as keyof typeof levelBadgeMapping] || 'neutral'"
            class="mx-auto"
          />
        </div>
      </template>

      <template #category-cell="{ row }">
        <div class="flex items-center gap-2">
          <u-button
            v-if="row.getIsGrouped() && grouping[0] === 'event_type'"
            :icon="uIcons.chevronDoubleRight"
            size="xs"
            variant="link"
            color="neutral"
            @click="row.toggleExpanded()"
            :ui="{ leadingIcon: row.getIsExpanded() ? 'rotate-90 transition-transform duration-200' : 'transition-transform duration-200' }"
          />
          <u-link
            v-if="(row.getIsGrouped() && row.groupingColumnId === 'category') || (!grouping.includes('category') && !row.getIsGrouped())"
            :to="{ name: 'category', params: { id: kebabCase(row.getValue('category') as string) } }"
            class="hover-link default-link w-fit mx-auto"
          >
            {{ row.getValue("category") }}
          </u-link>
        </div>
      </template>
    </u-table>
  </dashboard-subpanel>
</template>
