<script setup lang="ts">
import { UBadge, UButton, ULink } from "#components"
import type { TableColumn } from "@nuxt/ui"
defineProps<{
  players: Pick<PlayerInterface, "id" | "name" | "min_year" | "max_year" | "tour" | "last_name">[]
  status: APIStatusType
}>()
const { icons } = useAppConfig()
const { params } = useRoute()
const name = computed(() => decodeName(params.name as string))

const columns: TableColumn<Pick<PlayerInterface, "id" | "name" | "min_year" | "max_year" | "tour">>[] = [
  {
    id: "tour",
    header: "Tour",
    cell: ({ row }) =>
      h(UBadge, {
        color: row.original.tour.toLowerCase() as "atp" | "wta",
        label: row.original.tour
      })
  },
  {
    accessorKey: "last_name",
    header: ({ column }) =>
      h(UButton, {
        color: "neutral",
        variant: "link",
        label: "Player",
        icon:
          column.getIsSorted() ?
            column.getIsSorted() === "asc" ?
              icons.sortAlphaUp
            : icons.sortAlphaDown
          : icons.sortAlpha,
        onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        class: "-mx-2.5 font-semibold text-(--ui-text)"
      }),
    cell: ({ row }) => {
      const player = row.original
      return h(
        ULink,
        {
          to: {
            name: "player",
            params: { id: player.id, name: encodeName(player.name) }
          },
          class: "hover-link"
        },
        () => player.name
      )
    }
  },
  {
    id: "status",
    header: "Status",
    cell: ({ row }) =>
      h(UBadge, {
        color: row.original.max_year === new Date().getFullYear() ? "active" : "inactive",
        label: row.original.max_year === new Date().getFullYear() ? "Active" : "Inactive"
      })
  },
  {
    accessorKey: "min_year",
    header: ({ column }) =>
      h(UButton, {
        color: "neutral",
        variant: "link",
        label: "First Year on Tour",
        icon:
          column.getIsSorted() ?
            column.getIsSorted() === "asc" ?
              icons.sortNumberUp
            : icons.sortNumberDown
          : icons.sortNumber,
        onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        class: "-mx-2.5 font-semibold text-(--ui-text)"
      }),
    cell: ({ row }) => row.original.min_year ?? "—"
  },
  {
    accessorKey: "max_year",
    header: ({ column }) =>
      h(UButton, {
        color: "neutral",
        variant: "link",
        label: "Last Year on Tour",
        icon:
          column.getIsSorted() ?
            column.getIsSorted() === "asc" ?
              icons.sortNumberUp
            : icons.sortNumberDown
          : icons.sortNumber,
        onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        class: "-mx-2.5 font-semibold text-(--ui-text)"
      }),
    cell: ({ row }) => row.original.max_year ?? "—"
  }
]
</script>

<template>
  <u-table
    :data="players"
    :columns
    class="max-h-200 min-w-2/3 md:min-w-1/2 lg:min-w-1/4 mx-auto"
    :loading="['pending', 'idle'].includes(status)"
    sticky
    :empty="`No players who have represented ${name}`"
  />
</template>
