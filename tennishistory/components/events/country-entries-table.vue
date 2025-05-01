<script setup lang="ts">
import { UButton, UUser } from "#components"
import type { TableColumn } from "@nuxt/ui"
defineProps<{ entries: CountryEntryType[]; status: "pending" | "idle" | "error" | "success" }>()

const columns: TableColumn<CountryEntryType>[] = [
  {
    accessorKey: "last",
    header: ({ column }) => {
      const isSorted = column.getIsSorted()

      return h(UButton, {
        color: "neutral",
        variant: "link",
        label: "Player",
        icon: isSorted
          ? isSorted === "asc"
            ? ICONS.sortAlphaUp
            : ICONS.sortAlphaDown
          : ICONS.sortAlpha,
        onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        class: "-mx-2.5 font-semibold text-(--ui-text)"
      })
    },
    cell: ({ row }) => {
      return h(UUser, {
        name: row.original.name,
        avatar: {
          src: `https://www.atptour.com/-/media/alias/player-headshot/${row.original.id}`,
          icon: ICONS.player
        },
        to: {
          name: "player",
          params: { id: row.original.id, name: encodeName(row.original.name) }
        },
        ui: {
          name: "text-xs md:text-sm lg:text-md"
        }
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
        icon: isSorted
          ? isSorted === "asc"
            ? ICONS.sortNumberUp
            : ICONS.sortNumberDown
          : ICONS.sortNumber,
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
    class="w-fit mx-auto"
    :loading="['pending', 'idle'].includes(status)"
  >
    <template #empty>
      <div
        v-if="['pending', 'idle'].includes(status)"
        class="flex flex-col gap-4"
      >
        <div
          v-for="_ in 6"
          :key="_"
          class="flex gap-8"
        >
          <u-skeleton
            v-for="_ in 2"
            :key="_"
            class="h-4 w-1/2 rounded-lg"
          />
        </div>
      </div>
      <template v-else>No entries available</template>
    </template>
  </u-table>
</template>
