<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui"
const UButton = resolveComponent("u-button")

interface APIResponse {
  year: number
  pm: number
  R128?: number
  R64?: number
  R32: number
  R16: number
  QF: number
  SF: number
  F: number
  currency: CurrencyType
  yoy: string
}
const { pm } = defineProps<{ pm: APIResponse[] }>()

const columns: TableColumn<APIResponse>[] = [
  {
    accessorKey: "year",
    header: ({ column }) => {
      const isSorted = column.getIsSorted()
      return h(UButton, {
        color: "neutral",
        variant: "link",
        label: "Year",
        icon: isSorted ? (isSorted === "asc" ? ICONS.sortNumberUp : ICONS.sortNumberDown) : ICONS.sortNumber,
        onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        class: "-mx-2.5 font-semibold text-(--ui-text)"
      })
    }
  },
  { accessorFn: row => row.pm.toLocaleString("en-US", { style: "currency", currency: row.currency }), header: "Prize Money" },
  { accessorFn: row => row.yoy, header: "Increase (YoY)" },
  { accessorFn: row => row.F.toLocaleString("en-US", { style: "currency", currency: row.currency }), header: "Final" },
  { accessorFn: row => row.SF.toLocaleString("en-US", { style: "currency", currency: row.currency }), header: "Semi-final" },
  { accessorFn: row => row.QF.toLocaleString("en-US", { style: "currency", currency: row.currency }), header: "Quarter-final" },
  { accessorFn: row => row.R16.toLocaleString("en-US", { style: "currency", currency: row.currency }), header: "Round of 16" },
  { accessorFn: row => row.R32.toLocaleString("en-US", { style: "currency", currency: row.currency }), header: "Round of 32" }
]
if (pm[0].R64) {
  columns.push({ accessorFn: row => (row.R64 ? row.R64.toLocaleString("en-US", { style: "currency", currency: row.currency }) : "—"), header: "Round of 64" })
}
if (pm[0].R128) {
  columns.push({ accessorFn: row => (row.R128 ? row.R128.toLocaleString("en-US", { style: "currency", currency: row.currency }) : "—"), header: "Round of 128" })
}
</script>

<template>
  <u-table
    :data="pm"
    :columns="columns"
  />
</template>
