<script setup lang="ts">
import { PlayerAvatar, UProgress } from "#components"
import type { InputNumberEmits, TableColumn } from "@nuxt/ui"
const { stats, p1, p2 } = defineProps<{
  stats: { key?: string; label: string; percent?: boolean; value: number[] }[]
  p1: Pick<PlayerInterface, "name" | "id" | "country">
  p2: Pick<PlayerInterface, "name" | "id" | "country">
}>()

const isBold = (row: { label: string; value: number[] }, player: string) => {
  const lowStats = ["Double faults", "Unforced errors"]
  const singleStats = ["Aces", "Winners"]
  const bpsStats = ["Break points saved", "Break points converted"]
  switch (player) {
    case "p1":
      if (lowStats.includes(row.label)) {
        return row.value[0] < row.value[1]
      } else if (singleStats.includes(row.label)) {
        return row.value[0] > row.value[1]
      } else if (bpsStats.includes(row.label)) {
        if (
          (row.value[1] === 0 && row.value[3] === 0) ||
          (row.value[1] !== 0 && row.value[3] === 0)
        ) {
          return false
        } else if (row.value[1] === 0 && row.value[3] !== 0) {
          return true
        } else {
          return percentage(row.value[0], row.value[1]) > percentage(row.value[2], row.value[3])
        }
      } else {
        return percentage(row.value[0], row.value[1]) > percentage(row.value[2], row.value[3])
      }
    default:
      if (lowStats.includes(row.label)) {
        return row.value[1] < row.value[0]
      } else if (singleStats.includes(row.label)) {
        return row.value[1] > row.value[0]
      } else if (bpsStats.includes(row.label)) {
        if (
          (row.value[1] === 0 && row.value[3] === 0) ||
          (row.value[3] !== 0 && row.value[1] === 0)
        ) {
          return false
        } else if (row.value[3] === 0 && row.value[1] !== 0) {
          return true
        } else {
          return percentage(row.value[2], row.value[3]) > percentage(row.value[0], row.value[1])
        }
      } else {
        return percentage(row.value[2], row.value[3]) > percentage(row.value[0], row.value[1])
      }
  }
}

const columns: TableColumn<{ key?: string; label: string; percent?: boolean; value: number[] }>[] =
  [
    {
      id: "p1",
      meta: { class: { td: "w-2/5" } },
      header: () => {
        return h(PlayerAvatar, { player: p1 })
      },
      cell: ({ row }) => {
        return h(
          UProgress,
          {
            modelValue: row.original.value[0],
            max: row.original.percent
              ? row.original.value[1]
              : row.original.value[0] + row.original.value[1],
            ui: {
              base: "bg-primary-300 dark:bg-primary-950",
              indicator: "bg-primary-600",
              status: "!w-full text-(--ui-text)"
            },
            inverted: true
          },
          {
            status: ({ percent }: { percent: InputNumberEmits }) => {
              return h("span", { class: { "font-bold": isBold(row.original, "p1") } }, [
                row.original.percent
                  ? `${row.original.value[0]}/${row.original.value[1]} (${percent}%)`
                  : row.original.value[0]
              ])
            }
          }
        )
      }
    },
    { accessorKey: "label", header: "Category" },
    {
      id: "p2",
      meta: { class: { td: "w-2/5" } },
      header: () => {
        return h(PlayerAvatar, { player: p2 })
      },
      cell: ({ row }) => {
        return h(
          UProgress,
          {
            modelValue: row.original.percent ? row.original.value[2] : row.original.value[1],
            max: row.original.percent
              ? row.original.value[3]
              : row.original.value[0] + row.original.value[1],
            ui: {
              base: "bg-emerald-300 dark:bg-emerald-950",
              indicator: "bg-emerald-600",
              status: "!w-full text-(--ui-text)"
            }
          },
          {
            status: ({ percent }: { percent: number }) => {
              return h("span", { class: { "font-bold": isBold(row.original, "p2") } }, [
                row.original.percent
                  ? `${row.original.value[2]}/${row.original.value[3]} (${percent}%)`
                  : row.original.value[1]
              ])
            }
          }
        )
      }
    }
  ]
</script>

<template>
  <u-table
    :data="stats"
    :columns
  />
</template>
