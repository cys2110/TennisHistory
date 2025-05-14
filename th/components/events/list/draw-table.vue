<script setup lang="ts">
import { BaseLink, PlayerAvatar, ScoreItem, UButton } from "#components"
import type { TableColumn } from "@nuxt/ui"
import { getGroupedRowModel, type GroupingOptions } from "@tanstack/vue-table"

const appConfig = useAppConfig()
const route = useRoute()
const toast = useToast()
const name = computed(() => decodeName(route.params.name as string))

// API call
const { data: rounds, status } = await useFetch<DrawMatchType[]>("/api/events/draw", {
  query: { id: route.params.eid },
  default: () => [],
  onResponseError: ({ error }) => {
    toast.add({
      title: `Error fetching draw for ${name.value} ${route.params.year}`,
      description: error?.message,
      icon: appConfig.ui.icons.error,
      color: "error"
    })
    showError(error!)
  }
})

const columns: TableColumn<DrawMatchType>[] = [
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
    id: "p1",
    accessorKey: "p1",
    header: "Player 1",
    cell: ({ row }) => {
      if (!row.getIsGrouped() && row.original.p1)
        return h(
          "div",
          {
            class: "flex items-center gap-2 justify-center"
          },
          [
            h(PlayerAvatar, {
              player: row.original.p1,
              bold: row.original.p1.id === row.original.winner_id
            }),
            h(
              "span",
              {
                class: "text-xs"
              },
              [row.original.p1.seed || row.original.p1.status ? `(${row.original.p1.seed ?? ""}${row.original.p1.status ?? ""})` : ""]
            )
          ]
        )
    }
  },
  {
    accessorKey: "p2",
    header: "Player 2",
    cell: ({ row }) => {
      if (!row.getIsGrouped() && row.original.p2)
        return h(
          "div",
          {
            class: "flex items-center gap-2 justify-center"
          },
          [
            h(PlayerAvatar, {
              player: row.original.p2,
              bold: row.original.p2.id === row.original.winner_id
            }),
            h(
              "span",
              {
                class: "text-xs"
              },
              [row.original.p2.seed || row.original.p2.status ? `(${row.original.p2.seed ?? ""}${row.original.p2.status ?? ""})` : ""]
            )
          ]
        )
    }
  },
  {
    id: "score",
    header: "Score",
    cell: ({ row }) => {
      if (!row.getIsGrouped() && row.original.p1 && row.original.p2) {
        const p1Tbs = row.original.p1.tbs
        const p2Tbs = row.original.p2.tbs
        const p1Sets = row.original.p1.sets.filter(set => set !== null)
        const p2Sets = row.original.p2.sets.filter(set => set !== null)
        const sets = p1Sets.map((set, index) => `${set}${p2Sets[index]}`)
        const tbs = p1Tbs.map((tb, index) => tb && `${Math.min(Number(tb), Number(p2Tbs[index]))}`)

        return h(ScoreItem, {
          sets,
          tbs,
          tournament: { id: route.params.id as string, name: route.params.name as string },
          id: route.params.eid as string,
          year: route.params.year as string,
          match_no: row.original.match_no,
          incomplete: row.original.incomplete,
          class: "justify-center"
        })
      }
    }
  },
  {
    id: "h2h",
    cell: ({ row }) => {
      if (!row.getIsGrouped() && row.original.p1 && row.original.p2) {
        return h(UButton, {
          label: "H2H",
          icon: ICONS.h2h,
          to: {
            name: "h2h-players",
            params: {
              p1Name: encodeName(row.original.p1.name),
              p1Id: row.original.p1.id,
              p2Name: encodeName(row.original.p2.name),
              p2Id: row.original.p2.id
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
    :data="rounds"
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
    <template #empty> No draw available for {{ name }} {{ route.params.year }}</template>
  </u-table>
</template>
