<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui"
import { type Column, getGroupedRowModel, type GroupingOptions } from "@tanstack/vue-table"
import SortTableHeader from "~/components/sort-table-header.vue"
const { events } = defineProps<{
  events: UmpireMatchType[]
  status: APIStatusType
  firstName: string
  lastName: string
}>()
const {
  icons,
  ui: { icons: appIcons }
} = useAppConfig()

const columns: TableColumn<UmpireMatchType>[] = [
  { id: "expand", header: "Event" },
  { id: "tournament", accessorKey: "tournament.name" },
  { accessorKey: "round" },
  {
    accessorKey: "year",
    header: ({ column }) =>
      h(SortTableHeader, {
        column: column as Column<unknown>,
        label: "Year",
        type: "number"
      })
  },
  { id: "tour", header: "Tour" },
  { id: "type", header: "Singles/Doubles" },
  {
    id: "team1",
    // @ts-ignore
    accessorFn: row => row.p1.sort((a, b) => a.last_name.localeCompare(b.last_name))[0].last_name,
    header: ({ column }) => h(SortTableHeader, { column: column as Column<unknown>, label: "Player 1", type: "alpha" })
  },
  {
    id: "team2",
    // @ts-ignore
    accessorFn: row => row.p2.sort((a, b) => a.last_name.localeCompare(b.last_name))[0].last_name,
    header: ({ column }) => h(SortTableHeader, { column: column as Column<unknown>, label: "Player 2", type: "alpha" })
  },
  { id: "navigation", aggregationFn: "count" }
]

const grouping_options = ref<GroupingOptions>({
  groupedColumnMode: "remove",
  getGroupedRowModel: getGroupedRowModel()
})
</script>

<template>
  <u-table
    :data="events"
    :columns
    :loading="status === 'pending'"
    sticky
    :grouping="['tournament', 'round']"
    :grouping-options="grouping_options"
    :ui="{
      root: 'scrollbar-thin scrollbar-thumb-primary-600 scrollbar-track-transparent',
      td: 'empty:p-0' // helps with the colspaned row added for expand slot
    }"
    :empty="`No matches umpired by ${firstName} ${lastName}`"
  >
    <template #expand-cell="{ row }">
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
          :icon="appIcons.chevronDoubleRight"
          :ui="{ leadingIcon: row.getIsExpanded() ? 'rotate-90 transition-transform duration-200' : 'transition-transform duration-200' }"
          @click="row.toggleExpanded()"
        />

        <u-link
          v-if="row.groupingColumnId === 'tournament'"
          :to="{
            name: 'tournament',
            params: {
              id: row.original.tournament.id,
              name: kebabCase(row.original.tournament.name)
            }
          }"
          class="hover-link font-semibold"
        >
          {{ row.original.tournament.name }}
        </u-link>
        <div
          v-else-if="row.groupingColumnId === 'round'"
          class="font-semibold"
        >
          {{ row.original.round }}
        </div>
      </div>
    </template>

    <template #year-cell="{ row }">
      <u-link
        v-if="row.getIsGrouped() && row.depth === 0"
        :to="{
          name: 'event',
          params: { id: row.original.tournament.id, name: kebabCase(row.original.tournament.name), year: row.original.year, eid: row.original.id }
        }"
        class="hover-link"
      >
        {{ row.original.year }}
      </u-link>
      <template v-else>{{ "" }}</template>
    </template>

    <template #tour-cell="{ row }">
      <u-badge
        v-if="row.getIsGrouped() && row.depth === 0"
        v-for="tour in row.original.tours"
        :key="tour"
        :color="getTourColor([tour])"
        :label="tour"
        class="mx-1"
      />
      <template v-else>{{ "" }}</template>
    </template>

    <template #type-cell="{ row }">
      <u-badge
        v-if="!row.getIsGrouped()"
        :label="row.original.labels.includes('Singles') ? 'Singles' : 'Doubles'"
        :color="row.original.labels.includes('Singles') ? 'singles' : 'doubles'"
      />
    </template>

    <template #team1-cell="{ row }">
      <div
        v-if="!row.getIsGrouped()"
        class="flex flex-wrap items-center gap-1 w-fit mx-auto"
      >
        <template
          v-for="(player, index) in row.original.p1"
          :key="player.id"
        >
          <u-separator
            v-if="index > 0"
            class="h-4"
            orientation="vertical"
          />
          <player-link
            :player
            class="mx-auto w-fit"
          />
        </template>
      </div>
    </template>

    <template #team2-cell="{ row }">
      <div
        v-if="!row.getIsGrouped()"
        class="flex flex-wrap items-center gap-1 w-fit mx-auto"
      >
        <template
          v-for="(player, index) in row.original.p2"
          :key="player.id"
        >
          <u-separator
            v-if="index > 0"
            class="h-4"
            orientation="vertical"
          />
          <player-link
            :player
            class="mx-auto w-fit"
          />
        </template>
      </div>
    </template>

    <template #navigation-cell="{ row }">
      <u-button
        v-if="!row.getIsGrouped()"
        :to="{
          name: 'match',
          params: {
            id: row.original.tournament.id,
            name: kebabCase(row.original.tournament.name),
            year: row.original.year,
            eid: row.original.id,
            mid: constructMid(row.original.match_no, row.original.labels)
          }
        }"
        :disabled="!row.original.stats"
        :icon="icons.upcoming"
        label="Match"
        size="sm"
      />
      <template v-else> {{ row.getValue("navigation") }} {{ row.getValue("navigation") === 1 ? "match" : "matches" }} </template>
    </template>
  </u-table>
</template>
