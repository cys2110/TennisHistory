<script setup lang="ts">
import { PlayerAvatar, ScoreItem, ULink } from "#components"
import type { TableColumn } from "@nuxt/ui"
import BaseLink from "~/components/base-link.vue"

type H2HMatchType = Pick<EventInterface, "id" | "tournament" | "surface" | "year"> & {
  match: Pick<MatchInterface, "match_no" | "sets" | "winner" | "round" | "tbs" | "incomplete">
}

defineProps<{
  matches: H2HMatchType[]
  status: APIStatusType
}>()

const route = useRoute()
const p1Name = computed(() => decodeName(route.params.p1Name as string))
const p2Name = computed(() => decodeName(route.params.p2Name as string))

const columns: TableColumn<H2HMatchType>[] = [
  {
    accessorKey: "year",
    header: "Year",
    cell: ({ row }) => {
      const { tournament, year, id } = row.original
      return h(ULink, { name: "event", params: { id: tournament.id, name: encodeName(tournament.name), year, eid: id } }, () => year)
    }
  },
  {
    accessorKey: "match.winner",
    id: "winner",
    header: "Winner",
    cell: ({ row }) => {
      return h("div", { class: "w-fit mx-auto" }, [h(PlayerAvatar, { player: row.original.match.winner })])
    }
  },
  {
    accessorKey: "name",
    header: "Event",
    cell: ({ row }) => {
      const { tournament } = row.original
      return h(BaseLink, { type: "tournament", tournament }, () => tournament.name)
    }
  },
  { accessorKey: "match.round", id: "round", header: "Round" },
  {
    accessorKey: "surface",
    header: "Surface",
    cell: ({ row }) => {
      const { surface } = row.original
      return h(BaseLink, { id: surface.id, type: "surface" }, () => surface.id)
    }
  },
  {
    id: "score",
    header: "Score",
    cell: ({ row }) => {
      const { match, tournament, id, year } = row.original
      const { sets, tbs, match_no, incomplete } = match
      return h(ScoreItem, { sets, tbs, tournament, id, year, match_no, incomplete, centred: true })
    }
  }
]
</script>

<template>
  <u-table
    :data="matches"
    :columns="columns"
    :loading="['pending', 'idle'].includes(status)"
    sticky
    class="max-h-200"
  >
    <template #loading>
      <div
        v-for="_ in 6"
        :key="_"
        class="flex gap-8"
      >
        <u-skeleton class="h-4 w-full rounded-lg" />
      </div>
    </template>
    <template #empty> No matches played between {{ p1Name }} and {{ p2Name }} </template>
  </u-table>
</template>
