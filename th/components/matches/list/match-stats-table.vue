<script setup lang="ts">
// @ts-ignore
import kmhToMph from "kmh-to-mph"
import { MatchStatsChart, PlayerAvatar, ServiceSpeedGauge, ServiceSpeedModal, UButton } from "#components"
import type { TableColumn } from "@nuxt/ui"
import { getGroupedRowModel, type GroupingOptions } from "@tanstack/vue-table"

interface MatchStatsType {
  label: string
  p1: string
  p1_pc: number
  p2: string
  p2_pc: number
  category: string
}

const { stats, p1, p2 } = defineProps<{
  stats: MatchStatsType[]
  status: APIStatusType
  p1: Pick<PlayerInterface, "name" | "id" | "country"> | null
  p2: Pick<PlayerInterface, "name" | "id" | "country"> | null
}>()
const appConfig = useAppConfig()
const route = useRoute()
const name = computed(() => decodeName(route.params.name as string))

const isBold = (row: MatchStatsType, player: string) => {
  const lowStats = ["Double faults", "Unforced errors"]
  const bpsStats = ["Break points saved", "Break points converted"]
  switch (player) {
    case "p1":
      if (lowStats.includes(row.label)) {
        return row.p1_pc < row.p2_pc
      } else if (bpsStats.includes(row.label)) {
        if (row.p1_pc === 0 && row.p2_pc !== 0) {
          return true
        } else {
          return row.p1_pc > row.p2_pc
        }
      } else {
        return row.p1_pc > row.p2_pc
      }
    default:
      if (lowStats.includes(row.label)) {
        return row.p2_pc < row.p1_pc
      } else if (bpsStats.includes(row.label)) {
        if (row.p2_pc === 0 && row.p1_pc !== 0) {
          return true
        } else {
          return row.p2_pc > row.p1_pc
        }
      } else {
        row.p2_pc > row.p1_pc
      }
  }
}

const columns: TableColumn<MatchStatsType>[] = [
  {
    id: "category",
    accessorKey: "category",
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
          () => row.original.category
        )
      }
    },
    meta: { class: { td: "text-left" } }
  },
  { id: "label", accessorKey: "label", header: "" },
  {
    accessorKey: "p1_pc",
    header: () => h(PlayerAvatar, { player: p1!, class: "justify-center", bold: true }),
    cell: ({ row }) => {
      if (!row.getIsGrouped()) {
        if (row.original.category === "Service Speed") {
          return h("span", { class: isBold(row.original, "p1") && "font-semibold" }, [
            `${row.original.p1}km/h (${kmhToMph(row.original.p1).toFixed(0)}mph)`
          ])
        } else {
          return h("span", { class: isBold(row.original, "p1") && "font-semibold" }, [`${row.original.p1} (${row.getValue("p1_pc")})%`])
        }
      }
    }
  },
  {
    accessorKey: "p2_pc",
    header: () => h(PlayerAvatar, { player: p2!, class: "justify-center", bold: true }),
    aggregationFn: "mean",
    cell: ({ row }) => {
      if (!row.getIsGrouped()) {
        if (row.original.category === "Service Speed") {
          return h("span", { class: isBold(row.original, "p2") && "font-semibold" }, [
            `${row.original.p2}km/h (${kmhToMph(row.original.p2).toFixed(0)}mph)`
          ])
        } else {
          return h("span", { class: isBold(row.original, "p2") && "font-semibold" }, [`${row.original.p2} (${row.getValue("p2_pc")})%`])
        }
      }
    }
  },
  {
    id: "chart",
    cell: ({ row }) => {
      if (row.getIsGrouped()) {
        if (row.original.category === "Service Speed") {
          return h(ServiceSpeedModal, {
            stats: stats.filter(stat => stat.category === row.original.category)
          })
        } else {
          return h(MatchStatsChart, {
            stats: stats.filter(stat => stat.category === row.original.category),
            p1: p1!,
            p2: p2!,
            category: row.original.category
          })
        }
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
    :data="stats"
    :columns
    class="w-fit md:w-3/4 lg:w-2/3 xl:w-1/2 mx-auto"
    :loading="['pending', 'idle'].includes(status)"
    :grouping="['category']"
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

    <template #empty> No match stats available for {{ name }} {{ route.params.years }} </template>
  </u-table>
</template>
