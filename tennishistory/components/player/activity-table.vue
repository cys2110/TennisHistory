<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui"
const route = useRoute()
defineProps<{ event: PlayerActivityType; year: string }>()

const columns: TableColumn<ActivityMatchType>[] = [{ accessorKey: "round", header: "Round" }, { accessorKey: "country", header: "" }, { accessorKey: "id", header: "" }, { accessorKey: "name", header: "Opponent" }, { accessorKey: "rank", header: "Rank" }, { accessorKey: "winner", header: "" }, { id: "score", header: "Score" }, { id: "h2h" }]
</script>

<template>
  <u-table
    :data="event.matches"
    :columns
  >
    <template #country-cell="{ row }">
      <flag-icon
        v-if="row.original.country"
        :country="row.original.country"
      />
    </template>
    <template #id-cell="{ row }">
      <player-avatar
        v-if="row.original.id && row.original.name"
        :id="row.original.id"
        :name="row.original.name"
      />
    </template>
    <template #name-cell="{ row }">
      <div v-if="row.original.incomplete === 'B'">BYE</div>
      <div v-else-if="row.original.name">
        <nuxt-link
          class="hover-link"
          :to="{ name: 'player', params: { name: useChangeCase(row.original.name, 'kebabCase').value, id: row.original.id } }"
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
        :event="row.original"
      />
    </template>
    <template #h2h-cell="{ row }">
      <u-button
        v-if="row.original.name"
        size="sm"
        :to="{ name: 'h2h-page', params: { p1Name: route.params.name, p2Name: useChangeCase(row.original.name, 'kebabCase').value, p1Id: route.params.id, p2Id: row.original.id } }"
      >
        H2H
      </u-button>
    </template>
  </u-table>
</template>
