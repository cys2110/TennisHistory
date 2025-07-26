<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui"
import { type Column } from "@tanstack/vue-table"
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
  {
    id: "tournament",
    accessorKey: "tournament.name",
    header: ({ column }) =>
      h(SortTableHeader, {
        column: column as Column<unknown>,
        label: "Event",
        type: "alpha"
      })
  },
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
  {
    accessorKey: "round",
    header: ({ column }) =>
      h(SortTableHeader, {
        column: column as Column<unknown>,
        label: "Round",
        type: "alpha"
      })
  },
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
  { id: "navigation" }
]
</script>

<template>
  <u-table
    :data="events"
    :columns
    :loading="status === 'pending'"
    sticky
    :empty="`No matches umpired by ${firstName} ${lastName}`"
    class="scrollbar-thin scrollbar-thumb-primary-600 scrollbar-track-transparent"
  >
    <template #tournament-cell="{ row }">
      <u-link
        :to="{
          name: 'tournament',
          params: {
            id: row.original.tournament.id,
            name: kebabCase(row.original.tournament.name)
          }
        }"
        class="hover-link"
      >
        {{ row.original.tournament.name }}
      </u-link>
    </template>

    <template #year-cell="{ row }">
      <u-link
        :to="{
          name: 'event',
          params: { id: row.original.tournament.id, name: kebabCase(row.original.tournament.name), year: row.original.year, eid: row.original.id }
        }"
        class="hover-link"
      >
        {{ row.original.year }}
      </u-link>
    </template>

    <template #tour-cell="{ row }">
      <u-badge
        v-for="tour in row.original.tours"
        :key="tour"
        :color="getTourColor([tour])"
        :label="tour"
        class="mx-1"
      />
    </template>

    <template #type-cell="{ row }">
      <u-badge
        :label="row.original.labels.includes('Singles') ? 'Singles' : 'Doubles'"
        :color="row.original.labels.includes('Singles') ? 'singles' : 'doubles'"
      />
    </template>

    <template #team1-cell="{ row }">
      <div class="flex flex-wrap items-center gap-1 w-fit mx-auto">
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
      <div class="flex flex-wrap items-center gap-1 w-fit mx-auto">
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
        :icon="icons.upcoming"
        :disabled="!row.original.stats"
        label="Match"
        size="sm"
      />
    </template>
  </u-table>
</template>
