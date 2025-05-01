<script setup lang="ts">
import { PlayerAvatar, UButton } from "#components"
import type { TableColumn } from "@nuxt/ui"
defineProps<{ ages: WinnersByAgeInterface[] | null; status: string }>()

const columns: TableColumn<WinnersByAgeInterface>[] = [
  {
    accessorKey: "age",
    header: ({ column }) => {
      const isSorted = column.getIsSorted()
      return h(UButton, {
        color: "neutral",
        variant: "link",
        label: "Age",
        icon: isSorted
          ? isSorted === "asc"
            ? ICONS.sortNumberUp
            : ICONS.sortNumberDown
          : ICONS.sortNumber,
        onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        class: "-mx-2.5 font-semibold text-(--ui-text)"
      })
    }
  },
  { accessorKey: "year", header: "Year" },
  {
    id: "player",
    header: "Player",
    cell: ({ row }) => {
      return h("div", { class: "mx-auto flex justify-center items-center" }, [
        h(PlayerAvatar, {
          player: row.original.player
        })
      ])
    }
  }
]
</script>

<template>
  <u-table
    :data="ages"
    :columns="columns"
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
            v-for="_ in 3"
            :key="_"
            class="h-4 w-1/2 rounded-lg"
          />
        </div>
      </div>
      <template v-else>No stats available</template>
    </template>
  </u-table>
</template>
