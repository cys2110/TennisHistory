<script setup lang="ts">
import { PlayerAvatar, UButton } from "#components"
import type { TableColumn } from "@nuxt/ui"
defineProps<{ finalists: TournamentFinalistsInterface[]; status: APIStatusType }>()
const route = useRoute()
const name = computed(() => decodeName(route.params.name as string))

const columns: TableColumn<TournamentFinalistsInterface>[] = [
  {
    id: "player",
    header: "Player",
    cell: ({ row }) => {
      return h("div", { class: "flex justify-center" }, [
        h(PlayerAvatar, {
          player: row.original.player
        })
      ])
    }
  },
  {
    accessorKey: "finals",
    header: ({ column }) => {
      const isSorted = column.getIsSorted()
      return h(UButton, {
        color: "neutral",
        variant: "link",
        label: "Finals",
        icon: isSorted ? (isSorted === "asc" ? ICONS.sortNumberUp : ICONS.sortNumberDown) : ICONS.sortNumber,
        onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        class: "-mx-2.5 font-semibold text-(--ui-text)"
      })
    }
  },
  {
    accessorKey: "losses",
    header: ({ column }) => {
      const isSorted = column.getIsSorted()
      return h(UButton, {
        color: "neutral",
        variant: "link",
        label: "Losses",
        icon: isSorted ? (isSorted === "asc" ? ICONS.sortNumberUp : ICONS.sortNumberDown) : ICONS.sortNumber,
        onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        class: "-mx-2.5 font-semibold text-(--ui-text)"
      })
    }
  },
  {
    accessorKey: "wins",
    header: ({ column }) => {
      const isSorted = column.getIsSorted()
      return h(UButton, {
        color: "neutral",
        variant: "link",
        label: "Wins",
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
    :data="finalists"
    :columns="columns"
    :loading="['pending', 'idle'].includes(status)"
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
    <template #empty> No players by finals found for {{ name }} </template>
  </u-table>
</template>
