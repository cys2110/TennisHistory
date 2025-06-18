<script setup lang="ts">
import { MatchScoreItem, UButton, UIcon } from "#components"
import type { TableColumn } from "@nuxt/ui"

const { matches, tournament, id, year, tour } = defineProps<{
  matches: PlayerActivityType["matches"]
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
    opponent: Pick<EntryInterface, "id" | "name" | "country" | "incomplete" | "seed" | "status" | "rank" | "q_seed" | "q_status">
  }
>[] = [
  { accessorKey: "round", header: "Round" },
  { id: "opponent", header: "Opponent" },
  { accessorFn: row => (row.round.includes("Qualifying") ? row.opponent?.q_seed || "—" : row.opponent?.rank || "—"), header: "Rank" },
  {
    accessorKey: "winner_id",
    header: "",
    cell: ({ row }) => {
      const winner = row.original.winner_id
      return h(UIcon, {
        name: winner === playerId.value ? icons.success : icons.error,
        class: `text-xl ${winner === playerId.value ? "text-success-600" : "text-error-600"}`
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
  },
  {
    id: "h2h",
    cell: ({ row }) => {
      if (row.original.opponent) {
        const { name, id } = row.original.opponent
        return h(
          UButton,
          {
            variant: "subtle",
            size: "sm",
            to: {
              name: "h2h-players",
              params: {
                p1Name: playerName.value,
                p2Name: encodeName(name),
                p1Id: playerId.value,
                p2Id: id
              }
            },
            ui: { base: "px-2 py-1 font-semibold rounded-lg" }
          },
          () => "H2H"
        )
      }
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
        v-if="row.original?.opponent?.name"
        class="flex items-center gap-2"
      >
        <div class="flex items-center gap-2">
          <u-link
            :to="{ name: 'country', params: { id: row.original.opponent.country.id, name: encodeName(row.original.opponent.country.name) } }"
            class="flex items-center"
          >
            <u-icon
              :name="getFlagCode(row.original.opponent.country)"
              class="text-lg"
            />
          </u-link>
          <u-link
            :to="{ name: 'player', params: { id: row.original.opponent.id, name: encodeName(row.original.opponent.name) } }"
            class="hover-link"
          >
            {{ row.original.opponent.name }}
          </u-link>
        </div>
        <span
          v-if="
            (!row.original.round.includes('Qualifying') && (row.original.opponent?.seed || row.original.opponent?.status)) ||
            (row.original.round.includes('Qualifying') && (row.original.opponent?.q_seed || row.original.opponent?.q_status))
          "
          class="text-xs"
        >
          ({{
            row.original.round.includes("Qualifying") ?
              `${row.original.opponent.q_seed ?? ""}${row.original.opponent.q_status && row.original.opponent.q_seed ? " " : ""}${row.original.opponent.q_status ?? ""}`
            : `${row.original.opponent.seed ?? ""}${row.original.opponent.status && row.original.opponent.seed ? " " : ""}${row.original.opponent.status ?? ""}`
          }})
        </span>
      </div>
      <template v-else>BYE</template>
    </template>
  </u-table>
</template>
