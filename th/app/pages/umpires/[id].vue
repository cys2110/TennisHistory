<script setup lang="ts">
import { FilterTableHeader, NameTableHeader, PlayerLink, RangeTableHeader, UButton } from "#components"
import type { TableColumn, TableRow } from "@nuxt/ui"
import {
  type Column,
  getFacetedRowModel,
  getFacetedMinMaxValues,
  getFacetedUniqueValues,
  getGroupedRowModel,
  type GroupingOptions
} from "@tanstack/vue-table"

definePageMeta({ name: "umpire" })
const {
  params: { id }
} = useRoute("umpire")
const {
  icons,
  ui: { icons: uIcons }
} = useAppConfig()
const breakpoints = useBreakpoints(breakpointsTailwind, { ssrWidth: 1280 })
const mdAndDown = breakpoints.smallerOrEqual("md")

interface APIResponse extends EventInterface {
  match: MatchInterface
}

// API calls
const { data: umpire } = await useFetch<PersonInterface>("/api/umpires/overview", {
  query: { id },
  server: false
})

const { data: events, status } = await useFetch<APIResponse[]>("/api/umpires/details", {
  key: `umpire-events-${id}`,
  query: { id },
  default: () => [],
  server: false
})

useHead({
  title: () => `${umpire.value?.id ?? capitalCase(id as string)} | Umpires`
})

const columns = computed<TableColumn<APIResponse>[]>(() => [
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
            label: "Year"
          })
        ]
      )
  },
  {
    accessorKey: "match.tour",
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
    accessorKey: "match.type",
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
    accessorKey: "match.draw",
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
            label: "Draw",
            type: "alpha"
          })
        ]
      )
  },
  {
    accessorKey: "match.round",
    filterFn: (row, columnId, filterValue) => filterIncludesString(row, columnId, filterValue),
    header: ({ column }) =>
      h(FilterTableHeader, {
        column: column as Column<unknown>,
        label: "Round",
        type: "alpha"
      })
  },
  {
    id: "team1",
    accessorFn: row => row.match.p1.map(p => `${p.last_name}, ${p.first_name}`),
    filterFn: (row, columnId, filterValue) => filterIncludesName(row, columnId, filterValue),
    header: ({ column }) =>
      h(NameTableHeader, {
        column: column as Column<unknown>,
        label: "Team 1"
      }),
    cell: ({ row }) => {
      if (!row.getIsGrouped() || grouping.value.length === 0) {
        return h(
          "div",
          {
            class: "flex flex-col items-center"
          },
          row.original.match.p1.map(p =>
            h(PlayerLink, {
              player: p
            })
          )
        )
      }
    }
  },
  {
    id: "team2",
    accessorFn: row => row.match.p2.map(p => `${p.last_name}, ${p.first_name}`),
    filterFn: (row, columnId, filterValue) => filterIncludesName(row, columnId, filterValue),
    header: ({ column }) =>
      h(NameTableHeader, {
        column: column as Column<unknown>,
        label: "Team 2"
      }),
    cell: ({ row }) => {
      if (!row.getIsGrouped() || grouping.value.length === 0) {
        return h(
          "div",
          {
            class: "flex flex-col items-center"
          },
          row.original.match.p2.map(p =>
            h(PlayerLink, {
              player: p
            })
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

const handleSelectRow = async (row: TableRow<APIResponse>) => {
  if (row.getIsGrouped()) {
    row.toggleExpanded()
  } else {
    await navigateTo({
      name: "match",
      params: {
        id: row.original.tournament.id,
        name: kebabCase(row.original.tournament.name),
        year: row.original.year,
        eid: row.original.id,
        mid: constructMid(row.original.match.match_no, row.original.match.tour, row.original.match.type, row.original.match.draw)
      }
    })
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
              v-if="umpire?.labels.includes('Supervisor')"
              :to="{ name: 'supervisor', params: { id } }"
              :icon="icons.supervisor"
              :label="mdAndDown ? undefined : 'Supervisor Profile'"
              :size="mdAndDown ? 'xs' : 'sm'"
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
          :data="events"
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
                :name="icons.noCalendar"
                class="text-base"
              />
              No events found
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
                  (row.getIsGrouped() && grouping.includes('tournament_name') && row.depth === grouping.findIndex(x => x === 'tournament_name')) ||
                  (!grouping.includes('tournament_name') && !row.getIsGrouped())
                "
                :to="{ name: 'tournament', params: { id: row.original.tournament.id, name: kebabCase(row.original.tournament.name) } }"
                class="hover-link default-link w-fit mx-auto"
              >
                {{ row.getValue("tournament_name") }}
              </u-link>
            </div>
          </template>

          <template #match_type-cell="{ row }">
            <div class="flex items-center gap-2">
              <u-button
                v-if="row.getIsGrouped() && grouping[0] === 'match_type'"
                :icon="uIcons.chevronDoubleRight"
                size="xs"
                variant="link"
                color="neutral"
                @click="row.toggleExpanded()"
                :ui="{ leadingIcon: row.getIsExpanded() ? 'rotate-90 transition-transform duration-200' : 'transition-transform duration-200' }"
              />
              <coloured-badge
                v-if="
                  (row.getIsGrouped() && grouping.includes('match_type') && row.depth === grouping.findIndex(x => x === 'match_type')) ||
                  (!grouping.includes('match_type') && !row.getIsGrouped())
                "
                :label="row.getValue('match_type')"
                class="mx-auto"
              />
            </div>
          </template>

          <template #match_draw-cell="{ row }">
            <div class="flex items-center gap-2">
              <u-button
                v-if="row.getIsGrouped() && grouping[0] === 'match_draw'"
                :icon="uIcons.chevronDoubleRight"
                size="xs"
                variant="link"
                color="neutral"
                @click="row.toggleExpanded()"
                :ui="{ leadingIcon: row.getIsExpanded() ? 'rotate-90 transition-transform duration-200' : 'transition-transform duration-200' }"
              />
              <coloured-badge
                v-if="
                  (row.getIsGrouped() && grouping.includes('match_draw') && row.depth === grouping.findIndex(x => x === 'match_draw')) ||
                  (!grouping.includes('match_draw') && !row.getIsGrouped())
                "
                :label="row.getValue('match_draw')"
                class="mx-auto"
              />
            </div>
          </template>

          <template #match_tour-cell="{ row }">
            <div class="flex items-center gap-2">
              <u-button
                v-if="row.getIsGrouped() && grouping[0] === 'match_tour'"
                :icon="uIcons.chevronDoubleRight"
                size="xs"
                variant="link"
                color="neutral"
                @click="row.toggleExpanded()"
                :ui="{ leadingIcon: row.getIsExpanded() ? 'rotate-90 transition-transform duration-200' : 'transition-transform duration-200' }"
              />
              <coloured-badge
                v-if="
                  (row.getIsGrouped() && grouping.includes('match_tour') && row.depth === grouping.findIndex(x => x === 'match_tour')) ||
                  (!grouping.includes('match_tour') && !row.getIsGrouped())
                "
                :label="row.getValue('match_tour')"
                class="mx-auto"
              />
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
                v-if="
                  (row.getIsGrouped() && grouping.includes('year') && row.depth === grouping.findIndex(x => x === 'year')) ||
                  (!grouping.includes('year') && !row.getIsGrouped())
                "
                :to="{
                  name: 'event',
                  params: {
                    id: row.original.tournament.id,
                    name: kebabCase(row.original.tournament.name),
                    year: row.original.year,
                    eid: row.original.id
                  }
                }"
                class="hover-link default-link w-fit mx-auto"
              >
                {{ row.getValue("year") }}
              </u-link>
            </div>
          </template>
        </u-table>
      </template>
    </u-dashboard-panel>
  </div>
</template>
