<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui"
import { BaseLink, EventLink, PlayerAvatar, ScoreItem, TournamentLink, UBadge } from "#components"
import { Fragment } from "vue/jsx-runtime"

const p1ParamName = useRouteParams<string>("p1Name")
const p1Name = computed(() => decodeName(p1ParamName.value))
const p2ParamName = useRouteParams<string>("p2Name")
const p2Name = computed(() => decodeName(p2ParamName.value))

const appConfig = useAppConfig()
const route = useRoute()
const toast = useToast()

type H2HMatchType = Pick<EventInterface, "id" | "tournament" | "surface" | "year"> & {
  match: Pick<MatchInterface, "match_no" | "sets" | "winner" | "round" | "tbs" | "incomplete">
}

// API call
const {
  data: matches,
  status,
  refresh
} = await useFetch<H2HMatchType[]>("/api/h2h/matches", {
  query: { p1Id: route.params.p1Id, p2Id: route.params.p2Id },
  default: () => [],
  onResponseError: ({ error }) => {
    toast.add({
      title: `Error fetching matches for ${p1Name.value} v. ${p2Name.value}`,
      description: error?.message,
      icon: appConfig.ui.icons.error,
      color: "error"
    })
    showError(error!)
  }
})

const columns: TableColumn<H2HMatchType>[] = [
  {
    accessorKey: "year",
    header: "Year",
    cell: ({ row }) => {
      const { tournament, year, id } = row.original
      return h(EventLink, { tournament, year, id }, () => year)
    }
  },
  {
    accessorKey: "match.winner",
    id: "winner",
    header: "Winner",
    cell: ({ row }) => {
      return h("div", { class: "w-fit mx-auto" }, [
        h(PlayerAvatar, { player: row.original.match.winner })
      ])
    }
  },
  {
    accessorKey: "name",
    header: "Event",
    cell: ({ row }) => {
      const { tournament } = row.original
      return h(TournamentLink, { tournament }, () => tournament.name)
    }
  },
  { accessorKey: "match.round", id: "round", header: "Round" },
  {
    accessorKey: "surface",
    header: "Surface",
    cell: ({ row }) => {
      const { surface } = row.original
      return h(BaseLink, { id: surface, type: "surface" }, () => surface)
    }
  },
  {
    id: "score",
    header: "Score",
    cell: ({ row }) => {
      const { match, tournament, id, year } = row.original
      const { sets, tbs, match_no, incomplete } = match
      return h(Fragment, {}, [
        h(ScoreItem, { sets, tbs, tournament, id, year, match_no, incomplete }),
        incomplete && h(UBadge, { label: incomplete, color: "error" })
      ])
    }
  }
]
</script>

<template>
  <dashboard-subpanel
    title="Matches"
    :icon="ICONS.upcoming"
    class="2xl:w-3/4 mx-auto"
  >
    <u-table
      :data="matches"
      :columns="columns"
      :loading="status === 'pending'"
    >
      <template #empty>
        <div
          v-if="status === 'pending'"
          class="flex flex-col gap-4"
        >
          <div
            v-for="_ in 6"
            :key="_"
            class="flex gap-8"
          >
            <u-skeleton
              v-for="_ in 6"
              :key="_"
              class="h-4 w-1/7 rounded-lg"
            />
          </div>
        </div>
        <template v-else>No stats available</template>
      </template>
    </u-table>
  </dashboard-subpanel>
</template>
