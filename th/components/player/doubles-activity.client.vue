<script setup lang="ts">
import { MatchScoreItem, UButton, UIcon } from "#components"
import type { TableColumn } from "@nuxt/ui"

const { matches, tournament, id, year, tour, partner } = defineProps<{
  matches: PlayerActivityType["matches"]
  partner: PlayerActivityType["partner"]
  year: string
  id: number
  tournament: Pick<TournamentInterface, "id" | "name">
  tour: TourType
}>()
const {
  ui: { icons }
} = useAppConfig()
const { params } = useRoute()
const playerId = computed(() => params.id as string)
const playerName = computed(() => decodeName(params.name as string))

const columns: TableColumn<
  Pick<MatchInterface, "round" | "match_no" | "incomplete" | "winner_id" | "sets" | "tbs"> & {
    opponents: Pick<EntryInterface, "id" | "name" | "country" | "incomplete" | "seed" | "status" | "rank" | "q_seed" | "q_status">[]
  }
>[] = [
  { accessorKey: "round", header: "Round" },
  { id: "opponent", header: "Opponents" },
  {
    accessorKey: "winner_id",
    header: "",
    cell: ({ row }) => {
      const winner = row.original.winner_id
      return h(UIcon, {
        name: winner === playerId.value || winner === partner.id ? icons.success : icons.error,
        class: `text-xl ${winner === playerId.value || winner === partner.id ? "text-success-600" : "text-error-600"}`
      })
    }
  },
  {
    id: "score",
    header: "Score",
    cell: ({ row }) => {
      const { sets, tbs, incomplete, match_no } = row.original
      return incomplete === "B" ? "—" : (
          h(MatchScoreItem, {
            tournament,
            id,
            year,
            match_no,
            sets,
            tbs,
            incomplete,
            type: "Singles",
            tour,
            round: row.original.round,
            class: "mx-auto w-fit"
          })
        )
    }
  }
]
</script>

<template>
  <u-table
    :data="matches"
    :columns
    class="mx-auto w-full"
  >
    <template #opponent-cell="{ row }">
      <div
        v-if="row.original.opponents.length"
        class="flex items-center gap-2"
      >
        <div
          v-for="(opponent, index) in row.original.opponents"
          class="flex items-center gap-2"
        >
          <u-link
            :to="{ name: 'country', params: { id: opponent.country.id, name: encodeName(opponent.country.name) } }"
            class="flex items-center"
          >
            <u-icon
              :name="getFlagCode(opponent.country)"
              class="text-lg"
            />
          </u-link>
          <u-link
            :to="{ name: 'player', params: { id: opponent.id, name: encodeName(opponent.name) } }"
            class="hover-link"
          >
            {{ opponent.name }}
          </u-link>
          <span v-if="opponent.rank">[{{ opponent.rank }}]</span>
          <u-separator
            v-if="index === 0"
            orientation="vertical"
            class="h-4"
            :ui="{ border: 'border-(--ui-text-muted)' }"
          />
        </div>
        <span
          v-if="
            (!row.original.round.includes('Qualifying') && (row.original.opponents?.[0].seed || row.original.opponents?.[0].status)) ||
            (row.original.round.includes('Qualifying') && (row.original.opponents?.[0].q_seed || row.original.opponents?.[0].q_status))
          "
          class="text-xs"
        >
          ({{
            row.original.round.includes("Qualifying") ?
              `${row.original.opponents?.[0].q_seed ?? ""}${row.original.opponents?.[0].q_status && row.original.opponents?.[0].q_seed ? " " : ""}${row.original.opponents?.[0].q_status ?? ""}`
            : `${row.original.opponents?.[0].seed ?? ""}${row.original.opponents?.[0].status && row.original.opponents?.[0].seed ? " " : ""}${row.original.opponents?.[0].status ?? ""}`
          }})
        </span>
      </div>
      <template v-else>BYE</template>
    </template>
  </u-table>
</template>
