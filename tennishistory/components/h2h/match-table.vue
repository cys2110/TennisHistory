<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui"
defineProps<{ matches: H2HMatchType[]; p1Name: string; p1Id: string; p2Name: string; p2Id: string; p1Country: CountryInterface; p2Country: CountryInterface }>()

const columns: TableColumn<H2HMatchType>[] = [
  { accessorKey: "year", header: "Year" },
  { accessorKey: "winner_id", header: "Winner" },
  { accessorKey: "name", header: "Event" },
  { accessorKey: "round", header: "Round" },
  { accessorKey: "surface", header: "Surface" },
  { id: "score", header: "Score" }
]
</script>

<template>
  <div class="flex flex-col mt-10">
    <div class="h-(--ui-header-height) flex items-center border-b border-(--ui-border) px-4 sm:px-6 gap-2 mb-5">
      <u-icon
        :name="ICONS.swords"
        class="text-(--ui-text-highlighted)"
      />
      <h1 class="flex items-center gap-1.5 font-semibold text-(--ui-text-highlighted)">Matches</h1>
    </div>
    <u-table
      :data="matches"
      :columns
    >
      <template #year-cell="{ row }">
        <event-link
          :name="row.original.name"
          :tid="row.original.tid"
          :year="row.original.year"
          :eid="row.original.eid"
        >
          {{ row.original.year }}
        </event-link>
      </template>
      <template #winner_id-cell="{ row }">
        <div class="w-fit mx-auto">
          <player-avatar
            v-if="row.original.winner"
            :player="{ id: row.original.winner, name: row.original.winner === p1Id ? p1Name : p2Name, country: row.original.winner === p1Id ? p1Country : p2Country }"
          />
        </div>
      </template>
      <template #name-cell="{ row }">
        <tournament-link
          :name="row.original.name"
          :tid="row.original.tid"
        />
      </template>
      <template #score-cell="{ row }">
        <score-item
          :sets="row.original.sets"
          :tbs="row.original.tbs"
          :name="row.original.name"
          :tid="row.original.tid"
          :eid="row.original.eid"
          :year="row.original.year"
          :mid="row.original.mid ?? 0"
        />
        <u-badge
          v-if="row.original.incomplete"
          :label="row.original.incomplete"
          color="error"
        />
      </template>
    </u-table>
  </div>
</template>
