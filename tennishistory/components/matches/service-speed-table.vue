<script setup lang="ts">
// @ts-ignore
import kmhToMph from "kmh-to-mph"
import type { TableColumn } from "@nuxt/ui"
import { PlayerAvatar, UProgress } from "#components"
const { stats, p1, p2 } = defineProps<{
  stats: { key?: string; label: string; percent?: boolean; value: number[] }[]
  p1: Pick<PlayerInterface, "name" | "id" | "country">
  p2: Pick<PlayerInterface, "name" | "id" | "country">
}>()

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
            max: Math.max(row.original.value[1], row.original.value[0]),
            ui: {
              base: "bg-primary-300 dark:bg-primary-950",
              indicator: "bg-primary-700",
              status: "!w-full text-(--ui-text)"
            },
            inverted: true
          },
          {
            status: () => {
              return h(
                "span",
                { class: { "font-bold": row.original.value[0] > row.original.value[1] } },
                [
                  `${row.original.value[0]} km/h (${Math.round(
                    kmhToMph(row.original.value[0])
                  )} mph)`
                ]
              )
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
        return h(PlayerAvatar, { player: p2, class: "justify-end" })
      },
      cell: ({ row }) => {
        return h(
          UProgress,
          {
            modelValue: row.original.value[1],
            max: Math.max(row.original.value[1], row.original.value[0]),
            ui: {
              base: "bg-emerald-300/50 dark:bg-emerald-950",
              indicator: "bg-emerald-700",
              status: "!w-full text-(--ui-text)"
            }
          },
          {
            status: () => {
              return h(
                "span",
                { class: { "font-bold": row.original.value[1] > row.original.value[0] } },
                [
                  `${row.original.value[1]} km/h (${Math.round(
                    kmhToMph(row.original.value[1])
                  )} mph)`
                ]
              )
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
