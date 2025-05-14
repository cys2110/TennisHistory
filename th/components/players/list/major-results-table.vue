<script setup lang="ts">
import { BaseLink, UButton, ULink } from "#components"
import type { TableColumn } from "@nuxt/ui"
import { getGroupedRowModel, type GroupingOptions } from "@tanstack/vue-table"

const { results, status } = defineProps<{
  results: MajorResultsType[]
  status: APIStatusType
}>()

const appConfig = useAppConfig()
const route = useRoute()
const name = computed(() => decodeName(route.params.name as string))

type newResultsType = {
  id: string
  tournament: Pick<TournamentInterface, "id" | "name">
  round: RoundType
  year: string
}

const formattedResults = computed(() => {
  if (results) {
    const newArray: newResultsType[] = []
    results.forEach(result => {
      result.events.forEach(event => {
        newArray.push({
          id: result.tournament.id,
          tournament: result.tournament,
          round: result.round,
          year: event.year
        })
      })
    })
    return newArray
  }
  return []
})

const columns: TableColumn<newResultsType>[] = [
  {
    id: "expand",
    cell: ({ row }) => {
      if (row.getIsGrouped()) {
        return h(UButton, {
          variant: "link",
          color: "neutral",
          icon: row.getIsExpanded() ? appConfig.ui.icons.minus : appConfig.ui.icons.plus,
          onClick: () => row.toggleExpanded()
        })
      }
    }
  },
  {
    id: "tournament",
    accessorKey: "tournament.name",
    header: "Tournament",
    cell: ({ row }) => {
      if (row.getIsGrouped()) {
        const tournament = row.original.tournament
        return h(BaseLink, {
          type: "tournament",
          tournament
        })
      }
    }
  },
  {
    id: "round",
    header: "Round",
    cell: ({ row }) => {
      if (row.getIsGrouped()) {
        return row.original.round
      }
    }
  },
  {
    id: "year",
    accessorKey: "year",
    header: "Years",
    cell: ({ row }) => {
      if (row.getIsGrouped()) {
        const count = row.getValue("year")
        const { round } = row.original
        return `${count} ${count === 1 ? (round === "Win" ? "title" : "result") : round === "Win" ? "titles" : "results"}`
      } else {
        const { id, tournament, year } = row.original
        return h(
          ULink,
          {
            to: { name: "event", params: { id: tournament.id, name: encodeName(tournament.name), year, eid: id } },
            class: "hover-link w-fit"
          },
          () => year
        )
      }
    },
    aggregationFn: "uniqueCount"
  }
]

const grouping_options = ref<GroupingOptions>({
  groupedColumnMode: false,
  getGroupedRowModel: getGroupedRowModel()
})
</script>

<template>
  <u-table
    :data="formattedResults"
    :columns
    class="max-h-200"
    :loading="['pending', 'idle'].includes(status)"
    sticky
    :grouping="['tournament']"
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
        class="flex w-full gap-8"
      >
        <u-skeleton class="h-4 w-full rounded-lg" />
      </div>
    </template>
    <template #empty> No results found </template>
  </u-table>
</template>
