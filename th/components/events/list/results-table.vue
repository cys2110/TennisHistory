<script setup lang="ts">
import { BaseLink, PlayerAvatar, ScoreItem, UButton } from "#components"
import type { TableColumn } from "@nuxt/ui"
import { getGroupedRowModel, type GroupingOptions } from "@tanstack/vue-table"

type ResultsType = {
  title: RoundType
  matches: Pick<MatchInterface, "match_no" | "date" | "court" | "duration" | "incomplete" | "umpire" | "winner" | "loser">[]
}

const { rounds, status } = defineProps<{ rounds: ResultsType[]; status: APIStatusType }>()
const appConfig = useAppConfig()
const route = useRoute()
const name = computed(() => decodeName(route.params.name as string))

const formattedRounds = computed(() => {
  if (rounds.length) {
    const newArray: ({ round: RoundType } & Pick<
      MatchInterface,
      "match_no" | "date" | "court" | "duration" | "incomplete" | "umpire" | "winner" | "loser"
    >)[] = []
    rounds.forEach(round => {
      round.matches.forEach(match => {
        newArray.push({
          round: round.title,
          ...match
        })
      })
    })
    return newArray
  }
  return []
})

const columns: TableColumn<
  { round: RoundType } & Pick<MatchInterface, "match_no" | "date" | "court" | "duration" | "incomplete" | "umpire" | "winner" | "loser">
>[] = [
  {
    accessorKey: "round",
    header: "",
    cell: ({ row }) => {
      if (row.getIsGrouped()) {
        return h(
          UButton,
          {
            variant: "link",
            color: "neutral",
            icon: row.getIsExpanded() ? appConfig.ui.icons.minus : appConfig.ui.icons.plus,
            onClick: () => row.toggleExpanded(),
            class: "font-semibold"
          },
          () => row.getValue("round")
        )
      }
    },
    meta: { class: { td: "text-left" } }
  },
  {
    id: "winner",
    accessorKey: "winner",
    header: "Winner",
    cell: ({ row }) => {
      if (!row.getIsGrouped())
        return h(
          "div",
          {
            class: "flex items-center gap-2"
          },
          [
            h(PlayerAvatar, {
              player: row.original.winner
            }),
            h(
              "span",
              {
                class: "text-xs"
              },
              [row.original.winner.seed || row.original.winner.status ? `(${row.original.winner.seed ?? ""}${row.original.winner.status ?? ""})` : ""]
            )
          ]
        )
    }
  },
  {
    accessorKey: "loser",
    header: "Loser",
    cell: ({ row }) => {
      if (!row.getIsGrouped())
        return h(
          "div",
          {
            class: "flex items-center gap-2"
          },
          [
            h(PlayerAvatar, {
              player: row.original.loser
            }),
            h(
              "span",
              {
                class: "text-xs"
              },
              [row.original.loser.seed || row.original.loser.status ? `(${row.original.loser.seed ?? ""}${row.original.loser.status ?? ""})` : ""]
            )
          ]
        )
    }
  },
  {
    id: "score",
    header: "Score",
    cell: ({ row }) => {
      if (!row.getIsGrouped()) {
        const winnerTbs = row.original.winner.tbs
        const loserTbs = row.original.loser.tbs
        const winnerSets = row.original.winner.sets.filter(set => set !== null)
        const loserSets = row.original.loser.sets.filter(set => set !== null)
        const sets = winnerSets.map((set, index) => `${set}${loserSets[index]}`)
        const tbs = winnerTbs.map((tb, index) => tb && `${Math.min(Number(tb), Number(loserTbs[index]))}`)

        return h(ScoreItem, {
          sets,
          tbs,
          tournament: { id: route.params.id as string, name: route.params.name as string },
          id: route.params.eid as string,
          year: route.params.year as string,
          match_no: row.original.match_no,
          incomplete: row.original.incomplete
        })
      }
    }
  },
  { accessorKey: "date", header: "Date" },
  { accessorKey: "duration", header: "Duration" },
  { accessorKey: "court", header: "Court" },
  {
    accessorKey: "umpire",
    header: "Umpire",
    cell: ({ row }) => {
      if (!row.getIsGrouped() && row.original.umpire)
        return h(BaseLink, {
          type: "umpire",
          id: row.original.umpire
        })
    }
  },
  {
    id: "h2h",
    cell: ({ row }) => {
      if (!row.getIsGrouped()) {
        return h(UButton, {
          label: "H2H",
          icon: ICONS.h2h,
          to: {
            name: "h2h-players",
            params: {
              p1Name: encodeName(row.original.winner.name),
              p1Id: row.original.winner.id,
              p2Name: encodeName(row.original.loser.name),
              p2Id: row.original.loser.id
            }
          },
          size: "xs"
        })
      }
    }
  }
]

const grouping_options = ref<GroupingOptions>({
  groupedColumnMode: false,
  getGroupedRowModel: getGroupedRowModel()
})
</script>

<template>
  <u-table
    :data="formattedRounds"
    :columns
    class="w-fit mx-auto"
    :loading="['pending', 'idle'].includes(status)"
    :grouping="['round']"
    :grouping-options="grouping_options"
    :ui="{
      root: 'min-w-full',
      td: 'empty:p-0' // helps with the colspaned row added for expand slot
    }"
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
    <template #empty> No results available for {{ name }} {{ route.params.year }}</template>
  </u-table>
</template>
