<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui"
interface APIResponse {
  age: string
  player: PlayerInterface
  year: string
}

defineProps<{ ages: APIResponse[] }>()
const UButton = resolveComponent("u-button")

const columns: TableColumn<APIResponse>[] = [
  {
    accessorKey: "age",
    header: ({ column }) => {
      const isSorted = column.getIsSorted()
      return h(UButton, {
        color: "neutral",
        variant: "link",
        label: "Age",
        icon: isSorted ? (isSorted === "asc" ? ICONS.sortNumberUp : ICONS.sortNumberDown) : ICONS.sortNumber,
        onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        class: "-mx-2.5 font-semibold text-(--ui-text)"
      })
    }
  },
  { accessorKey: "year", header: "Year" },
  { id: "player", header: "Player" }
]
</script>

<template>
  <u-table
    :data="ages"
    :columns="columns"
  >
    <template #player-cell="{ row }">
      <player-avatar :player="row.original.player" />
    </template>
  </u-table>
</template>
