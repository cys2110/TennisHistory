<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui"
defineProps<{ matches: H2HMatch[] }>()

const columns: TableColumn<H2HMatch>[] = [
  { accessorKey: "year", header: "Year" },
  { accessorKey: "winner", header: "Winner" },
  { accessorKey: "tname", header: "Event" },
  { accessorKey: "round", header: "Round" },
  { accessorKey: "surface", header: "Surface" },
  { id: "score", header: "Score" }
]
</script>

<template>
  <u-table
    :data="matches"
    :columns
  >
    <template #year-cell="{ row }">
      <nuxt-link
        class="hover-link"
        :to="{ name: 'event', params: { name: useChangeCase(row.original.tname, 'kebabCase').value, tid: row.original.tid, year: row.original.year, eid: row.original.eid } }"
      >
        {{ row.original.year }}
      </nuxt-link>
    </template>
    <template #winner-cell="{ row }">
      <div class="flex gap-2 items-center">
        <player-avatar
          :id="row.original.winner"
          :name="row.original.winner_name"
        />
        <div>{{ row.original.winner_name }}</div>
      </div>
    </template>
    <template #tname-cell="{ row }">
      <nuxt-link
        class="hover-link"
        :to="{ name: 'tournament', params: { name: useChangeCase(row.original.tname, 'kebabCase').value, tid: row.original.tid } }"
      >
        {{ row.original.tname }}
      </nuxt-link>
    </template>
    <template #score-cell="{ row }">
      <score-item
        :event="row.original"
        :name="row.original.tname"
        :tid="row.original.tid"
        :eid="row.original.eid"
        :year="row.original.year"
        :match_no="row.original.mid ?? 0"
      />
      <u-badge
        v-if="row.original.incomplete"
        :label="row.original.incomplete"
        color="error"
      />
    </template>
  </u-table>
</template>
