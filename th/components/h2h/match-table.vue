<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui"
const { c1, c2 } = defineProps<{ c1: CountryInterface; c2: CountryInterface }>()
const p1Id = useRouteParams<string>("p1Id")
const p2Id = useRouteParams<string>("p2Id")
const p1ParamName = useRouteParams<string>("p1Name")
const p1Name = computed(() => decodeName(p1ParamName.value))
const p2ParamName = useRouteParams<string>("p2Name")
const p2Name = computed(() => decodeName(p2ParamName.value))

// API call
const { data: matches, status } = await useFetch<H2HMatchType[]>("/api/h2h-matches", { query: { p1Id, p2Id } })

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
  <dashboard-subpanel
    title="Matches"
    :icon="ICONS.upcoming"
    class="2xl:w-3/4 mx-auto"
  >
    <u-table
      v-if="matches"
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
            :player="{ id: row.original.winner, name: row.original.winner === p1Id ? p1Name : p2Name, country: row.original.winner === p1Id ? c1 : c2 }"
          />
        </div>
      </template>
      <template #name-cell="{ row }">
        <tournament-link
          :name="row.original.name"
          :id="row.original.tid"
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
    <error-message
      v-else
      :title="`No matches found for ${p1Name} v. ${p2Name}`"
      :icon="ICONS.noInfo"
      :status
      :error="`No matches found for ${p1Name} v. ${p2Name}`"
    />
  </dashboard-subpanel>
</template>
