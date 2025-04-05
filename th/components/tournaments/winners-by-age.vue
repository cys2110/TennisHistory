<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui"
const UButton = resolveComponent("u-button")
const id = useRouteParams<string>("id")
const paramName = useRouteParams<string>("name")
const name = computed(() => decodeName(paramName.value))
const toast = useToast()

interface APIResponse {
  age: string
  player: PlayerInterface
  year: string
}

// API calls
const { data: ages, status } = await useFetch<APIResponse[]>("/api/tournament-winner-ages", {
  query: { id },
  onResponseError: () => {
    toast.add({
      title: `Error fetching winners by country for ${name.value}`,
      icon: ICONS.error,
      color: "error"
    })
  }
})

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
  <dashboard-subpanel
    title="Winners by Age"
    :icon="ICONS.calendar"
  >
    <u-table
      v-if="ages"
      :data="ages"
      :columns="columns"
    >
      <template #player-cell="{ row }">
        <player-avatar :player="row.original.player" />
      </template>
    </u-table>
    <error-message
      v-else
      :icon="ICONS.noCountries"
      :status
      :title="`No winners by country found for ${name}`"
    />
  </dashboard-subpanel>
</template>
