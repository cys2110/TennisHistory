<script setup lang="ts">
import { BaseLink, UButton } from "#components"
import type { TableColumn } from "@nuxt/ui"

const { activity, year, status } = defineProps<{
  activity: PlayerActivityType[]
  year: string
  status: APIStatusType
}>()

const appConfig = useAppConfig()
const route = useRoute()
const name = computed(() => decodeName(route.params.name as string))

const columns: TableColumn<PlayerActivityType>[] = [
  {
    id: "expand",
    cell: ({ row }) =>
      h(UButton, {
        color: "neutral",
        variant: "link",
        size: "sm",
        class: "w-fit",
        icon: appConfig.ui.icons.chevronDown,
        onClick: () => row.toggleExpanded()
      })
  },
  {
    id: "tournament",
    accessorKey: "tournament.name",
    header: "Tournament",
    cell: ({ row }) =>
      h(BaseLink, {
        type: "tournament",
        tournament: row.original.tournament
      })
  },
  {
    id: "category",
    header: "Category",
    cell: ({ row }) =>
      h(BaseLink, {
        id: row.original.category as string,
        type: "category",
        class: "md:text-xs lg:text-sm"
      })
  },
  { accessorKey: "dates", header: "Dates" },
  {
    id: "surface",
    header: "Surface",
    cell: ({ row }) =>
      h(BaseLink, {
        id: row.original.surface.id,
        type: "surface"
      })
  },
  {
    id: "country",
    header: "Country",
    cell: ({ row }) => h(BaseLink, { country: row.original.venues[0].country, type: "country", class: "mx-auto" })
  },
  {
    id: "matches",
    header: "Matches Played",
    accessorFn: row => row.matches.length
  },
  {
    id: "round",
    header: "Round Reached",
    accessorFn: row => {
      const { round, winner_id } = row.matches[row.matches.length - 1]
      return round === "Final" && winner_id === route.params.id ? "Win" : round
    }
  },
  {
    id: "opponent",
    header: "Avg Opponent Rank",
    accessorFn: row => {
      const matches = row.matches.length
      const totalRank = row.matches.reduce((acc, match) => acc + Number(match.opponent.rank), 0)
      return Math.round(totalRank / matches)
    }
  }
]
</script>

<template>
  <u-table
    :data="activity"
    :columns
    sticky
    class="w-full mx-auto max-h-200"
    :loading="['pending', 'idle'].includes(status)"
  >
    <template #loading>
      <div
        v-for="_ in 6"
        :key="_"
        class="flex w-full gap-8"
      >
        <u-skeleton class="h-4 w-full rounded-lg" />
      </div>
    </template>

    <template #empty> {{ name }} had no activity in {{ year }} </template>

    <template #expanded="{ row }">
      <activity-matches-table
        :matches="row.original.matches"
        :year
        :id="row.original.id"
        :tournament="row.original.tournament"
      />
    </template>
  </u-table>
</template>
