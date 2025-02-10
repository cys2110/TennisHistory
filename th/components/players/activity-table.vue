<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui"
defineProps<{ event: PlayerActivityType; year: string }>()
const name = useRouteParams<string>("name")
const id = useRouteParams<string>("id")

const columns: TableColumn<PlayerActivityOpponentType>[] = [
  {
    accessorKey: "round",
    header: "Round",
    meta: { class: { th: "text-slate-500 dark:text-slate-400 text-center text-lg", td: "text-center text-slate-600 dark:text-slate-300" } }
  },
  { accessorKey: "country", header: "" },
  { accessorKey: "id", header: "" },
  { accessorKey: "name", header: "Opponent", meta: { class: { th: "text-slate-500 dark:text-slate-400 text-center text-lg", td: "text-center text-slate-600 dark:text-slate-300" } } },
  { accessorKey: "rank", header: "Rank", meta: { class: { th: "text-slate-500 dark:text-slate-400 text-center text-lg", td: "text-center text-slate-600 dark:text-slate-300" } } },
  { accessorKey: "winner", header: "" },
  { id: "score", header: "Score", meta: { class: { th: "text-slate-500 dark:text-slate-400 text-center text-lg", td: "text-center text-slate-600 dark:text-slate-300" } } },
  { id: "h2h" }
]
</script>

<template>
  <u-table
    :data="event.matches"
    :columns
    class="mx-auto"
  >
    <template #country-cell="{ row }">
      <flag-icon
        v-if="row.original.country"
        :country="row.original.country"
      />
    </template>
    <template #id-cell="{ row }">
      <u-avatar
        v-if="row.original.id && row.original.name"
        :src="`https://www.atptour.com/-/media/alias/player-headshot/${row.original.id}`"
      />
    </template>
    <template #name-cell="{ row }">
      <div v-if="row.original.incomplete === 'B'">BYE</div>
      <div v-else-if="row.original.name">
        <nuxt-link
          class="hover-link"
          :to="{ name: 'player', params: { name: useChangeCase(row.original.name, 'kebabCase').value, id: row.original.id } }"
          prefetch-on="interaction"
        >
          {{ row.original.name }}
        </nuxt-link>
        <small v-if="row.original.seed || row.original.status">({{ row.original.seed }}{{ row.original.status }})</small>
      </div>
    </template>
    <template #winner-cell="{ row }">
      <u-icon
        :name="row.original.winner !== row.original.id ? ICONS.check : ICONS.cross"
        class="text-xl"
        :class="row.original.winner !== row.original.id ? 'text-green-600' : 'text-red-600'"
      />
    </template>
    <template #score-cell="{ row }">
      <score-item
        :name="event.name"
        :tid="event.tid"
        :eid="event.eid"
        :year
        :match_no="row.original.match_no"
        :sets="row.original.sets"
        :tbs="row.original.tbs"
      />
    </template>
    <template #h2h-cell="{ row }">
      <u-button
        v-if="row.original.name"
        size="sm"
        :to="{ name: 'h2h-players', params: { p1Name: name, p2Name: useChangeCase(row.original.name, 'kebabCase').value, p1Id: id, p2Id: row.original.id } }"
        variant="subtle"
        color="secondary"
      >
        H2H
      </u-button>
    </template>
  </u-table>
</template>
