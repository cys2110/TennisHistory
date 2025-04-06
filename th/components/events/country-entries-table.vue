<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui"
defineProps<{ entries: CountryEntryType[] }>()
const UButton = resolveComponent("u-button")

const columns: TableColumn<EntryTableType>[] = [
  {
    accessorKey: "last",
    header: ({ column }) => {
      const isSorted = column.getIsSorted()

      return h(UButton, {
        color: "neutral",
        variant: "link",
        label: "Player",
        icon: isSorted ? (isSorted === "asc" ? ICONS.sortAlphaUp : ICONS.sortAlphaDown) : ICONS.sortAlpha,
        onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        class: "-mx-2.5 font-semibold text-(--ui-text)"
      })
    }
  },
  {
    accessorKey: "rank",
    header: ({ column }) => {
      const isSorted = column.getIsSorted()

      return h(UButton, {
        color: "neutral",
        variant: "link",
        label: "Rank",
        icon: isSorted ? (isSorted === "asc" ? ICONS.sortNumberUp : ICONS.sortNumberDown) : ICONS.sortNumber,
        onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        class: "-mx-2.5 font-semibold text-(--ui-text)"
      })
    }
  }
]
</script>

<template>
  <u-table
    :data="entries"
    :columns
    class="w-fit mx-auto my-5"
  >
    <template #last-cell="{ row }">
      <u-user
        :name="row.original.name"
        :avatar="{ src: `https://www.atptour.com/-/media/alias/player-headshot/${row.original.id}`, icon: ICONS.player }"
        :to="{ name: 'player', params: { id: row.original.id, name: encodeName(row.original.name) } }"
        prefetch-on="interaction"
        :ui="{ name: row.original.withdrew ? 'line-through' : '' }"
      />
    </template>
  </u-table>
</template>
