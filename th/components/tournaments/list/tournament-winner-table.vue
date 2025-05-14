<script setup lang="ts">
import { EventButtons, PlayerAvatar, ScoreItem } from "#components"
import type { TableColumn } from "@nuxt/ui"

type TournamentEventType = Pick<EventInterface, "id" | "year" | "draw_type" | "winner" | "loser"> & {
  match: Pick<MatchInterface, "sets" | "tbs" | "incomplete">
}

const { events } = defineProps<{ events: TournamentEventType[]; status: APIStatusType }>()
const route = useRoute()
const name = computed(() => decodeName(route.params.name as string))

const columns: TableColumn<TournamentEventType>[] = [
  {
    accessorKey: "year",
    header: "Year"
  },
  {
    id: "Winner",
    header: "Winner",
    cell: ({ row }) => {
      if (row.original.winner) {
        return h(PlayerAvatar, { player: row.original.winner })
      } else {
        return "No final played"
      }
    }
  },
  {
    id: "Finalist",
    header: "Finalist",
    cell: ({ row }) => {
      if (row.original.loser) {
        return h(PlayerAvatar, { player: row.original.loser })
      }
    }
  },
  {
    id: "score",
    header: "Score",
    cell: ({ row }) => {
      if (row.original.winner) {
        return h(ScoreItem, {
          sets: row.original.match.sets,
          tbs: row.original.match.tbs,
          tournament: { name: route.params.name as string, id: route.params.id as string },
          year: row.original.year,
          id: row.original.id,
          match_no: "1",
          incomplete: row.original.match.incomplete
        })
      }
    }
  },
  {
    id: "navigation",
    cell: ({ row }) =>
      h(EventButtons, {
        tournament: { id: route.params.id as string, name: route.params.name as string },
        year: row.original.year,
        id: row.original.id,
        draw_type: row.original.draw_type
      })
  }
]
</script>

<template>
  <u-table
    :data="events"
    :columns
    class="w-fit mx-auto"
    :loading="['pending', 'idle'].includes(status)"
  >
    <template #loading>
      <div
        v-for="_ in 6"
        :key="_"
        class="flex gap-8"
      >
        <u-skeleton
          v-for="_ in 5"
          :key="_"
          class="h-4 rounded-lg"
        />
      </div>
    </template>
    <template #empty> No events found for {{ name }}</template>
  </u-table>
</template>
