<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui"
defineProps<{ matches: Pick<MatchType, "mid" | "round" | "surface" | "name" | "tid" | "eid" | "winner_id" | "year" | "sets" | "tbs" | "incomplete">[]; p1_name: string; p1Id: string; p2_name: string; p2Id: string }>()

const columns: TableColumn<Pick<MatchType, "mid" | "round" | "surface" | "name" | "tid" | "eid" | "winner_id" | "year" | "sets" | "tbs" | "incomplete">>[] = [
  {
    accessorKey: "year",
    header: "Year",
    meta: { class: { th: "text-slate-500 dark:text-slate-400 text-center", td: "text-center text-slate-600 dark:text-slate-300" } }
  },
  {
    accessorKey: "winner_id",
    header: "Winner",
    meta: { class: { th: "text-slate-500 dark:text-slate-400 text-center", td: "text-center text-slate-600 dark:text-slate-300" } }
  },
  {
    accessorKey: "name",
    header: "Event",
    meta: { class: { th: "text-slate-500 dark:text-slate-400 text-center", td: "text-center text-slate-600 dark:text-slate-300" } }
  },
  {
    accessorKey: "round",
    header: "Round",
    meta: { class: { th: "text-slate-500 dark:text-slate-400 text-center", td: "text-center text-slate-600 dark:text-slate-300" } }
  },
  {
    accessorKey: "surface",
    header: "Surface",
    meta: { class: { th: "text-slate-500 dark:text-slate-400 text-center", td: "text-center text-slate-600 dark:text-slate-300" } }
  },
  {
    id: "score",
    header: "Score",
    meta: { class: { th: "text-slate-500 dark:text-slate-400 text-center", td: "text-center text-slate-600 dark:text-slate-300" } }
  }
]
</script>

<template>
  <u-table
    :data="matches"
    :columns
    class="xl:w-3/4 2xl:w-2/3 mx-auto"
  >
    <template #year-cell="{ row }">
      <nuxt-link
        class="hover-link"
        :to="{ name: 'event', params: { name: useChangeCase(row.original.name, 'kebabCase').value, tid: row.original.tid, year: row.original.year, eid: row.original.eid } }"
        prefetch-on="interaction"
      >
        {{ row.original.year }}
      </nuxt-link>
    </template>

    <template #winner_id-cell="{ row }">
      <div class="flex gap-2 items-center">
        <u-user
          :name="row.original.winner_id === p1Id ? p1_name : p2_name"
          :avatar="{
            src: `https://www.atptour.com/-/media/alias/player-headshot/${row.original.winner_id}`,
            alt: row.original.winner_id === p1Id ? p1_name : p2_name
          }"
        />
      </div>
    </template>

    <template #name-cell="{ row }">
      <nuxt-link
        class="hover-link"
        :to="{ name: 'tournament', params: { name: useChangeCase(row.original.name, 'kebabCase').value, tid: row.original.tid } }"
        prefetch-on="interaction"
      >
        {{ row.original.name }}
      </nuxt-link>
    </template>

    <template #score-cell="{ row }">
      <score-item
        :sets="row.original.sets"
        :tbs="row.original.tbs"
        :name="row.original.name"
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
