<script setup lang="ts">
import { PlayerAvatar, ScoreItem, UButton, UIcon } from "#components"
import type { TableColumn } from "@nuxt/ui"

const { matches, tournament, id, year } = defineProps<{
  matches: (Pick<
    MatchInterface,
    "round" | "match_no" | "incomplete" | "winner_id" | "sets" | "tbs"
  > & {
    opponent: Pick<
      EntryInterface,
      "id" | "name" | "country" | "incomplete" | "seed" | "status" | "rank"
    >
  })[]
  year: string
  id: string
  tournament: Pick<TournamentInterface, "id" | "name">
}>()
const appConfig = useAppConfig()
const playerId = useRouteParams<string>("id")
const paramName = useRouteParams<string>("name")
const playerName = computed(() => decodeName(paramName.value))

const columns: TableColumn<
  Pick<MatchInterface, "round" | "match_no" | "incomplete" | "winner_id" | "sets" | "tbs"> & {
    opponent: Pick<
      EntryInterface,
      "id" | "name" | "country" | "incomplete" | "seed" | "status" | "rank"
    >
  }
>[] = [
  { accessorKey: "round", header: "Round" },
  {
    accessorKey: "opponent.name",
    header: "Opponent",
    cell: ({ row }) => {
      const { name, id, country, seed, status } = row.original.opponent
      if (name) {
        return h("div", { class: "flex gap-2 items-center" }, [
          h(PlayerAvatar, {
            player: { id, name, country }
          }),
          (seed || status) && h("span", { class: "text-xs" }, () => `(${seed}${status})`)
        ])
      } else {
        return "BYE"
      }
    }
  },
  { accessorKey: "opponent.rank", header: "Rank" },
  {
    accessorKey: "winner_id",
    header: "",
    cell: ({ row }) => {
      const winner = row.original.winner_id
      return h(UIcon, {
        name: winner === playerId.value ? appConfig.ui.icons.success : appConfig.ui.icons.error,
        class: `text-xl ${winner === playerId.value ? "text-success-600" : "text-error-600"}`
      })
    }
  },
  {
    id: "score",
    header: "Score",
    cell: ({ row }) => {
      const { sets, tbs, incomplete, match_no } = row.original
      return incomplete === "B"
        ? "—"
        : h(ScoreItem, {
            tournament,
            id,
            year,
            match_no,
            sets,
            tbs,
            incomplete
          })
    }
  },
  {
    id: "h2h",
    cell: ({ row }) => {
      const { name, id } = row.original.opponent
      if (name) {
        return h(
          UButton,
          {
            variant: "soft",
            to: {
              name: "h2h-players",
              params: {
                p1Name: playerName.value,
                p2Name: encodeName(name),
                p1Id: playerId.value,
                p2Id: id
              }
            },
            ui: { base: "px-2 py-1 font-semibold" }
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
  />
</template>
