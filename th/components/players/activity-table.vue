<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui"
defineProps<{
  matches: Pick<MatchInterface, "country" | "id" | "incomplete" | "mid" | "name" | "player_incomplete" | "rank" | "round" | "sets" | "seed" | "status" | "tbs" | "winner">[]
  year: number
  name: string
  tid: string
  eid: string
}>()
const id = useRouteParams<string>("id")
const paramName = useRouteParams<string>("name")
const playerName = computed(() => decodeName(paramName.value))

const columns: TableColumn<Pick<MatchInterface, "country" | "id" | "incomplete" | "mid" | "name" | "player_incomplete" | "rank" | "round" | "sets" | "seed" | "status" | "tbs" | "winner">>[] = [
  { accessorKey: "round", header: "Round" },
  { accessorKey: "name", header: "Opponent" },
  { accessorKey: "rank", header: "Rank" },
  { accessorKey: "winner", header: "" },
  { id: "score", header: "Score" },
  { id: "h2h" }
]
</script>

<template>
  <u-table
    :data="matches"
    :columns
    class="mx-auto w-full"
  >
    <template #name-cell="{ row }">
      <div
        v-if="row.original.id && row.original.name"
        class="flex gap-2 items-center"
      >
        <player-avatar :player="{ id: row.original.id, name: row.original.name, country: row.original.country }" />
        <small v-if="row.original.seed || row.original.status">({{ row.original.seed }}{{ row.original.status }})</small>
      </div>
      <template v-else>BYE</template>
    </template>
    <template #winner-cell="{ row }">
      <u-icon
        :name="row.original.winner !== row.original.id ? ICONS.success : ICONS.error"
        class="text-xl"
        :class="row.original.winner !== row.original.id ? 'text-success-600' : 'text-error-600'"
      />
    </template>
    <template #score-cell="{ row }">
      <score-item
        :name="name"
        :tid="tid"
        :eid="eid"
        :year="year.toString()"
        :mid="row.original.mid"
        :sets="row.original.sets"
        :tbs="row.original.tbs"
      />
    </template>
    <template #h2h-cell="{ row }">
      <u-button
        v-if="row.original.name"
        size="sm"
        :to="{ name: 'h2h-players', params: { p1Name: playerName, p2Name: encodeName(row.original.name), p1Id: id, p2Id: row.original.id } }"
      >
        H2H
      </u-button>
    </template>
  </u-table>
</template>
